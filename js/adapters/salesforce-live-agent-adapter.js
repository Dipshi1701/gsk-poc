// Salesforce Live agent adapter
import tracking from '../helpers/external-tracking.js';
import stripHTML from '../helpers/strip-html.js';

export default function(storage, variables, customConfig, labels, routing, surveyId) {
  'use strict';

  var config = extend({
    debug: false,
    agentWaitTimeout: 600, // seconds
    nextQueueTimeout: 30, // seconds
    sendMessageTimeout: 2, // seconds. Merge all messages, send during this timeout
    inputId: '#inbenta-bot-input',
    escalateSystemMessageData: {
      message: 'escalate-chat',
      translate: true,
      options: [{ label: 'yes', value: 'yes' }, { label: 'no', value: 'no' }]
    },
    agentSessionLifetime: 3600 // 3600 seconds => 1h
  }, customConfig);

  var getDomainPath = function() {
    return config.path.base.replace(/\/$/, '');
  };

  function extend(destination, source) {
    for (var property in source) {
      if (source.hasOwnProperty(property)) {
        if (destination[property] && (typeof (destination[property]) === 'object') &&
        (destination[property].toString() === '[object Object]') && source[property]) {
          extend(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
    }
    return destination;
  }

  var dd = function() {
    if (config.debug) {
      var LOG_PREFIX = new Date(new Date().toUTCString()).toISOString();
      var args = Array.prototype.slice.call(arguments);

      args.unshift(LOG_PREFIX);

      console.log.apply(console, args);
    }
  };

  var AgentSession = {
    session: false,
    errorCounter: 0,
    get: function(key) {
      return (typeof storage.get(key) !== 'undefined') ? storage.get(key) : false;
    },
    set: function(key, value) {
      storage.set(key, value);
    }
  };

  return function(chatBot) {

    var chatbotAdapter,
      lastAnswer,
      bottimeout,
      surveyDisplay,
      request = {
        messageBody: [],
        getMessage: []
      },
      timers = {
        startChatTimer: 0,
        sendMessage: undefined
      },
      listener = {
        chasitorTyping: false
      },
      flag = {
        isActive: 'isActive',
        adapterSessionId: 'adapterSessionId',
        sequence: -1
      },
      path = {
        auth: '/init',
        getMessage: '/message/receive',
        sendMessage: '/message/send',
        availability: '/availability'
      },
      auth = {
        systemMessageEscalationID: ''
      };

    // Reset error counter
    var resetErrorCounter = function() { AgentSession.errorCounter = 0; }

    // Check working time
    var checkAvailability = function(positiveCallback, negativeCallback) {
      let callback = function(code, response) {

        chatBot.api.getAppData({
          'dataID': 'WorkingTime',
          'name': 'Time'
        }).then(({ data }) => {
          let timeTable = [];
          let isWorkingTime = false;

          if (data.results && data.results[0] && data.results[0].value) {
            timeTable = data.results[0].value;
          }

          if (timeTable[response.day] && timeTable[response.day] !== 'closed') {
            let busines_hours = timeTable[response.day].split('-');
            let time_init = busines_hours[0].replace(':', '');
            let time_end = busines_hours[1].replace(':', '');

            isWorkingTime = time_init < response.time && response.time < time_end;
          }

          if (isWorkingTime) {
            positiveCallback();
          } else {
            negativeCallback();
          }
        }).catch((error) => {
          dd('Check agents failed: ', error);
          negativeCallback();
        });
      }

      let options = {
        type: 'GET',
        url: getDomainPath() + path.availability,
        data: JSON.stringify({ queue: storage.get('buttonId') })
      };

      requestCall(options, callback);
    };

    var createChat = function(callback) {

      var headers = {
        'Content-Type': 'application/x-www-form-urlencoded charset=utf-8',
        'X-Inbenta-Key': chatBot.api.apiAuth.inbentaKey,
        'Authorization': chatBot.api.apiAuth.authorization.token,
        'X-Inbenta-Session': 'Bearer ' + chatBot.api.sessionToken
      };
      // Creates Salesforce Case with a custom Subject (domain)
       const specialtyHCPButtonId = config.queueMapping.HCP['Specialty HCP WMR'].buttonId;
      const setCustomSubject = storage.get('buttonId') === specialtyHCPButtonId ||
                                    storage.get('buttonIdBeforeCustomEscalation') === specialtyHCPButtonId;
      var options = {
        type: 'POST',
        url: getDomainPath() + path.auth,
        headers: headers,
        data: JSON.stringify({
          queue: storage.get('buttonId'),
          setCustomSubject
        })
      };

      var responseHandler = function(code, resp) {
        switch (code) {
          case 200:
          case 304:
            if (resp.success) {
              if (resp.surveyEndpoint) AgentSession.set('survey', resp.surveyEndpoint);
              callback(resp);
              return;
            }
            break;
          default:
            endChatSession(false, 'Reason: Adapter received failure response');
            chatBot.actions.displaySystemMessage({
              message: 'no-agents',
              translate: true
            });
            chatBot.actions.sendMessage({ directCall: 'endOfConversation' });
        }
      };

      requestCall(options, responseHandler);
    };

    var getChatText = function(ack) {

      var headers = {
        'X-Adapter-Session-Id': AgentSession.get(flag.adapterSessionId)
      };

      if (typeof ack !== 'number') {
        ack = 0;
      }

      var options = {
        type: 'GET',
        url: getDomainPath() + path.getMessage + '?ack=' + encodeURIComponent(ack),
        headers: headers
      };

      var responseHandler = function(code, resp) {
        switch (code) {
          case 204:
            resetErrorCounter();
            AgentSession.set(flag.isActive, true);
            if (AgentSession.get('ack') === ack) AgentSession.set('ack', ack);
            break;
          case 205:
            return;
          case 200:
            resetErrorCounter();
            if (resp.data.ack !== undefined && resp.data.ack >= AgentSession.get('ack')) {
              AgentSession.set('ack', resp.data.ack);
            }
            if (ack < AgentSession.get('ack')) ack++;
            if (!resp.success) {
              endChatSession(true, 'Reason: Adapter received failure response');
              chatBot.actions.displaySystemMessage({
                message: 'no-agents',
                translate: true
              });
              chatBot.actions.sendMessage({ directCall: 'endOfConversation' });
              return;
            }
            AgentSession.set(flag.isActive, true);
            if (resp.success && resp.data.messages instanceof Object) {
              resp.data.messages.forEach(function(message) {
                switch (message.type) {
                  case 'AgentNotTyping':
                    chatBot.actions.hideChatbotActivity();
                    break;
                  case 'AgentTyping':
                    chatBot.actions.displayChatbotActivity();
                    break;
                  case 'ChatEstablished':
                    chatbotAdapter = true;
                    clearTimeout(timers.startChatTimer);
                    chatBot.actions.displaySystemMessage({
                      message: 'agent-joined',
                      replacements: { agentName: config.agent.name },
                      translate: true
                    });
                    tracking('2', AgentSession.get('sflaId'));
                    chatBot.api.sessionUser({"sflaId": AgentSession.get('sflaId') });
                    chatBot.api.track('CHAT_ATTENDED', { value: 'TRUE' });
                    retrieveLastMessages();
                    break;
                  case 'ChatMessage':
                    if (resp.data.sequence <= flag.sequence) {
                      dd('Duplicate message sequence, break', resp.data);
                      break;
                    }
                    flag.sequence = resp.data.sequence;
                    dd('chatMessage:', message.message.text);
                    chatBot.actions.hideChatbotActivity();
                    chatBot.actions.displayChatbotMessage({
                      type: 'answer',
                      message: message.message.text
                    });
                    break;
                  case 'ChatRequestFail':
                    clearTimeout(timers.startChatTimer);
                    if (storage.get('inCustomEscalation') === true) {
                      escalateToNextQueue();
                    } else {
                      chatBot.api.track('CHAT_NO_AGENTS', { value: 'TRUE' });
                      endChatSession(true, 'Reason: Adapter received (ChatRequestFail) response from Salesforce');
                     /* chatBot.actions.displaySystemMessage({
                        message: 'no-agents',
                        translate: true
                      });*/
                      chatBot.actions.sendMessage({ directCall: 'noAgentsAvailable' });
                    }
                    break;
                  case 'ChasitorSessionData':
                    break;
                  case 'AgentDisconnect':
                  case 'ChatEnded':
                    displaySurveyAfterEscalation(AgentSession.get('survey'));
                    clearTimeout(timers.startChatTimer);
                    endChatSession(true, 'Reason: Adapter received (ChatEnded) response from Salesforce');
                    break;
                  case 'ChatRequestSuccess':
                  case 'ChatTransferred':
                  case 'CustomEvent':
                  case 'NewVisitorBreadcrumb':
                  case 'QueueUpdate':
                    dd('missingEvent - ' + message.type, message.message);
                    break;
                }
              })
            }
            break;
          case 401:
            endChatSession(true, 'Reason: Adapter received 401 code, It means session validation fails');
            chatBot.actions.displaySystemMessage({
              message: 'chat-closed',
              translate: true,
              replacements: { agentName: config.agent.name }
            });
            chatBot.actions.sendMessage({ directCall: 'endOfConversation' });
            return;
          case 409:
            return;
          case 403:
            dd('Request timed out');
            return;
          default:
            AgentSession.errorCounter++;
        }
        if (AgentSession.errorCounter >= 3) {
          dd('Error counter' + AgentSession.errorCounter);
          endChatSession(true, 'Reason: Adapter received to many errors. Error counter limit');
          chatBot.actions.displaySystemMessage({
            message: 'chat-closed',
            translate: true,
            replacements: { agentName: config.agent.name }
          });
          chatBot.actions.sendMessage({ directCall: 'endOfConversation' });
        } else {
          if (chatbotAdapter) {
            getChatText(ack);
          }
        }
      };

      request.getMessage.push(requestCall(options, responseHandler));
    };

    var sendMessageToLiveAgent = function(message, callback) {
      if (message.noun !== 'ChatMessage') {
        var options = {
          type: 'POST',
          url: getDomainPath() + path.sendMessage,
          headers: {
            'X-Adapter-Session-Id': AgentSession.get(flag.adapterSessionId)
          },
          data: JSON.stringify([message])
        };
        requestCall(options, callback);
      } else {
        if (timers.sendMessage) {
          clearTimeout(timers.sendMessage);
        }

        request.messageBody.push(message);

        timers.sendMessage = setTimeout(function() {
          var options = {
            type: 'POST',
            url: getDomainPath() + path.sendMessage,
            headers: {
              'X-Adapter-Session-Id': AgentSession.get(flag.adapterSessionId)
            },
            data: JSON.stringify(request.messageBody)
          };
          request.messageBody = [];
          requestCall(options, function(code) {
            listener.chasitorTyping = false;
            if (code === 403) {
              endChatSession(true, 'Reason: Adapter received 401 code, It means session validation fails');
              chatBot.actions.displaySystemMessage({
                message: 'chat-closed',
                translate: true,
                replacements: { agentName: config.agent.name }
              });
              chatBot.actions.sendMessage({ directCall: 'endOfConversation' });
            }
          });
        }, config.sendMessageTimeout * 1000);
      }
    };

    var endChatSession = function(sendNotice, reason) {

      if (AgentSession.get('chatActive')) tracking('7', AgentSession.get('sflaId'));

      reason = reason !== undefined ? reason : '';
      dd('endChatSession', reason);
      AgentSession.set('chatActive', false);
      chatbotAdapter = false;
      AgentSession.set(flag.isActive, false);

      request.getMessage.forEach(function(request) {
        request.abort()
      });
      flag.sequence = -1;
      request.getMessage = [];
      var callback = function() {
        chatBot.actions.hideChatbotActivity();
        chatBot.actions.enableInput();
      };
      if (sendNotice) {
        sendMessageToLiveAgent({
          prefix: 'Chasitor',
          noun: 'ChatEnd',
          object: { 'type': 'ChatEndReason', 'reason': 'client' }
        }, callback);
      }
    };

    var abortExistentGetRequests = function() {
      request.getMessage.forEach(function(request) {
        request.abort()
      });
      request.getMessage = [];
    };

    var requestCall = function(requestOptions, responseHandler) {
      var xmlhttp = new XMLHttpRequest();
      var options = extend({
        type: 'POST',
        url: auth.authUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        data: ''
      }, requestOptions);

      xmlhttp.onload = function() {
        dd('onload response', xmlhttp.status, xmlhttp.response);
        var index = request.getMessage.indexOf(xmlhttp);
        if (index > -1) {
          request.getMessage.splice(index, 1);
        }
        if (typeof responseHandler !== 'undefined') {
          var responseBody = xmlhttp.response ? JSON.parse(xmlhttp.response) : {};
          responseHandler(xmlhttp.status, responseBody);
        }
      };

      xmlhttp.onerror = function() {
        dd('onerror response', xmlhttp);
      };

      xmlhttp.open(options.type, options.url, true);

      xmlhttp.timeout = 30 * 1000; // 30 seconds

      xmlhttp.ontimeout = function(e) {
        var ack = AgentSession.get('ack');
        AgentSession.set('ack', ++ack);
        getChatText(AgentSession.get('ack'));
      };

      for (var key in options.headers) {
        if (options.headers.hasOwnProperty(key)) {
          xmlhttp.setRequestHeader(key, options.headers[key]);
        }
      }
      dd('Request:', options);

      xmlhttp.send(options.data || null);

      return xmlhttp;
    };

    var retrieveLastMessages = function() {
      dd('start retrieve messages');
      let previousConversationMessage = {
        'prefix': 'Chasitor',
        'noun': 'ChatMessage',
        'object': { 'text': '*** CHATBOT CONVERSATION ***' }
      };
      sendMessageToLiveAgent(previousConversationMessage);
      chatBot.actions.getConversationTranscript()
        .forEach(function(messageObj) {
          let author = '';
          let message = '';

          if (messageObj.sideWindowTitle && messageObj.sideWindowContent) {
            message += messageObj.sideWindowTitle;
            message += ' -- ' + stripHTML(messageObj.message).trim();
            message += ' -- ' + stripHTML(messageObj.sideWindowContent).trim();
          } else {
            message = messageObj.message;
          }

          switch (messageObj.user) {
            case 'guest':
              author = 'User';
              break;
            default:
              author = 'Chatbot';
          }
          let historyMesage = {
            'prefix': 'Chasitor',
            'noun': 'ChatMessage',
            'object': { 'text': author + ': ' + message }
          };
          sendMessageToLiveAgent(historyMesage);
        });
      sendMessageToLiveAgent(previousConversationMessage);
      dd('end retrieve messages');
    };

    var chasitorEvent = function(listenerID, targetElement, chatbotInstance) {
      var message;
      var inputLength = targetElement[0].value.length;
      if (inputLength > 0 && !listener.chasitorTyping) {
        listener.chasitorTyping = true;
        message = { 'prefix': 'Chasitor', 'noun': 'ChasitorTyping', 'object': {} };
      } else if (inputLength <= 0 && listener.chasitorTyping && event.which !== 13) {
        listener.chasitorTyping = false;
        message = { 'prefix': 'Chasitor', 'noun': 'ChasitorNotTyping', 'object': {} };
      }
      if (!chatbotAdapter || !message) return;
      sendMessageToLiveAgent(message)
    };

    window.customEscalation = function(data) {

      storage.set('inCustomEscalation', true);

      const customQueue = storage.get('customQueue');
      if (customQueue) {
        storage.set('buttonId', customQueue);
      }

      askEscalationToLiveAgent();
    }

    var askEscalationToLiveAgent = function() {
      let availabilityCallback = function() {
        lastAnswer = { message: 'wait-for-agent', translate: true };
        auth.systemMessageEscalationID = chatBot.actions.displaySystemMessage(config.escalateSystemMessageData);
        chatBot.actions.disableInput();
      }

      let noAvailabilityCallback = function() {
        tracking('100', '');
        chatBot.actions.sendMessage({ directCall: 'outOfBusinessHours' });
      }

      checkAvailability(availabilityCallback, noAvailabilityCallback);
    }

    var checkEscalationToLiveAgent = function(message) {
      chatBot.actions.enableInput();
      auth.systemMessageEscalationID = '';
      if (message === config.escalateSystemMessageData.options[0].value || message === config.escalateSystemMessageData.options[0].label) {
        processConnectToLiveAgent();
      } else if (message === config.escalateSystemMessageData.options[1].value || message === config.escalateSystemMessageData.options[1].label) {
        chatbotAdapter = false;
        chatBot.api.track('CHAT_ESCALATION_REJECTED', { value: 'TRUE' });
        chatBot.actions.sendMessage({ directCall: 'endOfConversation' });
      }
    };

    window.userTypeCallback = function(data) {
      storage.set('userType', data.userType);
      processConnectToLiveAgent();
    }

    var processConnectToLiveAgent = function() {
      
      // If the queue is PA related then continue
      const wasButtonIdSetInProductValidation = storage.get('buttonIdSetInProductValidation') ?? false;
      const isPArelated = storage.get('buttonId') === routing['CONSUMER']['GRC - Patient Assistance'].buttonId;

      // If button id was already set via the logic in product validation or is PA related; skip the legacy logic and escalate now
      if (wasButtonIdSetInProductValidation || isPArelated) {
        connectToLiveAgent();
        return;
      }

      let userType = storage.get('userType');

      // Check if the userType is set
      if (typeof userType === 'undefined') {

        chatBot.actions.sendMessage({ directCall: 'askUserType' });
        // chatBot.actions.disableInput();

      } else if (userType.toLowerCase() === 'HCP'.toLowerCase()) {

        // First set default buttonId for HCP & unknown product
        if (storage.get('inCustomEscalation') !== true) {
          storage.set('buttonId', routing['HCP']['MICC - Other'].buttonId);
        }
        // Then, check the logic routing for HCP
        setButtonIdBasedOnRouting();

      } else if (userType.toLowerCase() === 'CONSUMER'.toLowerCase()) {

        // First set default buttonId for CONSUMER & unknown product
        storage.set('buttonId', routing['CONSUMER']['GRC - Patient Assistance'].buttonId);
        // Then, check the logic routing for CONSUMER
        setButtonIdBasedOnRouting();

      }
    };

    // Logic to change buttonId based on UserType and Product
    var setButtonIdBasedOnRouting = function() {
      let userType = storage.get('userType');
      let variableConfiguration = { revealValues: true };
      chatBot.api.getVariables(variableConfiguration).then(function(response) {
        if (response.data && response.data['product'] && response.data['product'].value) {
          storage.set('product', response.data['product'].value);
        }

        const product = storage.get('product') || '';
        if (product !== '' && storage.get('inCustomEscalation') !== true) {
          let buttons = routing[userType];
          let buttons_keys = Object.keys(buttons);
          for (var i = 0; i < buttons_keys.length; i++) {
            let button = buttons[buttons_keys[i]];
            if ('products' in button && button.products.toLowerCase().indexOf(product.toLowerCase()) !== -1) {
              storage.set('buttonId', button.buttonId);
              break;
            }
          }
        }

        connectToLiveAgent();
      });
    }

    var connectToLiveAgent = function() {
      chatbotAdapter = true;

      if (lastAnswer) {
        chatBot.actions.displaySystemMessage(lastAnswer)
      }

      if (storage.get('inCustomEscalation') === true && storage.get('customAlternativeQueue') !== '') {
        timers.startChatTimer = setTimeout(function() {
          if (!chatbotAdapter) return;
          escalateToNextQueue();
        }, config.nextQueueTimeout * 1000);
      } else {
        timers.startChatTimer = setTimeout(function() {
          if (!chatbotAdapter) return;
          chatBot.api.track('CHAT_UNATTENDED', { value: 'TRUE' });
          endChatSession(true, 'Reason: Timeout. No agent answer');
         /* chatBot.actions.displaySystemMessage({
            message: 'no-agents',
            translate: true
          });*/
          chatBot.actions.sendMessage({ directCall: 'noAgentsAvailable' });
          var ack = AgentSession.get('ack');
          AgentSession.set('ack', ++ack);
        }, config.agentWaitTimeout * 1000);
      }

      createChat(function(response) {
        AgentSession.set('chatActive', true);
        AgentSession.set('sflaId', response.sflaId);
        AgentSession.set(flag.adapterSessionId, response.adapterSessionId);
        getChatText(AgentSession.get('ack'));
      });
    }

    var escalateToNextQueue = function () {
      
      abortExistentGetRequests();
      chatBot.actions.displaySystemMessage({
        message: labels['escalating-next-agent']
      });
      storage.set('inCustomEscalation', false);
      let customAlternativeQueue = storage.get('customAlternativeQueue');
      if (typeof customAlternativeQueue !== 'undefined') {
        storage.set('buttonIdBeforeCustomEscalation', storage.get('buttonId'));
        storage.set('buttonId', customAlternativeQueue);
      }
      var ack = AgentSession.get('ack');
      AgentSession.set('ack', ++ack);
      sendMessageToLiveAgent({
        prefix: 'Chasitor',
        noun: 'ChangeQueue',
        object: { 'type': 'ChatEndReason', 'reason': 'client' }
      }, connectToLiveAgent);
    }

    // Escalate based on content attributes (flags ESCALATE)
    chatBot.subscriptions.onDisplayChatbotMessage(function(answer, next) {
      let flagEscalate = answer.flags && answer.flags.length > 0 && answer.flags.indexOf('escalate') !== -1;
      if (!chatbotAdapter && flagEscalate) {
        askEscalationToLiveAgent();
      } else {
        return next(answer);
      }
    });

    chatBot.subscriptions.onSendMessage(function(messageData, next) {
      if (chatbotAdapter) {
        var message = {
          'prefix': 'Chasitor',
          'noun': 'ChatMessage',
          'object': { 'text': messageData.message }
        };
        sendMessageToLiveAgent(message);
      } else {
        if (auth.systemMessageEscalationID) {
          checkEscalationToLiveAgent(messageData.message);
          return;
        }
        return next(messageData);
      }
    });

    chatBot.subscriptions.onSelectSystemMessageOption(function(optionData, next) {

      if (optionData.id !== auth.systemMessageEscalationID) {
        return next(optionData);
      }

      if (AgentSession.get(flag.isActive) ?? false) {
        dd('During connection to agent, was discovered existence connection, so we just connected to that session');
        chatbotAdapter = true;
        auth.systemMessageEscalationID = '';
        chatBot.actions.displaySystemMessage({
          message: 'agent-joined',
          replacements: { agentName: config.agent.name },
          translate: true
        });
        chatBot.actions.enableInput();
        abortExistentGetRequests();
        getChatText(AgentSession.get('ack'));
      } else {
        chatBot.actions.displayUserMessage({
          message: optionData.option.label,
          translate: true
        });
        checkEscalationToLiveAgent(optionData.option.value);
      }
    });

    // Restart connection if there was a chat conversation
    chatBot.subscriptions.onReady(function(next) {
      chatBot.helpers.setListener(config.inputId, 'keyup', chasitorEvent, chatBot);
      if (AgentSession.get(flag.isActive) ?? false) {
        chatbotAdapter = true;
        abortExistentGetRequests();
        var ack = AgentSession.get('ack');
        AgentSession.set('ack', ++ack);
        getChatText(AgentSession.get('ack'));
      } else {
        endChatSession(false, 'Reason: Clear all previous old data');
      }
      return next();
    });

    // Ratings logic
    chatBot.subscriptions.onRateContent(function(rateData, next) {
      chatBot.actions.closeSideWindow();
      if (rateData.value === 1) {
        chatBot.actions.sendMessage({ directCall: 'additionalHelp' })
      } else {
        askEscalationToLiveAgent();
      }

      return next(rateData);
    });

    // Set PA queue in case the content has special attribute
    chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
      let hasPArelated = messageData.attributes && messageData.attributes['PA_RELATED'];
      if (hasPArelated && hasPArelated === 'TRUE') {
        storage.set('buttonId', routing['CONSUMER']['GRC - Patient Assistance'].buttonId);
      }
      if (messageData.message === "I couldn't identify the product you mentioned") {
        storage.set('product', 'default');
        storage.set('buttonId', routing['HCP']['MICC - Other'].buttonId);
        chatBot.actions.sendMessage({
          message: "DefaultProduct",
          directCall: ""
        })
        return;
      }
      return next(messageData);
    });


    /*
     * SURVEY - Chat & Bot surveys logic
    */
    window.addEventListener('message', receiveMessage, false);
    function receiveMessage(event) {
      if (event.data.message === 'inbenta.survey.successful_answer') {
        storage.set('surveyProcess', 'toFinish')
        chatBot.actions.resetSession(); // Close chatbot and resetSession
      }
    }

    // On session start, set the survey as pending
    chatBot.subscriptions.onStartConversation(function(conversationData, next) {
      window.chatbot = chatBot;
      window.chatbotSessionId = conversationData.sessionId;
      storage.set('surveyProcess', 'toInit');
      // if (!storage.get('buttonId')) {
      //   storage.set('buttonId', routing['CONSUMER']['GRC - Patient Assistance'].buttonId);
      // }

      // Save all variables in storage to be used in the session
      const variablesToStore = {
        ...variables.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.value }), {}),
        ...window.inbChatbotParams.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.value }), {}),
      };
      for (const key in variablesToStore) {
        storage.set(key, variablesToStore[key]);
      }

      // Save the custom escalation variable so the correct contents are displayed
      if (variablesToStore['customEscalation'] === true) {
        chatBot.api.addVariable('customEscalation', 'TRUE');
      }

      chatBot.api.sessionUser({"Origin": window.location.origin });

      return next(conversationData);
    });

    // On reset session, check wether a survey has to be displayed or not
    chatBot.subscriptions.onResetSession(function(next) {
      chatbotAdapter = false;
      auth.systemMessageEscalationID = null;
      chatBot.actions.closeSideWindow();
      if (storage.get('surveyProcess') !== 'toInit') { // Already showing the survey
        storage.set('surveyProcess', 'toInit')
        return next();
      } else {
        if (AgentSession.get('chatActive')) {
          chatBot.actions.displaySystemMessage({
            message: 'chat-closed',
            translate: true,
            replacements: { agentName: config.agent.name }
          });
          displaySurveyAfterEscalation(AgentSession.get('survey'));
          clearTimeout(timers.startChatTimer);
          tracking('207', '');
          endChatSession(true, 'Reason: Customer exited conversation');
          return;
        } else {
          // Don't display survey if we're in the spanish config or transitioning to the spanish config
          if (
            surveyId === null ||
            window.resetSessionMotive === "spanishtransition" ||
            localStorage.getItem("inb_sdk_language") === "es"
          ) {
            return next();
          }

          storage.set("surveyProcess", "inProgress");
          chatBot.api.getSurvey(surveyId).then(function (response) {
            displaySurveyFromChatbot(response.data.url);
          });
          return;
        }
      }

      return next();
    });

    chatBot.subscriptions.onDisplaySystemMessage(function(messageData, next) {
      if (AgentSession.get('chatActive') && messageData.id === 'exitConversation') {
        if (storage.get('surveyProcess') === 'inProgress') {
          chatBot.actions.resetSession();
        } else {
          return next(messageData);
        }
      } else return next(messageData);
    });

    // Display survey again on refresh
    chatBot.subscriptions.onDomReady(function(next) {
      if (typeof storage.get('surveyDisplayed') !== 'undefined') {
        displaySurveyFromChatbot(storage.get('surveyDisplayed'));
      }
      return next();
    });

    // Force hide custom conversation window onShowConversationWindow
    chatBot.subscriptions.onShowConversationWindow(function(next) {
      let sessionData = chatBot.actions.getSessionData();
      if (!sessionData.sessionToken) {
        chatBot.actions.hideCustomConversationWindow();
      }
      return next();
    });

    // Display survey fromm chatbot
    var displaySurveyFromChatbot = function(surveyURL) {
        // If the user has not interacted with the chatbot, don't display the survey, reset the session and close the bot
        const hasUserInteractedWithChatbot = storage.get('user_interaction') ?? false;
        if (!hasUserInteractedWithChatbot) {
          storage.set('surveyProcess', 'toFinish')
          chatBot.actions.resetSession();
          return;
        }
  
      storage.set('surveyProcess', 'inProgress');
      storage.set('surveyDisplayed', surveyURL);
      chatBot.actions.showCustomConversationWindow({
        content: '<div id="5starVOC_GSK_Chat001"></div>',
        showLoader: false
      });
    }

    // Display survey after escalation
    var displaySurveyAfterEscalation = function(surveyURL) {
      storage.set('surveyProcess', 'inProgress');
      storage.set('surveyDisplayed', surveyURL);
      chatBot.actions.showCustomConversationWindow({
        content: '<iframe src="' + surveyURL + '"></iframe>',
        showLoader: false
      });
    }

    function setbottimeout() {
        bottimeout = window.setTimeout(closebot, 600000);
    }

    function closebot() {
        window.clearTimeout(bottimeout);
        bottimeout = undefined;
        surveyDisplay = false;
        chatBot.actions.resetSession();
        console.log("Bot Timeout Close!");
    }

    chatBot.subscriptions.onDisplayUserMessage(function(messageData, next) {
        window.clearTimeout(bottimeout);
        bottimeout = undefined;
        surveyDisplay = true;
        return next(messageData);
    });

    chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
        if (!bottimeout) {
            setbottimeout();
        }
        return next(messageData);
    });

    chatBot.subscriptions.onDisplayChatbotMessage((function(answer, next) {
        if (answer && answer.attributes && answer.attributes.title === "Role question - user is a patient ") {
            storage.set("userType", "CONSUMER")
        } else if (answer && answer.attributes && answer.attributes.title === "Role question - User is a Healthcare Professional") {
            storage.set("userType", "HCP");
        }
        return next(answer);
    }));

    window.dialogtwoproduct = function(dialogvar) {
      var testvar = "true";
      chatBot.api.addVariable('dialogvar', testvar);
    }

    window.escalatedialog = function(escalatevar) {
      const escalateVar = escalatevar.escalatevar

      if (escalateVar) {
        const userType = storage.get("userType");
        const possibleRoutes = routing?.[userType];

        if (possibleRoutes) {
          for (let route in possibleRoutes) {
            if (possibleRoutes[route]?.products) {
              let products = possibleRoutes[route].products.split(",");
              if (products.includes(escalateVar)) {
                storage.set('buttonId', possibleRoutes[route].buttonId);
                break;
              }
            }
          }
        }
      }

      window.chatbot.actions.sendMessage({
          message: "",
          directCall: "Livechat"
      });
    }

    chatBot.subscriptions.onHideConversationWindow(function(next) {
      (function() {
        if (typeof window.CustomEvent === "function") return false;

        function CustomEvent(event, params) {
          params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
          };
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        }
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
      })();
      var evt = new CustomEvent("chatBotClose");
      document.querySelector("body").dispatchEvent(evt);
      return next();
    });

  }
}

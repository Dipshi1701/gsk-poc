// External tracking
export default function(code, id) {

  let data = {};

  data.eventid = code;
  data.timestamp = Date.now();
  data.chatinfo = id;

  switch (code) {
    case '2': // chat start (agent joined)
      data.eventname = 'started';
      data.triggername = 'Start Chat';
      data.page = 'Initialised';
      break;
    case '7': // chat end
      data.eventname = 'finished';
      data.triggername = 'End Chat';
      data.page = 'Chat finished';
      break;
    case '201': // user sends first message
      data.eventname = 'firstMessage';
      data.triggername = 'first message';
      data.page = 'Initialised';
      break;
    case '207': // user abandons chat
      data.eventname = 'chatabandon';
      data.triggername = 'chat abandon';
      data.page = 'Initialised';
      break;
    case '17': // chatbot popup closed
      data.eventname = 'chatpopupclosed';
      data.triggername = 'chatbot';
      data.page = 'StartPage';
      break;
    case '10': // chatbot answers from KB
      data.eventname = 'chatbotquestions';
      data.triggername = 'chatbot';
      data.page = 'StartPage';
      break;
    case '100': // chat initialized out of working time
      data.eventid = '10';
      data.eventname = 'ooo';
      data.triggername = 'chatbot';
      data.page = 'StartPage';
      break;
  }

  try {

    // Check if tracking object exists
    if (typeof (ChatdigitalData) !== 'object') return;

    // If no events defined, create a list of events
    if (typeof (ChatdigitalData.event) === 'undefined') ChatdigitalData.event = new Array(10);

    ChatdigitalData.event[0] = {}
    ChatdigitalData.event[0].eventInfo = {
      eventID: data.eventid,
      eventName: data.eventname,
      triggerName: data.triggername,
      type: 'chat',
      timeStamp: data.timestamp,
      eventPage: data.page,
      chatInfo: data.chatinfo
    }

    if (typeof (ChatdigitalData.chatFields) === 'undefined') {
      ChatdigitalData.chatFields = new Array(10);
      ChatdigitalData.chatFields[0] = {
        FieldName: 'chatInfo',
        FieldValue: data.chatinfo
      }
    }

    if (ChatdigitalData.event) {
      ChatdigitalData.event[0].data = ChatdigitalData.chatFields;
      let body = document.getElementsByTagName('body');
      body[0].dispatchEvent(
        new CustomEvent('chatbotcall', ChatdigitalData)
      );
    } else {
      console.warn('File not available', ChatdigitalData.event[0]);
    }
  } catch (e) {
    console.warn('The consumer log Starts from here-' + e.message)
  }
}

export default function(storage, routing, customLabels, productValidationConfig, queueMapping) {
  return function(chatbot) {
    const variableConfiguration = {
          revealValues:true
      };
    let repMessage = customLabels.repMessage;
    let noRepMessage = customLabels.noRepMessage;
    let vaccinesProducts = ['bexsero', 'boostrix', 'gsk flu franchise', 'flulaval', 'fluarix', 'infanrix', 'pediarix', 'menveo', 'rotarix', 'shingrix'];
    const escalationDirectCall = 'escalationOffer';

    if (storage.get("userType") === "HCP") {
      storage.set("userType", "CONSUMER");
    }

  /**
   * Validates product variables and initiates appropriate actions.
   */
    chatbot.actions.productValidation = function() {
      chatbot.api.getVariables(variableConfiguration).then(function(variables) {
        const product2 = (variables?.data?.product_2?.value ?? '').toLowerCase();
        const productRep = (variables?.data?.productrep?.value ?? '').toLowerCase();

        // Handle product2 logic; this will return true if a direct call was made
        if (product2 !== '' && handleProduct2(product2)) {
          return;
        }

        // Handle productRep logic; this will return true if a direct call was made
        if (productRep !== '' && handleProductRep(productRep)) {
          return;
        }

        // product2 and productRep didn't trigger any direct calls, call the no rep direct call
        const directCall = 'noagentsrep';
        console.log(`[productValidation] product2 and productRep did not trigger any direct calls :: Calling default direct call: ${directCall}`);
        chatbot.actions.sendMessage({ directCall });
      });
    }

    /**
     * Handles logic for product2.
     *
     * @param {string} product2
     * @returns {boolean} Returns true if a direct call is made, otherwise false.
     */
    function handleProduct2(product2) {
      const { product2ToButton, product2ToDirectCall } = productValidationConfig;

      // Handle product2 to button
      if (product2ToButton.hasOwnProperty(product2)) {
        const queueName = product2ToButton[product2];
        const buttonId = getButtonIdFromQueueName(queueName);
        console.log(`[productValidation] product2ToButton :: ${product2} found :: Setting button: ${queueName} ${buttonId} :: Calling direct call: ${escalationDirectCall}`);
        storage.set('buttonId', buttonId);
        storage.set('buttonIdSetInProductValidation', true);
        chatbot.actions.sendMessage({ directCall: escalationDirectCall });
        return true;
      }

      // Handle product2 to direct call
      if (product2ToDirectCall.hasOwnProperty(product2)) {
        const directCall = product2ToDirectCall[product2];
        console.log(`[productValidation] product2ToDirectCall :: ${product2} found :: Calling direct call: ${directCall}`);
        chatbot.actions.sendMessage({ directCall });
        return true;
      }

      return false;
    }

  /**
   * Handles logic for productRep.
   *
   * @param {string} productRep
   * @returns {boolean} Returns true if a direct call is made, otherwise false.
   */
    function handleProductRep(productRep) {
      const { productRepToButton, productRepToDirectCall } = productValidationConfig;

      // Handle productRep to button
      if (productRepToButton.hasOwnProperty(productRep)) {
        const queueName = productRepToButton[productRep];
        const buttonId = getButtonIdFromQueueName(queueName);
        console.log(`[productValidation] productRepToButton :: ${productRep} found :: Setting button: ${queueName} ${buttonId} :: Calling direct call: ${escalationDirectCall}`);
        storage.set('buttonId', buttonId);
        storage.set('buttonIdSetInProductValidation', true);
        chatbot.actions.sendMessage({ directCall: escalationDirectCall });
        return true;
      }

      // Handle productRep to direct call
      if (productRepToDirectCall.hasOwnProperty(productRep)) {
        const directCall = productRepToDirectCall[productRep];
        console.log(`[productValidation] productRepToDirectCall :: ${productRep} found :: Calling direct call: ${directCall}`);
        chatbot.actions.sendMessage({ directCall });
        return true;
      }

      // Handle if product rep is set, but didn't match any of the previous configurations
      if (productRep !== '') {
        const queueName = 'GRC - Patient Assistance';
        const buttonId = getButtonIdFromQueueName(queueName);
        console.log(`[productValidation] handleProductRep :: ${productRep} not found :: Setting button: ${queueName} ${buttonId} :: Calling direct call: ${escalationDirectCall}`);
        storage.set('buttonId', buttonId);
        storage.set('buttonIdSetInProductValidation', true);
        chatbot.actions.sendMessage({ directCall: escalationDirectCall });
        return true;
      }

      return false;
    }

  /**
   * Retrieves the button ID associated with a queue name.
   *
   * @param {string} name
   * @returns {string|null} - The button ID if found, otherwise null.
   */
    function getButtonIdFromQueueName(name) {
      for (const userTypeKey in queueMapping) {
        for (const key in queueMapping[userTypeKey]) {
          if (key.toLowerCase() === name.toLowerCase()) {
            return queueMapping[userTypeKey][key].buttonId;
          }
        }
      }

      return null;
    }

    // Get the closest field sales professional
    chatbot.actions.findRep = function() {
      chatbot.api.getVariables(variableConfiguration).then(function(response) {
        let variables = response.data;
        let zipcode, territories, territoriesFound = '';
        let isVaccineProduct = false;

        for (let i = 0; i < vaccinesProducts.length; i++) {
          if (variables.productrep.value.toLowerCase() === vaccinesProducts[i]) isVaccineProduct = true;
        }

        if (variables.zipcode) zipcode = variables.zipcode.value;
        else if (!isVaccineProduct) {
          storage.set('buttonId', routing['CONSUMER']['GRC - Patient Assistance'].buttonId);
          chatbot.actions.sendMessage({ directCall: 'escalationOffer' });
        }

        if (variables.territories && variables.territories.value !== 'null') {
          territories = JSON.parse(variables.territories.value);

          if (!isVaccineProduct) territoriesFound = getTerritories(territories, zipcode);
          else territoriesFound = territories;

          if (territoriesFound.length > 1) {
            let finalTerritory = getClosestTerritory(territoriesFound);
            sendRepMessage(finalTerritory);
          } else if(territoriesFound.length === 1) {
            sendRepMessage(territoriesFound[0]);
          } else {
            displayChatbotMessage(noRepMessage);
            storage.set('buttonId', routing['CONSUMER']['GRC - Patient Assistance'].buttonId);
            storage.set()
            chatbot.actions.sendMessage({ directCall: 'escalationOffer' });
          }
        } else {
          displayChatbotMessage(noRepMessage);
          storage.set('buttonId', routing['CONSUMER']['GRC - Patient Assistance'].buttonId);
          chatbot.actions.sendMessage({ directCall: 'escalationOffer' });
        }
      });
    }

    // Return all the territories with the zipcode introduced
    function getTerritories (territories, zipcode) {
      var territoriesFound = [];
      for (var i = 0; i <= territories.length - 1; i++) {
        if (territories[i].ZIP.indexOf(zipcode) !== -1 && territories[i].roster_member.length > 0) {
          territoriesFound.push(territories[i]);
        }
      }
      return territoriesFound;
    }


    function displayChatbotMessage (message) {
      chatbot.actions.displayChatbotMessage({
        type: 'answer',
        message: message
      });
      resetVariables();
    }

    // Get the closest territory, the territories has a code like "US_1REDT8". The closest territory is the one closest to US_1REDT1
    function getClosestTerritory (territoriesFound) {
      var territoryNum = 999;
      var finalTerritory = [];

      for (var i = 0; i <= territoriesFound.length - 1; i++) {
        if (!territoriesFound[i].field_force.match(/[0-9]$/)) {
          finalTerritory = territoriesFound[i];
          break;
        } else if (parseInt(territoriesFound[i].field_force.slice(-1)) < territoryNum) {
          territoryNum = parseInt(territoriesFound[i].field_force.slice(-1));
          finalTerritory = territoriesFound[i];
        }
      }

      return finalTerritory;
    }

    // Format chatbot response with the field sales professional data
    function sendRepMessage (territory) {
      const repFullName = territory.roster_member[0].RepFirstName + ' ' + territory.roster_member[0].RepLastName;
      const repEmail = (territory.roster_member[0].RepEmail && territory.roster_member[0].RepEmail !== 'null') ? territory.roster_member[0].RepEmail : '';
      let repPhone = (territory.roster_member[0].RepMobilePhone && territory.roster_member[0].RepMobilePhone !== 'null') ? territory.roster_member[0].RepMobilePhone : '';
      repMessage = repMessage.replace('<Rep Name>', repFullName);
      if (repEmail === '' && repPhone === '') {
        displayChatbotMessage(noRepMessage);
        storage.set('buttonId', routing['CONSUMER']['GRC - Patient Assistance'].buttonId);
        chatbot.actions.sendMessage({ directCall: 'escalationOffer' });
      } else {
        repMessage = repMessage.replace('<Rep Email>', '<a href = "mailto: ' + repEmail + '">' + repEmail + '</a>');
        if (repEmail !== '' && repPhone !== '') { repPhone = ' and ' + '<a href = "tel: ' + repPhone + '">' + repPhone + '</a>' }
        repMessage = repMessage.replace('<Rep Phone>', repPhone);
        displayChatbotMessage(repMessage);
        chatbot.actions.sendMessage({ directCall: 'additionalHelp' });
      }
    }

    function resetVariables () {
      var variableList =
      [
          'accountNPI',
          'territories',
          'accountFirstName',
          'accountLastName',
            'ProductRep',
            'product_2'
      ];
      chatbot.api.resetVariables(variableList);
      repMessage = customLabels.repMessage;
      storage.set('buttonId', routing['CONSUMER']['GRC - Patient Assistance'].buttonId);
    }

    function addVariable (name, value) {
      chatbot.api.addVariable(name, value)
    }
  }
}

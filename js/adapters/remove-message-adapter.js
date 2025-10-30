export default function() {
  return function(chatbot) {
    chatbot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
      if (messageData.message == "It seems like you want to talk about something else") {
        return;
      }

      return next(messageData);
    });
  };
}

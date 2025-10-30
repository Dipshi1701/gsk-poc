## How to create a Chatbot adapter

Create your adapters as separate functions in this folder and import them into the `main.js`.

Example for `./src/scripts/adapters/modify-user-messages-adapter.js`:

```javascript
export default function () {
  return function modifyUserMessagesAdapter(bot) {
    bot.subscriptions.onDisplayUserMessage(function(messageData, next) {
      // All user messages will be replaced by the following message.
      messageData.message = "This is a User Message text replaced with the modifyUserMessageAdapter";
      return next(messageData);
    });
  }
}
```

Then, your `main.js` will look like the following:
```javascript
import modifyUserMessageAdapter from "../scripts/adapters/modify-user-messages-adapter";

// Insert adapters
app.sdkConfig.adapters = (typeof app.sdkConfig.adapters !== "undefined") ? app.sdkConfig.adapters : [];
app.sdkConfig.adapters.push(modifyUserMessageAdapter());
```

More information about **adapters**: [Inbenta SDK Chatbot - Adapters](https://developers.inbenta.io/javascript-sdks/chatbot/sdk-adapters)

More information about **actions** and **subscriptions** here: [Inbenta SDK Chatbot - Actions & subscriptions](https://developers.inbenta.io/javascript-sdks/chatbot/sdk-customization)

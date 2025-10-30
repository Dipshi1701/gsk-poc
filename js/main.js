import importScript from "./helpers/import-script.js";
import getSDKScript from "./helpers/get-sdk-script.js";


// Check if conf file exists
if (typeof inbChatbotAppSdk === "undefined") {
  throw new ReferenceError(
    "Inbenta Chatbot SDK couldn't be started, missing conf file. Please contact with support team for more information."
  );
}

window.buildInbentaSdk = (language = "en") => {
  console.log("buildInbentaSdk called with language:", language);
  
  
  if (window.InbentaChatbotSDK) {
    console.warn("InbentaChatbotSDK already exists!");
    console.log("Existing SDK Product:", window.inbChatbotAppSdk?.sdkConfig?.source);
    console.log("Existing SDK Variables:", window.inbChatbotAppSdk?.sdkConfig?.variables);
  }
  
    // Remove any open chatbots from ES<->EN transition
  const chatbots = document.querySelectorAll("#inbenta-bot-sdk");
  if (chatbots) {
    chatbots.forEach((chatbot) => {
      chatbot.remove();
    });
  }

  localStorage.setItem("inb_sdk_language", language);
  const appChatbot =
    language === "es" ? inbChatbotAppSdkSpanish : inbChatbotAppSdk;
  
  console.log("Loading Product:", appChatbot.sdkConfig?.source);
  console.log(" ChatbotId:", appChatbot.sdkConfig?.chatbotId);
  console.log(" Variables:", appChatbot.sdkConfig?.variables);



  // Import & build SDK
  const sdkChatbotScript = getSDKScript(
    appChatbot.sdkIntegration,
    appChatbot.product
  );
 
  // Import Search app
  importScript(sdkChatbotScript, () => {
    // Check if the Chatbot and Hyperchat SDK objects exists
    if (typeof window.InbentaChatbotSDK === "undefined") {
      throw new ReferenceError("Cannot start because SDK is not available.");
    }

   
  
    console.log(" Building SDK with credentials...");
    window.InbentaChatbotSDK.buildWithDomainCredentials(
      appChatbot.sdkAuth,
      appChatbot.sdkConfig
    );
    console.log("SDK Built Successfully!");
    console.log("Final Product:", appChatbot.sdkConfig?.source);
    console.log("Final Variables:", appChatbot.sdkConfig?.variables);
  });
};




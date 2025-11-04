const PRODUCT_CONFIG = {
    'trelegy': {
      src: 'Trelegy_poc',
      prod: 'Trelegy', 
      id: 'Trelegy'
    },
    'nucala': {
      src: 'Nucala',
      prod: 'Nucala',
      id: 'Nucala'
    },
    'shingrix': {
      src: 'Shingrix',
      prod: 'Shingrix',
      id: 'Shingrix'
    },
    'anoro': {
      src: 'Anoro',
      prod: 'Anoro',
      id: 'Anoro'
    },
    'benlysta': {
      src: 'Benlysta',
      prod: 'Benlysta',
      id: 'Benlysta'
    },
    'anorohcp': {
      src: 'AnoroHCP',
      prod: 'Anoro',
      id: 'AnoroHCP'
    },
    'nucalahcp': {
      src: 'NucalaHCP',
      prod: 'Nucala',
      id: 'NucalaHCP'
    },
    'trelegyhcp': {
      src: 'TrelegyHCP',
      prod: 'Trelegy',
      id: 'TrelegyHCP'
    },
    'zejulahcp': {
      src: 'ZejulaHCP',
      prod: 'Zejula',
      id: 'Zejula'
    },
    'gskpro': {
      src: 'GSKPRO',
      prod: 'Default',
      id: 'GSKPRO'
    },
    'blenrephcp': {
      src: 'BlenrepHCP',
      prod: 'Blenrep',
      id: 'BlenrepHCP'
    },
    'benlystahcp': {
      src: 'BenlystaHCP',
      prod: 'Benlysta',
      id: 'BenlystaHCP'
    },
    'mybreo': {
      src: 'Mybreo',
      prod: 'Mybreo',
      id: 'Mybreo'
    },
    'contactus': {
      src: 'Contactus',
      prod: 'Contactus',
      id: 'Contactus'
    },
    'jemperlihcp': {
      src: 'JemperliHCP',
      prod: 'Jemperli',
      id: 'JemperliHCP'
    },
    'shingrixhcp': {
      src: 'ShingrixHCP',
      prod: 'Shingrix',
      id: 'ShingrixHCP'
    },
    'blenrep': {
      src: 'Blenrep',
      prod: 'Blenrep',
      id: 'Blenrep'
    },
    'zejula': {
      src: 'Zejula',
      prod: 'Zejula',
      id: 'Zejula'
    },
    'jemperli': {
      src: 'Jemperli',
      prod: 'Jemperli',
      id: 'Jemperli'
    },
    'ventolin': {
      src: 'Ventolin',
      prod: 'Ventolin',
      id: 'Ventolin'
    },
    'gskoncology': {
      src: 'GSKOncology',
      prod: 'Default',
      id: 'GSKOncology'
    },
    'advair': {
      src: 'Advair',
      prod: 'Advair',
      id: 'Advair'
    },
    'flovent': {
      src: 'Flovent',
      prod: 'Flovent',
      id: 'Flovent'
    },
    'incruse': {
      src: 'Incruse',
      prod: 'Incruse',
      id: 'Incruse'
    },
    'arnuity': {
      src: 'Arnuity',
      prod: 'Arnuity',
      id: 'Arnuity'
    },
    'gskflu': {
      src: 'gskflu',
      prod: 'gskflu',
      id: 'gskflu'
    },
    'bexserohcp': {
      src: 'Bexserohcp',
      prod: 'Bexsero',
      id: 'Bexserohcp'
    },
    'gskoncologyondemand': {
      src: 'gskoncologyondemand',
      prod: 'default',
      id: 'gskoncologyondemand'
    },
    'ojjaarahcp': {
      src: 'ojjaarahcp',
      prod: 'ojjaara',
      id: 'ojjaarahcp'
    },
    'ojjaara': {
      src: 'ojjaara',
      prod: 'ojjaara',
      id: 'ojjaara'
    },
    'jesduvroqhcp': {
      src: 'jesduvroqhcp',
      prod: 'jesduvroq',
      id: 'jesduvroqhcp'
    },
    'jesduvroq': {
      src: 'jesduvroq',
      prod: 'jesduvroq',
      id: 'jesduvroq'
    },
    'menveohcp': {
      src: 'Menveohcp',
      prod: 'Menveo',
      id: 'Menveohcp'
    },
    'blujepa': {
      src: 'Blujepa',
      prod: 'Blujepa',
      id: 'Blujepa'
    },
    'blujepahcp': {
      src: 'BlujepaHCP',
      prod: 'Blujepa',
      id: 'BlujepaHCP'
    }
  };
  
  
  const API_CONFIG = {
    apiKey: 'BaAMju4v0LCJ0JouGzJsS05JqzHY0q04iYkPDDJmBvI=',
    domainKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCZlNvRzJ4RXdHQnZ3ekFDQUpGc3FnOjoifQ.LN88QhffGZ4adVxzZfgUCyMgIJOIdzH1noY4o7-KtwA0AAawRDohP-a9nmyI0bhgPlV1WAEUmE3Ym2u-CxrxgQ'
  };
  

  function autoOpenInbenta() {
    const FLAG = "__INBENTA_AUTO_OPENED__";

    function openIfReady() {
      const root = document.getElementById("inbenta-bot-sdk");
      if (!root) return false;

      const launcher = root.querySelector(".inbenta-bot__launcher");
      if (!launcher) return false;

     
      launcher.style.display = "none";

     
      if (
        !document.body.classList.contains("inbenta-bot--open") &&
        !document.body.classList.contains("inbenta-bot--opened") &&
        !window[FLAG]
      ) {
        window[FLAG] = true;
        launcher.click();
      }
      return true;
    }

    if (openIfReady()) return;
    const obs = new MutationObserver(() => {
      if (openIfReady()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  
  function launchChatbot() {
    console.log("launchChatbot() called");
  
    const selectedProduct = document.getElementById("product").value;
    const selectedEnv = document.getElementById("env").value;
  
    const productConfig = PRODUCT_CONFIG[selectedProduct];
    if (!productConfig) {
      alert("Product configuration not found!");
      return;
    }
    console.log("Launching chatbot for:", selectedProduct, productConfig);
  
    console.log("Starting cleanup...");
  
    if (window.InbentaChatbotSDK) {
      console.log("EXISTING SDK DETECTED!");
      console.log("Current Product Source:", window.inbChatbotAppSdk?.sdkConfig?.source);
      console.log("Current Variables:", window.inbChatbotAppSdk?.sdkConfig?.variables);
      console.log("NEW Product Requested:", productConfig.src);
      
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
      }
      
      console.log("Destroying existing SDK instance...");
      
      try {
        if (typeof window.InbentaChatbotSDK.closeConversationWindow === 'function') {
          window.InbentaChatbotSDK.closeConversationWindow();
          console.log("Conversation window closed");
        }
        if (typeof window.InbentaChatbotSDK.destroy === 'function') {
          window.InbentaChatbotSDK.destroy();
          console.log("SDK destroy() called");
        }
      } catch (e) {
        console.warn("Error during SDK destruction:", e);
      }
      
      document.body.classList.remove("inbenta-bot--open", "inbenta-bot--opened");
      
      const existingChatbots = document.querySelectorAll("#inbenta-bot-sdk");
      existingChatbots.forEach((el) => {
        el.remove();
        console.log("Removed existing chatbot DOM");
      });
      
      delete window.InbentaChatbotSDK;
      delete window.buildInbentaSdk;
      delete window.inbChatbotAppSdk;
      delete window.inbChatbotAppSdkSpanish;
      delete window.inbChatbotParams;
      delete window.__INBENTA_AUTO_OPENED__;
      
      console.log(" All SDK references cleared!");
      
      setTimeout(() => {
        performCleanupAndReload(productConfig, selectedEnv);
      }, 300);
      
      return;
    }
    
    console.log("No existing SDK instance found");
    console.log("Loading Product:", productConfig.src);
    performCleanupAndReload(productConfig, selectedEnv);
  }
  
  function performCleanupAndReload(productConfig, selectedEnv) {
    console.log("Performing final cleanup and reload...");
    
    const confScripts = document.querySelectorAll('script[data-inbenta-conf]');
    console.log("conf scripts:", confScripts.length, confScripts);
    confScripts.forEach((s) => s.remove());
  
    const mainScripts = document.querySelectorAll('script[src*="main.js"]');
    console.log("main scripts:", mainScripts.length, mainScripts);
    mainScripts.forEach((s) => s.remove());
  
    const sdkScripts = document.querySelectorAll('script[src*="inbenta-chatbot-sdk.js"]');
    console.log("sdk scripts:", sdkScripts.length, sdkScripts);
    sdkScripts.forEach((s) => s.remove());
  
    const chatbotElements = document.querySelectorAll("#inbenta-bot-sdk");
    console.log("chatbot elements:", chatbotElements.length, chatbotElements);
    chatbotElements.forEach((el) => el.remove());
  
    document.body.classList.remove("inbenta-bot--open", "inbenta-bot--opened");
    console.log("Cleanup completed");
  
    let wizard = document.querySelector("script.wizard");
    if (!wizard) {
      wizard = document.createElement("script");
      wizard.className = "wizard";
      document.head.appendChild(wizard);
    }
  
    wizard.setAttribute("data-chatbot-product", productConfig.prod);
    wizard.setAttribute("data-chatbot-env", selectedEnv);
    wizard.setAttribute("data-chatbot-source", productConfig.src);
    wizard.setAttribute("data-chatbot-id", productConfig.id);
    wizard.setAttribute("data-chatbot-api", API_CONFIG.apiKey);
    wizard.setAttribute("data-chatbot-key", API_CONFIG.domainKey);
  
  console.log("Wizard data:", {
    product: productConfig.prod,
    env: selectedEnv,
    source: productConfig.src,
    id: productConfig.id,
  });

 
  const existingConfScripts = document.querySelectorAll('script[data-inbenta-conf="true"]');
  existingConfScripts.forEach(script => script.remove());

  const confScript = document.createElement("script");
  confScript.src = "./conf/inbenta-conf.js?v=" + Date.now(); 
  confScript.setAttribute("data-inbenta-conf", "true");
  
    confScript.onload = function () {
      console.log("inbenta-conf.js loaded. Loading main.js...");
  
      const mainScript = document.createElement("script");
      mainScript.type = "module";
      mainScript.src = "./js/main.js?v=" + Date.now();
  
      mainScript.onload = function () {
        console.log("main.js loaded (it will auto-start the SDK).");
      };
      mainScript.onerror = function () {
        console.error("Failed to load main.js");
        alert("Failed to load main.js");
      };
  
      document.body.appendChild(mainScript);
    };
  
    confScript.onerror = function () {
      console.error("Failed to load inbenta-conf.js");
      alert("Failed to load inbenta-conf.js");
    };
  
    document.body.appendChild(confScript);
  }

  function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 15;
  
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
  
      const size = Math.random() * 100 + 50;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
  
      particlesContainer.appendChild(particle);
    }
  }


  

  document.addEventListener('DOMContentLoaded', function() {
    const mountButton = document.getElementById('mount');
    const clearButton = document.getElementById('clear-reload');
    const generateKeysButton = document.getElementById('toggle-theme');
    const backToHomeButton = document.getElementById('back-to-home');

    initParticles();
    
    if (mountButton) {
      mountButton.addEventListener('click', launchChatbot);
    }
    
    if (clearButton) {
      clearButton.addEventListener('click', function() {
        window.location.reload();
      });
    }
    if (!generateKeysButton) { return; }
    generateKeysButton.addEventListener('click', function() {
      window.location.href = 'keys.html';
    });
    if (!backToHomeButton) { return; }
    backToHomeButton.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  });
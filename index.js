(function () {
    // const cdn="https://assets.gskstatic.com/pharma/us/global/components/preprod/chatbot/";

    const styles = [
        `.wizard-chatbot {
            padding:0;
            width: 44px;
            height: 44px;
            cursor: pointer;
            position: fixed;
            right: 7px;
            z-index: 9999;
            background:none;
            box-sizing: border-box;
            border-radius:44px;
            border:none;
            transition: all .35s;
            transform-origin: center;
            box-shadow:0 3px 3px 1px rgba(0, 0, 0, .1);
            z-index:2;
        }`,
        `.wizard-chatbot:focus{
            outline:none;
        }`,
        `.wizard-chatbot span.chatbot-container{
            width:100%;
            height:100%;
            display:block;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 22px auto;
            background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.35 21.01"><path d="M3,0H13.45a3.1,3.1,0,0,1,2.14.86,2.92,2.92,0,0,1,.88,2.08V9.5a2.92,2.92,0,0,1-.88,2.08,3.1,3.1,0,0,1-2.14.86H8.23L3.65,16.27a.51.51,0,0,1-.71-.05.53.53,0,0,1-.13-.36l.25-3.43H3a3,3,0,0,1-2.13-.86A2.85,2.85,0,0,1,0,9.5V2.94A2.89,2.89,0,0,1,.89.86,3.06,3.06,0,0,1,3,0ZM18,4.78a3,3,0,0,1,1.53.8,2.78,2.78,0,0,1,.87,2v6.56a2.78,2.78,0,0,1-.87,2,2.93,2.93,0,0,1-2.08.85h-.11l.25,3.49h0a.39.39,0,0,1-.11.31.43.43,0,0,1-.62,0l-4.61-4H6.14l3-3h6.32A2.48,2.48,0,0,0,18,11.54V5a1.34,1.34,0,0,0,0-.2Z" transform="translate(0 0)" style="fill:%23FFF"/></svg>');
            background-color:#F26632;
            border-radius:44px;
        }`
        ,
        `.wizard-chatbot.focused span.chatbot-container{
            animation-duration: .4s;
            animation-name: chatbotClicked;
            animation-iteration-count:infinite;       
        }`,

        `.wizard-chatbot:active span.chatbot-container{
            animation-duration: .4s;
            animation-name: chatbotClicked;
        }`,
        `.wizard-chatbot  span.chatbot-container:hover{
            background-color:#E05E2F;
        }`,
        `.wizard-chatbot span.chatbot-container span{
            visibility:hidden;
            width:0;
            height:0;
            overflow:hidden;
        }`,
        `.inbenta-bot__launcher{
            display:none !important
        }`,
        `
        .wizard-chatbot.wizard-chatbot-hide{
            display:none !important;
        }
        `,
        `@keyframes chatbotClicked {
            0%{
                box-shadow:0 0 0px 4px rgba(225,225,255,.15);
                transform: scale(1);
            }
            20%{
                box-shadow:0 0 0px 4px rgba(224,94,47,.15);
                transform: scale(1.05);
                background-color:#E05E2F;
            }
            100%{
                box-shadow:0 0 0px 4px rgba(225,225,255,.15);
                transform: scale(1);
            }
          }
        `,
        `@keyframes chatbotFocused{
            0%{
                box-shadow:0 0 0px 4px rgba(225,225,255,.15);
                transform: scale(1);
            }
            20%{
                box-shadow:0 0 0px 4px rgba(224,94,47,.15);
                transform: scale(1.05);
                background-color:#E05E2F;
            }
            100%{
                box-shadow:0 0 0px 4px rgba(225,225,255,.15);
                transform: scale(1);
            }
          }
        `,
        `body.isi-loaded:not(.isi-sticky-hidden):not(.isi-only):not(.isi-sticky-collapsed) .wizard-chatbot{
            display:none;
        }`,
        //No ISI
        `
        body:not(.isi-loaded):not(.wizard-back-to-top-loaded) .wizard-chatbot{
            bottom:12px;
        }
        `,
        `body.wizard-back-to-top-loaded.wizard-scrolled-viewport:not(.isi-loaded) .wizard-chatbot{
            bottom:68px;
        }
        `,
        `body.wizard-back-to-top-loaded:not(.wizard-scrolled-viewport):not(.isi-loaded) .wizard-chatbot{
            bottom:12px;
        }
        `,
        //hidden Floating ISI
        `
        body.isi-sticky-hidden:not(.wizard-back-to-top-loaded) .wizard-chatbot{
            bottom:12px;
        }
        `,
        `
        body.wizard-back-to-top-loaded.isi-sticky-hidden .wizard-chatbot{
            bottom:68px;
        }
        `,
        //collapsed ISI
        `
        body.isi-sticky-collapsed:not(.isi-sticky-hidden):not(.wizard-back-to-top-loaded) .wizard-chatbot{
            bottom:68px;
        }
        `,
        `
        body.isi-sticky-collapsed:not(.isi-sticky-hidden) .wizard-chatbot{
            bottom:87px !important;
        }
        `,
        `
        body.wizard-back-to-top-loaded.isi-sticky-collapsed:not(.isi-sticky-hidden) .wizard-chatbot{
            bottom:68px;
        }
        `
    ];

   
    const prevBtn = document.querySelector(".reference-chat-icon");

    if (prevBtn) {
        console.log("Please Remove Original Chat Bot Button");
        prevBtn.remove();
    }

    const btn = document.querySelectorAll(".wizard-chatbot-static");

    const styleSheet = window.document.createElement("style");
    window.document.head.appendChild(styleSheet);

    const sheet = styleSheet.sheet;

    styles.forEach((rule, i) => {
        sheet.insertRule(rule.toString(), i);
    });

    
    document.querySelector("body").addEventListener("chatBotClose", function (evt) {
        document.querySelector(".wizard-chatbot").classList.remove("wizard-chatbot-hide");
    });

    const addFiles = function (evt) {
        evt.preventDefault();

        var ChatdigitalData = {};
        window.ChatdigitalData = ChatdigitalData;

        const body = document.querySelector("body");

        document.querySelector(".wizard-chatbot").classList.add("wizard-chatbot-hide");
        
        if (body.classList.contains("inbenta-bot--opened")) {
            if (document.getElementById("inbenta-bot-sdk") != null) {
                document.querySelector(".inbenta-bot__launcher").click();
            }
        } else {

           const script = document.createElement("script");
           script.src = './conf/inbenta-conf.js'; 
           script.onload = () => console.log('[conf] Local inbenta-conf.js loaded');
           script.onerror = (e) => console.error('[conf] FAILED to load', script.src, e)
           body.appendChild(script);
           body.classList.add("inbenta-bot--open");
           body.classList.add("inbenta-bot--opened");
                  }
    }
    const focus = (evt) => {
        if (evt.key === "Tab" && evt.type === "keyup") {
            evt.currentTarget.classList.add("focused");
        }
    }
    const blur = (evt) => {
        const classList = evt.currentTarget.classList
        if (classList.contains("focused"))
            classList.remove("focused");
    }
    const addButton = function () {

        const button = document.createElement("button");
        const container = document.createElement("span");
        const text = document.createElement("span");
        button.classList.add("wizard-chatbot");
        button.classList.add("inbenta-chatbot");
        container.classList.add("chatbot-container");

        text.textContent = "Chat with GSK";
        button.setAttribute("aria-label", "Chat with GSK");
        button.setAttribute("title", "Chat with GSK");
        button.setAttribute("tabIndex", "0");

        container.append(text);
        button.append(container);

        button.addEventListener("click", addFiles);

        //focus-visible breaks in Safari, so these events add and remove a focus class.
        button.addEventListener("keyup", focus);
        button.addEventListener("blur", blur);

        const body = document.querySelector("body");




        const backToTop = body.querySelector(".wizard-back-to-top");
        if (backToTop) {
            backToTop.insertAdjacentElement("beforebegin", button);
        } else {
            body.appendChild(button);
        }


    }

    //loop through static buttons
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener("click", addFiles);
    }
    //add fab
    addButton();
    

})();

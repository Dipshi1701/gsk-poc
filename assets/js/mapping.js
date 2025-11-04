// assets/js/mapping.js
export const PRODUCTS = {
    trelegy:        { src: 'Trelegy_poc',  prod: 'Trelegy',  id: 'Trelegy',      preprodGroup: 'B', previewProdGroup: 'A' },
    nucala:         { src: 'Nucala',       prod: 'Nucala',   id: 'Nucala',       preprodGroup: 'B', previewProdGroup: 'A' },
    shingrix:       { src: 'Shingrix',     prod: 'Shingrix', id: 'Shingrix',     preprodGroup: 'B', previewProdGroup: 'A' },
    anoro:          { src: 'Anoro',        prod: 'Anoro',    id: 'Anoro',        preprodGroup: 'B', previewProdGroup: 'A' },
    benlysta:       { src: 'Benlysta',     prod: 'Benlysta', id: 'Benlysta',     preprodGroup: 'B', previewProdGroup: 'B' },
  
    anorohcp:       { src: 'AnoroHCP',     prod: 'Anoro',    id: 'AnoroHCP',     preprodGroup: 'B', previewProdGroup: 'B' },
    nucalahcp:      { src: 'NucalaHCP',    prod: 'Nucala',   id: 'NucalaHCP',    preprodGroup: 'B', previewProdGroup: 'B' },
    trelegyhcp:     { src: 'TrelegyHCP',   prod: 'Trelegy',  id: 'TrelegyHCP',   preprodGroup: 'B', previewProdGroup: 'C' },
    zejulahcp:      { src: 'ZejulaHCP',    prod: 'Zejula',   id: 'Zejula',       preprodGroup: 'B', previewProdGroup: 'C' },
    gskpro:         { src: 'GSKPRO',       prod: 'Default',  id: 'GSKPRO',       preprodGroup: 'B', previewProdGroup: 'B' },
  
    blenrephcp:     { src: 'BlenrepHCP',   prod: 'Blenrep',  id: 'BlenrepHCP',   preprodGroup: 'B', previewProdGroup: 'C' },
    benlystahcp:    { src: 'BenlystaHCP',  prod: 'Benlysta', id: 'BenlystaHCP',  preprodGroup: 'B', previewProdGroup: 'C' },
    mybreo:         { src: 'Mybreo',       prod: 'Mybreo',   id: 'Mybreo',       preprodGroup: 'C', previewProdGroup: 'D' },
    contactus:      { src: 'Contactus',    prod: 'Contactus',id: 'Contactus',    preprodGroup: 'D', previewProdGroup: 'D' },
  
    jemperlihcp:    { src: 'JemperliHCP',  prod: 'Jemperli', id: 'JemperliHCP',  preprodGroup: 'C', previewProdGroup: 'E' },
    shingrixhcp:    { src: 'ShingrixHCP',  prod: 'Shingrix', id: 'ShingrixHCP',  preprodGroup: 'B', previewProdGroup: 'E' },
    blenrep:        { src: 'Blenrep',      prod: 'Blenrep',  id: 'Blenrep',      preprodGroup: 'C', previewProdGroup: 'D' },
    zejula:         { src: 'Zejula',       prod: 'Zejula',   id: 'Zejula',       preprodGroup: 'C', previewProdGroup: 'F' },
    jemperli:       { src: 'Jemperli',     prod: 'Jemperli', id: 'Jemperli',     preprodGroup: 'C', previewProdGroup: 'F' },
  
    ventolin:       { src: 'Ventolin',     prod: 'Ventolin', id: 'Ventolin',     preprodGroup: 'C', previewProdGroup: 'F' },
    gskoncology:    { src: 'GSKOncology',  prod: 'Default',  id: 'GSKOncology',  preprodGroup: 'C', previewProdGroup: 'F' },
    advair:         { src: 'Advair',       prod: 'Advair',   id: 'Advair',       preprodGroup: 'C', previewProdGroup: 'G' },
    flovent:        { src: 'Flovent',      prod: 'Flovent',  id: 'Flovent',      preprodGroup: 'C', previewProdGroup: 'G' },
    incruse:        { src: 'Incruse',      prod: 'Incruse',  id: 'Incruse',      preprodGroup: 'C', previewProdGroup: 'G' },
  
    arnuity:        { src: 'Arnuity',      prod: 'Arnuity',  id: 'Arnuity',      preprodGroup: 'C', previewProdGroup: 'G' },
    gskflu:         { src: 'gskflu',       prod: 'gskflu',   id: 'gskflu',       preprodGroup: 'C', previewProdGroup: 'H' },
    bexserohcp:     { src: 'Bexserohcp',   prod: 'Bexsero',  id: 'Bexserohcp',   preprodGroup: 'D', previewProdGroup: 'H' },
    sotrovimab:     { src: 'Sotrovimab',   prod: 'Sotrovimab',id:'Sotrovimab',   preprodGroup: 'D', previewProdGroup: 'H' },
    gskoncologyondemand: { src: 'gskoncologyondemand', prod: 'default', id: 'gskoncologyondemand', preprodGroup: 'D', previewProdGroup: 'H' },
  
    ojjaarahcp:     { src: 'ojjaarahcp',   prod: 'ojjaara',  id: 'ojjaarahcp',   preprodGroup: 'D', previewProdGroup: 'E' },
    ojjaara:        { src: 'ojjaara',      prod: 'ojjaara',  id: 'ojjaara',      preprodGroup: 'D', previewProdGroup: 'E' },
    jesduvroqhcp:   { src: 'jesduvroqhcp', prod: 'jesduvroq',id: 'jesduvroqhcp', preprodGroup: 'D', previewProdGroup: 'D' },
    jesduvroq:      { src: 'jesduvroq',    prod: 'jesduvroq',id: 'jesduvroq',    preprodGroup: 'D', previewProdGroup: 'D' },
    menveohcp:      { src: 'Menveohcp',    prod: 'Menveo',   id: 'Menveohcp',    preprodGroup: 'D', previewProdGroup: 'I' },
  
    blujepa:        { src: 'Blujepa',      prod: 'Blujepa',  id: 'Blujepa',      preprodGroup: 'E', previewProdGroup: 'B' },
    blujepahcp:     { src: 'BlujepaHCP',   prod: 'Blujepa',  id: 'BlujepaHCP',   preprodGroup: 'E', previewProdGroup: 'B' },
  
   
    'medical-affairs': { src: 'MedicalAffairs', prod: 'Default', id: 'MedicalAffairs', preprodGroup: null, previewProdGroup: 'D' }
  };
  
  export const API_KEYS = {
    preprod:    'BaAMju4v0LCJ0JouGzJsS05JqzHY0q04iYkPDDJmBvI=',
    preview:    'BaAMju365cQ63Q9nPWmyc6PfxI4fNr+/gpTlCauJ57Q=',
    production: 'BaAMju365cQ63Q9nPWmyc6PfxI4fNr+/gpTlCauJ57Q='
  };
  
  export const DOMAIN_KEYS_PREPROD = {
    B: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCYUJncFpnOUJZNGF0S193LXQyb2tROjoifQ.EsWx9UBCHJnyppriSMoM9Ummg8-5ddbnUd5LCl13RJTAVko3HqNoPSl5rS7xSicJD3b5exTUaSw0HVptCm3jUg',
    C: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCYW5ZYXo1YkF3UkRuaG9PTHo4R3FnOjoifQ.nHLD7E4rcZjKBkdfcXHRmsC0G44vkwHbRPiVb-mFdJOLfoc9H2GUsWYt2fVq_hPfDLAoLvXhznBz1aVwlbtU6Q',
    D: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCZHZXeFVxLWJTbFNKcXA3TGh4cm1ROjoifQ.GQi65j6NfO48Z90avzPVvO9Veq6hnbCr8iMMUDBSHJZTHy0pmnxM6GHVy8nXj3_Sia2uAJvJ7ixESrrkkbKmkg',
    E: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCakRkcUpDbVlNdXZsM1FzT1l4ckZBOjoifQ.UiI1f_gKnFgQmej7mozURyeLLosJ3qZ-zFmIEpG4B48AaoHiRlK_0lzVtVzsK4WTtYF5D_uVKh2p2l9CgcLwSw'
  };
  
  export const DOMAIN_KEYS_PREVIEW_PROD = {
    A: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCYnk0WHVtakY4TzF1ZHZ0cVM5UlJROjoifQ.UHkNH9hmttspPxtVWOHIAhyL-OI2UJbKRxsAPCggdDbq0jmMF9EDTayXZJGJ7BV2MN2qTzVxWnAe0-5wutAekg',
    B: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCYnk0cm9JUkNaaThPTUFDZFoxOHJ3OjoifQ.cXMmCoVme3y6tzYtbcsd4rhjhbr0Cr506iJZcFvr20FTPXw378Wwd3l93QB-2UQS5YbKYNZgnI6ZVQnCELWTAw',
    C: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCYnk0dEFKbjNTS1VtU0tJbFhwNGxnOjoifQ.LWhFIXtS-k1BV7HSmIpdubadqEZm_PlaTWTY8_oLZKtmesTI0Nss6gx-a6dSsf3bQajHKInNG-HeSaybcOdUCA',
    D: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCYnk0dWFONmh6TG05OXlBZmctRWhROjoifQ.RveWMGBZFlg9twHeMe1-SZXiQuQoGiON3b486Dt7xJClfyVegQ1Wo-kWkQ0jvDHDfuqL9gxpbovrzOkv8NxL4A',
    E: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCYWhQSWt2SkZaRGlIRlBHaklYSzZ3OjoifQ.P55t-JlMNK8AAthB0DnqlNv4weUCbemMQP6tNw4uCPO7cxip-dB1tWJYa4-PeFPcG6u3uIt1EmQkTi6aauTg-A',
    F: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCY08zekMtWEZ1Q1NLaFdoejJLYzZBOjoifQ.G5SQ3TLTRx5zXHxckYK6J3U1TWsB-DGj2czdlVCrob99xm-suhDNCYTZZs_MhkVRBuh9J66gDIy_PIhUJJn5gQ',
    G: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCYWNGaDdjYlJtSUw4RXhrUDR4NDV3OjoifQ.Nrx2Eb-aangnc4ramqjbAqUEdHTAarP5wYKXx_dvR27lt7KJt0oPCVCCkR05Emm2BcRNp-xvEcrXmGnSN6nKYw',
    H: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCYWNacTZabFZoMXlBRk1VV0FtOTBBOjoifQ.bEdozvc3bwfKjxxnfbUtfMAQE1hGSpyYmaza9qdYGnXc75mylf0zKTYs5NwBBNZ8sKUHjOIs1ezA-2Q3S-jkEA',
    I: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJwcm9qZWN0IjoiZ3NrX2NoYXRib3RfcHJvZHVjdGlvbl9lbiIsImRvbWFpbl9rZXlfaWQiOiJCYWhQTWRQWTJET3IzblBWUFhJQVJROjoifQ.ZHFEIC96v_a4CHrByUax3qnaFeEfNSoKKhdvh_E-NEJ4XUWe0oEg8WtWmcfQiQ20O0M8yVzIo1I1G0JMt036Ww'
  };
  
  export function resolveKeys(env, productKey) {
    const p = PRODUCTS[productKey];
    if (!p) throw new Error('Unknown product: ' + productKey);
  
    if (env === 'preprod') {
      if (!p.preprodGroup || !DOMAIN_KEYS_PREPROD[p.preprodGroup]) {
        throw new Error('No preprod domain key for: ' + productKey);
      }
      return {
        apiKey: API_KEYS.preprod,
        domainKey: DOMAIN_KEYS_PREPROD[p.preprodGroup],
        src: p.src, prod: p.prod, id: p.id
      };
    }
  
    const group = p.previewProdGroup;
    if (!group || !DOMAIN_KEYS_PREVIEW_PROD[group]) {
      throw new Error('No preview/production domain key for: ' + productKey);
      }
    const apiKey = env === 'preview' ? API_KEYS.preview : API_KEYS.production;
    return {
      apiKey,
      domainKey: DOMAIN_KEYS_PREVIEW_PROD[group],
      src: p.src, prod: p.prod, id: p.id
    };
  }
  
  export function generateWizardTag(env, productKey) {
    const { apiKey, domainKey, src, prod, id } = resolveKeys(env, productKey);
    return `<script class="wizard" data-chatbot-env="${env}" data-chatbot-prod="${prod}" data-chatbot-src="${src}" data-chatbot-id="${id}" data-chatbot-key="${domainKey}" data-chatbot-api="${apiKey}"></script>`;
  }
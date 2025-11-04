import { generateWizardTag, resolveKeys, PRODUCTS } from './mapping.js';

function injectScriptTag(tagString) {
  const container = document.getElementById('script-container');
  if (!container) return;
  // Clear previous
  container.innerHTML = '';
  // Create a DOM script element and set attributes safely
  const parser = new DOMParser();
  const doc = parser.parseFromString(tagString, 'text/html');
  const script = doc.querySelector('script.wizard');
  if (!script) return;
  const s = document.createElement('script');
  Array.from(script.attributes).forEach(attr => {
    s.setAttribute(attr.name, attr.value);
  });
  container.appendChild(s);
}

document.addEventListener('DOMContentLoaded', () => {
  const productSelect = document.getElementById('product');
  const envSelect = document.getElementById('env');
  const generateBtn = document.getElementById('generate-keys');
  const out = document.getElementById('wizard-tag');
  const details = document.getElementById('wizard-details');
  const copyBtn = document.getElementById('copy-tag');

  if (!productSelect || !envSelect || !generateBtn || !out || !details || !copyBtn) {
    return;
  }

  
  copyBtn.disabled = true;

  generateBtn.addEventListener('click', () => {
    const product = productSelect.value; 
    const env = envSelect.value; 

    try {
      const { apiKey, domainKey, src, prod, id } = resolveKeys(env, product);
      const tag = generateWizardTag(env, product);
      out.textContent = tag;

      details.innerHTML = `
        <div class="card p-3" style="border-radius: 12px;">
          <div class="row g-3">
            <div class="col-md-6">
              <div><strong>Product key</strong>: ${product}</div>
              <div><strong>Environment</strong>: ${env}</div>
              <div><strong>data-chatbot-src</strong>: ${src}</div>
              <div><strong>data-chatbot-prod</strong>: ${prod}</div>
              <div><strong>data-chatbot-id</strong>: ${id}</div>
            </div>
            <div class="col-md-6">
              <div><strong>data-chatbot-key</strong>: <code>${domainKey}</code></div>
              <div><strong>data-chatbot-api</strong>: <code>${apiKey}</code></div>
            </div>
          </div>
        </div>`;

      injectScriptTag(tag);

      // Enable copy after generation
      copyBtn.disabled = false;
    } catch (e) {
      out.textContent = '';
      details.innerHTML = `<div class="alert alert-danger">${e?.message || 'Failed to generate wizard tag'}</div>`;
      copyBtn.disabled = true;
    }
  });

  copyBtn.addEventListener('click', async () => {
    const text = out.textContent || '';
    if (!text.trim()) return;
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext !== false) {
        await navigator.clipboard.writeText(text);
        success = true;
      }
    } catch (_) {}

    if (!success) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        success = true;
      } catch (_) {}
    }

    copyBtn.textContent = success ? 'Copied!' : 'Copy failed';
    setTimeout(() => (copyBtn.textContent = 'Copy Tag'), 1500);
  });
});



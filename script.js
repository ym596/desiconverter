// script.js
const KEY_NAME = 'exRatesApiKey';

// Save API key to localStorage
function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (!key) return alert('Please enter a valid API key.');
  localStorage.setItem(KEY_NAME, key);
  document.getElementById('apiKeySection').style.display = 'none';
}

// Remove API key and show input again
function resetApiKey() {
  localStorage.removeItem(KEY_NAME);
  document.getElementById('apiKeySection').style.display = 'block';
}

// Forward converter: selected currency → INR
async function convert() {
  const apiKey = localStorage.getItem(KEY_NAME);
  if (!apiKey) {
    return alert('Please save your exchangeratesapi.io API key first.');
  }

  const currency = document.getElementById('currency').value;
  const rawAmt  = parseFloat(document.getElementById('amount').value);
  const unit    = document.getElementById('unit').value;

  if (isNaN(rawAmt) || rawAmt <= 0) {
    return alert('Enter a positive number.');
  }

  const multipliers = { unit:1, hundred:1e2, thousand:1e3, million:1e6, billion:1e9 };
  const totalUnits = rawAmt * (multipliers[unit] || 1);

  try {
    const url = `https://api.exchangeratesapi.io/v1/convert?access_key=${apiKey}` +
                `&from=${currency}&to=INR&amount=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error.type || 'API error');
    const rate = data.result;

    document.getElementById('exchange-rate')
      .textContent = `1 ${currency} = ${rate.toFixed(2)} INR`;

    const totalINR = rate * totalUnits;
    let formatted;
    if (totalINR >= 1e7) {
      formatted = (totalINR / 1e7).toFixed(2) + ' crore INR';
    } else if (totalINR >= 1e5) {
      formatted = (totalINR / 1e5).toFixed(2) + ' lakh INR';
    } else {
      formatted = totalINR.toLocaleString('en-IN', { maximumFractionDigits: 2 }) + ' INR';
    }
    document.getElementById('result').textContent = formatted;

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  } catch (err) {
    alert('Conversion failed: ' + err.message);
  }
}

// Reverse converter: INR → selected currency
async function convert2() {
  const apiKey = localStorage.getItem(KEY_NAME);
  if (!apiKey) {
    return alert('Please save your exchangeratesapi.io API key first.');
  }

  const currency = document.getElementById('currency2').value;
  const rawINR   = parseFloat(document.getElementById('amount2').value);

  if (isNaN(rawINR) || rawINR <= 0) {
    return alert('Enter a positive number.');
  }

  try {
    const url = `https://api.exchangeratesapi.io/v1/convert?access_key=${apiKey}` +
                `&from=INR&to=${currency}&amount=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error.type || 'API error');
    const rate = data.result;

    document.getElementById('exchange-rate2')
      .textContent = `1 INR = ${rate.toFixed(4)} ${currency}`;

    const totalTarget = rawINR * rate;
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(totalTarget);

    document.getElementById('result2').textContent = formatted;

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  } catch (err) {
    alert('Conversion failed: ' + err.message);
  }
}

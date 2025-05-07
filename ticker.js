// ticker.js - Improved Implementation
// Uses /latest endpoint to fetch multiple rates in one call

const TICKER_ID = 'ticker';
const KEY_NAME = 'exRatesApiKey';
// define target currencies relative to INR
const targets = ['USD', 'EUR', 'GBP', 'JPY'];

/**
 * Update the ticker element with live rates or placeholder
 */
async function updateTicker() {
  const tickerEl = document.getElementById(TICKER_ID);
  if (!tickerEl) return;

  const apiKey = localStorage.getItem(KEY_NAME);
  if (!apiKey) {
    tickerEl.textContent = '🔑 Enter & save API key to load live rates...';
    return;
  }

  try {
    // Fetch all target rates relative to INR
    const symbols = targets.join(',');
    const url =
      `https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}` +
      `&base=INR&symbols=${symbols}`;

    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error.info || data.error.type);

    // Build ticker text
    const items = targets.map(cur => {
      const rate = data.rates[cur];
      return `INR/${cur}: ${rate.toFixed(2)}`;
    });
    const text = items.join('   |   ');

    // Render scrolling marquee
    tickerEl.innerHTML = `<marquee behavior="scroll" direction="left" scrollamount="5">${text}</marquee>`;
  } catch (err) {
    console.error('Ticker error:', err);
    tickerEl.textContent = `⚠️ ${err.message}`;
  }
}

// Initialize and refresh every 60 seconds
document.addEventListener('DOMContentLoaded', () => {
  updateTicker();
  setInterval(updateTicker, 60000);
});

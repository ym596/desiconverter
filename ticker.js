// ticker.js
// Live exchange rates ticker for Desi Currency Converter
// Fetches major currency pairs and displays them in a scrolling marquee

const TICKER_ID = 'ticker';
const KEY_NAME = 'exRatesApiKey';

// Currency pairs to display (from → to)
const pairs = [
  { from: 'USD', to: 'INR' },
  { from: 'EUR', to: 'INR' },
  { from: 'GBP', to: 'INR' },
  { from: 'JPY', to: 'INR' },
  { from: 'INR', to: 'USD' }
];

/**
 * Update the ticker element with live rates or placeholder
 */
async function updateTicker() {
  const tickerEl = document.getElementById(TICKER_ID);
  if (!tickerEl) return;

  const apiKey = localStorage.getItem(KEY_NAME);
  if (!apiKey) {
    // Show placeholder text if API key not saved
    tickerEl.textContent = '🔑 Enter & save API key to load live rates...';
    return;
  }

  try {
    // Fetch rates for each pair concurrently
    const requests = pairs.map(pair => {
      const url = `https://api.exchangeratesapi.io/v1/convert` +
                  `?access_key=${apiKey}` +
                  `&from=${pair.from}&to=${pair.to}&amount=1`;
      return fetch(url)
        .then(resp => resp.json())
        .then(data => ({
          pair: `${pair.from}/${pair.to}`,
          rate: data.result
        }));
    });

    const results = await Promise.all(requests);
    // Format ticker content
    const text = results
      .map(r => `${r.pair}: ${r.rate.toFixed(2)}`)
      .join('   |   ');

    // Render scrolling marquee
    tickerEl.innerHTML = `<marquee behavior="scroll" direction="left" scrollamount="5">${text}</marquee>`;
  } catch (err) {
    console.error('Ticker error:', err);
    tickerEl.textContent = '⚠️ Unable to load live rates.';
  }
}

// Initialize and refresh every 60 seconds
document.addEventListener('DOMContentLoaded', () => {
  updateTicker();
  setInterval(updateTicker, 60000);
});

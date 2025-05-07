// ticker.js
// Fetch and display live exchange rates in a scrolling ticker
// Uses the same exchangeratesapi.io API key stored under KEY_NAME

const TICKER_ID = 'ticker';
const KEY_NAME = 'exRatesApiKey';
// Currencies to display (base INR to others or vice versa)
const pairs = [
  { from: 'USD', to: 'INR' },
  { from: 'EUR', to: 'INR' },
  { from: 'GBP', to: 'INR' },
  { from: 'JPY', to: 'INR' },
  { from: 'INR', to: 'USD' }
];

async function updateTicker() {
  const apiKey = localStorage.getItem(KEY_NAME);
  if (!apiKey) return; // no key, don't run

  try {
    // Build promises for each pair
    const fetches = pairs.map(p => {
      const url = `https://api.exchangeratesapi.io/v1/convert?access_key=${apiKey}` +
                  `&from=${p.from}&to=${p.to}&amount=1`;
      return fetch(url)
        .then(r => r.json())
        .then(data => ({ pair: `${p.from}/${p.to}`, rate: data.result }));
    });

    const results = await Promise.all(fetches);
    // Build ticker text
    const text = results.map(r => `${r.pair}: ${r.rate.toFixed(2)}`).join('   |   ');

    const ticker = document.getElementById(TICKER_ID);
    if (ticker) {
      // Use innerHTML with marquee for scroll effect
      ticker.innerHTML = `<marquee behavior="scroll" direction="left" scrollamount="5">${text}</marquee>`;
    }
  } catch (e) {
    console.error('Ticker update failed:', e);
  }
}

// Initial load and periodic updates every minute
document.addEventListener('DOMContentLoaded', () => {
  updateTicker();
  setInterval(updateTicker, 60000);
});

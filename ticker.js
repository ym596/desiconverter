// ticker.js
const symbols = ['USD','EUR','SGD','GBP','AUD'];

async function updateTicker() {
  const tickerEl = document.getElementById('ticker');
  const url = `https://api.frankfurter.app/latest?from=INR&to=${symbols.join(',')}`;
  console.log('⏳ Fetching ticker rates from:', url);

  try {
    const res = await fetch(url);
    console.log('HTTP status:', res.status);
    const json = await res.json();
    console.log('✅ Frankfurter response:', json);

    // Invert each INR→X rate to get X→INR
    const parts = symbols.map(s => {
      const r = json.rates[s];
      if (r == null) {
        return `${s}/INR: N/A`;
      }
      const inverted = 1 / r;
      return `${s}/INR: ${inverted.toFixed(5)}`;
    });

    tickerEl.innerHTML = `<marquee behavior="scroll" direction="left" scrollamount="5">${
      parts.join('   |   ')
    }</marquee>`;

  } catch (err) {
    console.error('Ticker fetch error:', err);
    tickerEl.textContent = '⚠️ Unable to load live rates.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateTicker();
  setInterval(updateTicker, 60000);
});

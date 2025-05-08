// ticker.js
const symbols = ['USD','EUR','GBP','JPY'];

async function updateTicker() {
  const tickerEl = document.getElementById('ticker');
  const url = `https://api.frankfurter.app/latest?from=INR&to=${symbols.join(',')}`;
  console.log('⏳ Fetching ticker rates from:', url);

  try {
    const res = await fetch(url);
    console.log('HTTP status:', res.status);
    const json = await res.json();
    console.log('✅ Frankfurter response:', json);

    // Frankfurter returns { amount:1, base:"INR", date:"...", rates:{ USD:0.012, … } }
    const parts = symbols.map(s => {
      const r = json.rates[s];
      return `INR/${s}: ${r!=null ? r.toFixed(2) : 'N/A'}`;
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
  setInterval(updateTicker, 60_000);
});

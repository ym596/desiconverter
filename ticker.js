// ticker.js
const symbols = ['USD','EUR','GBP','JPY'];
async function updateTicker() {
  const tickerEl = document.getElementById('ticker');
  const url = `https://api.exchangerate.host/latest?base=INR&symbols=${symbols.join(',')}`;
  console.log('⏳ Fetching ticker rates from:', url);
  try {
    const res = await fetch(url);
    console.log('HTTP status', res.status);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('Received ticker data', data);
    if (!data.rates) throw new Error('No “rates” in response');
    const parts = symbols.map(s => {
      const rate = data.rates[s];
      return rate != null
        ? `INR/${s}: ${rate.toFixed(2)}`
        : `INR/${s}: N/A`;
    });
    tickerEl.innerHTML = `<marquee behavior="scroll" direction="left" scrollamount="5">${parts.join('   |   ')}</marquee>`;
  } catch (err) {
    console.error('Ticker fetch error:', err);
    tickerEl.textContent = '⚠️ Unable to load live rates.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateTicker();
  setInterval(updateTicker, 60_000);
});

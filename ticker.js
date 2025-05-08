// ticker.js
const symbols = ['USD','EUR','GBP','JPY'];

async function updateTicker() {
  const tickerEl = document.getElementById('ticker');
  const url = `https://api.exchangerate.host/latest?base=INR&symbols=${symbols.join(',')}`;

  console.log('⏳ Fetching ticker rates from:', url);
  let data;
  try {
    const res = await fetch(url);
    console.log('HTTP status:', res.status, res.statusText);
    data = await res.json();
    console.log('✅ Parsed JSON:', data);
  } catch (err) {
    console.error('🚨 Network or parse error:', err);
    tickerEl.textContent = '⚠️ Unable to load live rates.';
    return;
  }

  // Make sure we actually got a rates object
  if (!data || typeof data.rates !== 'object') {
    console.error('🚨 No `rates` field in response:', data);
    tickerEl.textContent = '⚠️ Unable to load live rates.';
    return;
  }

  // Build the marquee, but guard each symbol
  const parts = symbols.map(s => {
    const rate = data.rates[s];
    if (rate == null) {
      console.warn(`⚠️ No rate for ${s}, got:`, data.rates);
      return `INR/${s}: N/A`;
    }
    return `INR/${s}: ${rate.toFixed(2)}`;
  });

  tickerEl.innerHTML = `<marquee behavior="scroll" direction="left" scrollamount="5">${
    parts.join('   |   ')
  }</marquee>`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateTicker();
  setInterval(updateTicker, 60_000);
});

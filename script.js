 // Save API key to sessionStorage
 function saveApiKey() {
  const input = document.getElementById("apiKeyInput").value.trim();
  if (input) {
    sessionStorage.setItem("apiKey", input);
    document.getElementById("apiKeySection").style.display = "none"; // Hide input section
    alert("API Key saved successfully.");
  } else {
    alert("Please enter a valid API key.");
  }
}


    // Reset API key in sessionStorage
    function resetApiKey() {
  sessionStorage.removeItem("apiKey");
  alert("API key removed. Please enter a new one.");
  document.getElementById("apiKeySection").style.display = "block"; // Show input section again
}

    let liveRate = null;

    async function convert() {
      const apiKey = sessionStorage.getItem('apiKey');
      if (!apiKey) {
        alert("API key not set. Please enter and save your API key above.");
        return;
      }

      const baseCurrency = document.getElementById("currency").value;
      const amount = parseFloat(document.getElementById("amount").value);
      const unit = document.getElementById("unit").value;

      if (isNaN(amount)) {
        document.getElementById("result").innerHTML = "Please enter a valid number.";
        return;
      }

      const multiplier = {
        unit: 1,
        hundred: 100,
        thousand: 1_000,
        million: 1_000_000,
        billion: 1_000_000_000
      }[unit];

      if (!multiplier) {
        document.getElementById("result").innerHTML = "Invalid unit selected.";
        return;
      }

      try {
        const response = await fetch(
          `https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}&symbols=INR,${baseCurrency}`
        );
        const data = await response.json();

        if (!data.success || !data.rates?.INR || !data.rates[baseCurrency]) {
          throw new Error("API response incomplete");
        }

        const eurToInr = data.rates.INR;
        const eurToBase = data.rates[baseCurrency];
        liveRate = eurToInr / eurToBase;

        document.getElementById("exchange-rate").innerHTML =
  `1 ${baseCurrency} = ₹${liveRate.toFixed(2)} INR<br><br><span style="font-size: 12px; color: gray;">Live rate powered by <a href="https://exchangeratesapi.io" target="_blank" style="color: gray; text-decoration: underline;">exchangeratesapi.io</a></span>`;
      } catch (error) {
        console.error("Exchange rate fetch failed:", error);
        liveRate = 83.5;
        document.getElementById("exchange-rate").innerHTML =
          "Could not fetch rate. Using fallback: ₹83.5";
      }

      const baseAmount = amount * multiplier;
      const inrAmount = baseAmount * liveRate;

      const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
      });
      
      let outputText;
      if (inrAmount >= 1e7) {
        outputText = `${formatter.format(inrAmount / 1e7)} Crores`;
      } else if (inrAmount >= 1e5) {
        outputText = `${formatter.format(inrAmount / 1e5)} Lakhs`;
      } else if (inrAmount >= 1e3) {
        outputText = `${formatter.format(inrAmount / 1e3)} Thousands`;
      } else {
        outputText = formatter.format(inrAmount);
      }

            const resultDiv = document.getElementById("result");
resultDiv.innerHTML = outputText;
resultDiv.classList.add("result-box");
resultDiv.style.display = "inline-block";
updateHistory(`${amount} ${baseCurrency} (${unit}) → ${outputText}`);
// 🎉 Confetti animation
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 }
});
    }

    function updateHistory(entry) {
        let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
        history.unshift(entry); // Add new at start
        history = history.slice(0, 5); // Keep only last 5
        localStorage.setItem("conversionHistory", JSON.stringify(history));
        renderHistory();
      }
      
      function renderHistory() {
        const historyList = document.getElementById("historyList");
        const history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
      
        historyList.innerHTML = ""; // Clear old entries
      
        if (history.length === 0) {
          historyList.innerHTML = `<li class="list-group-item bg-dark text-light">No recent conversions yet.</li>`;
          return;
        }
      
        history.forEach((item) => {
          const li = document.createElement("li");
          li.className = "list-group-item bg-dark text-light";
          li.textContent = item;
          historyList.appendChild(li);
        });
      }

    document.getElementById("currency").addEventListener("change", () => {
      const selected = document.getElementById("currency").value;
      document.getElementById("exchange-rate").innerHTML = `Fetching ${selected} to INR rate...`;
    });

    // Hide API input section on load if key is already saved
window.onload = () => {
  if (sessionStorage.getItem("apiKey")) {
    document.getElementById("apiKeySection").style.display = "none";
  }
  renderHistory(); // Load saved history on page load
};
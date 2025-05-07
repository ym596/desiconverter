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
  
        const outputText = inrAmount >= 1e7
          ? `₹${(inrAmount / 1e7).toFixed(2)} Crores`
          : inrAmount >= 1e5
            ? `₹${(inrAmount / 1e5).toFixed(2)} Lakhs`
            : inrAmount >= 1e3
              ? `₹${(inrAmount / 1e3).toFixed(2)} Thousands`
              : `₹${inrAmount.toFixed(2)} Rupees`;
  
              const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = outputText;
  resultDiv.classList.add("result-box");
  resultDiv.style.display = "inline-block";
  // 🎉 Confetti animation
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
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
  };
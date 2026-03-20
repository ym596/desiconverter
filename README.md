# Desi Currency Converter 🇮🇳💸

A responsive and localized currency converter that converts major global currencies (USD, EUR, GBP, SGD, AUD) into Indian Rupees and displays results in Indian units — Thousands, Lakhs, or Crores.

---

## 🚀 Live Demo

👉 [Click here to use the converter](https://ym596.github.io/desiconverter/)

---

## 🛠 Features

- Fetches **real-time exchange rates** using the [ExchangeratesAPI.io](https://exchangeratesapi.io/) service
- Converts and formats international currencies into INR and Indian number units
- Responsive and mobile-friendly UI
- Secure handling of API credentials via `sessionStorage`

---

## 🔐 API Key Setup

To use the currency conversion, you need an API key from [ExchangeratesAPI.io](https://exchangeratesapi.io/).

### How to get your API key:
1. Go to [https://exchangeratesapi.io/](https://exchangeratesapi.io/) and create a free account.
2. Copy the API key from your dashboard.

### How to use it in the app:
- On first load, enter your API key in the field at the top.
- Click **“Save API Key”**.
- The key will be securely stored for the session using your browser's `sessionStorage`.
- You can click **“Reset API Key”** anytime to enter a new one.

> ⚠️ Your key is never stored permanently or sent anywhere else — it's stored only in your browser memory.

---

## 🧠 Author

Created by [Yash Mehta](https://github.com/ym596) as part of a web development project.

---

## 📜 License

MIT License — feel free to use and customize!

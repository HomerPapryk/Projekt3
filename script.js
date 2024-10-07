const { to, set } = gsap;
const rateInfo = document.getElementById("rate-info");
const button = document.getElementById("convert-btn");

button.addEventListener("click", async (e) => {
  if (button.done) return;

  button.done = true;
  rateInfo.innerHTML = `<p class="getting-rate blinking">Pobieranie kursu...</p>`;

  await getExchangeRate();

  to(button.querySelector(".default"), { opacity: 1, duration: 0.25 });
  button.done = false;
});

document
  .getElementById("from-currency")
  .addEventListener("change", function () {
    const selectedCurrency = this.value;
    document.getElementById(
      "from-flag"
    ).src = `./flags/${selectedCurrency.toLowerCase()}.png`;
  });

async function getExchangeRate() {
  const fromCurrency = document.getElementById("from-currency").value;
  const amount = document.getElementById("amount").value;
  const apiURL = `https://api.nbp.pl/api/exchangerates/rates/a/${fromCurrency.toLowerCase()}/?format=json`;

  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    const rate = data.rates[0].mid;
    const result = (amount * rate).toFixed(2);

    rateInfo.innerHTML = `<p>${amount} ${fromCurrency} = ${result} PLN</p>`;
  } catch (error) {
    rateInfo.innerHTML =
      "<p>Błąd podczas pobierania kursu. Spróbuj ponownie.</p>";
  }
}

const flagBaseUrl = "https://flagcdn.com/48x36/";
const flagMapping = {
  USD: "us",
  EUR: "eu",
  CHF: "ch",
  PLN: "pl",
};

document
  .getElementById("from-currency")
  .addEventListener("change", function () {
    const selectedCurrency = this.value;
    document.getElementById(
      "from-flag"
    ).src = `${flagBaseUrl}${flagMapping[selectedCurrency]}.png`;
  });

async function getExchangeRate() {
  const fromCurrency = document.getElementById("from-currency").value;
  const amount = document.getElementById("amount").value;
  const apiURL = `https://api.nbp.pl/api/exchangerates/rates/a/${fromCurrency.toLowerCase()}/?format=json`;
  const rateInfo = document.getElementById("rate-info");

  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    const rate = data.rates[0].mid;
    const result = (amount * rate).toFixed(2);

    rateInfo.innerHTML = `<p>${amount} ${fromCurrency} = ${result} PLN</p>`;
  } catch (error) {
    rateInfo.innerHTML =
      "<p>Error fetching exchange rate. Please try again.</p>";
  }
}

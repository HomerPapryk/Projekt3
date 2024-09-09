const { to, set } = gsap;

document.querySelectorAll(".button-pay").forEach((button) => {
  const rateInfo = document.getElementById("rate-info");

  button.addEventListener("click", async (e) => {
    if (button.done) return;

    button.done = true;

    rateInfo.innerHTML = `<p class="getting-rate blinking">Getting exchange rate...</p>`;

    to(button.querySelector(".default"), {
      opacity: 0,
      duration: 0.1,
    });

    to(button, {
      "--button-money-opacity": 1,
      duration: 0.2,
    });

    to(button, {
      keyframes: [
        {
          "--button-money-x": "-50%",
          duration: 1.5,
          ease: "elastic.out(1, .9)",
        },
        {
          "--button-money-shine-position": "202px",
          duration: 0.5,
          delay: 0.3,
          onStart() {
            set(button, {
              "--button-default-opacity": 0,
              "--button-done-opacity": 1,
            });
          },
        },
        {
          "--button-money-scale": 1.1,
          duration: 0.25,
        },
        {
          "--button-money-scale": 0.9,
          "--button-money-opacity": 0,
          duration: 0.1,
          onComplete: async () => {
            await getExchangeRate();

            to(button, {
              "--button-default-opacity": 1,
              "--button-done-opacity": 0,
              duration: 0.25,
              delay: 3,
              clearProps: true,
              onComplete() {
                button.done = false;
              },
            });

            to(button.querySelector(".default"), {
              opacity: 1,
              duration: 0.25,
              delay: 3,
            });
          },
        },
      ],
    });
  });
});

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

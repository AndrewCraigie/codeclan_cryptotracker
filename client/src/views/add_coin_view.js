const PubSub = require('../helpers/pub_sub.js');


const AddCoinView = function (form) {
  this.form = form;
  this.coinsList = [];
};

AddCoinView.prototype.bindEvents = function () {
  PubSub.subscribe('Cryptotracker:coins-list-data', (event) => {
    this.coinsList = event.detail;
    this.render();
  })
};

AddCoinView.prototype.render = function () {
  const coinSelect = document.querySelector('select#coin-select');
  this.coinsList.forEach((coin) => {
    const coinOption = this.createOption(coin);
    coinSelect.appendChild(coinOption);
  });
};

AddCoinView.prototype.createOption = function (coin) {
  const option = document.createElement('option');
  option.value = coin.symbol;
  const coinPrice = coin.quotes.USD.price;
  option.textContent = `${coin.name} (${coin.symbol}) - Price: ${coin.quotes.USD.price.toFixed(2)}`;
  return option;
};

module.exports = AddCoinView;

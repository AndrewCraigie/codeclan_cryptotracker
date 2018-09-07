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
  const numberInput = this.createInput();
  this.form.appendChild(numberInput);
};

AddCoinView.prototype.createOption = function (coin) {
  const option = document.createElement('option');
  option.value = coin.symbol;
  const coinPrice = coin.quotes.USD.price;
  option.textContent = `${coin.name} (${coin.symbol}) - Price: ${coin.quotes.USD.price.toFixed(2)}`;
  return option;
};

AddCoinView.prototype.createInput = function () {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = 0;
  input.step = 0.01;
  return input;
};

module.exports = AddCoinView;

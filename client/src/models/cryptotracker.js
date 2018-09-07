const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Cryptotracker = function (url) {
  this.url = url;
  this.request = new Request(this.url);
  this.coins = [];
  this.coinsList = null;

};

Cryptotracker.prototype.bindEvents = function () {

  PubSub.subscribe('AddCoinView:add-coin-submitted', (event) => {
    this.addCoin(event.detail);
  });

  PubSub.subscribe('Coins:coins-list-data', (event) => {

    this.coinsList = event.detail
    this.getCoinData();

  })
};


Cryptotracker.prototype.getCoinData = function () {

  this.request.get()
  .then( (coins) => {

    this.coins = coins;

    console.log(this.coins);
    console.log(this.coinsList);

    // TODO merge data from coinsList and coins
    // create a portfolioCoins object list and publsh
    // to portfolio_list_view

    //PubSub.publish('Cryptotracker:coins-list-data', this.coins);

  })
  .catch(console.error);

};

Cryptotracker.prototype.addCoin = function (data) {
  const newCoin = {
    symbol: data['coin-select'].value,
    quantity: parseInt(data['coin-amount'].value)
  };
  this.request.post(newCoin)
  .then((coins) => {
    PubSub.publish('Cryptotracker:coin-list-ready', coins);
  })
  .catch()
};

module.exports = Cryptotracker;

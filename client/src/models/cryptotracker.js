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
  });

};



Cryptotracker.prototype.getCoinData = function () {

  this.request.get()
  .then( (coins) => {
    this.coins = coins;
    this.coinItemDetail();
  })
  .catch(console.error);

};

Cryptotracker.prototype.coinItemDetail = function(){

  const coinDetails = this.coins.map((portfolioCoin) => {

    const apiCoin = this.getCoinBySymbol(portfolioCoin.symbol)
    const value = this.calculateValue(portfolioCoin.quantity, apiCoin.quotes.USD.price);
    return {
      apiCoin: apiCoin,
      portfolioQuantity: portfolioCoin.quantity,
      value: value
    }

  });

  PubSub.publish('Cryptotracker:coin-list-ready', coinDetails);

};

Cryptotracker.prototype.calculateValue = function(quantity, price){
  return quantity * price;
};

Cryptotracker.prototype.getCoinBySymbol = function(symbol){
  return this.coinsList.find((coin) => {
    return coin.symbol === symbol;
  })
};

Cryptotracker.prototype.addCoin = function (data) {

  this.request.post(data)
  .then((coins) => {
    PubSub.publish('Cryptotracker:portfolio-data-requested', coins);
  })
  .catch()

};

module.exports = Cryptotracker;

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

//GETS COMPLETE COIN DATA FROM THE DATABASE
Cryptotracker.prototype.getCoinData = function () {

  this.request.get()
  .then( (coins) => {
    this.coins = coins;
    this.coinItemDetail();
  })
  .catch(console.error);

};

//PUBLISHES THE COIN AND VALUE DETAILS
Cryptotracker.prototype.coinItemDetail = function(){

  const coinDetails = this.coins.map((portfolioCoin) => {

    const apiCoin = this.getCoinBySymbol(portfolioCoin.symbol)
    const value = this.calculateValue(portfolioCoin.quantity, apiCoin.quotes.USD.price);
    return {
      apiCoin: apiCoin,
      value: value
    }

  });

  PubSub.publish('Cryptotracker:coin-list-ready', coinDetails);
  // Point at which both lists should be updated;

};

//CALCULATES THE TOTAL VALUE OF COINS
Cryptotracker.prototype.calculateValue = function(quantity, price){
  return quantity * price;
};

//RETURNS COIN DATA FROM API BASED ON SYMBOL
Cryptotracker.prototype.getCoinBySymbol = function(symbol){
  return this.coinsList.find((coin) => {
    return coin.symbol === symbol;
  })
};

//ADDS COIN TO DATABASE BASED ON EXISTING COIN VALIDATION
Cryptotracker.prototype.addCoin = function (data) {

  const isExistingCoin = this.validateExistingCoin(data);
  if (isExistingCoin) {
    this.updateCoin(data);
  }
  else {
    this.postCoin(data);
  }
  //PubSub.publish('Cryptotracker:portfolio-data-requested', this.coins);
};

//VALIDATES IF COIN EXISTS BASED ON SYMBOL
Cryptotracker.prototype.validateExistingCoin = function (data) {
  return this.coins.some((coin) => {
    return coin.symbol === data.symbol;
  });
};

//UPDATES COIN QUANTITY DATA
Cryptotracker.prototype.updateCoin = function (data) {
  const coinFound = this.findCoin(data);
  const updatedCoinQuantity = data.quantity + coinFound.quantity;
  const updatedCoin = {symbol: data.symbol, quantity: updatedCoinQuantity};
  this.putCoin(coinFound._id, updatedCoin);
};

//FINDS COIN BASED ON SYMBOL
Cryptotracker.prototype.findCoin = function (data) {
  return this.coins.find((coin) => {
    return coin.symbol === data.symbol;
  });
};

//CREATES A NEW COIN DATA INTO DATABASE
Cryptotracker.prototype.postCoin = function (data) {
  this.request.post(data)
  .then((coins) => {
    this.coins = coins;
    this.publishPortfolioData();
  })
  .catch();
};

//UPDATES COIN DATA IN THE DATABASE
Cryptotracker.prototype.putCoin = function (id, payload) {
  this.request.put(id, payload)
  .then((coins) => {
      this.coins = coins;
      this.publishPortfolioData();
    }).catch(console.error);
};

//DELETES COIN FROM THE DATABASE
/*
Cryptotracker.prototype.deleteCoin = function (id) {
  this.request.delete(id).then((coins) => {
    this.coins = coins;
    this.publishPortfolioData();
  })
  .catch(console.error);
  }
};
*/

Cryptotracker.prototype.publishPortfolioData = function () {
  PubSub.publish('Cryptotracker:portfolio-data-requested', this.coins);
};

module.exports = Cryptotracker;

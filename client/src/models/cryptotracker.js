const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Cryptotracker = function (databaseUrl, apiUrl) {

  this.databaseUrl = databaseUrl;
  this.databaseRequest = new Request(this.databaseUrl );

  this.apiUrl = apiUrl;
  this.apiRequest = new Request(this.apiUrl)

  this.portfolioCoins = [];
  this.apiCoins = [];

  this.coinsData = [];

};

Cryptotracker.prototype.bindEvents = function () {

  PubSub.subscribe('AddCoinView:add-coin-submitted', (event) => {
    this.addCoin(event.detail);
  });

};

Cryptotracker.prototype.getPortolioData = function () {

  this.databaseRequest.get()
  .then( (portFolioCoins) => {
    this.portfolioCoins = portFolioCoins;
    this.getApiData();
  })
  .catch(console.error);

};

Cryptotracker.prototype.getApiData = function(){

  this.apiRequest.get()
  .then((apiCoins) => {

    for (var coin in apiCoins.data) {
      if (apiCoins.data.hasOwnProperty(coin)) {
        this.apiCoins.push(apiCoins.data[coin]);
      }
    }

    this.mergeCoinData();

  })
  .catch(console.error);

};

Cryptotracker.prototype.mergeCoinData = function(){

  this.coinsData = this.apiCoins.map((apiCoin) => {

    const portfolioCoin = this.getPortfolioCoinBySymbol(apiCoin.symbol);
    const apiCoinPrice = apiCoin.quotes.USD.price;

    if (portfolioCoin) {
      apiCoin.portfolioQuantity = portfolioCoin.quantity;
      apiCoin.portfolioValue = this.calculateValue(portfolioCoin.quantity, apiCoinPrice);
      apiCoin.portfolioId = portfolioCoin['_id'];
    } else {
      apiCoin.portfolioQuantity = 0;
      apiCoin.portfolioValue = 0;
    }

    return apiCoin;

  });

  PubSub.publish('Cryptotracker:coin-data-ready', this.coinsData);

};

Cryptotracker.prototype.getPortfolioCoinBySymbol = function(symbol){

  return this.portfolioCoins.find((portfolioCoin) => {
    return portfolioCoin.symbol.toLowerCase() === symbol.toLowerCase();
  });

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

  this.databaseRequest.post(data)
  .then((coins) => {
    console.log(coins);
    this.coinItemDetail();
    //PubSub.publish('Cryptotracker:portfolio-data-requested', coins);
  })
  .catch()

};

module.exports = Cryptotracker;

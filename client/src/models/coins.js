const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Coins = function(apiUrl){

  this.apiUrl = apiUrl
  this.coinsRequest = new Request(this.apiUrl);
  this.coins = [];
  this.coinsList = [];

  this.coinData = {
    apiCoins: this.coins,
    portfolioCoins : this.coinsList
  }

  this.bothListsAvailable = false;

};

Coins.prototype.bindEvents = function(){

  PubSub.subscribe('Cryptotracker:coin-list-ready', (event) => {

    this.coinsList  = event.detail;
    this.bothListsAvailable = true;

    this.mergePortfolioData();

    PubSub.publish('Coins:filtered-coins-list-data', this.coins);

    //this.getCoinData();

  })

};

Coins.prototype.mergePortfolioData = function(){

  this.coins.forEach((coin) => {

    const symbol = coin.symbol;
    const portfolioCoin = this.gitPortfolioCoinBySymbol(symbol);

    if (portfolioCoin){
      coin.portfolioQuantity = portfolioCoin.portfolioQuantity;
    } else {
      coin.portfolioQuantity = 0;
    }

  })

};

Coins.prototype.gitPortfolioCoinBySymbol = function(symbol){

  return this.coinsList.find((coin) => {
    return coin.apiCoin.symbol.toLowerCase() === symbol.toLowerCase();
  })

};

Coins.prototype.getCoinData = function(){

  this.coinsRequest.get().then( (coins) => {

    for (var coin in coins.data) {
      if (coins.data.hasOwnProperty(coin)) {
        this.coins.push(coins.data[coin]);
      }
    }

    PubSub.publish('Coins:coins-list-data', this.coins);

  }).catch(console.error);

};

module.exports = Coins;

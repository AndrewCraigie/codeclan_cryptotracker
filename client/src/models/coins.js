const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Coins = function(apiUrl){

  this.apiUrl = apiUrl
  this.coinsRequest = new Request(this.apiUrl);
  this.coins = [];
  this.coinsList = [];

};

Coins.prototype.bindEvents = function(){

  PubSub.subscribe('Cryptotracker:portfolio-data-requested', (event) => {
    this.coinsList  = event.detail;
    this.getCoinData();

  })

};

//Returns coins that arent added
Coins.prototype.getFilteredCoins = function () {

 const allCoinsSymbols = this.getCoinsSymbols(this.coinsList);
 const myCoinsSymbols = this.getCoinsSymbols(this.coins);
 const filteredCoins = [];
 const filteredCoinSymbols = allCoinsSymbols.filter((coinSymbol) => {
   return myCoinsSymbols.indexOf(coinSymbol) == -1;
 });
 filteredCoinSymbols.forEach((coinSymbol) => {
   filteredCoins.push(this.getCoinBySymbol(coinSymbol));
 });

 console.log(filteredCoins);
 //PubSub.publish('Cryptotracker:filtered-coins', filteredCoins);
};

Coins.prototype.getCoinsSymbols = function (list) {
 return list.map((coin) => {
   return coin.symbol;
 });

};

Coins.prototype.getCoinData = function(){

  this.coinsRequest.get().then( (coins) => {

    for (var coin in coins.data) {
      if (coins.data.hasOwnProperty(coin)) {
        this.coins.push(coins.data[coin]);
      }
    }
    //this.getFilteredCoins();
    //console.log(this.coins);
    PubSub.publish('Coins:coins-list-data', this.coins);

  }).catch(console.error);

};

module.exports = Coins;

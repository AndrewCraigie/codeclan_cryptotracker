const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Coins = function(apiUrl){

  this.apiUrl = apiUrl
  this.coinsRequest = new Request(this.apiUrl);
  this.coins = [];

};

Coins.prototype.bindEvents = function(){
  PubSub.subscribe('Cryptotracker:coin-list-ready', (event) => {
    console.log('Cryptotracker:coin-list-ready');
    console.log(event.detail);
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

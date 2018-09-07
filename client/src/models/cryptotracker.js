const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Cryptotracker = function (coinListUrl) {
  this.coinListUrl = coinListUrl;
  this.request = new Request(this.coinListUrl);
  this.coins = [];
};

Cryptotracker.prototype.getCoinData = function () {
  this.request.get().then( (coins) => {
  for (var coin in coins.data) {
    if (coins.data.hasOwnProperty(coin)) {
      this.coins.push(coins.data[coin]);
    }
  }
  PubSub.publish('Cryptotracker:coins-list-data', this.coins);

}).catch(console.error);
};

module.exports = Cryptotracker;

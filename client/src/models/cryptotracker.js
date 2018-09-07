const Request = require('../helpers/request.js');

const Cryptotracker = function (coinListUrl) {
  this.coinListUrl = coinListUrl;
  this.request = new Request(this.coinListUrl);
  this.coins = [];
};

Cryptotracker.prototype.getCoinData = function () {
  this.request.get().then( (coins) => {
  this.coins = coins.data;

}).catch(console.error);
};

module.exports = Cryptotracker;

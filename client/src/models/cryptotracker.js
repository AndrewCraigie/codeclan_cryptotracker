const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Cryptotracker = function (coinListUrl, url) {
  this.coinListUrl = coinListUrl;
  this.listRequest = new Request(this.coinListUrl);
  this.request = new Request(url);
  this.coins = [];
};

Cryptotracker.prototype.bindEvents = function () {
  PubSub.subscribe('AddCoinView:add-coin-submitted', (event) => {
    this.addCoin(event.detail);
  })
};

Cryptotracker.prototype.getCoinData = function () {
  this.listRequest.get().then( (coins) => {
  for (var coin in coins.data) {
    if (coins.data.hasOwnProperty(coin)) {
      this.coins.push(coins.data[coin]);
    }
  }
  PubSub.publish('Cryptotracker:coins-list-data', this.coins);

}).catch(console.error);
};

Cryptotracker.prototype.addCoin = function (data) {
  const newCoin = {
    symbol: data['coin-select'].value,
    quantity: parseInt(data['coin-amount'].value)
  };
  this.request.post(newCoin)
  .then((coins) => {
    console.log(coins);
  })
  .catch()
};

module.exports = Cryptotracker;

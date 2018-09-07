const PubSub = require('../helpers/pub_sub.js');
const CoinView = require('./coin_view.js');

const PortfolioiListView = function (container) {
  this.container = container;
  this.coinsData = [];
};

PortfolioiListView.prototype.bindEvents = function () {
  PubSub.subscribe('Cryptotracker:coin-list-ready', (event) => {
    this.coinsData = event.detail;
    this.render();
  })
};


PortfolioiListView.prototype.render = function () {
  this.coinsData.forEach((coin) => {
    const coinView = new CoinView(this.container, coin);
    coinView.render();
  });
};

module.exports = PortfolioiListView;

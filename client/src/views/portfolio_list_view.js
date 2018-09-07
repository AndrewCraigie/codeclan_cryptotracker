const PubSub = require('../helpers/pub_sub.js');

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
    console.log(coin);
  });
};

module.exports = PortfolioiListView;

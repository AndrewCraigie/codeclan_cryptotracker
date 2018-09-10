const PubSub = require('../helpers/pub_sub.js');
const CoinView = require('./coin_view.js');
const element = require('../helpers/element.js');

const PortfolioiListView = function (container) {
  this.container = container;

  this.headerGroup = null;
  this.listContainer = null;
  this.summaryGroup = null;
  this.quantityTotalsElement = null;
  this.totalValueElement = null;

  this.coinsData = [];
};

PortfolioiListView.prototype.bindEvents = function () {

  PubSub.subscribe('Cryptotracker:coin-data-ready', (event) => {
    this.coinsData = event.detail;
    this.render();
  });

};

PortfolioiListView.prototype.makeHeaderGroup = function(){

  this.headerGroup = element.make({
    tag: 'div',
    attribs: {
      id: 'portfolio-view-header'
    }
  });

  const nameHeader = element.make({
    tag: 'p',
    attribs: {
      id: 'portfolio-view-name-header'
    },
    content: 'Coin Name'
  });
  this.headerGroup.appendChild(nameHeader);

  const symbolHeader = element.make({
    tag: 'p',
    attribs: {
      id: 'portfolio-view-symbol-header'
    },
    content: 'Symbol'
  });
  this.headerGroup.appendChild(symbolHeader);

  const quantityHeader = element.make({
    tag: 'p',
    attribs: {
      id: 'portfolio-view-quantity-header'
    },
    content: 'Quantity'
  });
  this.headerGroup.appendChild(quantityHeader);

  const valueHeader = element.make({
    tag: 'p',
    attribs: {
      id: 'portfolio-view-value-header'
    },
    content: 'Coin Total'
  });
  this.headerGroup.appendChild(valueHeader);

  this.container.appendChild(this.headerGroup);

};

PortfolioiListView.prototype.makeListContainer = function(){

  this.listContainer = element.make({
    tag: 'div',
    attribs: {
      id: 'porfolio-list-list'
    }
  });
  this.container.appendChild(this.listContainer);

};

PortfolioiListView.prototype.makeSummaryGroup = function(){

  this.summaryGroup = element.make({
    tag: 'div',
    attribs: {
      id: 'portfolio-list-summary-group'
    }
  });

  const totalsPara = element.make({
    tag: 'p',
    attribs: {
      id: 'porfolio-list-totals-label'
    },
    content: 'Portfolio Totals'
  });
  this.summaryGroup.appendChild(totalsPara);

  this.quantityTotalsElement = element.make({
    tag: 'p',
    attribs: {
      id: 'porfolio-list-quantity-total'
    },
    content: '88'
  });
  this.summaryGroup.appendChild(this.quantityTotalsElement);

  this.totalValueElement = element.make({
    tag: 'p',
    attribs: {
      id: 'porfolio-list-total_value'
    },
    content: '20000'
  });
  this.summaryGroup.appendChild(this.totalValueElement);

  this.container.appendChild(this.summaryGroup);

};

PortfolioiListView.prototype.render = function () {

  if (!this.headerGroup){
    this.makeHeaderGroup();
  }

  if (!this.listContainer){
    this.makeListContainer();
  }

  element.clear(this.listContainer);

  this.coinsData.forEach((coin) => {
    if (coin.portfolioId){
      const coinView = new CoinView(this.listContainer, coin);
      coinView.render();
    }
  });

  if (!this.summaryGroup){
    this.makeSummaryGroup();
  }


};

module.exports = PortfolioiListView;

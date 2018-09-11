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
/*
PortfolioiListView.prototype.makeHeaderGroup = function(){

  this.headerGroup = element.make({
    tag: 'div',
    attribs: {
      id: 'portfolio-view-header'
    }
  });
//image code starts
  // const imageHeader = element.make({
  //   tag: 'p',
  //   attribs: {
  //     id: 'portfolio-view-image-header'
  //   },
  //   content: 'Coin'
  // });
  // this.headerGroup.appendChild(imageHeader);
//image code ends
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
    content: 'Value'
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
*/

PortfolioiListView.prototype.render = function () {
  this.container.innerHTML = '';
  const tableElement = element.make({
    tag: 'table',
    attribs: {
      id: 'portfolio-view-table'
    },
  });
  const tableRowHeaderElement = element.make({
    tag: 'tr',
    attribs: {
      class: 'portfolio-view-table-header'
    },
  });
  const tableCoinHeader = element.make({
    tag: 'th',
    attribs: {
      class: 'portfolio-view-table-header'
    },
    content: "Coin"
  });
  tableRowHeaderElement.appendChild(tableCoinHeader);
  const tableNameHeader = element.make({
    tag: 'th',
    attribs: {
      class: 'portfolio-view-table-header'
    },
    content: "Coin Name"
  });
  tableRowHeaderElement.appendChild(tableNameHeader);
  const tableQuantityHeader = element.make({
    tag: 'th',
    attribs: {
      class: 'portfolio-view-table-header'
    },
    content: "quantity"
  });
  tableRowHeaderElement.appendChild(tableQuantityHeader);
  const tableValueHeader = element.make({
    tag: 'th',
    attribs: {
      class: 'portfolio-view-table-header'
    },
    content: "Total Value"
  });
  tableRowHeaderElement.appendChild(tableValueHeader);
  tableElement.appendChild(tableRowHeaderElement);
  console.log(this.coinsData);
  this.coinsData.forEach((coin) => {
    if (coin.portfolioId){
      const coinRowElement = element.make({
        tag: 'tr',
        attribs: {
          class: 'portfolio-view-list',
        }
      });
      const tdImageElement  = element.make({
        tag: 'td',
        attribs: {
          class: 'portfolio-view-list'
        }
      });
      const imageElement = element.make({
        tag: 'img',
        attribs: {
          class: 'coin-image',
          src: `/images/${coin.website_slug}.png`
        }
      });
      tdImageElement.appendChild(imageElement);
      coinRowElement.appendChild(tdImageElement);

      const tdNameElement  = element.make({
        tag: 'td',
        attribs: {
          class: 'portfolio-view-list'
        },
        content: `${coin.name} (${coin.symbol})`
      });

      coinRowElement.appendChild(tdNameElement);

      const tdQuantityElement  = element.make({
        tag: 'td',
        attribs: {
          class: 'portfolio-view-list'
        },
        content: `${coin.portfolioQuantity}`
      });

      coinRowElement.appendChild(tdQuantityElement);

      const tdValueElement  = element.make({
        tag: 'td',
        attribs: {
          class: 'portfolio-view-list'
        },
        content: `${coin.portfolioValue.toFixed(2)}`
      });

      coinRowElement.appendChild(tdValueElement);

      coinRowElement.addEventListener('click', (event) => {
        PubSub.publish('PortfolioiListView:coin-selected', coin);
      })

      tableElement.appendChild(coinRowElement);
    }
  });


  this.container.appendChild(tableElement);


};
module.exports = PortfolioiListView;

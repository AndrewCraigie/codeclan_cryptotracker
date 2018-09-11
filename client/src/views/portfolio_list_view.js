const PubSub = require('../helpers/pub_sub.js');
const CoinView = require('./coin_view.js');
const element = require('../helpers/element.js');

const PortfolioiListView = function (container) {
  this.container = container;

  // this.headerGroup = null;
  // this.listContainer = null;
  // this.summaryGroup = null;
  // this.quantityTotalsElement = null;
  // this.totalValueElement = null;
  this.tableElement = null;
  this.tableBodyElement = null;
  this.totalValue = 0;
  this.totalQuantity = 0;
  this.coinsData = [];
  this.valueTotal = 0;
  this.coinsQuantityTotal = 0;
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

    content: 'Value $'

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
    content: this.coinsQuantityTotal
  });
  this.summaryGroup.appendChild(this.quantityTotalsElement);

  this.totalValueElement = element.make({
    tag: 'p',
    attribs: {
      id: 'porfolio-list-total_value'
    },
    content: this.valueTotal.toFixed(2)
  });
  this.summaryGroup.appendChild(this.totalValueElement);

  this.container.appendChild(this.summaryGroup);

};

PortfolioiListView.prototype.render = function () {

  this.coinsQuantityTotal = 0;
  this.valueTotal = 0;

  if (!this.headerGroup){
    this.makeHeaderGroup();
  }

  if (!this.listContainer){
    this.makeListContainer();
  }

  element.clear(this.listContainer);

  this.coinsData.forEach((coin) => {

    if (coin.portfolioId){

      this.coinsQuantityTotal ++;
      this.valueTotal += coin.portfolioValue;

      const coinView = new CoinView(this.listContainer, coin);
      coinView.render();
    }
  });

  if (!this.summaryGroup){
    this.makeSummaryGroup();
  }


};
*/

//GENERATES A TABLE WITH DATA- STARTS

PortfolioiListView.prototype.render = function () {
  this.container.innerHTML = '';
  this.tableElement = element.make({
    tag: 'table',
    attribs: {
      id: 'portfolio-view-table'
    },
  });

  this.renderTableHeader();

  this.tableBodyElement = element.make({
    tag: 'tbody',
    attribs: {
      id: 'portfolio-view-table-tbody'
    },
  });


  this.coinsData.forEach((coin) => {
    if (coin.portfolioId){
      this.totalValue += coin.portfolioValue;
      this.totalQuantity += coin.portfolioQuantity;
      this.renderCoinRow(coin);
      }
  });

  this.renderTableFooter();

  this.container.appendChild(this.tableElement);
};

PortfolioiListView.prototype.renderTableHeader = function () {
  const tableHeadElement = element.make({
    tag: 'thead',
    attribs: {
      id: 'portfolio-view-table-thead'
    },
  });

  const tableRowHeaderElement = element.make({
    tag: 'tr',
    attribs: {
      class: 'portfolio-view-table-tr'
    }
  });
  const tableCoinHeader = element.make({
    tag: 'th',
    attribs: {
      class: 'portfolio-view-table-th',
      scope: "col"
    },
    content: "Coin"
  });
  tableRowHeaderElement.appendChild(tableCoinHeader);
  const tableNameHeader = element.make({
    tag: 'th',
    attribs: {
      class: 'portfolio-view-table-th',
      scope: "col"
    },
    content: "Name"
  });
  tableRowHeaderElement.appendChild(tableNameHeader);
  const tableSymbolHeader = element.make({
    tag: 'th',
    attribs: {
      class: 'portfolio-view-table-th',
      scope: "col"
    },
    content: "Symbol"
  });
  tableRowHeaderElement.appendChild(tableSymbolHeader);
  const tableQuantityHeader = element.make({
    tag: 'th',
    attribs: {
      class: 'portfolio-view-table-th',
      scope: "col"
    },
    content: "Qty"
  });
  tableRowHeaderElement.appendChild(tableQuantityHeader);
  const tableValueHeader = element.make({
    tag: 'th',
    attribs: {
      class: 'portfolio-view-table-th',
      scope: "col"
    },
    content: "Value $"
  });
  tableRowHeaderElement.appendChild(tableValueHeader);
  tableHeadElement.appendChild(tableRowHeaderElement)
  this.tableElement.appendChild(tableHeadElement);
};

PortfolioiListView.prototype.renderCoinRow = function (coin) {
  const coinRowElement = element.make({
    tag: 'tr',
    attribs: {
      class: 'portfolio-view-table-tr',
    }
  });
  const tdImageElement  = element.make({
    tag: 'td',
    attribs: {
      class: 'portfolio-view-table-td'
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
      class: 'portfolio-view-table-td'
    },
    content: `${coin.name}`
  });

  coinRowElement.appendChild(tdNameElement);

  const tdSymbolElement  = element.make({
    tag: 'td',
    attribs: {
      class: 'portfolio-view-table-td'
    },
    content: `${coin.symbol}`
  });

  coinRowElement.appendChild(tdSymbolElement);

  const tdQuantityElement  = element.make({
    tag: 'td',
    attribs: {
      class: 'portfolio-view-table-td'
    },
    content: `${coin.portfolioQuantity}`
  });

  coinRowElement.appendChild(tdQuantityElement);

  const tdValueElement  = element.make({
    tag: 'td',
    attribs: {
      class: 'portfolio-view-table-td'
    },
    content: `${coin.portfolioValue.toFixed(2)}`
  });

  coinRowElement.appendChild(tdValueElement);

  coinRowElement.addEventListener('click', (event) => {
    PubSub.publish('PortfolioiListView:coin-selected', coin);
  });

  this.tableBodyElement.appendChild(coinRowElement);

  this.tableElement.appendChild(this.tableBodyElement);

};

PortfolioiListView.prototype.renderTableFooter = function () {
  const tableFootElement = element.make({
    tag: 'tfoot',
    attribs: {
      id: 'portfolio-view-table-tfoot'
    },
  });

  const tableRowFooterElement = element.make({
    tag: 'tr',
    attribs: {
      class: 'portfolio-view-table-tr'
    }
  });
  const tableSumElement = element.make({
    tag: 'td',
    attribs: {
      class: 'portfolio-view-table-td-total',
      colspan: 3
    },
    content: "Portfolio Totals"
  });
  tableRowFooterElement.appendChild(tableSumElement);

  const tableQuantityData = element.make({
    tag: 'td',
    attribs: {
      class: 'portfolio-view-table-td-tfoot'
    },
    content: `${this.totalQuantity}`
  });
  tableRowFooterElement.appendChild(tableQuantityData);

  const tableSumData = element.make({
    tag: 'td',
    attribs: {
      class: 'portfolio-view-table-td-tfoot'
    },
    content: `${this.totalValue.toFixed(2)}`
  });
  tableRowFooterElement.appendChild(tableSumData);
  tableFootElement.appendChild(tableRowFooterElement);
  this.tableElement.appendChild(tableFootElement);
};

//ENDS
module.exports = PortfolioiListView;

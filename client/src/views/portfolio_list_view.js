const PubSub = require('../helpers/pub_sub.js');
const CoinView = require('./coin_view.js');
const element = require('../helpers/element.js');

const PortfolioiListView = function (container) {
  this.container = container;

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
    this.totalQuantity = 0;
    this.totalValue = 0;
    this.render();
  });
};

//GENERATES A TABLE WITH DATA- STARTS

PortfolioiListView.prototype.render = function () {
  this.container.innerHTML = '';
  this.valueTotal = 0;
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
      this.totalQuantity += parseFloat(coin.portfolioQuantity);
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

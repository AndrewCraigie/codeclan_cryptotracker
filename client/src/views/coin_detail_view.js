const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');
const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

const CoinDetailView = function(container){

  this.container = container;
  this.coinData = null;

  this.coinDetailsGroup = null;
  this.controlsGroup = null;

  this.chartDiv = null;
  this.dataDiv = null;

  this.updateButton = null;
  this.quantityControl = null;

  this.theme = null;

};

CoinDetailView.prototype.bindEvents = function(){

    PubSub.subscribe('Cryptotracker:coin-detail-ready', (event) => {
      this.coinData = event.detail;
      this.render();
    });

    PubSub.subscribe('Cryptotracker:coin-deleted', (event) => {
      console.log(event.detail);
    });

    PubSub.subscribe('Themes:theme-available', (event) => {
      this.theme= event.detail;
      this.render();
    });

};

CoinDetailView.prototype.handleUpdate = function(event){

    const quantity = this.quantityControl.value;
    const coinId = this.coinData.portfolioId;

    const coin = {
      symbol: this.coinData.symbol,
      id: coinId,
      quantity: quantity
    };

    PubSub.publish('CoinDetailView:coin-updated', coin);
};

CoinDetailView.prototype.handleDelete = function(event){

    const status = confirm(`Are you sure you want to delete ${this.coinData.portfolioQuantity} ${this.coinData.name} from your portfolio?`);

    if (status){
      PubSub.publish('CoinDetailView:delete-coin', this.coinData.portfolioId);
    }

};

CoinDetailView.prototype.handleQuantityChange = function(event){
  this.updateButton.disabled = false;
};

CoinDetailView.prototype.makeControlsGroup = function(){

  this.controlsGroup = element.make({
    tag: 'div',
    attribs: {
      id: 'coin-detail-control-group'
    }
  });

  const quantityLabel = element.make({
    tag: 'p',
    attribs: {
      id: 'coin-detail-quantity-label'
    },
    content: 'Quantity'
  });
  this.controlsGroup.appendChild(quantityLabel);

  this.quantityControl = element.make({
    tag: 'input',
    attribs: {
      type: 'number',
      min: 0,
      step: 0.01,
      value: this.coinData.portfolioQuantity
    }
  });
  this.quantityControl.required = true;
  this.quantityControl.addEventListener('change', this.handleQuantityChange.bind(this))
  this.controlsGroup.appendChild(this.quantityControl);

  this.updateButton  = element.make({
    tag: 'button',
    attribs: {
      id: 'coin-detail-update-button'
    },
    content: 'Update Quantity'
  });
  this.updateButton .disabled = true;
  this.updateButton .addEventListener('click', this.handleUpdate.bind(this));
  this.controlsGroup.appendChild(this.updateButton);

  const deleteButton = element.make({
    tag: 'button',
    attribs: {
      id: 'coin-detail-delete-button'
    },
    content: 'Delete Coin'
  });
  deleteButton.addEventListener('click', this.handleDelete.bind(this));
  this.controlsGroup.appendChild(deleteButton);

  this.container.appendChild(this.controlsGroup);

};

CoinDetailView.prototype.render = function(){

  element.clear(this.container);
  this.makeHeader();
  this.makeChartDiv();
  this.makeDataDiv();

  this.renderData();
  this.renderChart();

  this.makeControlsGroup();

};

CoinDetailView.prototype.renderData = function () {
  const priceElement = element.make({
    tag: 'p',
    attribs: {
      class:'price-para'
    },
    content: `Unit Price : $ ${this.coinData.quotes.USD.price}`
  });
  this.dataDiv.appendChild(priceElement);

  const rankElement = element.make({
    tag: 'p',
    attribs: {
      class:'rank-para'
    },
    content: `Coin Rank : ${this.coinData.rank}`
  });
  this.dataDiv.appendChild(rankElement);

  const valueElement = element.make({
    tag: 'p',
    attribs: {
      class:'value-para'
    },
    content: `Total Value : $ ${this.coinData.portfolioValue}`
  });
  this.dataDiv.appendChild(valueElement);
};

CoinDetailView.prototype.renderChart = function () {
  Highcharts.theme = this.theme;
  Highcharts.setOptions(Highcharts.theme);
  const categories = this.coinData.historicalData.map((data) => {
    return data.timeStamp;
  });
  const chartData = this.coinData.historicalData.map((data) => {
    return data.close;
  });
  const chart = Highcharts.chart(this.chartDiv, {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Coin Performance'
    },
    xAxis: {
      categories: categories
    },
    yAxis: {
      title: {
        text: 'Value $'
      }
    },
    series: [{
      name: 'Coin Value',
      data: chartData
    }]
  });
};

CoinDetailView.prototype.makeHeader = function () {
  const headerElement = element.make({
    tag: 'h2',
    attribs: {
      class: 'coin-header'
    },
    content: `${this.coinData.name} (${this.coinData.symbol})`
  });
  this.container.appendChild(headerElement);
};

CoinDetailView.prototype.makeChartDiv = function () {
  this.chartDiv = element.make({
    tag: 'div',
    attribs: {
      id: 'coin-detail-view-chart-div'
    }
  });
  this.container.appendChild(this.chartDiv);
};


CoinDetailView.prototype.makeDataDiv = function () {
  this.dataDiv = element.make({
    tag:'div',
    attribs: {
      id: 'coin-detail-view-data-div'
    }
  });
    this.container.appendChild(this.dataDiv);
};
module.exports = CoinDetailView;

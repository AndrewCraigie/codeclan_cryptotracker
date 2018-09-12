const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');
const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

const CoinDetailView = function(container){

  this.container = container;
  this.coinData = null;

  this.chartDiv = null;
  this.isDeleteMessage = false;
  this.theme = null;

};

CoinDetailView.prototype.bindEvents = function(){

    PubSub.subscribe('Cryptotracker:coin-detail-ready', (event) => {
      this.coinData = event.detail;
      // console.log(this.coinData.portfolioValue, this.coinData.portfolioQuantity);
      this.container.classList.remove('is-active');
      this.isDeleteMessage = false;
      this.render();
    });

    PubSub.subscribe('Cryptotracker:coin-deleted', (event) => {

      this.isDeleteMessage = true;
      this.renderDeleteMessage();

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
      portfolioId: coinId,
      quantity: quantity
    };

    PubSub.publish('CoinDetailView:coin-updated', coin);

};


CoinDetailView.prototype.renderDeleteMessage = function(){

  const container = this.container;
  element.clear(container);

  const tempElement = element.make({
    tag: 'h2',
    attribs: {
      class: 'temp-element'
    },
    content: this.coinData.name + ' deleted'
  });
  container.appendChild(tempElement)

  setTimeout(function(){
     tempElement.classList.remove('temp-element');
     tempElement.classList.add('temp-element-fade');
   }, 600);

   setTimeout(function(){
      container.removeChild(tempElement);
    }, 2000);

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
  const chart = Highcharts.chart(this.container, {
    chart: {
      type: 'line'
    },
    title: {
      text: `${this.coinData.name} Performance'`
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
      type: 'area',
      name: 'Coin Value',
      data: chartData
    }]
  });

};

CoinDetailView.prototype.render = function(){

  element.clear(this.container);


  if (this.coinData) {
    this.renderChart();
  }


};


module.exports = CoinDetailView;

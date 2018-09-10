const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');

const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

const PortfolioChartView = function(container, themeName){
  this.container = container
  this.coinsData = [];
  this.chart = null;

  this.highChartsTheme = [];
  this.themeName = themeName;

  this.theme = null;

  this.categories = [];
  this.chartData = [];

};

PortfolioChartView.prototype.bindEvents = function(){

  PubSub.subscribe('Cryptotracker:coin-data-ready', (event) => {
    this.coinsData = event.detail;
    console.log(this.coinsData[0].historicalData);
  //  this.getChartData();
    //this.render();
  });

  PubSub.subscribe('Themes:theme-available', (event) => {
    this.theme= event.detail;
    // this.getChartData();
     this.render();
  })

};

PortfolioChartView.prototype.getChartData = function () {
  const coin = this.coinsData.find((coin) => {
    return coin.portfolioId != undefined;
  });
  console.log(coin);
  const historicalData = coin.historicalData;
  console.log(historicalData);
};


PortfolioChartView.prototype.render = function(){

  Highcharts.theme = this.theme;
  Highcharts.setOptions(Highcharts.theme);

  this.chart = Highcharts.chart(this.container, {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Porfolio Performance'
    },
    xAxis: {
      categories: this.categories
    },
    yAxis: {
      title: {
        text: 'Value $'
      }
    },
    series: [{
      name: 'Portfolio Total Value',
      data: this.chartData
    }]
  });

};


module.exports = PortfolioChartView;

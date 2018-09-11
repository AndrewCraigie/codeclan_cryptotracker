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

  this.ready = false;

  this.chartDiv = null;

};

PortfolioChartView.prototype.bindEvents = function(){

  PubSub.subscribe('Cryptotracker:coin-data-ready', (event) => {
    this.coinsData = event.detail;
    this.ready = true;
    this.getChartData();
    this.render();
  });

  PubSub.subscribe('Themes:theme-available', (event) => {
    this.theme= event.detail;
    console.log(this.theme);
    if (this.ready) {
      this.getChartData();
    }
     this.render();
  })

};

PortfolioChartView.prototype.getChartData = function () {
  this.chartData = [];
  const coin = this.coinsData.find((coin) => {
    return coin.portfolioId != undefined;
  });
  const historicalData = coin.historicalData;
  this.categories = historicalData.map((data) => {
    return data.timeStamp;
  });


  this.categories.forEach((category, index) => {
    let total = 0;
    this.coinsData.forEach((coin) => {
      if (coin.historicalData) {
        total += coin.historicalData[index].close
      }

    });
    this.chartData.push(total);
  });

};


PortfolioChartView.prototype.render = function(){
  element.clear(this.container);
  this.makeChartDiv();
  Highcharts.theme = this.theme;
  Highcharts.setOptions(Highcharts.theme);

  this.chart = Highcharts.chart(this.chartDiv, {
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

PortfolioChartView.prototype.makeChartDiv = function () {
  this.chartDiv = element.make({
    tag: 'div',
    attribs: {
      id: 'portfolio-chart_view-div'
    }
  });
  this.container.appendChild(this.chartDiv);
};

module.exports = PortfolioChartView;

const PubSub = require('../helpers/pub_sub.js');
const CoinView = require('./coin_view.js');
const element = require('../helpers/element.js');

const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

const PortfolioChartView = function(container){
  this.container = container
  this.coinsData = [];
  this.chart = null;
};

PortfolioChartView.prototype.bindEvents = function(){

  PubSub.subscribe('Cryptotracker:coin-data-ready', (event) => {
    this.coinsData = event.detail;
    this.render();
  });

};

PortfolioChartView.prototype.render = function(){

  this.chart = Highcharts.chart(this.container, {
         chart: {
             type: 'line'
         },
         title: {
             text: 'Porfolio Performance'
         },
         xAxis: {
             categories: ['Monday', 'Tuesday', 'Wednesday']
         },
         yAxis: {
             title: {
                 text: 'Value $'
             }
         },
         series: [{
             name: 'Portfolio Total Value',
             data: [1, 0, 4]
         }]
     });

};


module.exports = PortfolioChartView;

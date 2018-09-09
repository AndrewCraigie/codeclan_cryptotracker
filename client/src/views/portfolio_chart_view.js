const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

const PortfolioChartView = function(container){
  this.container = container
};

PortfolioChartView.prototype.bindEvents = function(){
  console.log(Highcharts);
};

PortfolioChartView.prototype.render = function(){

  const myChart = Highcharts.chart(this.container, {
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

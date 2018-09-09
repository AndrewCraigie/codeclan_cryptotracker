const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');

const CoinDetailView = function(container){

  this.container = container;
  this.coinData = null;

};

CoinDetailView.prototype.bindEvents = function(){

    PubSub.subscribe('Cryptotracker:coin-detail-ready', (event) => {
      console.log('CoinDetail received Cryptotracker:coin-detail-ready');
      this.coinData = event.detail;
      this.render();
    })

};

CoinDetailView.prototype.render = function(){

  element.clear(this.container);

  const tempElement = element.make({
    tag: 'h2',
    attribs: {
      class: 'temp-element'
    },
    content: this.coinData.name
  });
  this.container.appendChild(tempElement);

  console.log(this.coinData);

  for (let prop in this.coinData){
    if(this.coinData.hasOwnProperty(prop)){

      const propName = prop;
      const propValue = this.coinData[prop];
      const propP = element.make({
        tag: 'p',
        attribs: {
          class: 'prop-para'
        },
        content: `${propName}: ${propValue}`
      });

      this.container.appendChild(propP);

    }
  }

};

module.exports = CoinDetailView;

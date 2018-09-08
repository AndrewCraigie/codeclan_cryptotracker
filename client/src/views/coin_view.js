const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');

const CoinView = function (container, coin) {
  this.container = container;
  this.coin = coin.apiCoin;
  this.value = coin.value;

};

CoinView.prototype.clearElement = function(element){

  while(element.firstChild){
    element.removeChild(element.firstChild);
  }

};

CoinView.prototype.render = function () {

  const coinDiv = element.make({
    tag: 'div',
    attribs: {
      class: 'coin',
      'data-coin-symbol': `${this.coin.symbol}`,
    }
  });

  const namePara = element.make({
    tag: 'p',
    attribs: {
      class: 'coin-view-coin-name'
    },
    content: this.coin.name
  });
  coinDiv.appendChild(namePara);

  const symbolPara = element.make({
    tag: 'p',
    attribs: {
      class: 'coin-view-coin-symbol'
    },
    content: this.coin.symbol
  })
  coinDiv.appendChild(symbolPara);

  const valuePara = element.make({
    tag: 'p',
    attribs: {
      class: 'coin-view-coin-price'
    },
    content: `${this.value.toFixed(0)}`
  });
  coinDiv.appendChild(valuePara);

  coinDiv.addEventListener('click', (event) => {
    console.log(event.target.dataset['coinSymbol']);
  });

  this.container.appendChild(coinDiv);
};


module.exports = CoinView;

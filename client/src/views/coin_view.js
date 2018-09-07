const PubSub = require('../helpers/pub_sub.js');

const CoinView = function (container, coin) {
  this.container = container;
  this.coin = coin.apiCoin;
  this.value = coin.value;
};

CoinView.prototype.render = function () {

  const coinDiv = this.createDiv();

  const namePara = this.createParagraph(this.coin.name);
  coinDiv.appendChild(namePara);

  const symbolPara = this.createParagraph(this.coin.symbol);
  coinDiv.appendChild(symbolPara);

  const valuePara = this.createParagraph(`$${this.value.toFixed(0)}`);
  coinDiv.appendChild(valuePara);
  // coinDiv.addEventListener('click', (event) => {
  //
  // });

  this.container.appendChild(coinDiv);
};

CoinView.prototype.createDiv = function () {
  const div = document.createElement('div');
  div.classList.add('coin');
  return div;
};

CoinView.prototype.createParagraph = function (content) {
  const paragraph = document.createElement('p');
  paragraph.textContent = content;
  return paragraph;
};

module.exports = CoinView;

const PubSub = require('../helpers/pub_sub.js');

const CoinView = function (container, coin) {
  this.container = container;
  this.coin = coin;
};

CoinView.prototype.render = function () {
  console.log(this.coin);
  const coinDiv = this.createDiv();

  const namePara = this.createParagraph("Bitcoin");
  coinDiv.appendChild(namePara);

  const symbolPara = this.createParagraph(this.coin.symbol)
  coinDiv.appendChild(symbolPara);

  const valuePara = this.createParagraph('$ 200')
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

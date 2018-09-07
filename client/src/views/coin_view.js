const PubSub = require('../helpers/pub_sub.js');

const CoinView = function (container, coin) {
  this.container = container;
  this.coin = coin;
};

CoinView.prototype.render = function () {
  console.log(this.coin);
  const coinDiv = this.createDiv();

  const namePara = this.createParagraph(this.coin.name);
  coinDiv.appendChild(namePara);

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

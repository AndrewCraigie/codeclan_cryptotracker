const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');

const CoinSelector = function(form, coinsList){
  this.form = form;
  this.coinsList = coinsList;
  this.nameLength = this.longestNameLength();
}

CoinSelector.prototype.makeCoinItems = function(container){

  this.coinsList.forEach((coin) => {
    const coinOption = this.makeCoinItem(coin);
    container.appendChild(coinOption);
  });

};

CoinSelector.prototype.longestNameLength = function(){

  const longestName =  this.coinsList.reduce((prev, current) => {
      const larger = (prev.name.length > current.name.length) ?  prev : current
      return larger;
  });

  return longestName.name.length;

}

CoinSelector.prototype.makeCoinItem = function(coin) {

  const coinItem =  element.make({
    tag: 'li',
    attribs: {
      class: 'coins-list-coin-item',
      'data-coin-symbol': `${coin.symbol}`
    }
  });

  const nameSpan = element.make({
    tag: 'span',
    attribs: {
      class: 'coins-list-coin-name',
      style: `width:${this.nameLength - 2}ch;`,
    },
    content: `${coin.name}`
  });
  coinItem.appendChild(nameSpan);

  const symbolSpan = element.make({
    tag: 'span',
    attribs: {
      class: 'coins-list-coin-symbol'
    },
    content: `${coin.symbol}`
  });
  coinItem.appendChild(symbolSpan);

  // const currencySymbol = element.make({
  //   tag: 'span',
  //   attribs: {
  //     class: 'coins-list-coin-currency'
  //   },
  //   content: '$'
  // })
  // coinItem.appendChild(currencySymbol);

  const price = coin.quotes.USD.price.toFixed(2);
  const priceSpan = element.make({
    tag: 'span',
    attribs: {
      class: 'coins-list-coin-price'
    },
    content: `${price}`
  });
  coinItem.appendChild(priceSpan);

  coinItem.addEventListener('click', (event) => {
    const coinSymbol = event.target.getAttribute('data-coin-symbol');
    PubSub.publish('CoinSelector:coin-selected', coinSymbol);
  });

  return coinItem;

};



CoinSelector.prototype.render = function(){

  this.form.submitBtn.disabled = true;

  const coinListDiv = element.make({
    tag: 'ul',
    attribs: {
      id: 'coins-list-list'
    }
  })

  this.makeCoinItems(coinListDiv);

  this.form.appendChild(coinListDiv);

  this.form.submitBtn.disabled = false;

};

module.exports = CoinSelector;

const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');

const CoinSelector = function(form, coinsList){
  this.form = form;
  this.coinsList = coinsList;
  this.coinListDiv = null;
  this.coinItems = [];
  this.top10 = [];
  this.selectedCoinInput = null;
  this.selectedCoinPortfolioInput = null;

  this.nameLength = this.longestNameLength();
}

CoinSelector.prototype.makeCoinItems = function(container){

  this.coinItems = [];

  this.coinsList.forEach((coin) => {
    const coinOption = this.makeCoinItem(coin);
    this.coinItems.push(coinOption);
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

CoinSelector.prototype.handleCoinItemClick = function(event){

  const coinSymbol = event.target.getAttribute('data-coin-symbol');
  this.selectedCoinInput.value = coinSymbol;

  const portfolioId = event.target.getAttribute('data-portfolioId');
  this.selectedCoinPortfolioInput.value = portfolioId;

  this.setHighlight(event.target);

};

CoinSelector.prototype.makeCoinItem = function(coin) {

  const price = coin.quotes.USD.price.toFixed(2);

  const coinItem =  element.make({
    tag: 'li',
    attribs: {
      class: 'coins-list-coin-item',
      'data-coin-symbol': `${coin.symbol}`,
      'data-coin-price': `${price}`,
      'data-coin-quantity': `${coin.portfolioQuantity}`
    }
  });

  if (coin.portfolioId){
    coinItem.setAttribute('data-portfolioId', `${coin.portfolioId}`);
    coinItem.classList.add('coins-list-coin-in-portfolio');
  }

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

  const priceSpan = element.make({
    tag: 'span',
    attribs: {
      class: 'coins-list-coin-price'
    },
    content: `${price}`
  });
  coinItem.appendChild(priceSpan);

  coinItem.addEventListener('click', this.handleCoinItemClick.bind(this));

  return coinItem;

};

CoinSelector.prototype.setHighlight = function(selected){

  this.coinItems.forEach((element) => {
    element.classList.toggle('coins-list-selected-coin', element === selected);
  });

};

CoinSelector.prototype.handleFind = function(event){

  const filterText = event.target.value;
  this.filterList(filterText);

};

CoinSelector.prototype.handleAll = function(){

  this.coinItems.forEach((element) => {
     element.classList.remove('coins-list-hidden');
  });

};

CoinSelector.prototype.handleTop10 = function(){

  for (let i = 0; i < this.coinItems.length; i++){
    const item = this.coinItems[i];
    item.classList.toggle('coins-list-hidden', !item.classList.contains('top-10'));
  }

}

CoinSelector.prototype.handleMyCoins = function(){

  for (let i = 0; i < this.coinItems.length; i++){
    const item = this.coinItems[i];
    item.classList.toggle('coins-list-hidden', !item.classList.contains('coins-list-coin-in-portfolio'));
  }

};

CoinSelector.prototype.getTop10 = function(){

  const sortedList = this.coinItems.sort((a, b) => {
    return (parseFloat(a.dataset['coinPrice']) - parseFloat(b.dataset['coinPrice']));
  }).reverse();

  for (let i = 0; i < sortedList.length; i++){
    this.coinItems[i].classList.toggle('top-10', i < 10);
  }

};

CoinSelector.prototype.filterList = function(filterValue){

  const filtervalue = filterValue.toLowerCase();

  this.coinItems.forEach((element) => {

    const itemDataValue = element.getAttribute('data-coin-symbol').toLowerCase()
    const containsFilterValue = (itemDataValue === filterValue);
    element.classList.toggle('coins-list-hidden', !containsFilterValue);

  });

};

CoinSelector.prototype.makeFilterControls = function(){

  const filterControlsDiv = element.make({
    tag: 'div',
    attribs: {
      class: 'coins-list-filter-controls-container'
    }
  });

  const allBtn = element.make({
    tag: 'input',
    attribs: {
      type: 'button',
      value: 'All'
    }
  });
  allBtn.addEventListener('click', this.handleAll.bind(this));
  filterControlsDiv.appendChild(allBtn);

  const myCoinsBtn = element.make({
    tag: 'input',
    attribs: {
      type: 'button',
      value: 'My Coins'
    }
  });
  myCoinsBtn.addEventListener('click', this.handleMyCoins.bind(this));
  filterControlsDiv.appendChild(myCoinsBtn);

  const top10Btn = element.make({
    tag: 'input',
    attribs: {
      type: 'button',
      value: 'Top 10'
    }
  })
  top10Btn.addEventListener('click', this.handleTop10.bind(this));
  filterControlsDiv.appendChild(top10Btn);

  const findInput = element.make({
    tag: 'input',
    attribs: {
      type: 'text',
    }
  })
  findInput.addEventListener('keyup', this.handleFind.bind(this));
  filterControlsDiv.appendChild(findInput);


  const findBtn = element.make({
    tag: 'input',
    attribs: {
      type: 'button',
      value: 'Find'
    }
  })
  filterControlsDiv.appendChild(findBtn);

  this.form.insertBefore(filterControlsDiv, this.form.firstChild);


}

CoinSelector.prototype.render = function(selectedCoinInput, selectedCoinPortfolioInput){

  this.selectedCoinInput = selectedCoinInput;
  this.selectedCoinPortfolioInput = selectedCoinPortfolioInput
  this.form.submitBtn.disabled = true;

  if (this.coinListDiv == null){

    this.coinListDiv = element.make({
      tag: 'ul',
      attribs: {
        id: 'coins-list-list'
      }
    })

    this.form.insertBefore(this.coinListDiv, this.form.firstChild);

    this.makeFilterControls();

  } else {
    element.clear(this.coinListDiv);
  }

  this.makeCoinItems(this.coinListDiv);
  this.getTop10();

  this.form.submitBtn.disabled = false;

};

module.exports = CoinSelector;

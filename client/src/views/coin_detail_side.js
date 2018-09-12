const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');

const CoinDetailSide = function(container){

  this.container = container;
  this.isDeleteMessage = false

  this.coinData = null;

  this.coinDetailsGroup = null;

  this.headerDiv = null;
  this.imageElement = null;
  this.coinNameElement = null;

  this.dataDiv = null;

  this.controlsGroup = null;
  this.deleteButton = null;
  this.quantityControl = null;
  this.updateButton = null;

  this.deleteToggleBtn = null;
  this.deletePanel = null;

  this.inputs = [];
};

CoinDetailSide.prototype.bindEvents = function(){

  this.renderElements();

  PubSub.subscribe('Cryptotracker:coin-detail-ready', (event) => {
    this.coinData = event.detail;
    //this.container.classList.remove('is-active');
    this.isDeleteMessage = false;
    this.render();
  });

  PubSub.subscribe('Cryptotracker:coin-deleted', (event) => {
    this.isDeleteMessage = true;
    this.renderDeleteMessage();
  });

};

CoinDetailSide.prototype.handleUpdate = function(event){

    const quantity = this.quantityControl.value;
    const coinId = this.coinData.portfolioId;

    const coin = {
      symbol: this.coinData.symbol,
      portfolioId: coinId,
      quantity: quantity
    };

    PubSub.publish('CoinDetailSide:coin-updated', coin);
};

CoinDetailSide.prototype.handleDelete = function(event){

  this.deleteToggleBtn.classList.remove('delete-active');
  this.deletePanel.style.display = 'none';
  PubSub.publish('CoinDetailSide:delete-coin', this.coinData.portfolioId);


};

CoinDetailSide.prototype.handleQuantityChange = function(event){
  if(parseFloat(event.detail) >= 0.01){
    this.updateButton.disabled = false;
  } else {
    this.updateButton.disabled = true;
  }
};


//`${this.coinData.name} (${this.coinData.symbol})`
CoinDetailSide.prototype.renderData = function () {

  this.quantityControl.value = this.coinData.portfolioQuantity;
  this.coinNameElement.innerHTML = this.coinData.name;
  this.imageElement.src = `/images/${this.coinData.website_slug}.png`;


  const priceElement = element.make({
    tag: 'p',
    attribs: {
      class:'price-para'
    },
    content: `Unit Price : $ ${this.coinData.quotes.USD.price.toFixed(4)}`
  });
  this.dataDiv.appendChild(priceElement);

  const rankElement = element.make({
    tag: 'p',
    attribs: {
      class:'rank-para'
    },
    content: `Coin Rank : ${this.coinData.rank}`
  });
  this.dataDiv.appendChild(rankElement);

  const valueElement = element.make({
    tag: 'p',
    attribs: {
      class:'value-para'
    },
    content: `Total Value : $ ${this.coinData.portfolioValue.toFixed(4)}`
  });
  this.dataDiv.appendChild(valueElement);

  const marketCapElement = element.make({
    tag: 'p',
    attribs: {
      class:'value-para'
    },
    content: `Market Cap : $ ${this.coinData.quotes.USD.market_cap}`
  });
  this.dataDiv.appendChild(marketCapElement);




};


CoinDetailSide.prototype.makeHeaderDiv = function(){

  this.headerDiv = element.make({
    tag: 'div',
    attribs: {
      id: 'coin-detail-side-header'
    }
  })

  this.imageElement  = element.make({
    tag: 'img',
    attribs: {
      id: 'coin-detail-side-image',
      class: 'coin-image',
      src: `/images/blank.png`
    }

  });
  this.headerDiv.appendChild(this.imageElement);

  this.coinNameElement  = element.make({
    tag: 'h2',
    attribs: {
      class: 'coin-header'
    },
    content: 'Select a Portfolio Coin'
  });
  this.headerDiv.appendChild(this.coinNameElement);

  this.container.appendChild(this.headerDiv);

};

CoinDetailSide.prototype.makeDataDiv = function () {

  this.dataDiv = element.make({
    tag:'div',
    attribs: {
      id: 'coin-detail-side-data-div'
    }
  });
  this.container.appendChild(this.dataDiv);

};

CoinDetailSide.prototype.toggleDelete = function(event){

  this.deleteToggleBtn.classList.toggle('delete-active');

  if (this.deletePanel.style.display === 'block') {
    this.deleteToggleBtn.innerHTML = 'Delete Portfolio Coin';
    this.deletePanel.style.display = 'none';
  } else {
    this.deleteToggleBtn.innerHTML = 'Click Delete Coin to confirm';
    this.deletePanel.style.display = 'block'
  }

};

CoinDetailSide.prototype.makeControlsGroup = function(){

  this.controlsGroup = element.make({
    tag: 'div',
    attribs: {
      id: 'coin-detail-side-control-group'
    }
  });

  const quantityLabel = element.make({
    tag: 'p',
    attribs: {
      id: 'coin-detail-quantity-label'
    },
    content: 'Quantity in Portfolio'
  });
  this.controlsGroup.appendChild(quantityLabel);

  this.quantityControl = element.make({
    tag: 'input',
    attribs: {
      id: 'coin-detail-quantity-input',
      type: 'number',
      min: 0.01,
      step: 0.01,

    }
  });
  this.inputs.push(this.quantityControl);
  this.quantityControl.required = true;
  this.quantityControl.addEventListener('change', this.handleQuantityChange.bind(this))
  this.controlsGroup.appendChild(this.quantityControl);

  this.updateButton  = element.make({
    tag: 'button',
    attribs: {
      id: 'coin-detail-update-button'
    },
    content: 'Update Quantity'
  });
  this.inputs.push(this.updateButton);
  this.updateButton.disabled = true;
  this.updateButton.addEventListener('click', this.handleUpdate.bind(this));
  this.controlsGroup.appendChild(this.updateButton);


  this.deleteToggleBtn = element.make({
    tag: 'button',
    attribs: {
      id: 'delete-toggle-button'
    },
    content: 'Click to view delete options'
  });
  this.deleteToggleBtn.addEventListener('click', this.toggleDelete.bind(this));
  this.controlsGroup.appendChild(this.deleteToggleBtn);


  this.deletePanel = element.make({
    tag: 'div',
    attribs: {
      id: 'delete-panel',
      class: 'delete-panel'
    }
  });
  this.deletePanel.style.display = 'none';


  this.deleteButton = element.make({
    tag: 'button',
    attribs: {
      id: 'coin-detail-delete-button'
    },
    content: 'Delete Coin'
  });
  this.inputs.push(this.deleteButton);
  this.deleteButton.addEventListener('click', this.handleDelete.bind(this));
  this.deletePanel.appendChild(this.deleteButton)

  this.cancelDeleteBtn = element.make({
    tag: 'button',
    attribs: {
      id: 'cancel-delete-button'
    },
    content: 'Cancel'
  });
  this.cancelDeleteBtn.addEventListener('click', this.toggleDelete.bind(this));
  this.deletePanel.appendChild(this.cancelDeleteBtn)

  this.controlsGroup.appendChild(this.deletePanel);

  this.container.appendChild(this.controlsGroup);

  this.setControlStatus(true);

};

CoinDetailSide.prototype.setControlStatus = function(isDisabled){

  this.inputs.forEach((control) => {
    control.disabled = isDisabled;
    control.classList.toggle('ctrl-disabled', isDisabled);
  })

};

CoinDetailSide.prototype.renderElements = function(){

  this.makeHeaderDiv();
  this.makeDataDiv();
  this.makeControlsGroup();
  this.setControlStatus(true);

};

CoinDetailSide.prototype.render = function(){

  element.clear(this.dataDiv);

  if (this.coinData) {
    this.renderData();
    this.setControlStatus(false);
  }

};

CoinDetailSide.prototype.renderDeleteMessage = function(){

  this.setControlStatus(true);
  element.clear(this.dataDiv);
  this.imageElement.src = `/images/blank.png`;
  this.coinNameElement.innerHTML = 'Select a Portfolio Coin';

};

module.exports = CoinDetailSide;

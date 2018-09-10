const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');

const CoinDetailView = function(container){

  this.container = container;
  this.coinData = null;


  this.coinDetailsGroup = null;
  this.controlsGroup = null;

  this.updateButton = null;
  this.quantityControl = null;

};

CoinDetailView.prototype.bindEvents = function(){

    PubSub.subscribe('Cryptotracker:coin-detail-ready', (event) => {
      console.log('CoinDetail received Cryptotracker:coin-detail-ready');
      this.coinData = event.detail;
      this.render();
    });

};

CoinDetailView.prototype.handleUpdate = function(event){

    const quantity = this.quantityControl.value;
    const coinId = this.coinData.portfolioId;

    const coin = {
      symbol: this.coinData.symbol,
      id: coinId,
      quantity: quantity
    };

    PubSub.publish('CoinDetailView:coin-updated', coin);
};

CoinDetailView.prototype.handleDelete = function(event){
    PubSub.publish('CoinDetailView:delete-coin', this.coinData.portfolioId);
};

CoinDetailView.prototype.handleQuantityChange = function(event){
  this.updateButton.disabled = false;
};

CoinDetailView.prototype.makeControlsGroup = function(){

  this.controlsGroup = element.make({
    tag: 'div',
    attribs: {
      id: 'coin-detail-control-group'
    }
  });

  const quantityLabel = element.make({
    tag: 'p',
    attribs: {
      id: 'coin-detail-quantity-label'
    },
    content: 'Quantity'
  });
  this.controlsGroup.appendChild(quantityLabel);

  this.quantityControl = element.make({
    tag: 'input',
    attribs: {
      type: 'number',
      min: 0,
      step: 0.01,
      value: this.coinData.portfolioQuantity
    }
  });
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
  this.updateButton .disabled = true;
  this.updateButton .addEventListener('click', this.handleUpdate.bind(this));
  this.controlsGroup.appendChild(this.updateButton);

  const deleteButton = element.make({
    tag: 'button',
    attribs: {
      id: 'coin-detail-delete-button'
    },
    content: 'Delete Coin'
  });
  deleteButton.addEventListener('click', this.handleDelete.bind(this));
  this.controlsGroup.appendChild(deleteButton);

  this.container.appendChild(this.controlsGroup);

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

  this.makeControlsGroup();

};

module.exports = CoinDetailView;

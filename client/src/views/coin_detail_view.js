const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');

const CoinDetailView = function(container){

  this.container = container;
  this.coinData = null;


  this.coinDetailsGroup = null;
  this.controlsGroup = null;

  this.chartDiv = null;
  this.dataDiv = null;

  this.updateButton = null;
  this.quantityControl = null;

  this.isDeleteMessage = false;

};

CoinDetailView.prototype.bindEvents = function(){

    PubSub.subscribe('Cryptotracker:coin-detail-ready', (event) => {
      this.coinData = event.detail;
      this.container.classList.remove('is-active');
      this.isDeleteMessage = false;
      this.render();
    });

    PubSub.subscribe('Cryptotracker:coin-deleted', (event) => {
      this.isDeleteMessage = true;
      this.renderDeleteMessage();
    })

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

    const status = confirm(`Are you sure you want to delete ${this.coinData.portfolioQuantity} ${this.coinData.name} from your portfolio?`);

    if (status){
      PubSub.publish('CoinDetailView:delete-coin', this.coinData.portfolioId);
    }

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

  const deleteButton = element.make({
    tag: 'button',
    attribs: {
      id: 'coin-detail-delete-button'
    },
    content: 'Delete Coin'
  });
  deleteButton.addEventListener('click', this.handleDelete.bind(this));
  this.controlsGroup.appendChild(deleteButton);

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
      id: 'coin-detail-quantity-input',
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

  this.container.appendChild(this.controlsGroup);

};

CoinDetailView.prototype.makeChartDiv = function () {
  this.chartDiv = element.make({
    tag: 'div',
    attribs: {
      id: 'coin-detail-view-chart-div'
    }
  });
  this.container.appendChild(this.chartDiv);
};

CoinDetailView.prototype.makeDataDiv = function () {
  this.dataDiv = element.make({
    tag:'div',
    attribs: {
      id: 'coin-detail-view-data-div'
    }
  });
    this.container.appendChild(this.dataDiv);
};

CoinDetailView.prototype.renderDeleteMessage = function(){

  console.log('CoinDetailView: renderDeleteMessage', this.isDeleteMessage);

  const container = this.container;
  element.clear(container);

  const tempElement = element.make({
    tag: 'h2',
    attribs: {
      class: 'temp-element'
    },
    content: this.coinData.name + ' deleted'
  });
  container.appendChild(tempElement)

  container.classList.toggle("is-active");

};

CoinDetailView.prototype.render = function(){

  const container = this.container;

  element.clear(this.container);

  this.makeChartDiv();

  this.makeDataDiv();

  const tempElement = element.make({
    tag: 'h2',
    attribs: {
      class: 'temp-element'
    },
    content: this.coinData.name
  });
  this.dataDiv.appendChild(tempElement);


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

      this.dataDiv.appendChild(propP);

    }
  }

  this.makeControlsGroup();

  setTimeout(function(){
     container.classList.toggle("is-active");
     console.log('timeout');
   }, 300);


};

module.exports = CoinDetailView;

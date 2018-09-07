const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');


const AddCoinView = function (form) {

  this.form = form;
  this.coinsList = [];
  this.childElements = [];

  this.childDefinitions = [

    { tag: 'label',
      attribs: {
        for: 'coin-select',
        class: 'number-label'
      },
      content: 'Coins'
    },

    { tag: 'select',
      attribs: {
        id: 'coin-select'
      }
    },

    { tag: 'label',
      attribs: {
        for: 'coin-amount',
        class: 'number-label'
      },
      content: 'Quantity'
    },

    { tag: 'input',
      attribs: {
        id: 'coin-amount',
        type: 'number',
        min: 0,
        step: 0.01
      }
    },

    { tag: 'input',
      attribs: {
        type: 'submit',
        value: 'Add Coin'
      }
    }

  ];

};

AddCoinView.prototype.bindEvents = function () {

  PubSub.subscribe('Coins:coins-list-data', (event) => {
    this.coinsList = event.detail;
    this.render();
  });

  this.form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    PubSub.publish("AddCoinView:add-coin-submitted", evt.target)
  });

};

AddCoinView.prototype.makeElements = function(){

  this.childDefinitions.forEach((child) => {
    const elem = element.make(child);
    this.childElements.push(elem);
  });

};

AddCoinView.prototype.makeOptions = function(select){

  this.coinsList.forEach((coin) => {
    const coinOption = this.createOption(coin);
    select.appendChild(coinOption);
  });

};

AddCoinView.prototype.createOption = function(coin) {

  return element.make({
    tag: 'option',
    attribs: {
      value: coin.symbol,
    },
    content: `${coin.name} (${coin.symbol}) - Price: ${coin.quotes.USD.price.toFixed(2)}`
  });

};

AddCoinView.prototype.render = function () {

  this.makeElements();

  const coinSelect = this.childElements[1];
  this.makeOptions(coinSelect);

  this.childElements.forEach((element) => this.form.appendChild(element));

};



module.exports = AddCoinView;

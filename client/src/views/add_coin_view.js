const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');
const CoinSelector = require('./coin_selector.js');


const AddCoinView = function (form) {

  this.form = form;
  this.canSubmit = false;
  this.submitBtn = null;

  this.currency = 'USD';

  this.selectedCoin = null;
  this.portfolioId = null;

  this.coinsList = [];
  this.coinSelector = null;
  this.childElements = [];

  this.childDefinitions = [

    // { tag: 'label',
    //   attribs: {
    //     for: 'coin-select',
    //     class: 'number-label'
    //   },
    //   content: 'Coins'
    // },

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
        step: 0.01,
        required: 'required'
      }
    },

    { tag: 'input',
        attribs: {
          id: 'submitBtn',
          type: 'submit',
          value: 'Add Coin',
          disabled: 'disabled'
        }
    }

  ];

};

AddCoinView.prototype.bindEvents = function () {


  //PubSub.subscribe('Coins:coins-list-data', (event) => {
  PubSub.subscribe('Cryptotracker:coin-data-ready', (event) => {

    this.coinsList = event.detail;
    console.log(this.coinsList);

    if (!this.coinSelector){
      this.coinSelector = new CoinSelector(this.form, this.coinsList);
      this.render();
    } else {
      this.coinSelector.coinsList = this.coinsList;
      this.reset();
    }

  });

  this.form.addEventListener("submit", (evt) => {

    evt.preventDefault();

    const newCoin = {
      symbol: this.selectedCoin.value,
      portfolioId: this.portfolioId.value
      quantity: parseInt(evt.target['coin-amount'].value)
    };

    PubSub.publish("AddCoinView:add-coin-submitted", newCoin)

  });

};

AddCoinView.prototype.makeElements = function(){

  this.childDefinitions.forEach((child) => {
    const elem = element.make(child);
    this.childElements.push(elem);
  });

};

AddCoinView.prototype.reset = function(){

  this.form.reset();

};

AddCoinView.prototype.render = function () {

  this.makeElements();

  this.selectedCoin = element.make({ tag: 'hidden',
    attribs: {
      id: 'selectedCoin',
      value: 'null'
    }
  });

  this.childElements.push(this.selectedCoin);

  this.portfolioId = element.make({ tag: 'hidden',
    attribs: {
      id: 'portfolioId',
      value: 'null'
    }
  });

  this.childElements.push(this.portfolioId);

  this.childElements.forEach((element) => this.form.appendChild(element));

  this.coinSelector.render(this.selectedCoin, this.portfolioId);

};



module.exports = AddCoinView;

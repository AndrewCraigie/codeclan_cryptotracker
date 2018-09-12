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
  this.portfolioQuantity = null;

  this.coinNameInput = null;

  this.coinsList = [];
  this.coinSelector = null;
  this.childElements = [];

  this.addContainer = null;
};

AddCoinView.prototype.bindEvents = function () {

  PubSub.subscribe('Cryptotracker:coin-data-ready', (event) => {

    this.coinsList = event.detail;
    if (!this.coinSelector){
      this.coinSelector = new CoinSelector(this.form, this.coinsList);
    } else {
      this.coinSelector.coinsList = this.coinsList;
      this.reset();
    }
    this.render();
  });

  this.form.addEventListener("submit", (evt) => {

    evt.preventDefault();
    const newCoin = {
      symbol: this.selectedCoin.value,
      portfolioId: this.portfolioId.value,
      quantity: parseFloat(evt.target['coin-amount'].value),
    };

    PubSub.publish("AddCoinView:add-coin-submitted", newCoin);

  });

};

AddCoinView.prototype.makeAddGroup = function(){

  const addGroup = element.make({
    tag: 'div',
    attribs: {
      id: 'add-form-add-group'
    }
  });

  const coinLabel = element.make({ tag: 'label',
    attribs: {
      id: 'coin-name-label',
      for: 'coinNameInput',
      class: 'add-group-label'
    },
    content: 'Coin'
  });
  addGroup.appendChild(coinLabel);

  this.coinNameInput = element.make({
    tag: 'input',
    attribs: {
      id: 'coinNameInput',
      type: 'text',
      disabled: 'disabled'
    }
  });
  addGroup.appendChild(this.coinNameInput);

  const quantityLabel = element.make({ tag: 'label',
    attribs: {
      id: 'coin-amount-label',
      for: 'coin-amount',
      class: 'add-group-label'
    },
    content: 'Quantity'
  });
  addGroup.appendChild(quantityLabel);

  const quantityInput = element.make({ tag: 'input',
    attribs: {
      id: 'coin-amount',
      type: 'number',
      min: 0.01,
      step: 0.01,
      required: 'required'
    }
  });
  addGroup.appendChild(quantityInput);

  this.childElements.push(addGroup);

  this.submitBtn = element.make({ tag: 'input',
      attribs: {
        id: 'submitBtn',
        type: 'submit',
        value: 'Add Coin'
      }
  });
  this.submitBtn.disabled = true;

  this.childElements.push(this.submitBtn);
  // console.log(this.childElements);
};

AddCoinView.prototype.makeHiddenFields = function(){

  this.selectedCoinName = element.make({ tag: 'hidden',
    attribs: {
      id: 'selectedCoinName',
      value: 'null'
    }
  });
  this.childElements.push(this.selectedCoinName);

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

  // this.portfolioQuantity = element.make({ tag: 'hidden',
  //   attribs: {
  //     id: 'portfolioQuantity',
  //     value: 'null'
  //   }
  // });
  // this.childElements.push(this.portfolioQuantity);

};

AddCoinView.prototype.reset = function(){

  this.coinNameInput.textContent = '';
  this.coinSelector.setHighlight();
  this.form.submitBtn.disabled = true;
  this.childElements = [];
  this.addContainer.innerHTML = '';
  this.submitBtn = '';
  this.form.reset();

};

AddCoinView.prototype.render = function () {

  this.addContainer = element.make({ tag: 'div',
      attribs: {
        class:'add-container'
      }
  });
  this.form.appendChild(this.addContainer);
  this.makeAddGroup();
  this.makeHiddenFields();

  this.childElements.forEach((element) => this.addContainer.appendChild(element));

  this.coinSelector.render(this.selectedCoin, this.portfolioId);

};



module.exports = AddCoinView;

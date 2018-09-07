const Cryptotracker = require('./models/cryptotracker.js');
const AddCoinView = require('./views/add_coin_view.js');

document.addEventListener('DOMContentLoaded', () => {

  const coinListUrl = 'https://api.coinmarketcap.com/v2/ticker/?limit=10';
  const cryptotracker = new Cryptotracker(coinListUrl);
  cryptotracker.getCoinData();

  const addCoinForm = document.querySelector('form#add-coin-form');
  const addCoinView = new AddCoinView(addCoinForm);
  addCoinView.bindEvents();

 });

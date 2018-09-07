const Cryptotracker = require('./models/cryptotracker.js');
const AddCoinView = require('./views/add_coin_view.js');
const PortfolioiListView = require('./views/portfolio_list_view.js');

document.addEventListener('DOMContentLoaded', () => {

  const coinListUrl = 'https://api.coinmarketcap.com/v2/ticker/?limit=10';
  const url = "http://localhost:3000/api/cryptotracker";
  const cryptotracker = new Cryptotracker(coinListUrl, url);
  cryptotracker.getCoinData();

  const addCoinForm = document.querySelector('form#add-coin-form');
  const addCoinView = new AddCoinView(addCoinForm);
  addCoinView.bindEvents();

  cryptotracker.bindEvents();

  const portfolioContainer = document.querySelector('div#portfolio-list');
  const portfolioListView = new PortfolioiListView(portfolioContainer);
  portfolioListView.bindEvents();
 });

const Cryptotracker = require('./models/cryptotracker.js');
const AddCoinView = require('./views/add_coin_view.js');
const PortfolioiListView = require('./views/portfolio_list_view.js');
const Coins = require('./models/coins.js');

document.addEventListener('DOMContentLoaded', () => {

  const apiUrl = 'https://api.coinmarketcap.com/v2/ticker/';
  const databaseUrl = "http://localhost:3000/api/cryptotracker";



  const cryptotracker = new Cryptotracker(databaseUrl, apiUrl);
  cryptotracker.bindEvents();

  const addCoinForm = document.querySelector('form#add-coin-form');
  const addCoinView = new AddCoinView(addCoinForm);
  addCoinView.bindEvents();

  // const coins = new Coins(coinListUrl);
  // coins.bindEvents();

  const portfolioContainer = document.querySelector('div#portfolio-list');
  const portfolioListView = new PortfolioiListView(portfolioContainer);
  portfolioListView.bindEvents();

  cryptotracker.getPortolioData();

 });

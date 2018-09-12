const Cryptotracker = require('./models/cryptotracker.js');
const Themes = require('./models/themes.js');
const AddCoinView = require('./views/add_coin_view.js');
const PortfolioiListView = require('./views/portfolio_list_view.js');
const PortfolioChartView = require('./views/portfolio_chart_view.js');
const CoinDetailView = require('./views/coin_detail_view.js');
const CoinDetailSide = require('./views/coin_detail_side.js');
const ThemeSelectView = require('./views/theme_select_view.js');

document.addEventListener('DOMContentLoaded', () => {

  const defaultTheme = 'darkUnica';

  const portfolioChartViewContainer = document.querySelector('div#performance-chart-container');
  const portfolioChartView = new PortfolioChartView(portfolioChartViewContainer, defaultTheme);
  portfolioChartView.bindEvents();

  const themeSelectContainer = document.querySelector('div#theme-select-container');
  const themeSelectView = new ThemeSelectView(themeSelectContainer, defaultTheme);
  themeSelectView.bindEvents();

  const themes = new Themes(defaultTheme);
  themes.bindEvents();

  const apiUrl = 'https://api.coinmarketcap.com/v2/ticker/';
  const databaseUrl = "http://localhost:3000/api/cryptotracker";
  const historicalUrl = 'https://min-api.cryptocompare.com/data/';

  const cryptotracker = new Cryptotracker(databaseUrl, apiUrl, historicalUrl);
  cryptotracker.bindEvents();

  const addCoinForm = document.querySelector('form#add-coin-form');
  const addCoinView = new AddCoinView(addCoinForm);
  addCoinView.bindEvents();

  const portfolioContainer = document.querySelector('div#portfolio-list');
  const portfolioListView = new PortfolioiListView(portfolioContainer);
  portfolioListView.bindEvents();

  const coinDetailContainer = document.querySelector('div#coin-detail-container');
  const coinDetailView = new CoinDetailView(coinDetailContainer);
  coinDetailView.bindEvents();

  const coinDetailSideContainer = document.querySelector('div#coin-detail-side');
  const coinDetailSide = new CoinDetailSide(coinDetailSideContainer);
  coinDetailSide.bindEvents();

  cryptotracker.getPortolioData();

 });

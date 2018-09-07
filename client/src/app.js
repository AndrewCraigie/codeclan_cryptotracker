const Cryptotracker = require('./models/cryptotracker.js');

document.addEventListener('DOMContentLoaded', () => {

  const coinListUrl = 'https://api.coinmarketcap.com/v2/ticker/';
  const cryptotracker = new Cryptotracker(coinListUrl);
  cryptotracker.getCoinData();



 });

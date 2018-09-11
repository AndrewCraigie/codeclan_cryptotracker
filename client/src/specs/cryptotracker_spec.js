const assert = require('assert');
const Cryptotracker = require('../models/cryptotracker.js');

describe('Cryptotracker', function () {
  let cryptotracker;
  beforeEach(function () {

    const apiUrl = 'https://api.coinmarketcap.com/v2/ticker/';
    const databaseUrl = "http://localhost:3000/api/cryptotracker";
    const historicalUrl = 'https://min-api.cryptocompare.com/data/';
    cryptotracker = new Cryptotracker(databaseUrl, apiUrl, historicalUrl);
  });

  it('should have a url to load the server', function () {
    assert.strictEqual(cryptotracker.databaseUrl, 'http://localhost:3000/api/cryptotracker');
  });

  it('should have empty array of coins', function () {
    assert.strictEqual(cryptotracker.portfolioCoins.length, 0);
  });

  it('should be able to get coin by symbol', function () {
    const coin1 = {symbol: "BTC", name: "Bitcoin"};
    const coin2 = {symbol: "LTC", name: "Litecoin"};
    cryptotracker.coinsList = [coin1, coin2];
    const actual = cryptotracker.getCoinBySymbol('BTC');
    assert.strictEqual(actual, coin1);
  });

  it('should be able to get portfolio coin by symbol', function () {
    const coin1 = {symbol: "BTC", name: "Bitcoin"};
    const coin2 = {symbol: "LTC", name: "Litecoin"};
    cryptotracker.portfolioCoins = [coin1, coin2];
    const actual = cryptotracker.getPortfolioCoinBySymbol('BTC');
    assert.strictEqual(actual, coin1);
  });

  it('should be able to calculate total value', function () {
    const quantity = 2;
    const price = 20;
    const actual = cryptotracker.calculateValue(quantity, price);
    assert.strictEqual(actual, 40);
  });

  it('should be able to convert unix time to date', function () {
    const actual = cryptotracker.timestampToDate(1536667583);
    assert.strictEqual(actual, '11 Sep 2018');
  });


});

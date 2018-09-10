const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Cryptotracker = function (databaseUrl, apiUrl) {

  this.databaseUrl = databaseUrl;
  this.databaseRequest = new Request(this.databaseUrl );

  this.apiUrl = apiUrl;
  this.apiRequest = new Request(this.apiUrl)

  this.portfolioCoins = [];
  this.apiCoins = [];

  this.coinsData = [];

  this.selectedCoin = [];

};

Cryptotracker.prototype.bindEvents = function () {

  PubSub.subscribe('AddCoinView:add-coin-submitted', (event) => {

    const coinData = event.detail;

    if(coinData.portfolioId){

      this.updateCoin(coinData);

    } else {
      const coinDataToAdd = {
        symbol: coinData.symbol,
        quantity: coinData.quantity
      }
      this.addCoin(coinDataToAdd);
    }

  });

  PubSub.subscribe('CoinView:coin-selected', (event) => {

    this.selectedCoin = event.detail;
    this.getCoinDetails();
  });

  PubSub.subscribe('CoinDetailView:coin-updated', (event) => {
    const payload = {
      symbol: event.detail.symbol,
      quantity:event.detail.quantity
    };
    this.putCoin(event.detail.id, payload);

  });

  PubSub.subscribe('CoinDetailView:delete-coin', (event) => {
    this.deleteCoin(event.detail);
  })

};

//updates Coin data
Cryptotracker.prototype.updateCoin = function (coinData) {
  this.getCoin(coinData);

};

//FINDS COIN BY ID
Cryptotracker.prototype.getCoin = function (coinData) {
  this.databaseRequest.getById(coinData.portfolioId)
  .then((coin) => {
    const updatedCoinQuantity = coinData.quantity + coin[0].quantity;
    const updatedCoin = {symbol: coinData.symbol, quantity: updatedCoinQuantity};
    this.putCoin(coinData.portfolioId, updatedCoin);
  });
};

//UPDATES COIN DATA IN THE DATABASE
Cryptotracker.prototype.putCoin = function (id, payload) {
 this.databaseRequest.put(id, payload)
 .then((portFolioCoins) => {
   this.portfolioCoins = portFolioCoins;
   this.getApiData();

   this.selectedCoin.portfolioQuantity = payload.quantity;
   this.getCoinDetails();

   }).catch(console.error);
};

//DELETES COIN FROM THE DATABASE

Cryptotracker.prototype.deleteCoin = function (id) {
 this.databaseRequest.delete(id).then((portFolioCoins) => {
   this.portfolioCoins = portFolioCoins;
   this.getApiData();
   this.selectedCoin = null;
   this.getCoinDetails();
 })
 .catch(console.error);
};


Cryptotracker.prototype.getCoinDetails = function(){

  // Get the historical data and any other detail
  // Merge this with this.selectedCoin
  // publish this.selectedCoin
  PubSub.publish('Cryptotracker:coin-detail-ready', this.selectedCoin);

};

Cryptotracker.prototype.getPortolioData = function () {

  this.databaseRequest.get()
  .then( (portFolioCoins) => {
    this.portfolioCoins = portFolioCoins;
    this.getApiData();
  })
  .catch(console.error);

};

Cryptotracker.prototype.getApiData = function(){

  this.apiCoins = [];

  this.apiRequest.get()
  .then((apiCoins) => {

    for (var coin in apiCoins.data) {
      if (apiCoins.data.hasOwnProperty(coin)) {
        this.apiCoins.push(apiCoins.data[coin]);
      }
    }

    this.mergeCoinData();

  })
  .catch(console.error);

};

Cryptotracker.prototype.mergeCoinData = function(){

  this.coinsData = this.apiCoins.map((apiCoin) => {

    const portfolioCoin = this.getPortfolioCoinBySymbol(apiCoin.symbol);
    const apiCoinPrice = apiCoin.quotes.USD.price;

    if (portfolioCoin) {
      apiCoin.portfolioQuantity = portfolioCoin.quantity;
      apiCoin.portfolioValue = this.calculateValue(portfolioCoin.quantity, apiCoinPrice);
      apiCoin.portfolioId = portfolioCoin['_id'];
    } else {
      apiCoin.portfolioQuantity = 0;
      apiCoin.portfolioValue = 0;
    }

    return apiCoin;

  });

  PubSub.publish('Cryptotracker:coin-data-ready', this.coinsData);

};

Cryptotracker.prototype.getPortfolioCoinBySymbol = function(symbol){

  return this.portfolioCoins.find((portfolioCoin) => {
    return portfolioCoin.symbol.toLowerCase() === symbol.toLowerCase();
  });

};

Cryptotracker.prototype.calculateValue = function(quantity, price){
  return quantity * price;
};

Cryptotracker.prototype.getCoinBySymbol = function(symbol){
  return this.coinsList.find((coin) => {
    return coin.symbol === symbol;
  })
};

Cryptotracker.prototype.addCoin = function (data) {

  this.databaseRequest.post(data)
  .then((portFolioCoins) => {
    this.portfolioCoins = portFolioCoins;
    this.getApiData();
  })
  .catch()

};

module.exports = Cryptotracker;

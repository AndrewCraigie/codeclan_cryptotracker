const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Cryptotracker = function (databaseUrl, apiUrl, historicalUrl) {

  this.databaseUrl = databaseUrl;
  this.databaseRequest = new Request(this.databaseUrl );

  this.apiUrl = apiUrl;
  this.apiRequest = new Request(this.apiUrl)

  this.historicalUrl = historicalUrl;

  this.portfolioCoins = [];
  this.apiCoins = [];

  this.coinsData = [];

  this.selectedCoin = null;
  this.limit = 30;
};

Cryptotracker.prototype.bindEvents = function () {


  PubSub.subscribe('AddCoinView:add-coin-submitted', (event) => {

    const coinData = event.detail;
    console.log(coinData);
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

  // PubSub.subscribe('CoinView:coin-selected', (event) => {
  //
  //   this.selectedCoin = event.detail;
  //   console.log(this.selectedCoin);
  //   this.getCoinDetails();
  //
  // });

  //CALLED WHEN A COIN IS SELECTED IN PORTFOLIO LIST - STARTS
  PubSub.subscribe('PortfolioiListView:coin-selected', (event) => {

    this.selectedCoin = event.detail;
    this.getCoinDetails();

  });
//ENDS

  PubSub.subscribe('CoinDetailView:coin-updated', (event) => {
    const payload = {
      symbol: event.detail.symbol,
      quantity:event.detail.quantity
    };
    this.putCoin(event.detail.id, payload);

  });

  PubSub.subscribe('CoinDetailSide:delete-coin', (event) => {
    this.deleteCoin(event.detail);
  })

};

//UPDATES COIN DATA
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
   // console.log(this.selectedCoin);
   this.selectedCoin.portfolioQuantity = payload.quantity;
   this.selectedCoin.portfolioValue = this.calculateValue(payload.quantity, this.selectedCoin.quotes.USD.price);
   this.getCoinDetails();

   }).catch(console.error);
};

//DELETES COIN FROM THE DATABASE
Cryptotracker.prototype.deleteCoin = function (id) {
 this.databaseRequest.delete(id).then((portFolioCoins) => {
   this.portfolioCoins = portFolioCoins;
   this.getApiData();
   PubSub.publish('Cryptotracker:coin-deleted', this.selectedCoin);
   this.selectedCoin = null;
 })
 .catch(console.error);
};


Cryptotracker.prototype.getCoinDetails = function(){

  PubSub.publish('Cryptotracker:coin-detail-ready', this.selectedCoin);

};

//GETS PORTFOLIO COINS DATA
Cryptotracker.prototype.getPortolioData = function () {

  this.databaseRequest.get()
  .then( (portFolioCoins) => {
    this.portfolioCoins = portFolioCoins;
    this.getApiData();
  })
  .catch(console.error);

};

//GETS API COIN DATA
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

//MERGES API COIN AND PORTFOLIO COIN DATA
Cryptotracker.prototype.mergeCoinData = function(){

  this.myCoins = [];
  this.coinsData = this.apiCoins.map((apiCoin) => {

    const portfolioCoin = this.getPortfolioCoinBySymbol(apiCoin.symbol);
    const apiCoinPrice = apiCoin.quotes.USD.price;

    if (portfolioCoin) {

      apiCoin.portfolioQuantity = portfolioCoin.quantity;
      apiCoin.portfolioValue = this.calculateValue(portfolioCoin.quantity, apiCoinPrice);

      apiCoin.portfolioId = portfolioCoin['_id'];

      this.myCoins.push(apiCoin);

    } else {
      apiCoin.portfolioQuantity = 0;
      apiCoin.portfolioValue = 0;
    }

    return apiCoin;

  });


  let promises = this.myCoins.map((coin) => {
    let url = `histoday?fsym=${coin.symbol}&tsym=USD&limit=${this.limit}`;
    const historicalRequest = new Request(this.historicalUrl+url);
    return historicalRequest.get()
    .then((data) => {
      coin.historicalData = data.Data;
      coin.historicalData.forEach((entry) => {
        const time = this.timestampToDate(entry.time);
        entry.timeStamp = time;
      });

    });

  });

  Promise.all(promises).then((results) => {
    PubSub.publish('Cryptotracker:coin-data-ready', this.coinsData);
  });

};

//GETS PORTFOLIO COIN BY SYMBOL
Cryptotracker.prototype.getPortfolioCoinBySymbol = function(symbol){

  return this.portfolioCoins.find((portfolioCoin) => {
    return portfolioCoin.symbol.toLowerCase() === symbol.toLowerCase();
  });

};

//CALCULATES VALUE OF COINS
Cryptotracker.prototype.calculateValue = function(quantity, price){
  return quantity * price;
};

//GETS THE API COIN BY SYMBOL
Cryptotracker.prototype.getCoinBySymbol = function(symbol){
  return this.coinsList.find((coin) => {
    return coin.symbol === symbol;
  })
};

//ADDS COIN TO DATABASE
Cryptotracker.prototype.addCoin = function (data) {

  this.databaseRequest.post(data)
  .then((portFolioCoins) => {
    this.portfolioCoins = portFolioCoins;
    this.getApiData();
  })
  .catch()

};

//GETS HISTORICAL DATA FOR EACH COIN
Cryptotracker.prototype.getHistoricalData = function (apiCoin, symbol, currency, limit) {
  //const timeStamp = this.dateToTimestamp(time);
  let url = `histoday?fsym=${symbol}&tsym=${currency}&limit=${limit}`;
  const historicalRequest = new Request(this.historicalUrl+url);

  historicalRequest.get()
  .then((data) => {
    //histoday?fsym=LTC&tsym=USD&limit=20
    //console.log(data.Data);
    apiCoin.historicalData = data.Data;
    apiCoin.historicalData.forEach((entry) => {
      const time = this.timestampToDate(entry.time);
      entry.timeStamp = time;
    });

  });
};


//CONVERTS UNIX TIMESTAMP TO DATE
Cryptotracker.prototype.timestampToDate = function (unixTime) {


  const data = new Date(unixTime * 1000);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const year = data.getFullYear();
  const month = months[data.getMonth()];
  const date = data.getDate();
  const hour = data.getHours();
  const min = data.getMinutes();
  const sec = data.getSeconds();
  //const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  const time = month + ' ' + date;

  return time;
};


module.exports = Cryptotracker;

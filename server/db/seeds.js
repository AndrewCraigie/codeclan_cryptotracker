use cryptotracker;
db.dropDatabase();
db.coins.insertMany([
  {
    symbol: "BTC",
    quantity: 1
  },
  {
    symbol: "LTC",
    quantity: 2
  }
]);

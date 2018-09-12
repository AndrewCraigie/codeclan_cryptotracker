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
  },
  {
    symbol: "BTC",
    quantity: 4
  },
  {
    symbol: "LTC",
    quantity: 3
  },
  {
    symbol: "RDD",
    quantity: 1
  },
  {
    symbol: "MONA",
    quantity: 2
  }
]);

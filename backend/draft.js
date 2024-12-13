{
  strategies: {
    {
      name: "BarUpDn";
      type: "trend";
      long: over(close, open, close[1]);
      short: over(close[1], open, close);
    };
    {
      name: "InSide Bar";
      type: "trend";
      prerequisite: high < high[1] && low > low[1];
      long: close > open;
      short: close < open;
    };
    {
      name: "MACD";
      type: "trend";
      shortterm: EMA(close, 12);
      longterm: EMA(close, 26);
      long: cross(shortterm, longterm);
      short: cross(longterm, shortterm);
    };
    {
      name: "rsi";
      type: "TRB";
      price: rsi(14);
      up: 70;
      down: 30;
      long: cross(price, down);
      short: cross(up, price);
      longstop: cross(down, price);
      shortstop: cross(price, up);
    };
    {
      name: "boll";
      type: "TRB";
      price: EMA(close, 9);
      band: dev(price);
      multiplier: 2;
      up: price + multiplier * band;
      down: price - multiplier * band;
      long: cross(price, down);
      short: cross(up, price);
      longstop: cross(down, price);
      shortstop: cross(price, up);
    }
  }
  environment: {
    long: {
      over(30, rsi);
      over(EMA(close, 5), EMA(close, 10), EMA(close, 20), EMA(close, 30));
    };
    short: {
      over(rsi, 70);
    }
  };
  evaluation: {
  }
}
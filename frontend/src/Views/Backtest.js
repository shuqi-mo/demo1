import { useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import BacktestEvl from "./BacktestEvl";

function Backtest({ stock, trade, range }) {
  const API_URL = "http://localhost:5000";

  const price = [];
  const tradepoint = [];
  var start = 0;
  var end = stock.length - 1;
  const startDate = new Date(range[0]);
  const endDate = new Date(range[1]);
  var currentDate = new Date(stock[start][0]);
  while (currentDate < startDate) {
    start++;
    currentDate = new Date(stock[start][0]);
  }
  
  currentDate = new Date(stock[end][0]);
  while (currentDate > endDate) {
    end--;
    currentDate = new Date(stock[end][0]);
  }

  for (var i = start; i <= end; i++) {
    price.push(stock[i][2]);
    tradepoint.push(trade[i]);
  }

  const [backtestRes, setBacktestRes] = useState(null);

  useEffect(() => {
    axios
      .post(`${API_URL}/backtest`, { price, tradepoint })
      .then((response) => {
        setBacktestRes(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [stock, trade, range]);

  return (
    <div>
      {backtestRes && <BacktestEvl res={backtestRes}/>}
    </div>
  );
}

export default Backtest;

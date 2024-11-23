import { useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import Candle from "./Views/Candle";
import "./App.scss";
import Panel from "./Views/Panel";
import CodeEditor from "./Views/CodeEditor";
import Backtest from "./Views/Backtest";
import Upset from "./Views/Upset";

function App() {
  const API_URL = "http://localhost:5000";
  const [data, setData] = useState(null);
  const [code, setCode] = useState(
    "long:cross(EMA(close,12),EMA(close,26))\r\nshort:cross(EMA(close,26),EMA(close,12))\r\nevaluation:constraint(2022-07-01,2024-07-01)"
    //  "long:cross(EMA(close,12),bolling(EMA(close,9),movingstd(close,9),2,0))\r\nshort:cross(EMA(close,12),bolling(SMA(close,9),movingstd(close,9),2,1))\r\nevaluation:constraint(2022-07-01,2024-07-01)"
    // "long:over(EMA(close,5),EMA(close,10),EMA(close,20),EMA(close,30))\r\nshort:cross(EMA(close,26),close)\r\nevaluation:constraint(2022-07-01,2024-07-01)"
  );
  const [trade, setTrade] = useState(null);
  const [selectStock, setSelectStock] = useState("600893.SH");
  const [backtestRange, setBacktestRange] = useState([
    "2022-07-01",
    "2024-07-01",
  ]);

  const updateValue = (newValue) => {
    setData(newValue);
  };

  const updateStock = (newName) => {
    setSelectStock(newName);
  };

  const updateCode = (newValue) => {
    setCode(newValue);
  };

  const updateRange = (newRange) => {
    setBacktestRange(newRange);
    // console.log(newRange);
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/get_stock_data`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .post(`${API_URL}/receive_code`, { code, selectStock })
      .then((response) => {
        setTrade(response.data);
        // console.log(code);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [selectStock, code]);

  return (
    <div>
      <div className="panel">
        <Panel onUpdateValue={updateValue} onUpdateStock={updateStock} />
      </div>
      <div className="timeselector">
        {data && trade && (
          <div className="candle">
            <Candle data={data} trade={trade} />
          </div>
        )}
        <div className="editor">
          <CodeEditor
            code={code}
            onCodeChange={updateCode}
            selectStock={selectStock}
            stock={data}
            updateRange={updateRange}
          />
        </div>
      </div>
      <div className="right">
        <Upset/>
        <div className="backtest">
          {data && trade && (
            <Backtest
              stock={data["data"]}
              trade={trade}
              range={backtestRange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

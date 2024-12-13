import { useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import Candle from "./Views/Candle";
import "./App.scss";
import Panel from "./Views/Panel";
import CodeEditor from "./Views/CodeEditor";
import Backtest from "./Views/Backtest";
import Upset from "./Views/Upset";
import { Strategy } from "./utils/ClassDefinitions";

function App() {
  const API_URL = "http://localhost:5000";
  const [data, setData] = useState(null);
  const [code, setCode] = useState(
    "long:maybe cross(EMA(close,12),EMA(close,26)) && maybe over(EMA(close,5),EMA(close,10),EMA(close,20),EMA(close,30))\r\nshort:maybe cross(EMA(close,26),EMA(close,12))\r\nevaluation:period(2022-07-01,2024-07-01)"
    // "long:must cross(low,EMA(close,5)) && must over(EMA(close,5),EMA(close,10),EMA(close,20),EMA(close,30))\r\nshort:null\r\nevaluation:lookahead(2)"
  );
  const [trade, setTrade] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [selectStock, setSelectStock] = useState("600893.SH");
  const test1 = require("./case/test1.json");
  // 创建策略实例并计算
  const strategies = test1.strategies.map((strategyData) => {
    const strategy = new Strategy(strategyData);
    return {
      name: strategy.name,
      type: strategy.type,
      computedLong: strategy.computeLong(),
      computedShort: strategy.computeShort(),
    };
  });

  console.log(strategies);

  const updateValue = (newValue) => {
    setData(newValue);
  };

  const updateStock = (newName) => {
    setSelectStock(newName);
  };

  const updateCode = (newValue) => {
    setCode(newValue);
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
      .post(`${API_URL}/process_code`, { code, selectStock })
      .then((response) => {
        setTrade(response.data[0]);
        setEvaluation(response.data[1]);
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
          />
        </div>
      </div>
      <div className="right">
        <Upset />
        <div className="backtest">
          {data && trade && evaluation && (
            <Backtest
              stock={data["data"]}
              trade={trade}
              evaluation={evaluation}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

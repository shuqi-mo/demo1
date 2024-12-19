import { useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import Candle from "./Views/Candle";
import "./App.scss";
import Panel from "./Views/Panel";
import CodeEditor from "./Views/CodeEditor";
import { Indicator, Evaluation } from "./utils/ClassDefinitions";
import IndicatorsTable from "./Views/IndicatorsTable";

function App() {
  const API_URL = "http://localhost:5000";
  const test1 = require("./case/test1.json");
  const [data, setData] = useState(null);
  const [code, setCode] = useState(JSON.stringify(test1, null, 2));
  const [trade, setTrade] = useState(null);
  const [backtest, setBacktest] = useState(null);
  const [selectStock, setSelectStock] = useState("600893.SH");
  const [stockList, setStockList] = useState(null);

  // 创建策略实例并计算
  const indicators = JSON.parse(code).indicators.map((strategyData) => {
    const indicator = new Indicator(strategyData);
    return {
      name: indicator.name,
      exprLong: indicator.exprLong(),
      exprShort: indicator.exprShort(),
      trade: null,
      success: null,
      singlereturn: null,
      totalprofit: null,
    };
  });

  const evaluationData = JSON.parse(code).evaluation;

  // 创建 Evaluation 实例
  const evaluation = new Evaluation(evaluationData.period, evaluationData.stop);

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
    axios
      .get(`${API_URL}/get_stock_list`)
      .then((response) => {
        // setData(response.data);
        setStockList(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  // 定义一个异步函数来处理每个策略的请求
  async function processStrategies() {
    for (let i = 0; i < indicators.length; i++) {
      const exprLong = indicators[i].exprLong;
      const exprShort = indicators[i].exprShort;

      try {
        // 等待axios请求完成并获取响应数据
        const response = await axios.post(`${API_URL}/process_indicator`, {
          exprLong,
          exprShort,
          selectStock,
        });

        // 将返回的data赋值给indicators[i].trade
        indicators[i].trade = response.data;

        // 打印日志以查看返回的结果
        // console.log(`Strategy ${i} trade data:`, response.data);
      } catch (error) {
        console.error("Error for strategy " + i + ":", error);
      }
    }
    processEvaluation();
    var t = [];
    for (let i = 0; i < indicators[0].trade.length; i++) {
      var cur = 0;
      for (let j = 0; j < indicators.length; j++) {
        cur += indicators[j].trade[i];
      }
      if (cur > 0) {
        t.push(1);
      } else if (cur < 0) {
        t.push(-1);
      } else {
        t.push(0);
      }
    }
    setTrade(t);
  }

  async function processEvaluation() {
    const startDate = evaluation.startDate;
    const endDate = evaluation.endDate;
    const getStopLossThreshold = evaluation.getStopLossThreshold();
    const getTakeProfitThreshold = evaluation.getTakeProfitThreshold();
    const getAheadStopTime = evaluation.getAheadStopTime();

    for (let i = 0; i < indicators.length; i++) {
      const tradeSeq = indicators[i].trade;
      try {
        // 等待axios请求完成并获取响应数据
        const response = await axios.post(`${API_URL}/process_evaluation`, {
          startDate,
          endDate,
          getStopLossThreshold,
          getTakeProfitThreshold,
          getAheadStopTime,
          tradeSeq,
          selectStock,
        });
        indicators[i].success = response.data[0];
        indicators[i].totalprofit = response.data[1];
        indicators[i].singlereturn = response.data[2];
      } catch (error) {
        console.error("Error for strategy " + i + ":", error);
      }
    }
    // 提取 indicators 中的必要字段并更新 backtest
    const newBacktest = indicators.map((indicator) => ({
      name: indicator.name,
      success: indicator.success,
      singlereturn: indicator.singlereturn,
      totalprofit: indicator.totalprofit,
    }));

    setBacktest(newBacktest); // 更新 backtest 状态
  }

  useEffect(() => {
    processStrategies();
  }, [selectStock, code]);

  return (
    <div>
      <div className="panel">
        {stockList && (
          <Panel stockList={stockList} onUpdateValue={updateValue} onUpdateStock={updateStock} />
        )}
      </div>
      <div className="timeselector">
        {trade && (
          <div className="candle">
            <Candle data={data} trade={trade} />
          </div>
        )}
        {backtest && (
          <div style={{ padding: "20px" }}>
            <IndicatorsTable indicators={backtest} />
          </div>
        )}
      </div>
      <div className="right">
        <div className="editor">
          <CodeEditor code={code} onCodeChange={updateCode} />
        </div>
      </div>
    </div>
  );
}

export default App;

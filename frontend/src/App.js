import { useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import Candle from "./Views/Candle";
import "./App.scss";
import Panel from "./Views/Panel";
import CodeEditor from "./Views/CodeEditor";
import { Indicator, Evaluation } from "./utils/ClassDefinitions";
import IndicatorsTable from "./Views/IndicatorsTable";
import { Button } from "antd";
import StocksTable from "./Views/StocksTable";

function App() {
  const API_URL = "http://localhost:5000";
  const test1 = require("./case/test1.json");
  const [data, setData] = useState(null);
  const [code, setCode] = useState(JSON.stringify(test1, null, 2));
  const [trade, setTrade] = useState(null);
  const [backtest, setBacktest] = useState(null);
  const [selectStock, setSelectStock] = useState("600893.SH");
  const [stockList, setStockList] = useState(["600893.SH"]);
  const [stockPerformance, setStockPerformance] = useState([]);

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

  // 更新股票清单和选中股票
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

  // 计算指标交易序列
  async function processStrategies() {
    for (let i = 0; i < indicators.length; i++) {
      const exprLong = indicators[i].exprLong;
      const exprShort = indicators[i].exprShort;
      const stock = selectStock;

      try {
        // 等待axios请求完成并获取响应数据
        const response = await axios.post(`${API_URL}/process_indicator`, {
          exprLong,
          exprShort,
          stock,
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

  // 计算指标收益
  async function processEvaluation() {
    const startDate = evaluation.startDate;
    const endDate = evaluation.endDate;
    const getStopLossThreshold = evaluation.getStopLossThreshold();
    const getTakeProfitThreshold = evaluation.getTakeProfitThreshold();
    const getAheadStopTime = evaluation.getAheadStopTime();
    const stock = selectStock;

    for (let i = 0; i < indicators.length; i++) {
      const singleTrade = indicators[i].trade;
      try {
        // 等待axios请求完成并获取响应数据
        const response = await axios.post(`${API_URL}/process_evaluation`, {
          startDate,
          endDate,
          getStopLossThreshold,
          getTakeProfitThreshold,
          getAheadStopTime,
          singleTrade,
          stock,
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

  // 更新股票交易序列
  async function calculateTradeForStock(stock) {
    var tradeSeq = [];
    for (let i = 0; i < indicators.length; i++) {
      const exprLong = indicators[i].exprLong;
      const exprShort = indicators[i].exprShort;
      try {
        // 等待axios请求完成并获取响应数据
        const response = await axios.post(`${API_URL}/process_indicator`, {
          exprLong,
          exprShort,
          stock,
        });
        tradeSeq.push(response.data);
      } catch (error) {
        console.error("Error for strategy " + i + ":", error);
      }
    }
    return {
      stock,
      tradeSeq,
    };
  }

  // 更新股票收益
  async function calculatePerformanceForStock(stock) {
    const res_trade = await calculateTradeForStock(stock);
    const tradeSeq = res_trade["tradeSeq"];
    const startDate = evaluation.startDate;
    const endDate = evaluation.endDate;
    const getStopLossThreshold = evaluation.getStopLossThreshold();
    const getTakeProfitThreshold = evaluation.getTakeProfitThreshold();
    const getAheadStopTime = evaluation.getAheadStopTime();

    let success = [];
    let totalprofit = [];
    let singlereturn = [];

    for (let i = 0; i < tradeSeq.length; i++) {
      const singleTrade = tradeSeq[i];
      try {
        const response = await axios.post(`${API_URL}/process_evaluation`, {
          startDate,
          endDate,
          getStopLossThreshold,
          getTakeProfitThreshold,
          getAheadStopTime,
          singleTrade,
          stock,
        });
        success.push(response.data[0]);
        totalprofit.push(response.data[1]);
        singlereturn.push(response.data[2]);
      } catch (error) {
        console.error("Error processing evaluation for stock", stock, error);
      }
    }
    return {
      stock,
      success,
      singlereturn,
      totalprofit
    };
  }

  useEffect(() => {
    processStrategies();
  }, [selectStock, code]);

  async function calculateStockPerformance() {
    const performanceData = [];

    for (let stock of stockList) {
      const performance = await calculatePerformanceForStock(stock);
      console.log(performance);
      performanceData.push(performance);
    }

    setStockPerformance(performanceData);
  }

  const handleExecute = async () => {
    await calculateStockPerformance();
    console.log("Updated stock performance for all stocks");
  };

  return (
    <div>
      <div className="panel">
        <Panel
          stockList={stockList}
          onUpdateValue={updateValue}
          onUpdateStock={updateStock}
        />
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
            <Button type="primary" onClick={() => handleExecute()}>
              Update for stocklist
            </Button>
            <StocksTable stocks={stockPerformance}/>
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

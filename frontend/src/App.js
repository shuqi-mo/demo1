import { useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import Candle from "./Views/Candle";
import "./App.scss";
import Exampler from "./Views/Exampler";
import Panel from "./Views/Panel";
import CodeEditor from "./Views/CodeEditor";

function App() {
  const API_URL = "http://localhost:5000";
  const [data, setData] = useState(null);
  const [code, setCode] = useState(
    "buy:cross(SMA(close,12),SMA(close,26))\r\nsell:cross(SMA(close,26),SMA(close,12))"
  );
  const [trade, setTrade] = useState(null);
  const [examplerData, setExamplerData] = useState(null);
  const [selectStock, setSelectStock] = useState("600893.SH");

  const updateValue = (newValue) => {
    setData(newValue);
  };

  const updateStock = (newName) => {
    setSelectStock(newName);
  };

  function updateCode(newValue) {
    setCode(newValue);
  }

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
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    axios
      .post(`${API_URL}/cal_exampler_data`, { code, selectStock })
      .then((response) => {
        setExamplerData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [selectStock]);

  return (
    <div>
      <div className="panel">
        <Panel onUpdateValue={updateValue} onUpdateStock={updateStock}/>
      </div>
      <div className="timeselector">
        {data && trade && (
          <div className="candle">
            <Candle
              data={data}
              trade={trade}
            />
          </div>
        )}
        <div className="editor">
          <CodeEditor onCodeChange={updateCode}/>
        </div>
        {examplerData && (
          <div className="exampler">
            <Exampler data={examplerData} />
          </div>
        )}
      </div>
      <div className="right">
        <div className="stockselector">stock view</div>
        <div className="evolution">evolution view</div>
      </div>
    </div>
  );
}

export default App;

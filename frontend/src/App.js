import { useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import Candle from "./Views/Candle";
import MonacoEditor from "react-monaco-editor";
import "./App.scss";
import Exampler from "./Views/Exampler";
import Panel from "./Views/Panel";

function App() {
  const API_URL = "http://localhost:5000";
  const [data, setData] = useState(null);
  const [extendSingle, setextendSingle] = useState(null);
  const [extendDouble, setextendDouble] = useState(null);
  const [extendTriple, setextendTriple] = useState(null);
  const [code, setCode] = useState(
    "buy:cross(MA(close,12),MA(close,26))\r\nsell:cross(MA(close,26),MA(close,12))"
  );
  const [trade, setTrade] = useState(null);
  const [examplerData, setExamplerData] = useState(null);
  const [selectStock, setSelectStock] = useState("600893.SH");

  const updateValue = (newValue) => {
    setData(newValue);
    // console.log(newValue);
  };

  const updateStock = (newName) => {
    setSelectStock(newName);
    // console.log(newName);
  };

  function codeOnChange(newValue, e) {
    // console.log(newValue);
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
    axios
      .get(`${API_URL}/get_single`)
      .then((response) => {
        setextendSingle(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    axios
      .get(`${API_URL}/get_double`)
      .then((response) => {
        setextendDouble(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    axios
      .get(`${API_URL}/get_triple`)
      .then((response) => {
        setextendTriple(response.data);
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
        {data && extendSingle && extendDouble && extendTriple && trade && (
          <div className="candle">
            <Candle
              data={data}
              extend1={extendSingle}
              extend2={extendDouble}
              extend3={extendTriple}
              trade={trade}
            />
          </div>
        )}
        <div className="editor">
          <MonacoEditor
            width="700"
            height="100"
            language="javascript"
            // theme="vs-dark"
            value={code}
            // options={options}
            onChange={codeOnChange}
            // editorDidMount={this.editorDidMount}
          />
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

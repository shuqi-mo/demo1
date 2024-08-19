import { useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import Candle from "./Views/Candle";
import MonacoEditor from "react-monaco-editor";
import "./App.scss";

function App() {
  const API_URL = "http://localhost:5000";
  const [data, setData] = useState(null);
  const [extendSingle, setextendSingle] = useState(null);
  const [extendDouble, setextendDouble] = useState(null);
  const [extendTriple, setextendTriple] = useState(null);
  const [code, setCode] = useState("buy:cross(MA(close,15),MA(close,30))\r\nsell:cross(MA(close,30),MA(close,15))")
  const [trade, setTrade] = useState(null);

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
    axios
      .post(`${API_URL}/receive_code`, { code })
      .then((response) => {
        setTrade(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [code]);

  function codeOnChange(newValue, e) {
    // console.log(newValue);
    setCode(newValue);
  }

  return (
    <div>
      {data && extendSingle && extendDouble && extendTriple && (
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
          width="600"
          height="100"
          language="javascript"
          // theme="vs-dark"
          value={code}
          // options={options}
          onChange={codeOnChange}
          // editorDidMount={this.editorDidMount}
        />
      </div>
    </div>
  );
}

export default App;

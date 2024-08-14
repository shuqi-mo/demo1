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

  return (
    <div>
      {data && extendSingle && extendDouble && extendTriple && (
        <div className="candle">
          <Candle
            data={data}
            extend1={extendSingle}
            extend2={extendDouble}
            extend3={extendTriple}
          />
        </div>
      )}
      <div className="editor">
        <MonacoEditor
          width="600"
          height="100"
          language="javascript"
          // theme="vs-dark"
          value={"CROSS(MA(CLOSE,5),MA(CLOSE,30))"}
          // options={options}
          // onChange={this.onChange}
          // editorDidMount={this.editorDidMount}
        />
      </div>
    </div>
  );
}

export default App;

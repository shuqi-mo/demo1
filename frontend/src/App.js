import { useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import Candle from "./Candle";

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
    data && extendSingle && extendDouble && extendTriple && (
      <div>
        <Candle data={data} extend1={extendSingle} extend2={extendDouble} extend3={extendTriple}/>
      </div>
    )
  );
}

export default App;

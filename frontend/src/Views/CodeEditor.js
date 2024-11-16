import MonacoEditor from "react-monaco-editor";
import { useEffect, useState } from "react";
import { Button, Flex, Modal } from "antd";
import ModalPage from "./ModalPage";
import axios from "axios";

function CodeEditor({ onCodeChange, selectStock, stock, updateRange}) {
  const API_URL = "http://localhost:5000";
  const [code, setCode] = useState(
    "buy:cross(EMA(close,12),EMA(close,26))\r\nsell:cross(EMA(close,26),EMA(close,12))\r\nevaluation:evaRange(2022-07-01,2024-07-01)"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examplerData, setExamplerData] = useState(null);

  function convertArrayToString(arr) {
    return arr.map(item => {
      const [type, [operation, ...pairs]] = item;
      const formattedPairs = pairs.map((pair, index) => {
        // 日期格式
        if (pair.length === 10) {
          return pair;
        }
        const [indicator, field, period] = pair;
        return `${indicator}(${field},${period})`;
      });
      const operationStr = `${operation}(${formattedPairs.join(',')})`;
      return `${type}:${operationStr}`;
    }).join('\r\n');
  }

  function codeOnChange(newValue, e) {
    setCode(convertArrayToString(newValue));
    updateRange([newValue[2][1][1],newValue[2][1][2]]);
  }

  const handleExecute = () => {
    onCodeChange(code);
  };

  function showExampler() {
    setIsModalOpen(true);
  }

  const handleOk = () => {
    handleExecute();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // console.log(selectStock);
    axios
      .post(`${API_URL}/cal_exampler_data`, { code, selectStock })
      .then((response) => {
        setExamplerData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [selectStock, code]);

  return (
    <div>
      <MonacoEditor
        width="700"
        height="150"
        language="javascript"
        value={code}
        onChange={codeOnChange}
      />
      <Flex gap="small" wrap>
        <Button type="primary" onClick={() => handleExecute()}>
          execute
        </Button>
        <Button type="primary" onClick={() => showExampler()}>
          edit
        </Button>
      </Flex>
      <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1200}
          style={{height: '1500px'}}
        >
          <ModalPage data={examplerData} onUpdateParam={codeOnChange} stock={stock}/>
        </Modal>
    </div>
  );
}

export default CodeEditor;

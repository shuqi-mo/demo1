import MonacoEditor from "react-monaco-editor";
import { useEffect, useState } from "react";
import { Button, Flex, Modal } from "antd";
import ModalPage from "./ModalPage";
import axios from "axios";

function CodeEditor({ onCodeChange, selectStock }) {
  const API_URL = "http://localhost:5000";
  const [code, setCode] = useState(
    "buy:cross(EMA(close,12),EMA(close,26))\r\nsell:cross(EMA(close,26),EMA(close,12))"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examplerData, setExamplerData] = useState(null);

  function codeOnChange(newValue, e) {
    setCode(newValue);
  }

  // function handleExecute() {
  //   updateCode(code);
  // }
  const handleExecute = () => {
    onCodeChange(code);
  };

  function showExampler() {
    setIsModalOpen(true);
  }

  const handleOk = () => {
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
  }, [selectStock]);

  return (
    <div>
      <MonacoEditor
        width="700"
        height="150"
        language="javascript"
        // theme="vs-dark"
        value={code}
        // options={options}
        onChange={codeOnChange}
        // editorDidMount={this.editorDidMount}
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
          <ModalPage data={examplerData}/>
        </Modal>
    </div>
  );
}

export default CodeEditor;

import MonacoEditor from "react-monaco-editor";
import { useState } from "react";
import { Button } from "antd";

function CodeEditor({ onUpdateCode }) {
  const [code, setCode] = useState(
    "buy:cross(EMA(close,12),EMA(close,26))\r\nsell:cross(EMA(close,26),EMA(close,12))"
  );

  function codeOnChange(newValue, e) {
    setCode(newValue);
  }

  function handleExecute() {
    onUpdateCode(code);
  }

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
      <Button type="primary" onClick={() => handleExecute()}>
        execute
      </Button>
    </div>
  );
}

export default CodeEditor;

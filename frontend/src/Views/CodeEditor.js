import MonacoEditor from "react-monaco-editor";
import { useState } from "react";
import { Button } from "antd";

function CodeEditor({ onUpdateCode }) {
  const [code, setCode] = useState(
    "buy:cross(SMA(close,12),SMA(close,26))\r\nsell:cross(SMA(close,26),SMA(close,12))"
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

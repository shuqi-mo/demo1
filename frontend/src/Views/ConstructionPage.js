import { useEffect, useState } from "react";
import "../App.scss";
import { Input, Space, Select, Flex, Button } from "antd";

function ConstructionPage({ data, onUpdateParam }) {
  const [code, setCode] = useState(
    data[0][1].map((item) => {
      return {
        aggregation: item[0],
        data: item[1],
        param: item[2],
      };
    })
  );

  // console.log(data[1]);

  useEffect(() => {
    setCode(
      data[0][1].map((item) => {
        return {
          aggregation: item[0],
          data: item[1],
          param: item[2],
        };
      })
    );
  }, [data]);

  const optionsAggregation = [
    {
      value: "SMA",
      label: "SMA",
    },
    {
      value: "EMA",
      label: "EMA",
    },
    {
      value: "WMA",
      label: "WMA",
    },
    {
      value: "SMMA",
      label: "SMMA",
    },
    {
      value: "VWMA",
      label: "VWMA",
    },
  ];

  const optionsData = [
    {
      value: "open",
      label: "open",
    },
    {
      value: "close",
      label: "close",
    },
    {
      value: "high",
      label: "high",
    },
    {
      value: "low",
      label: "low",
    },
  ];

  const update = () => {
    const updateParam = [];
    for (var i = 0; i < code.length; i++) {
      const item = [];
      item.push(code[i]["aggregation"]);
      item.push(code[i]["data"]);
      item.push(code[i]["param"]);
      updateParam.push(item);
    }
    // console.log(updateParam);
    data[1][0][1][1] = updateParam[0];
    data[1][0][1][2] = updateParam[1];
    data[1][1][1][1] = updateParam[1];
    data[1][1][1][2] = updateParam[0];
    onUpdateParam(data[1]);
  }

  return (
    <div>
      <Space direction="vertical">
        {code.map((item, index) => (
          <>
            <p>{`Indicator ${index + 1}`}</p>
            <Flex gap="middle">
              <div>Aggregation</div>
              <Select
                key={`${index}-aggregation`}
                defaultValue={item.aggregation}
                onChange={(v) => {
                  const updateCode = code;
                  updateCode[index]["aggregation"] = v;
                  setCode(updateCode);
                }}
                options={optionsAggregation}
                style={{ width: 120 }}
              />
            </Flex>
            <Flex gap="middle">
              <div>Data</div>
              <Select
                key={`${index}-data`}
                defaultValue={item.data}
                onChange={(v) => {
                  const updateCode = code;
                  updateCode[index]["data"] = v;
                  setCode(updateCode);
                }}
                options={optionsData}
                style={{ width: 120 }}
              />
            </Flex>
            <Input
              key={`${index}-param`}
              addonBefore="param"
              defaultValue={item.param}
              onChange={(e) => {
                const updateCode = code;
                updateCode[index]["param"] = e.target.value;
                setCode(updateCode);
              }}
            />
          </>
        ))}
        <Button type="primary" onClick={() => update()}>
          update
        </Button>
      </Space>
    </div>
  );
}

export default ConstructionPage;

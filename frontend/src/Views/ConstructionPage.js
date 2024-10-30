import "../App.scss";
import { Input, Space, Select, Flex } from "antd";

function ConstructionPage({ data }) {
  const code = data[1].map((item) => {
    return {
      aggregation: item[0],
      data: item[1],
      param: item[2],
    };
  });

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

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
                onChange={handleChange}
                options={optionsAggregation}
                style={{ width: 120 }}
              />
            </Flex>
            <Flex gap="middle">
              <div>Data</div>
              <Select
                key={`${index}-data`}
                defaultValue={item.data}
                onChange={handleChange}
                options={optionsData}
                style={{ width: 120 }}
              />
            </Flex>
            <Input
              key={`${index}-param`}
              addonBefore="param"
              defaultValue={item.param}
            />
          </>
        ))}
      </Space>
    </div>
  );
}

export default ConstructionPage;

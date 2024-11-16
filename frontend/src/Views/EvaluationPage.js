import { DatePicker, Space, Typography } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function EvaluationPage({ data, stock, onUpdateParam }) {
  const param = data[1][2][1];
  const startDate = param[1];
  const endDate = param[2];

  return (
    <Space direction="vertical">
      <Typography.Title level={5}>Backtesting Period</Typography.Title>
      <RangePicker
        defaultValue={[
          // dayjs(stock["data"][0][0], dateFormat),
          // dayjs(stock["data"][stock["data"].length - 1][0], dateFormat),
          dayjs(startDate, dateFormat),
          dayjs(endDate, dateFormat),
        ]}
        onChange={(dates) => {
          data[1][2][1][1] = dates[0].format('YYYY-MM-DD');
          data[1][2][1][2] = dates[1].format('YYYY-MM-DD');
          onUpdateParam(data[1]);
        }}
      />
    </Space>
  );
}

export default EvaluationPage;

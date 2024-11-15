import { DatePicker, Space, Typography } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function EvaluationPage({ stock, onRangeChange }) {
  return (
    <Space direction="vertical">
      <Typography.Title level={5}>Backtesting Period</Typography.Title>
      <RangePicker
        defaultValue={[
          dayjs(stock["data"][0][0], dateFormat),
          dayjs(stock["data"][stock["data"].length - 1][0], dateFormat),
        ]}
        onChange={(dates) => {
          onRangeChange([dates[0].format('YYYY-MM-DD'),dates[1].format('YYYY-MM-DD')]);
        }}
      />
    </Space>
  );
}

export default EvaluationPage;

import React, { useRef } from "react";
import { Table } from "antd";
import * as d3 from "d3";

const IndicatorsTable = ({ indicators }) => {
  console.log(indicators);
  const lineChartRef = useRef([]);

  // 画图函数
//   const drawLineChart = (data, index) => {
//     const svg = d3
//       .select(lineChartRef.current[index])
//       .attr("width", 200)
//       .attr("height", 100)
//       .style("border", "1px solid #ccc");

//     const margin = { top: 10, right: 30, bottom: 30, left: 40 };
//     const width = 200 - margin.left - margin.right;
//     const height = 100 - margin.top - margin.bottom;

//     // 处理数据
//     const x = d3
//       .scaleLinear()
//       .domain([0, data.length - 1])
//       .range([0, width]);
//     const y = d3
//       .scaleLinear()
//       .domain([d3.min(data), d3.max(data)])
//       .range([height, 0]);

//     // 创建line生成器
//     const line = d3
//       .line()
//       .x((d, i) => x(i))
//       .y((d) => y(d))
//       .curve(d3.curveMonotoneX);

//     // 清空之前的图形
//     svg.selectAll("*").remove();

//     // 绘制线条
//     svg
//       .append("g")
//       .append("path")
//       .data([data])
//       .attr("fill", "none")
//       .attr("stroke", "rgb(75, 192, 192)")
//       .attr("stroke-width", 2)
//       .attr("d", line);

//     // 添加X轴
//     svg
//       .append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(d3.axisBottom(x).ticks(5));

//     // 添加Y轴
//     svg.append("g").call(d3.axisLeft(y).ticks(5));
//   };

  // 格式化数据
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total Trades",
      dataIndex: "totalTrades",
      key: "totalTrades",
    },
    {
      title: "Success Rate",
      dataIndex: "successRate",
      key: "successRate",
      render: (successRate) => `${(successRate * 100).toFixed(2)}%`,
    },
    {
      title: "Average Return",
      dataIndex: "avgReturn",
      key: "avgReturn",
      render: (avgReturn) => `${(avgReturn * 100).toFixed(2)}%`,
    },
    {
      title: "Total Profit",
      dataIndex: "totalProfit",
      key: "totalProfit",
      render: (totalProfit) => totalProfit.toFixed(4),
    },
    // {
    //   title: "Profit Chart",
    //   dataIndex: "chart",
    //   key: "chart",
    //   render: (chartData, record, index) => (
    //     <div ref={(el) => (lineChartRef.current[index] = el)} />
    //   ),
    // },
  ];

  const data = indicators.map((indicator, index) => {
    const successCount = indicator.success.filter((s) => s === 1).length;
    const successRate = successCount / indicator.success.length;
    const avgReturn =
      indicator.singlereturn.reduce((sum, value) => sum + value, 0) /
      indicator.singlereturn.length;
    const totalProfit = indicator.totalprofit[indicator.totalprofit.length - 1];

    // 画图
    // drawLineChart(indicator.totalprofit, index);

    return {
      key: indicator.name,
      name: indicator.name,
      totalTrades: indicator.success.length,
      successRate: successRate,
      avgReturn: avgReturn,
      totalProfit: totalProfit,
    //   chart: indicator.totalprofit,
    };
  });

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default IndicatorsTable;

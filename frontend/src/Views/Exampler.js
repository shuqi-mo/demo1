import { useEffect, useRef } from "react";
import _ from "lodash";
import * as d3 from "d3";

const width = 600;
const height = 400;
const margin = { top: 20, right: 30, bottom: 110, left: 80 };

function Exampler({ data }) {
  const d3Node = useRef(null);
  const getSvg = () => d3.select(d3Node.current);
  const checkElementExist = (element) => {
    if (element) {
      element.remove();
    }
  };

  useEffect(() => {
    checkElementExist(getSvg().selectAll("svg"));
    let svg = getSvg()
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // 定义X轴和Y轴的比例尺
    var x = d3
      .scaleLinear()
      .domain([0, data[0].length - 1])
      .range([0, width - margin.right - margin.left]);
    var y = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([height - margin.top - margin.bottom, 0]);

    let g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 添加X轴
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // 添加Y轴
    // g.append("g").call(d3.axisLeft(y));

    // 定义颜色比例尺
    var color = d3.scaleOrdinal(d3.schemeCategory10); // 使用D3的预定义颜色方案

    // 绘制折线
    var line = d3
      .line()
      .x(function (d, i) {
        return x(i);
      })
      .y(function (d) {
        return y(d);
      });

    // 为每组数据添加一条折线
    g.selectAll(".line")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", function (d, i) {
        return color(i);
      }) // 为每条线设置颜色
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // 添加外框
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("stroke", "black"); // 外框颜色设置为黑色
  }, []);

  return (
    <div>
      <div ref={d3Node} />
    </div>
  );
}

export default Exampler;

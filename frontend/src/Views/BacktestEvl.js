import { useEffect, useRef } from "react";
import * as d3 from "d3";

const width = 450;
const height = 250;
const margin = { top: 20, right: 30, bottom: 110, left: 80 };

function BacktestEvl({ res }) {
  // console.log(res);
  const d3Node = useRef(null);
  const getSvg = () => d3.select(d3Node.current);
  const checkElementExist = (element) => {
    if (element) {
      element.remove();
    }
  };

  useEffect(() => {
    const data = res[1];
    checkElementExist(getSvg().selectAll("svg"));
    let svg = getSvg()
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // 定义X轴和Y轴的比例尺
    var x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width - margin.right - margin.left]);
    var y = d3
      .scaleLinear()
      .domain([d3.min(data), d3.max(data)])
      .range([height - margin.top - margin.bottom, 0]);

    let g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 添加X轴
    g.append("g")
      .attr(
        "transform",
        "translate(0," + (height - margin.top - margin.bottom) + ")"
      )
      .call(d3.axisBottom(x));

    // 添加Y轴
    g.append("g").call(d3.axisLeft(y));

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
      .data([data])
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  }, [res]);

  return (
    <div>
      <div>transaction times: {res[0].length}</div>
      <div>success times: {res[0].reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</div>
      <div ref={d3Node} />
    </div>
  );
}

export default BacktestEvl;

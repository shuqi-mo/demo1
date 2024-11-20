import { useEffect, useRef } from "react";
import * as d3 from "d3";

function Upset() {
  // console.log(res);
  const d3Node = useRef(null);
  const getSvg = () => d3.select(d3Node.current);
  const checkElementExist = (element) => {
    if (element) {
      element.remove();
    }
  };

  // format intersection data
  const formatIntersectionData = (data) => {
    // compiling solo set data - how many values per set
    const soloSets = [];

    // nameStr is for the setName, which makes it easy to compile
    // each name would be A, then B, so on..
    const nameStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".substr(0, data.length);
    data.forEach((x, i) => {
      soloSets.push({
        name: x.name,
        setName: nameStr.substr(i, 1),
        num: x.values.length,
        values: x.values,
      });
    });

    // compiling list of intersection names recursively
    // ["A", "AB", "ABC", ...]
    const getIntNames = (start, end, nameStr) => {
      // eg. BCD
      const name = nameStr.substring(start, end);

      // when reaching the last letter
      if (name.length === 1) {
        return [name];
      }
      const retArr = getIntNames(start + 1, end, nameStr);

      // eg. for name = BCD, would return [B] + [BC,BCD,BD] + [C,CD,D]
      return [name[0]].concat(
        retArr.map((x) => name[0] + x),
        retArr
      );
    };

    let intNames = getIntNames(0, nameStr.length, nameStr);

    // removing solo names
    intNames = intNames.filter((x) => x.length !== 1);

    let intersections = [];

    // compile intersections of values for each intersection name
    intNames.forEach((intName) => {
      // collecting all values: [pub1arr, pub2arr, ...]
      const values = intName
        .split("")
        .map((set) => soloSets.find((x) => x.setName === set).values);

      // getting intersection
      // https://stackoverflow.com/questions/37320296/how-to-calculate-intersection-of-multiple-arrays-in-javascript-and-what-does-e
      const result = values.reduce((a, b) => a.filter((c) => b.includes(c)));
      intersections.push({
        name: intName
          .split("")
          .map((set) => soloSets.find((x) => x.setName === set).name)
          .join(" + "),
        setName: intName,
        num: result.length,
        values: result,
      });
    });

    // taking out all 0s
    intersections = intersections.filter((x) => x.value !== 0);
    return { intersections, soloSets };
  };

  // include solo sets with all its data
  const insertSoloDataAll = (intersections, soloSets) => {
    soloSets.forEach((x) => {
      intersections.push(x);
    });
    return intersections;
  };

  // include solo sets with only the values that ARE NOT in other sets
  const insertSoloDataOutersect = (intersections, soloSets) => {
    soloSets.forEach((x) => {
      // compile all unique values from other sets except current set
      const otherSets = [
        ...new Set(
          soloSets.map((y) => (y.setName === x.setName ? [] : y.values)).flat()
        ),
      ];

      // subtract otherSets values from current set values
      const values = x.values.filter((y) => !otherSets.includes(y));
      intersections.push({
        name: x.name,
        setName: x.setName,
        num: values.length,
        values: values,
      });
    });
    return intersections;
  };

  const raw = [
    {
      name: "set1",
      values: ["a", "b", "c", "d"],
    },
    {
      name: "set2",
      values: ["a", "b", "c", "d", "e", "f"],
    },
    {
      name: "set3",
      values: ["a", "b", "g", "h", "i"],
    },
    {
      name: "set4",
      values: ["a", "i", "j", "c", "d"],
    },
  ];

  // calculating intersections WITHOUT solo sets
  const { intersections, soloSets } = formatIntersectionData(raw);

  // putting the solo sets in:
  // to include solo sets with all its data, call this function
  // const allData = insertSoloDataAll(intersections, soloSets);

  // to include solo sets with only the values that ARE NOT in other sets
  // ie. the outersect of values in the solo sets, call this function
  const data = insertSoloDataOutersect(intersections, soloSets);

  //   console.log(data);

  useEffect(() => {
    checkElementExist(getSvg().selectAll("svg"));
    // all sets
    const allSetNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .substr(0, soloSets.length)
      .split("");

    // position and dimensions
    const margin = {
      top: 20,
      right: 0,
      bottom: 300,
      left: 150,
    };
    const width = 40 * data.length;
    const height = 400;

    // make the canvas
    let svg = getSvg()
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height*1.5]);

    // make a group for the upset circle intersection things
    const upsetCircles = svg
      .append("g")
      .attr("id", "upsetCircles")
      .attr("transform", `translate(20,${height + 40})`);

    const rad = 13;

    // making dataset labels
    soloSets.forEach((x, i) => {
      upsetCircles
        .append("text")
        .attr("dx", -30)
        .attr("dy", 5 + i * (rad * 2.7))
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .style("font-size", 15)
        .text(x.name);
    });

    // sort data decreasing
    data.sort((a, b) => parseFloat(b.num) - parseFloat(a.num));

    // make the bars
    const upsetBars = svg.append("g").attr("id", "upsetBars");

    const nums = data.map((x) => x.num);

    // set range for data by domain, and scale by range
    const xrange = d3.scaleLinear().domain([0, nums.length]).range([0, width]);

    const yrange = d3
      .scaleLinear()
      .domain([0, d3.max(nums)])
      .range([height, 0]);

    // set axes for graph
    const xAxis = d3
      .axisBottom()
      .scale(xrange)
      .tickPadding(2)
      .tickFormat((d, i) => data[i].setName)
      .tickValues(d3.range(data.length));

    const yAxis = d3.axisLeft().scale(yrange).tickSize(5);

    // add X axis
    upsetBars
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .call(xAxis)
      .selectAll(".tick")
      .remove();

    // Add the Y Axis
    upsetBars
      .append("g")
      .attr("class", "y axis")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .call(yAxis)
      .selectAll("text")
      .attr("fill", "black")
      .attr("stroke", "none");

    const chart = upsetBars
      .append("g")
      .attr("transform", "translate(1,0)")
      .attr("id", "chart");

    // adding each bar
    const bars = chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", 20)
      .attr("x", (d, i) => 9 + i * (rad * 2.7))
      .attr("y", (d) => yrange(d.num))
      .style("fill", "#02577b")
      .attr("height", (d) => height - yrange(d.num));

    // circles
    data.forEach((x, i) => {
      allSetNames.forEach((y, j) => {
        upsetCircles
          .append("circle")
          .attr("cx", i * (rad * 2.7))
          .attr("cy", j * (rad * 2.7))
          .attr("r", rad)
          .attr("class", `set-${x.setName}`)
          .style("opacity", 1)
          .attr("fill", () => {
            if (x.setName.indexOf(y) !== -1) {
              return "#02577b";
            }
            return "silver";
          });
      });

      upsetCircles
        .append("line")
        .attr("id", `setline${i}`)
        .attr("x1", i * (rad * 2.7))
        .attr("y1", allSetNames.indexOf(x.setName[0]) * (rad * 2.7))
        .attr("x2", i * (rad * 2.7))
        .attr(
          "y2",
          allSetNames.indexOf(x.setName[x.setName.length - 1]) * (rad * 2.7)
        )
        .style("stroke", "#02577b")
        .attr("stroke-width", 4);
    });

    // tooltip
    const tooltip = svg
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "white")
      .style("padding", "0px 10px")
      .style("background", "#02577b")
      .style("border-radius", "12px")
      .text("hehe"); // it changes, don't worry

    // bars
    //   .on("mouseover", (d) => {
    //     tooltip
    //       .text(`${d.name}: ${d.num} value${d.num === 1 ? "" : "s"}`)
    //       .style("visibility", "visible");
    //   })
    //   //   .on("mousemove", () => {
    //   //     tooltip
    //   //       .style("top", `${d3.event.pageY - 20}px`)
    //   //       .style("left", `${d3.event.pageX + 20}px`);
    //   //   })
    //   .on("mouseout", () => {
    //     tooltip.style("visibility", "hidden");
    //   });
  }, []);

  return (
    <div>
      <div ref={d3Node} />
    </div>
  );
}

export default Upset;

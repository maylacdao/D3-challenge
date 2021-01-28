//Specify initial svg size
var svgWidth = 960;
var svgHeight = 650;

//Set margins
var margin = {
    top: 20,
    right: 40,
    bottom: 200,
    left: 100
};


var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;


let chart = d3.select("#scatter")
                .append("div")
                .classed("chart", true);

let svg = chart.append("svg")
                .attr("width", svgWidth)
                .att("height", svgHeight);

let chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);


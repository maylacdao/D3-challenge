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


var chart = d3.select("#scatter")
                .append("div")
                .classed("chart", true);

var svg = chart.append("svg")
                .attr("width", svgWidth)
                .att("height", svgHeight);

var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var initXAxis = "poverty";
var initYAxis = "healthcare";

function xScale(censusData, initXAxis) {
    var xLinearScale = d3.scaleLinear()
                            .domain([d3.min(censusData, d => d[initXAxis]) * 0.8,
                                d3.max(censusData, d => d[initXAxis]) * 1.2])
                            .range([0, width]);
    
    return xLinearScale;
}

function yScale(censusData, initYAxis) {
    
}


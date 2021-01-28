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


let chart = d3.select
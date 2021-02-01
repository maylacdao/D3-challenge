//Specifiy initial width and height
var svgWidth = 960;
var svgHeight = 620;

//Set margins
var margin = {
  top: 20, 
  right: 40, 
  bottom: 150,
  left: 150
};

//Specify final chart area
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

//Create chart variable
var chart = d3.select("#scatter")
  .append("div")
  .classed("chart", true);

var svg = chart.append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
  
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

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[initYAxis]) * 0.8,
      d3.max(censusData, d => d[initYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}


function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return xAxis;
}


function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}


function renderCircles(circlesGroup, newXScale, initXAxis, newYScale, initYAxis) {

    circlesGroup.transition()
      .duration(2000)
      .attr("cx", data => newXScale(data[initXAxis]))
      .attr("cy", data => newYScale(data[initYAxis]))

    return circlesGroup;
}


function renderText(textGroup, newXScale, initXAxis, newYScale, initYAxis) {

    textGroup.transition()
      .duration(2000)
      .attr("x", d => newXScale(d[initXAxis]))
      .attr("y", d => newYScale(d[initYAxis]));

    return textGroup
}

function styleX(value, initXAxis) {

    
    if (initXAxis === "poverty") {
        return `${value}%`;
    }
    
    else if (initXAxis === "income") {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}


function updateToolTip(initXAxis, initYAxis, circlesGroup) {

    
    if (initXAxis === "poverty") {
      var xLabel = "Poverty:";
    }
    
    else if (initXAxis === "income"){
      var xLabel = "Median Income:";
    }
    
    else {
      var xLabel = "Age:";
    }

  if (initYAxis ==="healthcare") {
    var yLabel = "No Healthcare:"
  }
  else if(initYAxis === "obesity") {
    var yLabel = "Obesity:";
  }

  else{
    var yLabel = "Smokers:";
  }

  
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
        return (`${d.state}<br>${xLabel} ${styleX(d[initXAxis], initXAxis)}<br>${yLabel} ${d[initYAxis]}%`);
  });

  circlesGroup.call(toolTip);

 
  circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
}

d3.csv("./assets/data/data.csv").then(function(censusData) {

    console.log(censusData);
    
  
    censusData.forEach(function(data){
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

   
    var xLinearScale = xScale(censusData, initXAxis);
    var yLinearScale = yScale(censusData, initYAxis);

    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

 
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      
      .call(leftAxis);
    
    
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .classed("stateCircle", true)
      .attr("cx", d => xLinearScale(d[initXAxis]))
      .attr("cy", d => yLinearScale(d[initYAxis]))
      .attr("r", 16)
      .attr("opacity", ".8");

    
    var textGroup = chartGroup.selectAll(".stateText")
      .data(censusData)
      .enter()
      .append("text")
      .classed("stateText", true)
      .attr("x", d => xLinearScale(d[initXAxis]))
      .attr("y", d => yLinearScale(d[initYAxis]))
      .attr("dy", 3)
      .attr("font-size", "10px")
      .text(function(d){return d.abbr});

   
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 10 + margin.top})`);

    var povertyLabel = xLabelsGroup.append("text")
      .classed("aText", true)
      .classed("active", true)
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty")
      .text("IN POVERTY (%)");
      
    var ageLabel = xLabelsGroup.append("text")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age")
      .text("MEDIAN AGE");  

    var incomeLabel = xLabelsGroup.append("text")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income")
      .text("MEDIAN HOUSEHOLD INCOME")

    
    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${0 - margin.left/4}, ${height/2})`);

    var healthcareLabel = yLabelsGroup.append("text")
      .classed("aText", true)
      .classed("active", true)
      .attr("x", 0)
      .attr("y", 0 - 20)
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .attr("value", "healthcare")
      .text("LACKS HEALTHCARE (%)");
    
    var smokesLabel = yLabelsGroup.append("text")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("x", 0)
      .attr("y", 0 - 40)
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .attr("value", "smokes")
      .text("SMOKER (%)");
    
    var obesityLabel = yLabelsGroup.append("text")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("x", 0)
      .attr("y", 0 - 60)
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .attr("value", "obesity")
      .text("OBESE (%)");
    
    
    var circlesGroup = updateToolTip(initXAxis, initYAxis, circlesGroup);

    
    xLabelsGroup.selectAll("text")
      .on("click", function() {
        var value = d3.select(this).attr("value");

        if (value != initXAxis) {

          
          initXAxis = value; 

         
          xLinearScale = xScale(censusData, initXAxis);

          
          xAxis = renderXAxis(xLinearScale, xAxis);

          
          circlesGroup = renderCircles(circlesGroup, xLinearScale, initXAxis, yLinearScale, initYAxis);

          
          textGroup = renderText(textGroup, xLinearScale, initXAxis, yLinearScale, initYAxis);

         
          circlesGroup = updateToolTip(initXAxis, initYAxis, circlesGroup);


          if (initXAxis === "poverty") {
            povertyLabel.classed("active", true).classed("inactive", false);
            ageLabel.classed("active", false).classed("inactive", true);
            incomeLabel.classed("active", false).classed("inactive", true);
          }
          else if (initXAxis === "age") {
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", true).classed("inactive", false);
            incomeLabel.classed("active", false).classed("inactive", true);
          }
          else {
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", false).classed("inactive", true);
            incomeLabel.classed("active", true).classed("inactive", false);
          }
        }
      });

    yLabelsGroup.selectAll("text")
      .on("click", function() {
        var value = d3.select(this).attr("value");

        if(value !=initYAxis) {

            initYAxis = value;


            yLinearScale = yScale(censusData, initYAxis);


            yAxis = renderYAxis(yLinearScale, yAxis);


            circlesGroup = renderCircles(circlesGroup, xLinearScale, initXAxis, yLinearScale, initYAxis);


            textGroup = renderText(textGroup, xLinearScale, initXAxis, yLinearScale, initYAxis);


            circlesGroup = updateToolTip(initXAxis, initYAxis, circlesGroup);

            if (initYAxis === "obesity") {
              obesityLabel.classed("active", true).classed("inactive", false);
              smokesLabel.classed("active", false).classed("inactive", true);
              healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else if (initYAxis === "smokes") {
              obesityLabel.classed("active", false).classed("inactive", true);
              smokesLabel.classed("active", true).classed("inactive", false);
              healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else {
              obesityLabel.classed("active", false).classed("inactive", true);
              smokesLabel.classed("active", false).classed("inactive", true);
              healthcareLabel.classed("active", true).classed("inactive", false);
            }
          }
        });
});  

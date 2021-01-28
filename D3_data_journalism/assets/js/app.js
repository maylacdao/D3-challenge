
var svgWidth = 960;
var svgHeight = 620;

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
  .attr("height", svgHeight);
  
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial parameters; x and y axis
var initXAxis = "poverty";
var initYAxis = "healthcare";

//a function for updating the x-scale variable upon click of label
function xScale(censusData, initXAxis) {
    //scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[initXAxis]) * 0.8,
        d3.max(censusData, d => d[initXAxis]) * 1.2])
      .range([0, width]);

    return xLinearScale;
}
//a function for updating y-scale variable upon click of label
function yScale(censusData, initYAxis) {
  //scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[initYAxis]) * 0.8,
      d3.max(censusData, d => d[initYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}
//a function for updating the xAxis upon click
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return xAxis;
}

//function used for updating yAxis variable upon click
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}

//a function for updating the circles with a transition to new circles 
function renderCircles(circlesGroup, newXScale, initXAxis, newYScale, initYAxis) {

    circlesGroup.transition()
      .duration(2000)
      .attr("cx", data => newXScale(data[initXAxis]))
      .attr("cy", data => newYScale(data[initYAxis]))

    return circlesGroup;
}

//function for updating STATE labels
function renderText(textGroup, newXScale, initXAxis, newYScale, initYAxis) {

    textGroup.transition()
      .duration(2000)
      .attr("x", d => newXScale(d[initXAxis]))
      .attr("y", d => newYScale(d[initYAxis]));

    return textGroup
}
//function to stylize x-axis values for tooltips
function styleX(value, initXAxis) {

    //style based on variable
    //poverty
    if (initXAxis === "poverty") {
        return `${value}%`;
    }
    //household income
    else if (initXAxis === "income") {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}

//funtion for updating circles group
function updateToolTip(initXAxis, initYAxis, circlesGroup) {

    //poverty
    if (initXAxis === "poverty") {
      var xLabel = "Poverty:";
    }
    //income
    else if (initXAxis === "income"){
      var xLabel = "Median Income:";
    }
    //age
    else {
      var xLabel = "Age:";
    }
//Y label
  //healthcare
  if (initYAxis ==="healthcare") {
    var yLabel = "No Healthcare:"
  }
  else if(initYAxis === "obesity") {
    var yLabel = "Obesity:";
  }
  //smoking
  else{
    var yLabel = "Smokers:";
  }

  //create tooltip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
        return (`${d.state}<br>${xLabel} ${styleX(d[initXAxis], initXAxis)}<br>${yLabel} ${d[initYAxis]}%`);
  });

  circlesGroup.call(toolTip);

  //add
  circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
}
//retrieve data
d3.csv("./assets/data/data.csv").then(function(censusData) {

    console.log(censusData);
    
    //Parse data
    censusData.forEach(function(data){
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //create linear scales
    var xLinearScale = xScale(censusData, initXAxis);
    var yLinearScale = yScale(censusData, initYAxis);

    //create x axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append X
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    //append Y
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      //.attr
      .call(leftAxis);
    
    //append Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .classed("stateCircle", true)
      .attr("cx", d => xLinearScale(d[initXAxis]))
      .attr("cy", d => yLinearScale(d[initYAxis]))
      .attr("r", 14)
      .attr("opacity", ".5");

    //append Initial Text
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

    //create a group for the x axis labels
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 10 + margin.top})`);

    var povertyLabel = xLabelsGroup.append("text")
      .classed("aText", true)
      .classed("active", true)
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty")
      .text("In Poverty (%)");
      
    var ageLabel = xLabelsGroup.append("text")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age")
      .text("Age (Median)");  

    var incomeLabel = xLabelsGroup.append("text")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income")
      .text("Household Income (Median)")

    //create a group for Y labels
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
      .text("Without Healthcare (%)");
    
    var smokesLabel = yLabelsGroup.append("text")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("x", 0)
      .attr("y", 0 - 40)
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .attr("value", "smokes")
      .text("Smoker (%)");
    
    var obesityLabel = yLabelsGroup.append("text")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("x", 0)
      .attr("y", 0 - 60)
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .attr("value", "obesity")
      .text("Obese (%)");
    
    //update the toolTip
    var circlesGroup = updateToolTip(initXAxis, initYAxis, circlesGroup);

    //x axis event listener
    xLabelsGroup.selectAll("text")
      .on("click", function() {
        var value = d3.select(this).attr("value");

        if (value != initXAxis) {

          //replace chosen x with a value
          initXAxis = value; 

          //update x for new data
          xLinearScale = xScale(censusData, initXAxis);

          //update x 
          xAxis = renderXAxis(xLinearScale, xAxis);

          //upate circles with a new x value
          circlesGroup = renderCircles(circlesGroup, xLinearScale, initXAxis, yLinearScale, initYAxis);

          //update text 
          textGroup = renderText(textGroup, xLinearScale, initXAxis, yLinearScale, initYAxis);

          //update tooltip
          circlesGroup = updateToolTip(initXAxis, initYAxis, circlesGroup);

          //change of classes changes text
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
    //y axis lables event listener
    yLabelsGroup.selectAll("text")
      .on("click", function() {
        var value = d3.select(this).attr("value");

        if(value !=initYAxis) {
            //replace chosenY with value  
            initYAxis = value;

            //update Y scale
            yLinearScale = yScale(censusData, initYAxis);

            //update Y axis 
            yAxis = renderYAxis(yLinearScale, yAxis);

            //Udate CIRCLES with new y
            circlesGroup = renderCircles(circlesGroup, xLinearScale, initXAxis, yLinearScale, initYAxis);

            //update TEXT with new Y values
            textGroup = renderText(textGroup, xLinearScale, initXAxis, yLinearScale, initYAxis);

            //update tooltips
            circlesGroup = updateToolTip(initXAxis, initYAxis, circlesGroup);

            //Change of the classes changes text
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

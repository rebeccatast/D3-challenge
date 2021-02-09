function makeResponsive() {

    let svgWidth = 960;
    let svgHeight = 500;

    let margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 100
    };

    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;

    // Create the SVG wrapper, then append the svg group with its size attributes
    let svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    let chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let chosenXAxis = 'poverty';
    let chosenYAxis = 'healthcare';

    function xScale(riskData, chosenXAxis) {
        let xLinearScale = d3.scaleLinear()
            .domain([d3.min(riskData, d => d[chosenXAxis]) * 0.8,
            d3.max(riskData, d => d[chosenXAxis]) * 1.2])
            .range([0, width]);
        return xLinearScale;
    }
    //Import Data from data.csv file
    //d3.csv("assets/data/data.csv")
    //.then(function(riskData){

    //Get data from data.csv file and turn strings into integers if needed
    //riskData.forEach(function(data) {
    // data.age = +data.age;
    // data.smokes = +data.smokes;
    //data.healthcare = +data.healthcare;
    //data.poverty = +data.poverty;
    //data.abbr = data.abbr;
    //data.income = +data.income;
    // });

    function yScale(riskData, chosenYAxis) {
        let yLinearScale = d3.scaleLinear()
            .domain([d3.min(riskData, d => d[chosenYAxis]) * 0.8,
            d3.max(riskData, d => d[chosenYAxis]) * 1.2])
            .range([height, 0]);
        return yLinearScale;
    }

    function renderXAxes(newXScale, xAxis) {
        let bottomAxis = d3.axisBottom(newXScale);
        xAxis.transition()
            .duration(2000)
            .call(bottomAxis);
        return xAxis;
    }

    function renderYAxes(newYScale, YAxis) {
        let leftAxis = d3.axisLeft(newYScale);
        yAxis.transition()
            .duration(2000)
            .call(leftAxis);
        return yAxis;
    }

    function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        circlesGroup.transition()
            .duration(2000)
            .attr('cx', data => newXScale(data[chosenXAxis]))
            .attr('cy', data => newYScale(data[chosenYAxis]))
        return circlesGroup;
    }
    //function for updating STATE labels
    function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        textGroup.transition()
            .duration(2000)
            .attr('x', d => newXScale(d[chosenXAxis]))
            .attr('y', d => newYScale(d[chosenYAxis]));
        return textGroup
    }

    //function to stylize x-axis values for tooltips
    function styleX(value, chosenXAxis) {
        //style based on variable
        //poverty
        if (chosenXAxis === 'poverty') {
            return `${value}%`;
        }
        //household income
        else if (chosenXAxis === 'income') {
            return `${value}`;
        }
        else {
            return `${value}`;
        }
    }

    //funtion for updating circles group
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
        //poverty
        if (chosenXAxis === 'poverty') {
            var xLabel = 'Poverty:';
        }
        //income
        else if (chosenXAxis === 'income') {
            var xLabel = 'Median Income:';
        }
        //age
        else {
            var xLabel = 'Age:';
        }
        //Y label
        //healthcare
        if (chosenYAxis === 'healthcare') {
            var yLabel = "No Healthcare:"
        }
        else if (chosenYAxis === 'obesity') {
            var yLabel = 'Obesity:';
        }
        //smoking
        else {
            var yLabel = 'Smokers:';
        }

        var toolTip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-8, 0])
            .html(function (d) {
                return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
            });
        circlesGroup.call(toolTip);
        //add
        circlesGroup.on('mouseover', toolTip.show)
            .on('mouseout', toolTip.hide);
        return circlesGroup;
    }

    //Import Data from data.csv file
    d3.csv("assets/data/data.csv")
        .then(function (riskData) {
            console.log(riskData);

            //Get data from data.csv file and turn strings into integers if needed
            riskData.forEach(function (data) {
                data.age = +data.age;
                data.smokes = +data.smokes;
                data.healthcare = +data.healthcare;
                data.poverty = +data.poverty;
                data.abbr = data.abbr;
                data.income = +data.income;
                data.obesity = +data.obesity;
            });

            var xLinearScale = xScale(riskData, choosenXAxis);
            var yLinearScale = yScale(riskData, chosenYAxis);


            //Create axis
            let bottomAxis = d3.axisBottom(xLinearScale);
            let leftAxis = d3.axisLeft(yLinearScale);
            var xAxis = chartGroup.append("g")
                .classed('x-axis', true)
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);

            var yAxis = chartGroup.append("g")
                .classed('y-axis', true)
                .call(leftAxis);

            //Make Circles
            let circlesGroup = chartGroup.selectAll("circle")
                .data(riskData)
                .enter()
                .append("circle")
                .attr("cx", d => xLinearScale(d.poverty))
                .attr("cy", d => yLinearScale(d.healthcare))
                .attr("r", 10)
                .attr("fill", "lightblue")
                .attr("opacity", ".6")
                .attr("stroke-width", "1")
                .attr("stroke", "black");

            var textGroup = chartGroup.select("g")
                .selectAll("circle")
                .data(riskData)
                .enter()
                .append("text")
                .text(d => d.abbr)
                .attr("x", d => xLinearScale(d.poverty))
                .attr("y", d => yLinearScale(d.healthcare))
                .attr("dy", -395)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "black")
                .text(function (d) { return d.abbr });
            console.log(riskData)

            var xLabelsGroup = chartGroup.append('g')
                .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

            var povertyLabel = xLabelsGroup.append('text')
                .classed('aText', true)
                .classed('active', true)
                .attr('x', 0)
                .attr('y', 20)
                .attr('value', 'poverty')
                .text('In Poverty (%)');
            var ageLabel = xLabelsGroup.append('text')
                .classed('aText', true)
                .classed('inactive', true)
                .attr('x', 0)
                .attr('y', 40)
                .attr('value', 'age')
                .text('Age (Median)');
            var incomeLabel = xLabelsGroup.append('text')
                .classed('aText', true)
                .classed('inactive', true)
                .attr('x', 0)
                .attr('y', 60)
                .attr('value', 'income')
                .text('Household Income (Median)');

            var yLabelsGroup = chartGroup.append('g')
                .attr('transform', `translate(${0 - margin.left / 4}, ${height / 2})`);

            var healthcareLabel = yLabelsGroup.append('text')
                .classed('aText', true)
                .classed('active', true)
                .attr('x', 0)
                .attr('y', 0 - 20)
                .attr('dy', '1em')
                .attr('transform', 'rotate(-90)')
                .attr('value', 'healthcare')
                .text('Lacks Healthcare(%)');
            var smokesLabel = yLabelsGroup.append('text')
                .classed('aText', true)
                .classed('inactive', true)
                .attr('x', 0)
                .attr('y', 0 - 40)
                .attr('dy', '1em')
                .attr('transform', 'rotate(-90)')
                .attr('value', 'smokes')
                .text('Smokes (%)');
            var obesityLabel = yLabelsGroup.append('text')
                .classed('aText', true)
                .classed('inactive', true)
                .attr('x', 0)
                .attr('y', 0 - 60)
                .attr('dy', '1em')
                .attr('transform', 'rotate(-90)')
                .attr('value', 'obesity')
                .text('Obesity (%)');

            var circlesGroup = updateToolTip(choosenXAxis, choosenYAxis, circlesGroups);

            //x axis event listener
            xLabelsGroup.selectAll('text')
                .on('click', function () {
                    var value = d3.select(this).attr('value');
                    if (value != chosenXAxis) {
                        //replace chosen x with a value
                        chosenXAxis = value;
                        //update x for new data
                        xLinearScale = xScale(riskData, chosenXAxis);
                        //update x
                        xAxis = renderXAxis(xLinearScale, xAxis);
                        //upate circles with a new x value
                        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                        //update text
                        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                        //update tooltip
                        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                        //change of classes changes text
                        if (chosenXAxis === 'poverty') {
                            povertyLabel.classed('active', true).classed('inactive', false);
                            ageLabel.classed('active', false).classed('inactive', true);
                            incomeLabel.classed('active', false).classed('inactive', true);
                        }
                        else if (chosenXAxis === 'age') {
                            povertyLabel.classed('active', false).classed('inactive', true);
                            ageLabel.classed('active', true).classed('inactive', false);
                            incomeLabel.classed('active', false).classed('inactive', true);
                        }
                        else {
                            povertyLabel.classed('active', false).classed('inactive', true);
                            ageLabel.classed('active', false).classed('inactive', true);
                            incomeLabel.classed('active', true).classed('inactive', false);
                        }

                    }
                });
            //y axis lables event listener
            yLabelsGroup.selectAll('text')
                .on('click', function () {
                    var value = d3.select(this).attr('value');
                    if (value != chosenYAxis) {
                        //replace chosenY with value
                        chosenYAxis = value;
                        //update Y scale
                        yLinearScale = yScale(riskData, chosenYAxis);
                        //update Y axis
                        yAxis = renderYAxis(yLinearScale, yAxis);
                        //Udate CIRCLES with new y
                        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                        //update TEXT with new Y values
                        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                        //update tooltips
                        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                        //Change of the classes changes text
                        if (chosenYAxis === 'obesity') {
                            obesityLabel.classed('active', true).classed('inactive', false);
                            smokesLabel.classed('active', false).classed('inactive', true);
                            healthcareLabel.classed('active', false).classed('inactive', true);
                        }
                        else if (chosenYAxis === 'smokes') {
                            obesityLabel.classed('active', false).classed('inactive', true);
                            smokesLabel.classed('active', true).classed('inactive', false);
                            healthcareLabel.classed('active', false).classed('inactive', true);
                        }
                        else {
                            obesityLabel.classed('active', false).classed('inactive', true);
                            smokesLabel.classed('active', false).classed('inactive', true);
                            healthcareLabel.classed('active', true).classed('inactive', false);
                        }
                    }
                });
        });


}
makeResponsive();

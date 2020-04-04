// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg_labor_force = d3
    .select(".chart_labor_force")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append an SVG group
var chart_labor_force = svg_labor_force.append("g");

// Append a div to the body to create tooltips, assign it a class
//d3.select(".chart2").append("div").attr("class", "tooltip").style("opacity", 0);

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv", function (err, myData) {
    if (err) throw err;

    myData.forEach(function (data) {
        data.obese = Number(data.obese);
        data.bachelorOrHigher = Number(data.bachelorOrHigher);
        data.currentSmoker = Number(data.currentSmoker);
    });

    console.log(myData);

    // Create scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);

    var xLinearScale = d3.scaleLinear().range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Variables store minimum and maximum values in a column in data.csv
    var xMin;
    var xMax;
    var yMax;

    // Function identifies the minimum and maximum values in a column in data.csv
    // and assigns them to xMin and xMax variables, which defines the axis domain
    function findMinAndMax(dataColumnX) {
        xMin = d3.min(myData, function (data) {
            return Number(data[dataColumnX]) * 0.8;
        });

        xMax = d3.max(myData, function (data) {
            return Number(data[dataColumnX]) * 1.1;
        });

        yMax = d3.max(myData, function (data) {
            return Number(data.bachelorOrHigher) * 1.1;
        });
    }

    // The default x-axis is 'obese'
    // Another axis can be assigned to the variable during an onclick event.
    var currentAxisLabelX = "obese";

    var currentAxisLabelY = "bachelorOrHigher";

    // writeAnalysis(currentAxisLabelX, currentAxisLabelY);

    // Call findMinAndMax() with default
    findMinAndMax(currentAxisLabelX);

    // Set domain of an axis to extend from min to max values of the data column
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([0, yMax]);


    // Initializes tooltip
    var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        // Define position
        .offset([80, -60])
        // The html() method allows mix of JS and HTML in callback function
        .html(function (data) {
            var itemName = data.state;
            var itemEdu = Number(data.bachelorOrHigher);
            var itemInfo = Number(data[currentAxisLabelX]);
            var itemString;

            // Define the tooltip text, depending on the current (active) axis
            if (currentAxisLabelX === "obese") {
                itemString = "Obese:";
            }

            if (currentAxisLabelY === "bachelorOrHigher") {
                eduString = "College Grad: ";
            } else {
                eduString = "HS Grad: ";
            }
            return itemName + "<br>" + eduString + itemEdu + "%<br>" + itemString + itemInfo + "%";
        });

    // Create tooltip
    chart_labor_force.call(toolTip);

    chart_labor_force
        .selectAll("circle")
        .data(myData)
        .enter()
        .append("circle")
        .attr("cx", function (data, index) {
            return xLinearScale(Number(data[currentAxisLabelX]));
        })
        .attr("cy", function (data, index) {
            return yLinearScale(Number(data.bachelorOrHigher));
        })
        .attr("r", "12")
        .attr("fill", "lightblue")
        // Both circle and text instances have mouseover & mouseout event handlers
        .on("mouseover", function (data) {
            toolTip.show(data)
        })
        .on("mouseout", function (data) {
            toolTip.hide(data)
        });

    chart_labor_force
        .selectAll("text")
        .data(myData)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("class", "stateText")
        .style("fill", "white")
        .style("font", "10px sans-serif")
        .style("font-weight", "bold")
        .text(function (data) {
            return data.abbr;
        })
        .on("mouseover", function (data) {
            toolTip.show(data)
        })
        .on("mouseout", function (data) {
            toolTip.hide(data)
        })
        .attr("x", function (data, index) {
            return xLinearScale(Number(data[currentAxisLabelX]));
        })
        .attr("y", function (data, index) {
            return yLinearScale(Number(data.bachelorOrHigher)) + 4;
        });


    // Append an SVG group for the x-axis, then display the x-axis
    chart_labor_force
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        // The class name assigned here will be used for transition effects
        .attr("class", "x-axis")
        .call(bottomAxis);

    // Append a group for y-axis, then display it
    chart_labor_force.append("g")
        .attr("class", "y-axis")
        .call(leftAxis);

    // Append y-axis label
    chart_labor_force
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text")
        .attr("data-axis-name", "bachelorOrHigher")
        .text("Bachelor's Degree or Greater");

    // Append x-axis labels
    chart_labor_force
        .append("text")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
        )
        // This axis label is active by default
        .attr("class", "axis-text active")
        .attr("data-axis-name", "obese")
        .text("Obese (BMI > 30)(%)");

    chart_labor_force
        .append("text")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
        )
        // This axis label is inactive by default
        .attr("class", "axis-text inactive")
        .attr("data-axis-name", "currentSmoker")
        .text("Current Smoker (%)");

});




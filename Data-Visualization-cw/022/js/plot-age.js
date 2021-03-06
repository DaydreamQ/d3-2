var svgWidth = 750;
var svgHeight = 400;

var margin = {top: 20, right: 40, bottom: 80, left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width - 150], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#ca0020","#f4a582","#d5d5d5","#92c5de"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select(".chart_age").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("final_data_age.csv", function(error, data) {
    if (error) throw error;


    var epiNames = d3.keys(data[0]).filter(function(key) { return key !== "level"; });

    data.forEach(function(d) {
        d.epi = epiNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(data.map(function(d) { return d.level; }));
    x1.domain(epiNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.epi, function(d) { return d.value; }); })]);

    // Append x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Append y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Residents");


    var level = svg.selectAll(".level")
        .data(data)
        .enter().append("g")
        .attr("class", "level")
        .attr("transform", function(d) { return "translate(" + x0(d.level) + ",0)"; });


    //对每一个矩形操作
    level.selectAll("rect")
        .data(function(d) { return d.epi; })
        .enter().append("rect").attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2))
                // Simple Browser Tool Tip
                .append("title").text(function(data){
                // Returns number of people ('000')
                return "Number of People: " + data.value;
            });

            //var title_name = ""
            // if(elementData == "less than high school"){
            //     title_name = "less than high school";
            // }else if(elementData.name == "high school"){
            //     title_name = "high school";
            // }else if(elementData.name == "some college"){
            //     title_name = "some college";
            // }else if(elementData.name == "bachelor or higher"){
            //     title_name = "bachelor or higher";
            // }

            // divTooltip.html(this.level+"<br>"+x1(this.name)+"<br>"+(this.value));
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", color(d.name));
        })
        .style("fill", function(d) {return color(d.name);
        });

    // Create legend
    var legend = svg.selectAll(".legend")
        .data(epiNames.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 50)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 60)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });




    // Initializes tooltip
    var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        // Define position
        .offset([80, -60])
        // The html() method allows mix of JS and HTML in callback function
        .html(function (d) {
            var itemName = x0(d.level);
            var itemEdu = x1(d.name);
            var itemInfo = Number(d[currentAxisLabelX]);
            //var itemString = '1...';
            // // Tooltip text depends on which axis is active
            // if (currentAxisLabelX === "obese") {
            //     itemString = "Obese: ";
            // } else {
            //     itemString = "Smoker: ";
            // }
            // if (currentAxisLabelY === "bachelorOrHigher") {
            //     eduString = "College Grad: ";
            // } else {
            //     eduString = "HS Grad: ";
            // }
            return itemName +
                "<br>" +
                eduString +
                itemEdu + "%<br>" +
                itemInfo + "%";
        });

    // Create tooltip
    level.call(toolTip);
   

    var divTooltip = d3.select(".level").append("div").attr("class", "toolTip");

    //This is for the interactive part
    level.on("mousemove", function(d){
        // var scoll = d.getScrollTop();
        divTooltip.style("left", d3.event.pageX + "px");
        divTooltip.style("top", d3.event.pageY + "px");
        //divTooltip.style("top", d3.event.pageY+"px");
        divTooltip.style("display", "inline-block");

        var x = d3.event.pageX;
        var y = d3.event.pageY;
        var elements = document.querySelectorAll(':hover');
        var l = elements.length;
        l = l-1;
        var elementData = elements[l].__data__;
        var title_name = "";

        // Define the tooltip text, depending on the current (active) axis
        if(elementData.name == "less than high school"){
            title_name = "less than high school";
        }else if(elementData.name == "high school"){
            title_name = "high school";
        }else if(elementData.name == "some college"){
            title_name = "some college";
        }else if(elementData.name == "bachelor or higher"){
            title_name = "bachelor or higher";
        }

        divTooltip.html((d.label)+"<br>"+title_name+"<br>"+elementData.value);
    });

    level.on("mouseout", function(d){
        divTooltip.style("display", "none");
    });
});
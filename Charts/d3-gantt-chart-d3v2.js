/**
 * @author Brijesh
 */

d3.gantt = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";

    var margin = {
        top: 20,
        right: 40,
        bottom: 20,
        left: 150
    };
    var timeDomainStart = d3.time.day.offset(new Date(), -3);
    var timeDomainEnd = d3.time.hour.offset(new Date(), +3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE; // fixed or fit
    var taskTypes = [];
    var taskStatus = [];
    var height = document.body.clientHeight - margin.top - margin.bottom - 5;
    var width = document.body.clientWidth - margin.right - margin.left - 5;
    //var width = document.body.clientWidth;

    var tickFormat = "%H:%M";

    var keyFunction = function(d) {
        return d.startDate + d.taskName + d.endDate;
    };

    var rectTransform = function(d) {
        return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
    };

    var x = d3.time.scale().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);

    var y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([0, height - margin.top - margin.bottom], .1);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
        .tickSize(8).tickPadding(0);

    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

    var initTimeDomain = function() {
        if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
            if (tasks === undefined || tasks.length < 1) {
                timeDomainStart = d3.time.day.offset(new Date(), -3);
                //timeDomainEnd = d3.time.hour.offset(new Date(), +3);
                timeDomainEnd = d3.time.year.offset(new Date(), 2);
                return;
            }
            tasks.sort(function(a, b) {
                return a.endDate - b.endDate;
            });
            //timeDomainEnd = tasks[tasks.length - 1].endDate;
            timeDomainEnd = d3.time.year.offset(new Date(), 2);
            tasks.sort(function(a, b) {
                return a.startDate - b.startDate;
            });
            timeDomainStart = tasks[0].startDate;
        }
    };

    var initAxis = function() {
        //console.log(timeDomainStart);
        //console.log(timeDomainEnd);
        var startYear = timeDomainStart.getFullYear();
        var endYear = timeDomainEnd.getFullYear();
        var ticks = endYear - startYear == 0 ? 1 : endYear - startYear;
        //console.log(ticks);
        x = d3.time.scale().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);
        y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([0, height - margin.top - margin.bottom], .1);

        // xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
        //     .tickSize(8).tickPadding(8);
        //var ticks = 0;

        xAxis = d3.svg.axis().scale(x).orient("bottom")
            .tickSize(-height)
            //.attr("class", "verticleTick")
            .ticks(ticks);
        //.tickFormat(d3.time.format(tickFormat))
        //    .tickValues(d3.range(20, 80, 4));

        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };

    function gantt(tasks) {

        initTimeDomain();
        initAxis();

        var svg = d3.select("#wrapper")
            .append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            //.attr("width", width)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "gantt-chart")
            //.attr("width", width + margin.left + margin.right)
            //.attr("height", height + margin.top + margin.bottom)
            //.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
            .attr("transform", "translate(0,0)");

        svg.selectAll(".chart")
            .data(tasks, keyFunction).enter()
            .append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", function(d) {
                if (taskStatus[d.status] == null) { return "bar"; }
                return taskStatus[d.status];
            })
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            //.attr("height", 30)
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            });


        svg.append("g")
            .attr("class", "x axis")
            //.attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
            .attr("transform", "translate(0, 0" + (height - margin.top - margin.bottom) + ")")
            .transition()
            .call(xAxis);
        // var yAxisSvg = d3.select('#xaxis').append('svg')
        //     //.attr("width", width + margin.left + margin.right)
        //     //.attr("height", 20)
        //     .attr("transform", "translate(100,100)")
        //     .append("g")
        //     .call(yAxis);
        // yAxisSvg.selectAll("text")
        //     .append("text")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", "11px")
        //     .style("text-anchor", "")
        //     .text(function(d) {
        //         return d;
        //     })
        //     .attr("fill", "black");

        // svg.append("g")
        //     .attr("class", "y axis")
        //     .transition()
        //     .attr("position", "fixed")
        //     .call(yAxis);


        //Another y axis
        var svg1 = d3.select("#fixed")
            .append("svg")
            .attr("class", "chart")
            .attr("width", 40)
            //.attr("width", width)
            .attr("height", height + margin.top + margin.bottom)
            .append("g");
        var actualWidth = width - margin.left - margin.right;
        var yAxisSvg = svg1
            .attr("width", width + margin.left + margin.right)
            .attr("height", 20)
            .attr("transform", "translate(" + 38 + ",0)")
            .append("g")
            .attr("class", "y axis")
            .call(yAxis);

        yAxisSvg.selectAll("text")
            .append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("text-anchor", "")
            .text(function(d) {
                return d;
            })
            .attr("fill", "black");
        return gantt;

    };

    gantt.redraw = function(tasks) {

        initTimeDomain();
        initAxis();

        var svg = d3.select("svg");

        var ganttChartGroup = svg.select(".gantt-chart");
        var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);

        rect.enter()
            .insert("rect", ":first-child")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", function(d) {
                if (taskStatus[d.status] == null) { return "bar"; }
                return taskStatus[d.status];
            })
            .transition()
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            });

        rect.transition()
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            });

        rect.exit().remove();

        svg.select(".x").transition().call(xAxis);
        svg.select(".y").transition().call(yAxis);

        return gantt;
    };

    gantt.margin = function(value) {
        if (!arguments.length)
            return margin;
        margin = value;
        return gantt;
    };

    gantt.timeDomain = function(value) {
        if (!arguments.length)
            return [timeDomainStart, timeDomainEnd];
        timeDomainStart = +value[0], timeDomainEnd = +value[1];
        return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
        if (!arguments.length)
            return timeDomainMode;
        timeDomainMode = value;
        return gantt;

    };

    gantt.taskTypes = function(value) {
        if (!arguments.length)
            return taskTypes;
        taskTypes = value;
        return gantt;
    };

    gantt.taskStatus = function(value) {
        if (!arguments.length)
            return taskStatus;
        taskStatus = value;
        return gantt;
    };

    gantt.width = function(value) {
        if (!arguments.length)
            return width;
        width = +value;
        return gantt;
    };

    gantt.height = function(value) {
        if (!arguments.length)
            return height;
        height = +value;
        return gantt;
    };

    gantt.tickFormat = function(value) {
        if (!arguments.length)
            return tickFormat;
        tickFormat = value;
        return gantt;
    };
    return gantt;
};
var d3 = require('d3');

var margin = {top: 30, right: 50, bottom: 10, left: 50},
    width = 300,
    height = 300;
      

module.exports = {

    darw: function (container, points) {

        let svg = container.append('g').attr('transform','translate(200,600)')

        var formatPercent = d3.format('.0s')
        // Scales
        var colorScale = d3.scaleOrdinal(d3.schemePaired);

        var xScale = d3.scaleLinear()
            .domain([-3, 7])
            .range([0,width])

        var yScale = d3.scaleLinear()
            .domain([-3, 5])
            .range([0, height])
            
        // X-axis
        var xAxis = d3.axisTop()
            .scale(xScale)
            .ticks(5)
            .tickFormat(formatPercent);

        // Y-axis
        var yAxis = d3.axisRight()
            .scale(yScale)
            .ticks(5)
            .tickFormat(formatPercent);

        // Circles
        var circles = svg.selectAll('circle')
            .data(points)
            .enter()
            .append('circle')
            .on('click', function(d){

                d3.select(this).attr('fill','red')
            })
            .attr('cx',function (d) { return xScale(d.x) })
            .attr('cy',function (d) { return yScale(d.y) })
            .attr('r', 3)
            .attr('stroke','#666')
            .attr('stroke-width',1)
            .attr('fill', '#333')

        svg
            .on( "mousedown", function() {

                console.log(123)
                var p = d3.mouse( this);
            
                svg.append( "rect")
                .attr({
                    rx      : 6,
                    ry      : 6,
                    stroke   : "grey",
                    x       : p[0],
                    y       : p[1],
                    width   : 0,
                    height  : 0
                })
            })
            .on( "mousemove", function() {
                var s = svg.selectAll( "rect");
            
                if( !s.empty()) {
                    var p = d3.mouse( this),
            
                        d = {
                            x       : parseInt( s.attr( "x"), 10),
                            y       : parseInt( s.attr( "y"), 10),
                            width   : parseInt( s.attr( "width"), 10),
                            height  : parseInt( s.attr( "height"), 10)
                        },
                        move = {
                            x : p[0] - d.x,
                            y : p[1] - d.y
                        }
                    ;
            
                    if( move.x < 1 || (move.x*2<d.width)) {
                        d.x = p[0];
                        d.width -= move.x;
                    } else {
                        d.width = move.x;       
                    }
            
                    if( move.y < 1 || (move.y*2<d.height)) {
                        d.y = p[1];
                        d.height -= move.y;
                    } else {
                        d.height = move.y;       
                    }
                   
                    s.attr( d);
                    //console.log( d);
                }
            })
            .on( "mouseup", function() {
                svg.select( ".selection").remove();
            });
    
        // X-axis
        svg.append('g')
            .attr('class','axis')
            .attr('transform', 'translate(0,' + 0 + ')')
            .call(xAxis)

        svg.append('text') // X-axis Label
            .attr('class','label')
            .attr('fill','black')
            .attr('y', height - 10)
            .attr('x', width / 2)
            .attr('dy','.71em')
            .attr('font-size','10')
            .style('text-anchor','middle')
            .text('Principal Componnet 1')
        // Y-axis
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + width + ',0)')
            .call(yAxis)

        svg.append('text') // y-axis Label
            .attr('class','label')
            .attr('fill','black')
            .attr('transform','rotate(-90)')
            .attr('x', -height / 2)
            .attr('y',5)
            .attr('dy','.71em')
            .attr('font-size','10')
            .style('text-anchor','middle')
            .text('Principal Componnet 2')

        let box_round_lines = 
        [
            {'x1':300,'x2':300,'y1':0,'y2':300}, 
            {'x1':0,'x2':300,'y1':0,'y2':0},
            {'x1':0,'x2':0,'y1':300,'y2':0},
            {'x1':0,'x2':300,'y1':300,'y2':300},
        ]
        
        svg.append('g')
            .selectAll('round_lines')
            .data(box_round_lines)
            .enter()
            .append('line')
            .attr('x1', d => d.x1)
            .attr('x2', d => d.x2)
            .attr('y1', d => d.y1)
            .attr('y2', d => d.y2)
            .attr('stroke','#333')
            .attr('stroke-width', 2)

        let x_series = points.map(d => d.x)
        let y_series = points.map(d => d.y)


        var histogram = d3.histogram()
            .value(function(d) { return d; })   // I need to give the vector of value
            .domain(xScale.domain())  // then the domain of the graphic
            .thresholds(xScale.ticks(10)); // then the numbers of bins
      
        // And apply this function to data to get the bins
        var bins = histogram(x_series);
      
        // append the bar rectangles to the svg element
        svg.selectAll("hist_rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + 10 + ")"; })
            .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) - 1 ; })
            .attr("height", function(d) { return yScale(d.length)/6; })
            .attr("y", height)
            .style("fill", "#666")


        var bins = histogram(y_series);
      
            // append the bar rectangles to the svg element
        svg.selectAll("hist_rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", d =>  width - xScale(d.length)/5)
            .attr("transform", function(d) { return "translate(" + (-310) + "," + xScale(d.x0) + ")"; })
            .attr("width", function(d) { return xScale(d.length)/5; })
            .attr("height", function(d) { return xScale(d.x1) - xScale(d.x0) - 1; })
            .attr("y", 1)
            .style("fill", "#666")

        svg.append('rect')
            .attr('width',20)
            .attr('height', 20)
            .attr('fill','#666')
            .attr('x',-20 - 100)
            .attr('y', 23 - 100)
  
        svg.append('text')
            .attr('x',10 - 100)
            .attr('y',40 - 100)
            .attr('font-size', '20')
            .attr('font-family', '仿宋')
            .attr('text-anchor','start')
            .text('主成分分析降维投影')
    }

    
};
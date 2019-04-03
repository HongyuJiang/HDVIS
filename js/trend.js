var d3 = require('d3');

var margin = {top: 30, right: 50, bottom: 10, left: 50},
    width = 800,
    height = 400;
      

module.exports = {

    darw: function (container) {

        let svg = container.append('g').attr('transform','translate(150,1100)')

        let data = []

        for(let i=0;i<10;i++){

            let year = i + 2008

            let val1 = Math.random() * 0.6

            let val2 = Math.random() * 0.6

            let date = new Date(year + '-01-01 12:00:00')

            data.push({'date': date,'value1':val1,'value2':val2})
        }

        line1 = d3.line()
            .defined(d => !isNaN(d.value1))
            .x(d => x(d.date))
            .y(d => y(d.value1))

        line2 = d3.line()
            .defined(d => !isNaN(d.value2))
            .x(d => x(d.date))
            .y(d => y(d.value2))

        x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right])
        
        y = d3.scaleLinear()
            .domain([0,0.7])
            .range([height - margin.bottom, margin.top])

        xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

        yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(8))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y))

        svg.append("g")
            .call(xAxis);
      
        svg.append("g")
            .call(yAxis);
        
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#D191E8")
            .attr("stroke-width", 2)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line1);

        svg.selectAll(".circle")
            .data(data)
            .enter()
            .append('circle')
            .attr("fill", "#999")
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.value1))
            .attr('r',3)
        
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#7F91E8")
            .attr("stroke-width", 2)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line2);

        svg.selectAll(".circle")
            .data(data)
            .enter()
            .append('circle')
            .attr("fill", "#999")
            .attr('cx', d => x(d.date))
            .attr('cy', d => y(d.value2))
            .attr('r',3)

        y.ticks(8).forEach(function(val){

            let _y = y(val)

            svg.append('line')
            .attr('x1', x.range()[0])
            .attr('x2', x.range()[1])
            .attr('y1', _y)
            .attr('y2', _y)
            .attr('opacity',0.5)
            .attr('stroke-dasharray','4 4 4 4')
            .attr('stroke','#666')
        })

        svg.append('rect')
            .attr('width',20)
            .attr('height', 20)
            .attr('fill','#666')
            .attr('x',-20 + 300)
            .attr('y', 23 - 50)
  
        svg.append('text')
            .attr('x',10 + 300)
            .attr('y',40 - 50)
            .attr('font-size', '20')
            .attr('font-family', '仿宋')
            .attr('text-anchor','start')
            .text('省份-主成分变化趋势')

        let legend_data = []

        legend_data.push({'x':width,'y':100,'title':'PC1', 'color': '#D191E8'})

        legend_data.push({'x':width,'y':150,'title':'PC2', 'color': '#7F91E8'})

        svg.selectAll('legend')
            .data(legend_data)
            .enter()
            .append('line')
            .attr('x1', d => d.x - 20)
            .attr('x2', d => d.x)
            .attr('y1', d => d.y)
            .attr('y2', d => d.y)
            .attr('stroke', d => d.color)
            .attr('stroke-width','2')

        svg.selectAll('legend')
            .data(legend_data)
            .enter()
            .append('text')
            .attr('x', d => d.x + 15)
            .attr('y', d => d.y + 5)
            .attr('text-anchor','start')
            .attr('fill','black')
            .text(d => d.title)
    }

};
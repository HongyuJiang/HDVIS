var d3 = require('d3');

var margin = {top: 30, right: 50, bottom: 10, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
      

module.exports = {

    darw: function (container, mapData, population_data) {

        let province_location = {}

        mapData.features.forEach(function(d){

            province_location[d.properties.name] = d.properties.cp
        })

        let svg = container.append('g').attr('transform','translate(100,1700)')

        var projection = d3
            .geoMercator() 
            .scale(800)	
            .center([107.019923,34.818251]); 

        var path = d3.geoPath().projection(projection);　

        drawMaps(mapData)

        function drawMaps(geojson) {
            svg.selectAll("path")
                .data(geojson.features)
                .enter()
                .append("path")
                .attr("d", path)  
                .attr("fill", "#ccc")
                .attr("fill-opacity", 0.1)
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2);    
        }

        let marker_geo_coor = []

        population_data.forEach(function(d){

            let point = projection(province_location[d['省份']])

            let count = parseInt(d['出省人数'])

            marker_geo_coor.push({'name': d['省份'], 'x':point[0], 'y':point[1], 'count':count})
        })

        svg.selectAll('indicator')
            .data(marker_geo_coor)
            .enter()
            .append('rect')
            .attr('x', d => d.x - 5)
            .attr('y', d => d.y - Math.log(d.count) * 2)
            .attr('fill', '#F2525E')
            .attr('opacity', 0.7)
            .attr('height', d => Math.log(d.count) * 2)
            .attr('width', 10)

        svg.selectAll('indicator')
            .data(marker_geo_coor)
            .enter()
            .append('rect')
            .attr('x', d => d.x - 5)
            .attr('y', d => d.y)
            .attr('fill', 'white')
            .attr('opacity', 1)
            .attr('height', 5)
            .attr('width', 10)

        svg.selectAll('indicator_name')
            .data(marker_geo_coor)
            .enter()
            .append('text')
            .attr('font-size', 10)
            .attr('font-family', '微软雅黑')
            .attr('x', d => d.x - 15)
            .attr('y', d => d.y + 20)
            .text(d => d.name)

        svg.append('rect')
            .attr('width',20)
            .attr('height', 20)
            .attr('fill','#666')
            .attr('x',20 + 300)
            .attr('y', 23 - 100)

        svg.append('text')
            .attr('x', 10 + 460)
            .attr('y', 40 - 100)
            .attr('font-family', '仿宋')
            .attr('font-size', '20')
            .attr('text-anchor','end')
            .text('省份人口流动')
     
    }

};
<template>
<div class='map-view-container'>
      <div class='chart-name chart-name-middle'>{{name}}</div>
      <div v-bind:id='id' class='map-container'>
   
      </div>
  </div>
</template>

<script>
 
const d3 = require('d3');
import * as dsv from 'd3-dsv';

import DataProvider from '../DataProvider';

const props = {
  id: {
    type: String,
    default: () => 'map-view-container',
  },
  name: {
    type: String,
    default: () => '贡献度排名',
  },
  focus: {
    type: String,
    default: () => '高血压',
  },    
  top:{
    type: Number,
    default: () => 500,
  },
  left:{
    type: Number,
    default: () => 350,
  },
  data: {}
};

export default {

  name: 'map-view',
  props,
  mounted: function() {

    //Initialize the size of chart
    this.windowResize(window.innerWidth * 0.3, window.innerHeight * 0.3);

    //Add a listener for window's resize`
    window.addEventListener("resize", () => {
      this.windowResize(window.innerWidth * 0.3, window.innerHeight * 0.3);
    });


    d3.select(d3.select('#' + this.id).node().parentNode)
    .style('position', 'absolute')
    .style('top', this.top + 'px')
    .style('left', this.left + 'px')

     DataProvider.getPopulationData().then(response_popuData => {

            DataProvider.getMapData().then(response_mapData => {

                let population_data = dsv.csvParse(response_popuData.data);

                let geoChina = response_mapData.data
                        
                this.chartInit(geoChina, population_data)

            }, error => {
        
        });

        }, error => {
       
    });
  },

  watch:{



  },

  methods: {


    //Chart initialization
    chartInit(mapData, population_data){

        let width = 850,
            height = 350

        let container = d3.select('#' + this.id)

         let svg = container.append('svg')
        .attr('width', width + 50)
        .attr('height', height + 120)
        .append('g')
        .attr('transform', 'translate(80,70)')

        let province_location = {}

        mapData.features.forEach(function(d){

            province_location[d.properties.name] = d.properties.cp
        })


        var projection = d3
            .geoMercator() 
            .scale(550)	
            .center([105,30]); 

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
                .attr("stroke", "#333")
                .attr("stroke-width", 2)
                .attr("stroke-opacity", 0.3);    
        }

        let marker_geo_coor = []

        population_data.forEach(function(d){

            let point = projection(province_location[d['省份']])

            let count = parseFloat(d['迁出/迁入'])

            marker_geo_coor.push({'name': d['省份'], 'x':point[0], 'y':point[1], 'count':count})
        })

        svg.selectAll('indicator')
            .data(marker_geo_coor)
            .enter()
            .append('rect')
            .attr('x', d => d.x - 5)
            .attr('y',  function(d){

                if (d.count >= 1)

                return d.y - d.count * 2

                else return d.y - 1/d.count * 2
            })
            .attr('fill', d => d.count >= 1 ? '#f9483b' : '#5cabf9')
            .attr('opacity', 0.7)
            .attr('height', d=> d.count >= 1 ? d.count * 2 : 1/d.count * 2)
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
    },

    //Update the focus item
    focusUpdate(focus){


    },

    //Change chart size when window's size changed
    windowResize(width, height){

      //this.chart.changeSize(width, height)

    }
  }
}
</script>

<style lang="css">


.bubble-chart-container{
  
  position:absolute;
}

.bubble-container-name{

   position:absolute;
   width:100%;
   top:60%;
   color:rgba(255,255,255,0.5);
   font-size: 70px;
   text-align: center;
   text-anchor: middle;

}

</style>
<template>
<div class='para-chart-container'>
      <div class='chart-name chart-name-right'>{{name}}</div>
      <div v-bind:id='id' class='para-container'>
   
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
    default: () => 'para-chart-container',
  },
  name: {
    type: String,
    default: () => '慢病-小组统计',
  },
  focus: {
    type: String,
    default: () => '高血压',
  },
  top:{
    type: Number,
    default: () => 80,
  },
  right:{
    type: Number,
    default: () => 500,
  },
  data: {}
};

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };


export default {

  name: 'para-chart',
  props,
  mounted: function() {

    d3.select('#' + this.id)
    .style('position', 'absolute')
    .style('top', this.top + 'px')
    .style('right', this.right + 'px')

    //Initialize the size of chart
    this.windowResize(window.innerWidth * 0.3, window.innerHeight * 0.3);

    //Add a listener for window's resize`
    window.addEventListener("resize", () => {
      this.windowResize(window.innerWidth * 0.3, window.innerHeight * 0.3);
    });


    d3.select(d3.select('#' + this.id).node().parentNode)
    .style('top', this.top + 'px')
    .style('right', this.right + 'px')

    DataProvider.getPopulationData().then(response => {

        let data = dsv.csvParse(response.data)

        let {columns, data_dict} = this.dataProcess(data)
          
        this.chartInit(data, columns, data_dict)

    }, error => {
       
    });
    
  },

  methods: {

    //data process 
    dataProcess(contents){

        let population_data = contents;
        
        let columns = population_data['columns']

        columns.shift()

        let data_dict = this.get_dimension_values(population_data, columns)

        return  {columns, data_dict}
    },

    //Chart initialization
    chartInit(data, dimensions, data_dict){

        let container = d3.select('#' + this.id)

        let width = 800,
            height = 400
        
        let svg = container.append('svg')
        .attr('width', width + 200)
        .attr('height', height + 50)
        .append('g')
        .attr('transform', 'translate(100,0)')


        var formatPercent = d3.format('~s')

        let yScale = {}

        let zScale = d3.scaleLinear().domain([0, height])

        for (let index in dimensions) {

            name = dimensions[index]

            let true_extent = d3.extent(data, function(d) { return +d[name]; })
            let fitted_extent = [true_extent[0] * 0.8, true_extent[1] * 1.2]

            if(name == '出省人数' || name == '入省人数' ){

                fitted_extent[0] = -5000000
            }

            yScale[name] = d3.scaleLinear()
                .domain(fitted_extent)
                .range([height, 0])

        }

        // Build the X scale -> it find the best position for each Y axis
        let xScale = d3.scalePoint()
        .range([0, width])
        .domain(dimensions);

        let dist_dimensions = []

        dimensions.forEach(function(dim){

            dist_dimensions.push(dim)
        })

        dist_dimensions.remove(2,3)

        dist_dimensions.remove(3)

        function path(d) {
            let lineGenerator = d3.line()//.curve(d3.curveCardinal)
            return lineGenerator(dimensions.map(function(p) { return [xScale(p), yScale[p](d[p])]; }))
        }

        let dist_data = {}

        let that = this

        dist_dimensions.forEach(function(dim){

            let kde = that.kernelDensityEstimator(that.kernelEpanechnikov(7), zScale.ticks(40))
            let density =  kde( data_dict[dim].map(d => yScale[dim](d)) )
            dist_data[dim] = density
        })

        dist_dimensions.forEach(function(dim){

            let bins_container = svg.append('g')
             .attr('transform', d => 'translate(' + xScale(dim) + ',0)')

             bins_container.append("path")
             .attr("class", "mypath")
             .datum(dist_data[dim])
             .attr("fill", "#6F808C")
             .attr("opacity", "1")
             .attr("stroke", "#6F808C")
             .attr("stroke-width", 1)
             .attr("stroke-linejoin", "round")
             .attr("d",  d3.line()
                 .curve(d3.curveBasis)
                 .x(function(d) { return d[1] * 2500 })
                 .y(function(d) { return d[0]})
             );

        })

        // Draw the lines
        svg.selectAll("myPath")
            .data(data)
            .enter()
            .append("path")
            .attr("class", function (d) { return "line " +  d['省份'] } ) // 2 class for each line: 'line' and the group name
            .attr("d",  path)
            .style("fill", "none" )
            .style("stroke", '#5F909C' )
            .style("opacity", 0.3)

        // Draw the axis:
        svg.selectAll("myAxis")
            .data(dimensions).enter()
            .append("g")
            .attr("class", "axis")
            .attr("transform", function(d) { return "translate(" + xScale(d) + ")"; })
            .each(function(d) { 
                d3.select(this).call(d3.axisLeft()
                .ticks(5).tickFormat(formatPercent)
                .scale(yScale[d])); 
            })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; })
            .style("fill", "black")


          svg.append('rect')
          .attr('width',20)
          .attr('height', 20)
          .attr('fill','#666')
          .attr('x',-20)
          .attr('y', 23 - 100)

          svg.append('text')
          .attr('x',10)
          .attr('y',40 - 100)
          .attr('font-family', '仿宋')
          .attr('font-size', '20')
          .attr('text-anchor','start')
          .text('平行坐标与数据分布')
    },

    //Update the focus item
    focusUpdate(focus){


    },

    //Change chart size when window's size changed
    windowResize(width, height){

      //this.chart.changeSize(width, height)

    },
    // Function to compute density
    kernelDensityEstimator(kernel, X) {
        return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
        };
    },
    kernelEpanechnikov(k) {
        return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    },
    get_dimension_values(data, dimension){

        let data_dict = {}

        dimension.forEach(function(dim){
            
            data_dict[dim] = []
        })

        data.forEach(function(d){

            dimension.forEach(function(dim){
            
                data_dict[dim].push(parseFloat(d[dim]))
            })
    
        })

        return data_dict
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
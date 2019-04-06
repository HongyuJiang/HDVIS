<template>
<div class='para-chart-container'>
      <div class='chart-name chart-name-middle'>{{name}}</div>
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
    default: () => '未命名',
  },
  top:{
    type: Number,
    default: () => 80,
  },
  left:{
    type: Number,
    default: () => 470,
  },
  data: {},
 
};

//为数组增加删除函数
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };


export default {

  name: 'para-chart',
  props,
  mounted: function() {

    //设置图表位置
    d3.select('#' + this.id)
    .style('position', 'absolute')
    .style('left', this.left + 'px')
    .style('top', this.top + 'px')

    //获取人口数据
    DataProvider.getPopulationData().then(response => {

        let data = dsv.csvParse(response.data)

        let {columns, data_dict} = this.dataProcess(data)
          
        this.chartInit(data, columns, data_dict)

    }, error => {
       
    });

    //接收投影视图框选点
    this.$root.$on('PointsSeleted', (points) => {

      this.provinceHighlight(points)
    })
    
  },

  methods: {

    //数据处理
    dataProcess(contents){

        let population_data = contents;
        
        //获取数据维度名称
        let columns = population_data['columns']

        //删除省名
        columns.shift()

        //将数组转换为字典
        let data_dict = this.get_dimension_values(population_data, columns)

        return  {columns, data_dict}
    },

    chartInit(data, dimensions, data_dict){

        let container = d3.select('#' + this.id)

        let width = 800,
            height = 360
        
        let svg = container.append('svg')
        .attr('width', width + 200)
        .attr('height', height + 50)
        .append('g')
        .attr('transform', 'translate(100,30)')

        this.svg = svg

        //设置数据轴文字显示格式
        var formatPercent = d3.format('~s')

        //y轴比例尺集合
        let yScale = {}

        //分布图高度比例尺
        let zScale = d3.scaleLinear().domain([0, height])

        for (let index in dimensions) {

            name = dimensions[index]

            //计算每个维度的数据范围
            let true_extent = d3.extent(data, function(d) { return +d[name]; })

            //将数据范围扩展以汇聚靠近零点的数据
            let fitted_extent = [true_extent[0] * 0.8, true_extent[1] * 1.2]

            if(name == '出省人数' || name == '入省人数' ){

                fitted_extent[0] = -5000000
            }

            //将数据范围扩展以汇聚靠近零点的数据
            yScale[name] = d3.scaleLinear()
                .domain(fitted_extent)
                .range([height, 0])

        }

        // 创建x轴比例尺
        let xScale = d3.scalePoint()
        .range([0, width])
        .domain(dimensions);

        //找到需要计算数据分布的维度
        let dist_dimensions = []

        dimensions.forEach(function(dim){

            dist_dimensions.push(dim)
        })

        dist_dimensions.remove(2,3)

        dist_dimensions.remove(3)

        //线条生成器
        function path(d) {
            let lineGenerator = d3.line()//.curve(d3.curveCardinal)
            return lineGenerator(dimensions.map(function(p) { return [xScale(p), yScale[p](d[p])]; }))
        }

        let dist_data = {}

        let that = this

        //使用密度估计算法对每个维度的数据分布进行计算并分块
        dist_dimensions.forEach(function(dim){

            let kde = that.kernelDensityEstimator(that.kernelEpanechnikov(7), zScale.ticks(40))
            let density =  kde( data_dict[dim].map(d => yScale[dim](d)) )
            dist_data[dim] = density
        })

        //绘制数据分布图
        dist_dimensions.forEach(function(dim){

            let bins_container = svg.append('g')
             .attr('transform', d => 'translate(' + xScale(dim) + ',0)')

             bins_container.append("path")
             .attr("class", "mypath")
             .datum(dist_data[dim])
             .attr("fill", "#999")
             .attr("opacity", "0.7")
             .attr("stroke", "#333")
             .attr("stroke-width", 2)
             .attr("stroke-linejoin", "round")
             .attr("d",  d3.line()
                 .curve(d3.curveBasis)
                 .x(function(d) { return d[1] * 2500 })
                 .y(function(d) { return d[0]})
             );

        })

        // 画线
        svg.selectAll("myPath")
            .data(data)
            .enter()
            .append("path")
            .attr("class", 'province') // 2 class for each line: 'line' and the group name
            .attr("d",  path)
            .style("fill", "none" )
            .style("stroke", '#666' )
            .style("opacity", 0.3)

        // 绘制轴
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

    //交互事件：当投影视图中点被选中的时候，相应的线条将被高亮
    provinceHighlight(selected){

        let selectedJugher = {}

        selected.forEach(function(d){

            selectedJugher[d['name']] = 1
        })

        this.svg.selectAll('.province')
        .style('stroke', function(d){
            return selectedJugher[d['省份']] == 1 ? 'red' : '#666'
        })
        .style('stroke-width', function(d){
            return selectedJugher[d['省份']] == 1 ? '2' : '1'
        })

    },

    // 数据密度估计
    kernelDensityEstimator(kernel, X) {
        return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
        };
    },

    //密度估计函数Epanechnikov
    kernelEpanechnikov(k) {
        return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    },

    //将数组转换为字典
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
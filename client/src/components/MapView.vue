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
    default: () => '未命名',
  },
  top:{
    type: Number,
    default: () => 500,
  },
  left:{
    type: Number,
    default: () => 350,
  }
};

export default {

  name: 'map-view',
  props,
  mounted: function() {

    //设置图表位置
    d3.select(d3.select('#' + this.id).node().parentNode)
    .style('position', 'absolute')
    .style('top', this.top + 'px')
    .style('left', this.left + 'px')


    //获取数据并绘制图表
     DataProvider.getPopulationData().then(response_popuData => {

            DataProvider.getMapData().then(response_mapData => {

                //将CSV文件解析为字典数据
                let population_data = dsv.csvParse(response_popuData.data);

                let geoChina = response_mapData.data
                        
                this.chartInit(geoChina, population_data)

            }, error => {
        
        });

        }, error => {
       
    });
  },


  methods: {

    //图表初始化
    chartInit(mapData, population_data){

        let that = this

        //图表的长宽
        let width = 850,
            height = 350

        //设置放置图表的父级元素
        let container = d3.select('#' + this.id)

        //新建绘图画布
        let svg = container.append('svg')
        .attr('width', width + 50)
        .attr('height', height + 120)
        .append('g')
        .attr('transform', 'translate(80,70)')

        //构建省份数据字典
        let province_location = {}

        //将数据存入字典
        mapData.features.forEach(function(d){

            province_location[d.properties.name] = d.properties.cp
        })

        //新建地理投影方法
        var projection = d3
            .geoMercator() 
            .scale(550)	
            .center([105,30]); 

        //构建地图绘制器
        var path = d3.geoPath().projection(projection);　

        //绘制地图
        svg.selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            .attr("d", path)  
            .attr("fill", "#ccc")
            .attr("fill-opacity", 0.1)
            .attr("stroke", "#333")
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 0.3);    
        
        //柱状图数据/迁入迁出比例数据
        let marker_geo_coor = []

        //柱状图数据生成
        population_data.forEach(function(d){

            //将经纬度坐标系转换为x,y坐标系
            let point = projection(province_location[d['省份']])

            let count = parseFloat(d['迁出/迁入'])

            if(d['省份'] == '内蒙古') point[1] += 35

            marker_geo_coor.push({'name': d['省份'], 'x':point[0], 'y':point[1], 'count':count})
        })


        //绘制柱状图
        svg.selectAll('indicator')
            .data(marker_geo_coor)
            .enter()
            .append('rect')
            .attr('x', d => d.x - 5)
            .attr('y',  function(d){

                return d.count >= 1 ? d.y - d.count * 2 : d.y - 1/d.count * 2
            })
            .attr('fill', d => d.count >= 1 ? '#f9483b' : '#5cabf9')
            .attr('opacity', 0.7)
            .attr('height', d=> d.count >= 1 ? d.count * 2 : 1/d.count * 2)
            .attr('width', 10)

        //绘制柱状图基座
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

        //绘制柱状图名称
        svg.selectAll('indicator_name')
            .data(marker_geo_coor)
            .enter()
            .append('text')
            .attr('font-size', 10)
            .attr('font-family', '微软雅黑')
            .attr('x', d => d.x - 15)
            .attr('y', d => d.y + 20)
            .text(d => d.name)
            .on('click', function(d){

               that.$root.$emit('ProvinceSeleted', d.name)
            })

        //增加颜色解释
        svg.append('rect')
          .attr('x', 200)
          .attr('y', 300)
          .attr('width', 30)
          .attr('height', 13)
          .attr('fill', '#f9483b')

        svg.append('rect')
          .attr('x', 200)
          .attr('y', 330)
          .attr('width', 30)
          .attr('height', 13)
          .attr('fill', '#5cabf9')


        svg.append('text')
          .attr('x', 242)
          .attr('y', 310)
          .attr('font-size', 12)
          .text('迁入 > 迁出')

        svg.append('text')
          .attr('x', 242)
          .attr('y', 340)
          .attr('font-size', 12)
          .text('迁出 > 迁入')
        
    },

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
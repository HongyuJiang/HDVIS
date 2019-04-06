<template>
<div class='contrib-chart-container'>
      <div class='chart-name chart-name-left'>{{name}}</div>
      <div v-bind:id='id' class='contrib-container'>
   
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
    default: () => 'contrib-chart-container',
  },
  name: {
    type: String,
    default: () => '未命名',
  },
  top:{
    type: Number,
    default: () => 20,
  },
  left:{
    type: Number,
    default: () => 50,
  },
};

export default {

  name: 'contrib-chart',
  props,
  mounted: function() {

    //设置图表位置
    d3.select(d3.select('#' + this.id).node().parentNode)
    .style('position', 'absolute')
    .style('top', this.top + 'px')
    .style('left', this.left + 'px')

    //绘制图表
    this.chartInit()
  },

  methods: {

    //初始化图表
    chartInit(){

        //图表的长宽
        let width = 350,
            height = 350

        //设置放置图表的父级元素
        let container = d3.select('#' + this.id)

        //新建绘图画布
        let svg = container.append('svg')
        .attr('width', width + 50)
        .attr('height', height + 100)
        .append('g')
        .attr('transform', 'translate(50,30)')

        //贡献度数据，由python代码计算出
        let contrib_data = [[0.4706703162, -0.32356494, 0.5237312673, 0.2503520532, -0.1587296969, -0.4160826872, -0.06351887283, -0.3666742773], 
        [-0.2305916178, -0.4222965801, -0.1046096292,0.2902428, 0.5631073491, -0.08549629881, 0.578059447, -0.121477647]]

        //设置维度名称
        let dimensions = ['出省人数','入省人数','流动比','男女比例','返乡时长','无座率','中转次数','平均年龄']

        //初始化绘图点
        let points = []

        //设置点的位置
        for(let i=0;i<contrib_data.length;i++){

            for(let j=0;j<contrib_data[i].length;j++){

                let val = Math.abs(contrib_data[i][j]);

                if(i==0){  points.push({'x':val})   }
                else{
                    points[j].y = val
                    //设置点的名称
                    points[j].name = dimensions[j]
                    //计算箭头的方向，由维度在两个主成分的主成分的比例得出
                    points[j].angle = Math.atan(points[j].y / points[j].x)

                }
            }
        }

        //设置坐标轴显示格式
        var formatPercent = d3.format('.0s')

        //设置x轴比例尺
        var xScale = d3.scaleLinear()
            .domain([0, 0.6])
            .range([0,width])

        //设置y轴比例尺
        var yScale = d3.scaleLinear()
            .domain([0, 0.6])
            .range([height,0])
            
        //设置x轴
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5)

        //设置y轴
        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5)

        //创建直线生成器
        let lineGenerator = d3.line()
            .x(d => d.x)
            .y(d => d.y)
    
        let lines_data = []
    
        //创建主成分贡献度比例线条数据
        points.forEach(function(d){
    
            let x = xScale(d.x)
            let y = yScale(d.y)
    
            let p1 = {'x':x,'y':y},
                p2 = {'x':0,'y':y},
                p3 = {'x':x,'y':height}
    
            let line1 = [p1,p2],
                line2 = [p1,p3]
    
            lines_data.push(line1, line2)
    
        })
    
        //绘制线条
        svg.append('g').selectAll('lines')
            .data(lines_data)
            .enter()
            .append('path')
            .attr('stroke','#666')
            .attr('opacity','0.7')
            .attr('stroke-dasharray','4 4 4 4')
            .attr('fill', 'none')
            .attr('d', lineGenerator)
         

        //绘制线条中的数据点
        var circles = svg.selectAll('circle')
            .data(points)
            .enter()
            .append('circle')
            .attr('cx',function (d) { return xScale(d.x) })
            .attr('cy',function (d) { return yScale(d.y) })
            .attr('r','3')
            .attr('fill', '#25616E')

        //绘制维度的名字
        svg.selectAll('dim_name')
            .data(points)
            .enter()
            .append('text')
            .attr('x',function (d) { return xScale(d.x) })
            .attr('y',function (d) { return yScale(d.y) + 20 })
            .attr('text-anchor','middle')
            .attr('font-size',11)
            .text(d => d.name)
          
        //预设箭头绘制样式
        svg.append("defs").append("marker")
            .attr("id", "triangle")
            .attr("refX", 3)
            .attr("refY", 3)
            .attr("markerWidth", 15)
            .attr("markerHeight", 15)
            .attr("markerUnits","userSpaceOnUse")
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 6 3 0 6 1.5 3")
            .style("fill", "#F3573B");
          
        let line_R = 15

        //绘制箭头
        var arrows = svg.selectAll('arrows')
            .data(points)
            .enter()
            .append('line')
            .attr('x1',function (d) { return xScale(d.x) - line_R * Math.sin(d.angle + Math.PI/2)})
            .attr('y1',function (d) { return yScale(d.y) - line_R * Math.cos(d.angle + Math.PI/2)})
            .attr('x2',function (d) { return xScale(d.x) + line_R * Math.sin(d.angle + Math.PI/2)})
            .attr('y2',function (d) { return yScale(d.y) + line_R * Math.cos(d.angle + Math.PI/2)})
            .attr('marker-end', (d) => "url(#triangle)")//attach the arrow from defs
            .attr('stroke','#25616E')
            .attr('stroke-width', 1)

        // 绘制x轴
        svg.append('g')
            .attr('class','axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .append('text') // X-axis Label
            .attr('class','label')
            .attr('y', 25)
            .attr('x',width)
            .attr('dy','.71em')
            .attr('fill','black')
            .style('text-anchor','end') 
            .text('Principal Component 1')

        // 绘制y轴
        svg.append('g')
            .attr('class', 'axis')
            .call(yAxis)
            .append('text') // y-axis Label
            .attr('class','label')
            .attr('transform','rotate(-90)')
            .attr('x', -5)
            .attr('y', -40)
            .attr('dy','.71em')
            .attr('fill','black')
            .style('text-anchor','end')
            .text('Principal Component 2')
  
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
<template>
<div class='project-chart-container'>
      <div class='chart-name chart-name-right'>{{name}}</div>
      <div v-bind:id='id' class='project-container'>
   
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
    default: () => 'project-chart-container',
  },
  name: {
    type: String,
    default: () => '未命名',
  },
  top:{
    type: Number,
    default: () => 40,
  },
  right:{
    type: Number,
    default: () => 50,
  },
  data: {}
};

export default {

  name: 'project-chart',
  props,
  mounted: function() {

    d3.select(d3.select('#' + this.id).node().parentNode)
    .style('position', 'absolute')
    .style('top', this.top + 'px')
    .style('right', this.right + 'px')

    DataProvider.getPCAData().then(response => {

          let data = this.dataProcess(response.data)
              
          this.chartInit(data)

        }, error => {
       
    });
    
  },

  watch:{

  },

  methods: {

    //数据处理
    dataProcess(contents){

      let origin_data = dsv.csvParse(contents);
        
      let points_data = []
        
      origin_data.forEach(function(d){
        
        let x = +d['pc1']
        let y = +d['pc2']
        
        points_data.push({'x':x,'y':y,'name':d['省份']})
      })

      return points_data
    
    },

    //图表初始化
    chartInit(points){

        var that = this

        let container = d3.select('#' + this.id)

        let width = 300,
            height = 300
        
        let svg = container.append('svg')
        .attr('width', width + 120)
        .attr('height', height + 100)
        .append('g')
        .attr('transform', 'translate(0,0)')

        var formatPercent = d3.format('.0s')
        // Scales
        var colorScale = d3.scaleOrdinal(d3.schemePaired);

        var xScale = d3.scaleLinear()
            .domain([-3, 7])
            .range([100, width + 100])

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

        points.forEach(function(d){

          d.x = xScale(d.x)
          d.y = yScale(d.y)
        })

    
        var circles = svg.selectAll('circle')
            .data(points)
            .enter()
            .append('circle')
            .on('click', function(d){

                d3.select(this).attr('fill','red')
            })
            .attr('cx',function (d) { return (d.x) })
            .attr('cy',function (d) { return (d.y) })
            .attr('r', 3)
            .attr('stroke','#666')
            .attr('stroke-width',1)
            .attr('fill', '#333')


        //注册鼠标点击事件，开始进行框选操作
        container.select('svg').on("mousedown", function(e) {

                d3.event.preventDefault();
                var p = d3.mouse(this);
            
                svg.append( "rect")
                .attr('x', p[0])
                .attr('y', p[1])
                .attr('height', 0)
                .attr('width', 0)
                .attr('class', 'selection')
                .attr('stroke','grey')
                .attr('fill','none')
              
               
            })
            //注册鼠标移动事件，选择框跟随鼠标进行移动
            .on("mousemove", function(e) {

                d3.event.preventDefault();
                var s = d3.select("rect.selection");
            
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
                   
                    s.attr('x', d.x)
                     .attr('y', d.y)
                     .attr('width', d.width)
                     .attr('height', d.height)
      
                }
            })

            //注册鼠标点击结束事件，删除选择框，传递选择点
            .on( "mouseup", function() {

                let radius = 1.5
                var s = d3.select("rect.selection");

                if( !s.empty()) {


                  let d = {
                        x       : parseInt( s.attr( "x"), 10),
                        y       : parseInt( s.attr( "y"), 10),
                        width   : parseInt( s.attr( "width"), 10),
                        height  : parseInt( s.attr( "height"), 10)
                  }

                  svg.selectAll('circle').classed( "selected", false);

                  let selectedPoints = []

                  //选中的点颜色变红
                  svg.selectAll('circle').each( function( state_data, i) {

                        if(
                            state_data.x-radius>=d.x && state_data.x+radius<=d.x+d.width && 
                            state_data.y-radius>=d.y && state_data.y+radius<=d.y+d.height
                        ) {

                          selectedPoints.push(state_data)

                          d3.select(this).classed( "selected", true);
                        }
                  });

                  //将选中的点传给平行坐标
                  that.$root.$emit('PointsSeleted', selectedPoints)
                
                }

                  svg.select("rect.selection").remove();
            });
    
      
        svg.append('g')
            .attr('class','axis')
            .attr('transform', 'translate(0,' + 0 + ')')
            .call(xAxis)

        svg.append('text') // X-axis Label
            .attr('class','label')
            .attr('fill','black')
            .attr('y', height - 10)
            .attr('x', width / 2 + 100)
            .attr('dy','.71em')
            .attr('font-size','10')
            .style('text-anchor','middle')
            .text('Principal Componnet 1')
      
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + (width+100) + ',0)')
            .call(yAxis)

        svg.append('text') // y-axis Label
            .attr('class','label')
            .attr('fill','black')
            .attr('transform','rotate(-90)')
            .attr('x', -height / 2)
            .attr('y',105)
            .attr('dy','.71em')
            .attr('font-size','10')
            .style('text-anchor','middle')
            .text('Principal Componnet 2')

        //绘制外框
        let box_round_lines = 
        [
            {'x1':400,'x2':400,'y1':0,'y2':300}, 
            {'x1':100,'x2':400,'y1':0,'y2':0},
            {'x1':100,'x2':100,'y1':300,'y2':0},
            {'x1':100,'x2':400,'y1':300,'y2':300},
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

        let x_series = points.map(d => xScale.invert(d.x))
        let y_series = points.map(d => yScale.invert(d.y))

        //计算数据点在两个主成分上的贡献度分布
        var histogram = d3.histogram()
            .value(function(d) { return d; })  
            .domain(xScale.domain())  
            .thresholds(xScale.ticks(10)); 
      
        //生成数据桶
        var bins = histogram(x_series);
      
        // 绘制柱状图
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
    
        svg.selectAll("hist_rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", d =>  width + 100 - xScale(d.length)/5)
            .attr("transform", function(d) { return "translate(" + (-310) + "," + (xScale(d.x0)-100) + ")"; })
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

.selected{

  fill:red;
}

</style>
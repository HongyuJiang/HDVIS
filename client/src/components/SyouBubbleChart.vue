<template>
<div class='bubble-chart-container'>
      <div class='chart-name chart-name-right'>{{name}}</div>
      <h1 class='bubble-container-name'>{{focus}}</h1>
      <div v-bind:id='id' class='bubble-container'>
   
      </div>
  </div>
</template>

<script>
 
const d3 = require('d3');

import DataProvider from '../DataProvider';

const props = {
  id: {
    type: String,
    default: () => 'bubble-chart-container',
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
    default: () => 450,
  },
  right:{
    type: Number,
    default: () => 20,
  },
  data: {}
};

export default {

  name: 'bubble-chart',
  props,
  mounted: function() {

    this.chart = null

    //Initialize the chart's configuration
    this.chartInit()

    //Initialize the size of chart
    this.windowResize(window.innerWidth * 0.3, window.innerHeight * 0.3);

    //Add a listener for window's resize`
    window.addEventListener("resize", () => {
      this.windowResize(window.innerWidth * 0.3, window.innerHeight * 0.3);
    });

    //Response the update signal from other components
    this.$root.$on('updateBubble', (focus) => {

      this.focusUpdate(focus);
    })

    d3.select(d3.select('#' + this.id).node().parentNode)
    .style('top', this.top + 'px')
    .style('right', this.right + 'px')
    
  },

  watch:{

    //If data is updated, change chart source
    data: function(){

      console.log(this.data)

      let data = this.dataProcess(this.data, this.focus)

      this.chart.changeData(data)

    },

    //If focus item changed, change chart source
    focus: function(){

      let data = this.dataProcess(this.data, this.focus)

      this.chart.changeData(data)

    }

  },

  methods: {

    //data process 
    dataProcess(lists, dim){

        let newData = []

          const groupNames = ['group1', 'group2', 'group3', 
            'group4', 'group5', 'group6', 'group7', 
            'group8', 'group9', 'group10']

          for (let i=0;i<groupNames.length;i++){

            let meta = {}

            for (let j=0;j<lists.length;j++){
           
              if(lists[j]['item'] == dim && lists[j]['type'] == '签约人数'){
                
                  meta['value'] = parseInt(lists[j][groupNames[i]])

                  meta['group'] = i

                  meta['ratio'] = 100

                  meta['item'] = dim

                  continue;
              }
            }

            newData.push(meta)
          }

        return newData
      },

    //Chart initialization
    chartInit(){

        this.chart = new G2.Chart({
          container: this.id,
          padding: [50, 20, 50, 80],
        });

       this.chart.source({}, {
        group: {
            tickInterval: 1, // 自定义刻度间距
            nice: false, // 不对最大最小值优化
          
        },
        ratio: {
            tickInterval: 20,
            nice: false,
            max: 100,
            min: 0
        }
        });
        // 开始配置坐标轴
        this.chart.axis('group', {
        label: {
            formatter: function formatter(val) {
              return val + ' 组'; // 格式化坐标轴显示文本
            },
             textStyle: {
              fontSize: 12, 
              textAlign: 'center', 
              fill: '#ccc', 
            }
        },
        grid: {
            lineStyle: {
            stroke: '#d9d9d9',
            lineWidth: 1,
            lineDash: [2, 2]
            }
        }
        });
        this.chart.axis('ratio', {
        title: {
            offset: 64
        },
        label: {
            formatter: function formatter(val) {
              if (val > 0) {
                  return val + ' %';
              }
            },
             textStyle: {
              fontSize: 12, 
              fill: '#ccc', 
            }
        }
        });
        this.chart.legend(false);
        this.chart.tooltip({
          title: 'country'
        });
        this.chart.point().position('group*ratio')
        .size('value', [8, 25])
        .label('value', {
          offset: 0, // 文本距离图形的距离
          textStyle: {
              fill:'white'
        }
        }).opacity(0.3).shape('circle').tooltip('group*value').style({
          lineWidth: 1,
          stroke: '#1890ff'
        });
    
        this.chart.render();
    },

    //Update the focus item
    focusUpdate(focus){

      this.focus = focus

    },

    //Change chart size when window's size changed
    windowResize(width, height){

      this.chart.changeSize(width, height)

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
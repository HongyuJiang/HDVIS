<template>
<div id='radar-chart-container'>
      <div id='radar-chart'>
   
      </div>
  </div>
</template>

<script>

const d3 = require('d3');
import { DataView } from '@antv/data-set'

var data = [{
  item: '高血压',
  a: 64,
  b: 64
}, {
  item: '糖尿病',
  a: 16,
  b: 16
}, {
  item: '肺结核',
  a: 0,
  b: 0
}, {
  item: '低保',
  a: 41,
  b: 41
}, {
  item: '五保',
  a: 13,
  b: 13
}, {
  item: '残疾人口',
  a: 62,
  b: 62
}, {
  item: '贫困人口',
  a: 284,
  b: 284
}, {
  item: '低龄儿童',
  a: 213,
  b: 213
}, {
  item: '孕产妇',
  a: 7,
  b: 7
}, {
  item: '一般人群',
  a: 265,
  b: 0
}];

export default {

  name: 'radar-chart',
  data () {
    return {
      data: data
    }
  },

  mounted: function() {

    this.chartInit(this.data);
  },

  methods: {

    chartInit(){
        var dv = new DataView().source(data);
        dv.transform({
        type: 'fold',
        fields: ['a', 'b'], // 展开字段集
        key: 'user', // key字段
        value: 'score' // value字段
        });
        var chart = new G2.Chart({
        container: 'radar-chart',
        forceFit: true,
        height: 400,
        padding: [20, 20, 95, 20]
        });
        chart.source(dv, {
        score: {
            min: 0,
            max: 300
        }
        });
        chart.coord('polar', {
        radius: 0.8
        });
        chart.axis('item', {
        line: null,
        tickLine: null,
        grid: {
            lineStyle: {
            lineDash: null
            },
            
            hideFirstLine: false
        },
        });
        chart.axis('score', {
        line: null,
        tickLine: null,
        grid: {
            type: 'polygon',
            lineStyle: {
            lineDash: null
            }
        }
        });
        chart.legend('user', {
        marker: 'circle',
        offset: 30
        });
        chart.line().position('item*score').color('user').size(2);
        chart.point().position('item*score').color('user').shape('circle').size(4).style({
        stroke: '#fff',
        lineWidth: 1,
        fillOpacity: 1
        });
        chart.area().position('item*score').color('user');
        chart.render();
    }
  }
}
</script>

<style lang="css">


#radar-chart-container{
  width:80%;
  height:200px;
  position:absolute;
  top:10px;
  right:20px;
}

</style>
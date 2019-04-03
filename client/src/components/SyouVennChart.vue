<template>
  <div id='venn-chart-container'>
    <div class='chart-name chart-name-right'>重点人群种类</div>
    <div id='venn-chart'>
   
    </div>
  </div>
</template>
<script>

import G2 from '@antv/g2';

import * as d3 from 'd3';

let sets = [{
  sets: ['A'],
  size: 15,
  label: '糖尿病'
}, {
  sets: ['B'],
  size: 10,
  label: '高血压'
}, {
  sets: ['C'],
  size: 8,
  label: '白内障'
}, {
  sets: ['D'],
  size: 20,
  label: '贫困户'
}, {
  sets: ['A', 'B'],
  size: 3,
  label: ''
}, {
  sets: ['A', 'C'],
  size: 2,
  label: ''
}, {
  sets: ['B', 'C'],
  size: 1,
  label: ''
}, {
  sets: ['A', 'B', 'C'],
  size: 1,
  label: ''
}];


export default {
  name:'venn-chart',
  data () {
    return {
      setsData: sets
    }
  },
  mounted(){

    this.chartInit()
  },
  methods:{

      chartInit(){

        let chart = new G2.Chart({
            container: 'venn-chart',
            forceFit: true,
            padding: 10,
            height: 300
        });

        chart.source(this.setsData);
        chart.axis(false);
        chart.legend(false);
        chart.tooltip(true);
        chart.venn().label('sets') 
        .size('size')
        .color('id').active(true).shape('solid').style({
            lineWidth: 8,
            strokeOpacity:0.5,
            fillOpacity:0.3,
            padding: 10,
            textStyle: {
              fontSize: 15,
              fill: '#fff'
            }
        });
        chart.render();
      }
  }
}
</script>

<style scoped>

#venn-chart-container{

  width:100%;
  height:300px;
  position:absolute;
  top:400px;
}

</style>
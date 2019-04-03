<template>

  <div id='test-line-chart-container'>
      <div class='chart-name chart-name-right'>辖区签约趋势</div>
      <div id='test-line-chart'>
   
      </div>
  </div>
</template>
<script>

import G2 from '@antv/g2';

import * as d3 from 'd3';

let lineData = [
  {'time': '3-21', 'pm25': 10, 'pm100': 10},
  {'time': '3-22', 'pm25': 20, 'pm100': 10},
  {'time': '3-23', 'pm25': 30, 'pm100': 10},
  {'time': '3-24', 'pm25': 20, 'pm100': 10},
  {'time': '3-25', 'pm25': 50, 'pm100': 10},
  {'time': '3-25', 'pm25': 30, 'pm100': 10}
]


export default {
  name:'line-chart',
  data () {
    return {
      lineData: lineData
    }
  },
  methods:{

      chartInit(){

          var chart = new G2.Chart({
            container: 'test-line-chart',
            width: 470,
            height: 300,
          });

          chart.axis('pm25', {
                label: {
                    textStyle: {
                    fontSize: 12, 
                    textAlign: 'center', 
                    fill: '#ccc', 
                    }
                }
            });

            chart.axis('time', {
                label: {
                    textStyle: {
                    fontSize: 12, 
                    textAlign: 'center', 
                    fill: '#ccc', 
                    }
                }
            });
            
            chart.source(this.lineData);
            /*chart.scale('value', {
                min: 0
            });
            chart.scale('year', {
                range: [0, 1]
            });*/
            chart.tooltip({
            crosshairs: {
                type: 'line'
            }
            });
            chart.line().position('time*pm25').shape('smooth');
            chart.point().position('time*pm25').size(4).shape('circle').style({
            stroke: '#fff',
            lineWidth: 1
            });

            chart.render()
        }
  },
  mounted(){

    d3.select('#' + 'test-line-chart-container')
      .style('position', 'absolute')
      .style('top', '50px')
    
    this.chartInit()
  },
}
</script>

<style scoped>

#test-line-chart-container{

  width:100%;
  height:300px;
}

</style>
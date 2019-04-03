<template>

  <div id='bubble-frequency-chart-container'>
      <div class='chart-name chart-name-left'>辖区签约趋势</div>
      <div id='bubble-frequency-chart'>
   
      </div>
  </div>
</template>
<script>

import G2 from '@antv/g2';

import * as d3 from 'd3';

let Shape = G2.Shape;
Shape.registerShape('point', 'image', {
  drawShape: function drawShape(cfg, container) {
    cfg.points = this.parsePoints(cfg.points);
    var coord = this._coord;
    container.addShape('line', {
      attrs: {
        x1: cfg.points[0].x,
        y1: cfg.points[0].y,
        x2: cfg.points[0].x,
        y2: coord.start.y,
        stroke: '#ccc',
        lineWidth: 1,
        lineDash: [4, 2]
      }
    });
    return container.addShape('image', {
      attrs: {
        x: cfg.points[0].x - 12 * cfg.size / 2,
        y: cfg.points[0].y - 12 * cfg.size,
        width: 12 * cfg.size,
        height: 12 * cfg.size,
        img: cfg.shape[1]
      }
    });
  }
});

const imageMap = {
  'Internet Explorer': 'https://gw.alipayobjects.com/zos/rmsportal/eOYRaLPOmkieVvjyjTzM.png',
  'Chrome': 'https://gw.alipayobjects.com/zos/rmsportal/dWJWRLWfpOEbwCyxmZwu.png',
  'Firefox': 'https://gw.alipayobjects.com/zos/rmsportal/ZEPeDluKmAoTioCABBTc.png',
  'Safari': 'https://gw.alipayobjects.com/zos/rmsportal/eZYhlLzqWLAYwOHQAXmc.png',
  'Opera': 'https://gw.alipayobjects.com/zos/rmsportal/vXiGOWCGZNKuVVpVYQAw.png',
  'Undetectable': 'https://gw.alipayobjects.com/zos/rmsportal/NjApYXminrnhBgOXyuaK.png'
};

const data = [{
  name: 'Internet Explorer',
  value: 13
}, {
  name: 'Chrome',
  value: 20
}, {
  name: 'Firefox',
  value: 15
}, {
  name: 'Safari',
  value: 12
}, {
  name: 'Opera',
  value: 8
}, {
  name: 'Undetectable',
  value: 4
}];

export default {
  name:'bubble-frequency-chart',
  methods:{

    chartInit(){

        var chart = new G2.Chart({
            container: 'bubble-frequency-chart',
            forceFit: true,
            height: 280,
            width: 300,
            padding: [0, 40, 50]
        });
        
        chart.source(data, {
            value: {
                nice: false,
                max: 35,
                min: 0
            }
        });

        chart.legend(false);
        chart.axis('value', false);
        chart.point().position('name*value')
        .size('value').color('name')
        .shape('name', function(name) {
            return ['image', imageMap[name]]; 
        })
        .label('value', {
            offset: -20,
            textStyle: {
                fontSize: 12 
            }
        });

        chart.axis('name', {
        label: {
            textStyle: {
            fontSize: 12, 
            fill: '#ccc', 
            }
          }
        });

        chart.render();
        }
        
    },
  mounted(){

    this.chartInit()
  },
}
</script>

<style scoped>

#bubble-frequency-chart-container{

  width:100%;
  height:300px;
  position:absolute;
  top:700px;
}

</style>
<template>
<div id='group-pie-chart-container'>
      <div id='group-pie-chart'>
   
      </div>
  </div>
</template>

<script>
const d3 = require('d3');
import { DataView } from '@antv/data-set'

var data = [{
  item: '已签约',
  group: '一组',
  value: 1
}, {
  item: '未签约',
  group: '一组',
  value: 0
}, {
  item: '已签约',
  group: '二组',
  value: 1
}, {
  item: '未签约',
  group: '二组',
  value: 0
}, {
  item: '已签约',
  group: '三组',
  value: 1
}, {
  item: '未签约',
  group: '三组',
  value: 0
}, {
  item: '已签约',
  group: '四组',
  value: 1
}, {
  item: '未签约',
  group: '四组',
  value: 0
}, {
  item: '已签约',
  group: '五组',
  value: 1
}, {
  item: '未签约',
  group: '五组',
  value: 0
}, {
  item: '已签约',
  group: '六组',
  value: 1
}, {
  item: '未签约',
  group: '六组',
  value: 0
}, {
  item: '已签约',
  group: '七组',
  value: 1
}, {
  item: '未签约',
  group: '七组',
  value: 0
}, {
  item: '已签约',
  group: '八组',
  value: 1
}, {
  item: '未签约',
  group: '八组',
  value: 0
}, {
  item: '已签约',
  group: '九组',
  value: 1
}, {
  item: '未签约',
  group: '九组',
  value: 0
}, {
  item: '已签约',
  group: '十组',
  value: 1
}, {
  item: '未签约',
  group: '十组',
  value: 0
}];

export default {

  name: 'group-pie-chart',
  data () {
    return {
      data: data
    }
  },

  mounted: function() {

    this.chartInit(this.data);
  },

  methods: {

    chartInit(data){

        var chart = new G2.Chart({
            container: 'group-pie-chart',
            height: 630,
            forceFit: true,
            padding: 20,
            width:100,
        });

        chart.source(data);
        chart.tooltip(false);
        chart.legend(false);

        chart.axis('group', {
           label: null
        });
        // 以 group 为维度划分分面
        chart.facet('list', {
        fields: ['group'],
        padding: 10,
        rowTitle: null,
        rows: 6,
        cols: 1,
        colTitle: null,
        eachView: function eachView(view, facet) {
            var data = facet.data;
            var dv = new DataView();
            dv.source(data).transform({
                type: 'percent',
                field: 'value',
                dimension: 'item',
                as: 'percent'
            });

            //view.legend(false);
            view.source(dv, {
                percent: {
                    formatter: function formatter(val) {
                        return val;
                    }
                },
                group: {
                    formatter: function formatter(val) {
                        return null;
                    },
                }
            });

            view.coord('theta', {
                innerRadius: 0.35
            });
         
            view.intervalStack().position('percent')
            .color('item').label('percent', {
              formatter: function formatter(val, item) {
                if (val > 0.99)
                  return val * 100 + '%';
                else
                  return null;
              },
              offset: 0,
              textStyle: {
                rotate: 0,
                textAlign: 'center',
                shadowBlur: 2,
                shadowColor: 'rgba(255, 255, 255, .45)',
                fill:'#fff',
                fontSize:12,
              }
            })
        
        }
        });

        chart.render();
    }
  }
}
</script>

<style lang="css">


#group-pie-chart-container{
  width:30%;
  height:500px;
  position:absolute;
  top:380px;
  left:20px;
}

</style>
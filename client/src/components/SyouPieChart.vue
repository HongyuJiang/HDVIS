<template>
<div id='pie-chart-container'>
      <div id='pie-container'>
   
      </div>
  </div>
</template>

<script>
const d3 = require('d3');

var data = [{
  item: '已签约',
  count: 40,
  percent: 0.7
}, {
  item: '未签约',
  count: 60,
  percent: 0.3
}];

export default {

  name: 'pie-chart',
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
        var chart = new G2.Chart({
          container: 'pie-container',
          height: 250
        });
        chart.source(data, {
          percent: {
            formatter: function formatter(val) {
              val = val * 100 + '%';
              return val;
            }
          }
        });
        chart.legend(false);
        chart.coord('theta');
       
        chart.intervalStack().position('percent')
        .color('item',['#0E82DE','#333'])
        .label('percent', {
          // autoRotate: false,
          formatter: function formatter(val, item) {
            return item.point.item + ': ' + val;
          },
          offset: 0,
          textStyle: {
            rotate: 0,
            textAlign: 'center',
            shadowBlur: 2,
            shadowColor: 'rgba(255, 255, 255, .45)',
            fill:'#fff',
            fontSize:16,
          }
        })
        .tooltip('item*percent', function(item, percent) {
          percent = percent * 100 + '%';
          return {
            name: item,
            value: percent
          };
        }).style({
          lineWidth: 2,
          stroke: '#000'
        });

        chart.render();
    }
  }
}
</script>

<style lang="css">


#pie-chart-container{
  width:80%;
  height:200px;
  position:absolute;
  top:120px;
  left:20px;
}

</style>
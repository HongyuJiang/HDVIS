<template>
<div id='tick-dash-chart-container'>
      <div id='tick-dash-container'>
   
      </div>
  </div>
</template>

<script>
const d3 = require('d3');

var icon = 'M381.759 0h292l-.64 295.328-100.127-100.096-94.368 94.368C499.808 326.848 512 369.824 512 415.712c0 141.376-114.56 256-256 256-141.376 0-256-114.624-256-256s114.624-256 256-256c48.8 0 94.272 13.92 133.12 37.632l93.376-94.592L381.76 0zM128.032 415.744c0 70.688 57.312 128 128 128s128-57.312 128-128-57.312-128-128-128-128 57.312-128 128z'

var data = [{
  gender: '1',
  path: icon,
  value: 100
}, {
  gender: '2',
  path: icon,
  value: 100
}, {
  gender: '3',
  path: icon,
  value: 100
}, {
  gender: '4',
  path: icon,
  value: 100
}, {
  gender: '5',
  path: icon,
  value: 100
}, {
  gender: '6',
  path: icon,
  value: 100
}, {
  gender: '7',
  path: icon,
  value: 100
}, {
  gender: '8',
  path: icon,
  value: 100
}, {
  gender: '9',
  path: icon,
  value: 100
}, {
  gender: '10',
  path: icon,
  value: 40
}];

export default {
  name: 'tick-dash-chart',
  data () {
    return {
      data: data
    }
  },

  mounted: function() {

    this.chart = null

    this.$root.$on('updateRatio', (msg) => {

      var ratioTable = {

        '一组':31,
        '二组':40,
        '三组':51,
        '四组':34,
        '五组':44,
        '六组':51,
        '七组':29,
        '八组':42,
        '九组':37,
        '十组':33,
      }

      this.data[9]['value'] = ratioTable[msg]

      this.chart.destroy()

      this.chartInit(this.data);
      
    })

    this.chartInit(this.data);

  },

  methods: {

    chartInit(){

        this.chart = new G2.Chart({
          container: 'tick-dash-container',
          height: 100,
          width: 580,
          padding: 0,
          hoverable:false,
        });
        this.chart.source(data, {
          value: {
              min: 0,
              max: 100
          }
        });
        this.chart.legend(false);
        this.chart.axis(false);
        this.chart.tooltip(false);
        this.chart.interval().position('gender*value')
        // .shape('path', path => [ 'liquid-fill-path', path ])
        .shape('liquid-fill-gauge').style({
            lineWidth: 10,
            opacity: 0.75
        });

        var that = this

        data.forEach(function(row) {
          that.chart.guide().text({
              top: true,
              position: {
                  gender: row.gender,
                  value: 50
              },
              content: row.value + '%',
              style: {
              opacity: 0.75,
              fontSize: 15,
              fill: 'white',
              textAlign: 'center'
              }
          });
        });

        this.chart.render();

    }
  }
}
</script>

<style lang="css">


#tick-dash-chart-container{
  height:200px;
  position:absolute;
  top:350px;
  right:40px;
}

</style>
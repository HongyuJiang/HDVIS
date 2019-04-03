<template>
<div id='ratio-chart-container'>
      <div id='ratio-container'>
   
      </div>
  </div>
</template>

<script>
const d3 = require('d3');

var data = [{
  profession: '两年制副学士学位',
  highest: 110000,
  minimum: 23000,
  mean: 56636
}, {
  profession: '执法与救火',
  highest: 120000,
  minimum: 18000,
  mean: 66625
}, {
  profession: '教育学',
  highest: 125000,
  minimum: 24000,
  mean: 72536
}, {
  profession: '心理学',
  highest: 130000,
  minimum: 22500,
  mean: 75256
}, {
  profession: '计算机科学',
  highest: 131000,
  minimum: 23000,
  mean: 77031
}];

export default {

  name: 'ratio-chart',
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
          container: 'ratio-container',
          height: 250,
          forceFit: true,
          padding: [20, 80, 50, 110]
        });

        chart.source(data, {
          percent: {
            formatter: function formatter(val) {
              val = val * 100 + '%';
              return val;
            }
          }
        });

        chart.source(data);
        chart.coord().transpose();
        chart.axis('profession', {
        label: {
            offset: 12
        }
        });
        chart.interval().position('profession*range');

        chart.render();

        return chart
    }
  }
}
</script>

<style lang="css">


#ratio-chart-container{
  width:80%;
  height:200px;
  position:absolute;
  top:320px;
  left:20px;
}

</style>
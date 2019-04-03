<template>
<div v-bind:id='id' class="gauge-chart-container">
      <div v-bind:id='container' >
   
      </div>
  </div>
</template>

<script>
const d3 = require('d3');

const props = {

  id:{
    type: String,
    default: () => 0,
  },
  right: {
    type: String,
    default: () => '',
  },
  value: {
    type: String,
    default: () => 0,
  },
  container: {
    type: String,
    default: () => '',
  },
  name: {
    type: String,
    default: () => '',
  }
};

export default {

  name: 'gauge-chart',
  props,
  mounted: function() {

    d3.select('#' + this.id).style('right', this.right + 'px')
    this.chartInit(this.data);
  },

  methods: {

    chartInit(){

        var data1 = [];
        for (var i = 0; i < 50; i++) {
            var item = {};
            item.type = i + '';
            item.value = 10;
            data1.push(item);
        }

        var data2 = [];
        for (var _i = 0; _i < 50; _i++) {
            var _item = {};
            _item.type = _i + '';
            _item.value = 10;
        
            if (_i > this.value/2) {
                _item.value = 0;
            }
            data2.push(_item);
        }

        var chart = new G2.Chart({
        container: this.container,
        height: 150,
        padding: 0
        });
        chart.scale({
        type: {
            range: [0, 1]
        },
        value: {
            sync: true
        }
        });
        chart.legend(false);
        chart.tooltip(false);
        var view1 = chart.view();
        view1.source(data1);
        view1.axis(false);
        view1.coord('polar', {
            startAngle: -9 / 8 * Math.PI,
            endAngle: 1 / 8 * Math.PI,
            innerRadius: 0.75,
            radius: 0.8
        });
        view1.interval().position('type*value').color('#CBCBCB').size(3);

        var view2 = chart.view();
        view2.source(data1, {
        type: {
            tickCount: 3
        }
        });
        view2.axis('value', false);
        view2.axis('type', {
        grid: null,
        line: null,
        tickLine: null,
        label: {
            offset: -15,
            textStyle: {
            textAlign: 'center',
            fill: '#CBCBCB',
            fontSize: 12
            },
            formatter: function formatter(val) {
            if (val === '49') {
                return 50;
            }

            return val;
            }
        }
        });
        view2.coord('polar', {
            startAngle: -9 / 8 * Math.PI,
            endAngle: 1 / 8 * Math.PI,
            innerRadius: 0.95,
            radius: 0.55
        });
        view2.interval().position('type*value').color('#CBCBCB').size(3);

        var view3 = chart.view();
        view3.source(data2);
        view3.axis(false);
        view3.coord('polar', {
            startAngle: -9 / 8 * Math.PI,
            endAngle: 1 / 8 * Math.PI,
            innerRadius: 0.75,
            radius: 0.8
        });
        view3.interval().position('type*value').color('value', '#3023AE-#53A0FD').opacity(1).size(3);
        view3.guide().text({
        position: ['50%', '65%'],
        content: this.value,
        style: {
            fill: '#CBCBCB',
            fontSize: 32,
            textAlign: 'center',
            textBaseline: 'middle'
        }
        });

        view3.guide().text({
        position: ['50%', '95%'],
        content: this.name,
        style: {
            fill: '#CBCBCB',
            fontSize: 15,
            textAlign: 'center',
            textBaseline: 'middle'
        }
        });

        chart.render();
    }
  }
}
</script>

<style lang="css">


.gauge-chart-container{
  height:200px;
  position:absolute;
  bottom:0px;
}

</style>
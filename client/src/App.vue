<template>
  <div id="app">
    <div class="float-layer left-float-layer">
       <fixed-attr-indicator class="fixed-attrs"/>
       <dynamic-attr-indicator 
          name=辖区居民
          value=1303
          top=130
          id = xiaqu
          class="dynamic-attrs"
        />
        <dynamic-attr-indicator
          name=签约人数
          value=974
          top=230
          id = qianyue
          class="dynamic-attrs"
        /> 
        <syou-pie-chart
          class="pie-chart"
        />
        <syou-group-pie-chart
          class="group-pie-chart"
        />
        <syou-group-bar-chart
          class="group-bar-chart"
        />
     
     
    </div>

    <syou-mapbox-view class="mapbox-view"/>

    <div class="float-layer right-float-layer">
      <syou-vertical-bar-chart class="vertical-bar-chart"/>
      <syou-tick-dash-chart class="tick-dash-chart"/>
      <syou-bubble-chart class="bubble-chart" v-bind:data = "bubbleData" />
      <syou-gauge-chart 
        id='index-1'
        right='-50'
        container="gauge1" 
        class="gauge-chart" 
        value='100'
        name='签约评估得分'
      />
      <syou-gauge-chart
        id='index-2'
        right='200'
        container="gauge2" 
        class="gauge-chart"
        value='90'
        name='达标评估得分'
      />
    </div>  

  </div>


</template>

<script>

import SyouMapboxView from './components/SyouMapboxView';

////////////////////////////////////////////////////
import SyouPieChart from './components/SyouPieChart';
import SyouLineChart from './components/SyouLineChart';
import SyouGaugeChart from './components/SyouGaugeChart';
import SyouRatioChart from './components/SyouRatioChart';
import SyouGroupBarChart from './components/SyouGroupBarChart';
import FixedAttrIndicator from './components/FixedAttrIndicator';
import DynamicAttrIndicator from './components/DynamicAttrIndicator';
//import SyouBubbleFrequencyChart from './components/SyouBubbleFrequencyChart';
import SyouGroupPieChart from './components/SyouGroupPieChart';
import SyouVerticalBarChart from './components/SyouVerticalBarChart';
import SyouTickDashChart from './components/SyouTickDashChart';
import SyouBubbleChart from './components/SyouBubbleChart';
import DataProvider from './DataProvider';

export default {
  name: 'App',
  components: {
    SyouPieChart,
    SyouLineChart,
    SyouGaugeChart,
    SyouMapboxView,
    SyouRatioChart,
    SyouGroupBarChart,
    SyouGroupPieChart,
    SyouVerticalBarChart,
    FixedAttrIndicator,
    DynamicAttrIndicator,
    SyouTickDashChart,
    SyouBubbleChart,
  },
  data () {
    return {
      bubbleData: {}
    }
  },
  mounted: function() {

    DataProvider.getItemGroupCsv().then(response => {

          //this data is bind with the instance of component
          this.bubbleData = response.data
          
        }, error => {

          console.log('unable to get data')
        });

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.float-layer {
  position: absolute;
  z-index:999;
  width:25%;
  height:100%;

}

.left-float-layer{

  left:0px;
}

.right-float-layer{

  right:0px;
}


body {
    margin:0; 
    padding:0;
    width:100%;
    height:100%;
}

.chart-name{
    color:white; 
    margin-bottom:30px;
    border-top: 3px solid #F0B04D;
    background: rgba(255,255,255,0.1);
    padding:10px;
}

.chart-name-right{

    float:right; 
    right:10px;
    margin: 0%;
  
}

.chart-name-left{

    float:left; 
    left:10px; 
    margin: 5%;

}
</style>

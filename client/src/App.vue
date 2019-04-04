<template>
  <div id="app">
    <div class="float-layer left-float-layer">
        <contrib-chart class="contrib-chart" name='贡献度排名' />

    </div>

    <para-chart class="para-chart" name='平行坐标' />

    <div class="float-layer right-float-layer">
     
      <syou-bubble-chart class="bubble-chart" name='投影视图'  />
    
    
    </div>  

  </div>


</template>

<script>

////////////////////////////////////////////////////
import SyouBubbleChart from './components/SyouBubbleChart';
import ParaChart from './components/ParaChart';
import ContribChart from './components/ContribChart';
import DataProvider from './DataProvider';

export default {
  name: 'App',
  components: {
    SyouBubbleChart,
    ParaChart,
    ContribChart,
  },
  data () {
    return {
      bubbleData: {}
    }
  },
  mounted: function() {

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
    color:black; 
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

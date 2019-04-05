<template>
  <div id="app">
    <div class="float-layer left-float-layer">
        <contrib-chart class="contrib-chart" name='贡献度排名' />\
        <trend-chart class="trend-chart" name='关注城市出入省趋势' />

    </div>

    <para-chart class="para-chart" name='平行坐标' />
     <map-view class="map-view" name='迁入-迁出对比'  />

    <div class="float-layer right-float-layer">
     
      <project-chart class="project-chart" name='投影视图'  />
      <province-data-table class="province-data-table" name='数据表'  />
     
    </div>  

  </div>


</template>

<script>

////////////////////////////////////////////////////
import ProjectChart from './components/ProjectChart';
import ParaChart from './components/ParaChart';
import ContribChart from './components/ContribChart';
import TrendChart from './components/TrendChart';
import MapView from './components/MapView';
import ProvinceDataTable from './components/ProvinceDataTable';
import DataProvider from './DataProvider';

export default {
  name: 'App',
  components: {
    ProjectChart,
    ParaChart,
    ContribChart,
    TrendChart,
    ProvinceDataTable,
    MapView,
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


.chart-name-middle{

    position: absolute;
    left: 50%;
    margin: 0%;
    top:20px;
  
}

.chart-name-left{

    float:left; 
    left:10px; 
    margin: 0%;

}
</style>

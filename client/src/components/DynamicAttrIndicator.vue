<template>
<div class="container" v-bind:id='id'>
  <div class="index_name">
      <p> {{name}} </p>
  </div>
  <div class="index_value">
      <h2> {{value}} </h2>
  </div>
</div>
</template>
<script>

import * as d3 from 'd3';

const props = {
  name: {
    type: String,
    default: () => '',
  },
  value: {
    type: String,
    default: () => 0,
  },
  top:{
    type: String,
    default: () => 0,
  },
  id:{
    type: String,
    default: () => 0,
  }
};

export default {
  name: 'dynamic-attrs',
  props,
  mounted() {
   d3.select('#' + this.id).style('top', this.top + 'px')
   console.log(d3.select('#' + this.id))
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.container{

    position: absolute;
    width:51%;
    height: 3%;
    left: 50px
}

.index_name{

    border-left: 2px solid #F0B04D;
    position: absolute;
    width:31%;
    height: 80%;
    padding-left:10px;
  
}

.index_name p{

    color: #fff;
    margin: 0px;
    font-weight: 100
}

.index_value{

    border-bottom: 1px solid rgba(255,255,255,0.3);
    position: absolute;
    width:51%;
    height: 100%;
    top: 40px;
  
}


.index_value h2{

    color: #fff;
    margin: 0px;
    font-weight: 100
}



</style>

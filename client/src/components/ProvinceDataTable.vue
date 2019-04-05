<template>
<div id='table-container' class="ui">
    <div class='chart-name chart-name-right'>{{name}}</div>
       <vuetable ref="vuetable"
            :fields="columns"
            :data='rows'
            :api-mode="false"
        ></vuetable>
  </div>
</template>

<script>
 
const d3 = require('d3');
import * as dsv from 'd3-dsv';
import Vuetable from 'vuetable-2'

import DataProvider from '../DataProvider';

const props = {
  id: {
    type: String,
    default: () => 'table-container',
  },
  name: {
    type: String,
    default: () => '未命名',
  },
  top:{
    type: Number,
    default: () => 510,
  },
  right:{
    type: Number,
    default: () => 30,
  },
 
};

export default {

  name: 'province-data-table',
  props,
  components: {
    Vuetable
  },
  data(){
      return {
        columns: [],
        rows: []
      }
  },
  mounted: function() {

    d3.select('#' + this.id)
        .style('position', 'absolute')
        .style('top', this.top + 'px')
        .style('right', this.right + 'px')

    let that = this

    DataProvider.getPopulationData().then(response => {

        let data = dsv.csvParse(response.data)
        let {columns, population_data} = this.dataProcess(data)
        that.columns = columns
        that.rows = population_data

    }, error => {
       
    });


  },

  methods: {

    //data process 
    dataProcess(contents){

        let population_data = contents;
        let columns = population_data['columns']
        let data_dict = this.get_dimension_values(population_data, columns)

        return  {columns, population_data}
    },

    //Chart initialization
    chartInit(data, dimensions, data_dict){

       
    },
    get_dimension_values(data, dimension){

        let data_dict = {}

        dimension.forEach(function(dim){
            
            data_dict[dim] = []
        })

        data.forEach(function(d){

            dimension.forEach(function(dim){
            
                data_dict[dim].push(parseFloat(d[dim]))
            })
    
        })

        return data_dict
    }


  }
}
</script>

<style lang="css">


#table-container{
    position:absolute;
    width: 630px;
    height: 410px;
    
}

#table-container .chart-name{
   top: 0px;
   position: absolute 

}

#table-container table{
    margin-top:50px;
}

div .vuetable-body-wrapper{
    overflow-y: auto;
    height: 430px;
}


div .vuetable-body-wrapper *{
    font-size:8px !important;
}

</style>
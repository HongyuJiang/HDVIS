<template>
  <div id="map"></div>
</template>

<script>
import DataProvider from '../DataProvider';
import * as mapboxgl from 'mapbox-gl';

export default {
  name: 'mapbox-view',

  mounted() {
    this.map = ''
    this.mapInit(this);
    this.mapLoadGeojson(this);

    this.$root.$on('addAIcon', () => {
      this.mapAddIcon()
    })

  },
  methods: {

    addRegion2Map(features){

      this.map.addSource("region_json", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": features.features
        },
      })

      this.map.addLayer({
        "id": "region",
        "type": "fill",
        "source": "region_json",
        "paint": {
            "fill-color": "#fff",
            "fill-opacity": 0.1
        },
        minzoom: 7,
        maxzoom: 10,
      });

      this.map.addLayer({
        "id": "region_boundry",
        "type": "line",
        "source": "region_json",
        "paint": {
            'line-width': 1.5,
            'line-color': "black",
        },
        minzoom: 7,
        maxzoom: 10,
      });

      this.map.addLayer({
        "id": "region-label",
        "type": "symbol",
        "source": "region_json",
        "layout": {
          "text-field": "{name}",
          "text-size": 12,
         
        },
        "paint": {

           "text-color": '#fff'
        }
    });
    },
     addCounty2Map(features){

      this.map.addSource("town_json", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": features.features
        },
      })

      this.map.addLayer({
        "id": "county-overlay",
        "type": "fill",
        "source": "town_json",
        "paint": {
            "fill-color": "#fff",
            "fill-opacity": 0.1
        },
        minzoom: 10,
        maxzoom: 20,
      });

      
      this.map.addLayer({
        "id": "county-outline",
        "type": "line",
        "source": "town_json",
        "paint": {
            'line-width': 1,
            'line-color': "#000",
            'line-opacity': 1,
        },
        minzoom: 9,
        maxzoom: 20,
      });


      this.map.addLayer({
          "id": "county-label",
          "type": "symbol",
          "source": "town_json",
          "layout": {
            "text-field": "{name}",
            "text-size": 12,
          },
          "paint": {
            "text-color": '#fff'
          },
          minzoom: 9,
          maxzoom: 20,
      });
    },
    
    mapInit(that){
      mapboxgl.accessToken = 'pk.eyJ1IjoiaG9uZ3l1amlhbmciLCJhIjoiY2o1Y2VldHpuMDlyNTJxbzh5dmx2enVzNCJ9.y40wPiYB9y6qJE6H4PrzDw';
      this.map = new mapboxgl.Map({
          container: 'map', // container id
          style: 'mapbox://styles/hongyujiang/cjl1ya0sn4m0m2sqj0pbkuqor', // stylesheet location
          center: [104.849,31.5580], // starting position [lng, lat]
          zoom: 8.5 // starting zoom
      });

    },
    mapLoadGeojson(that){

    this.map.on('load', function(){

           DataProvider.getRegionJson().then(response => {
              
                that.data = response.data;
                that.addRegion2Map(that.data)

              }, error => {
                that.loading = false;
            });

            DataProvider.getCountyJson().then(response => {
              
                that.data = response.data;
                that.addCounty2Map(that.data)

              }, error => {
                that.loading = false;
            });

            that.mapAddCircle(that)
    
      })
    },
    mapAddDIYIcon(that){

        that.map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png', function(error, image) {
        if (error) throw error;
        that.map.addImage('cat', image);
        that.map.addLayer({
            "id": "wudu",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [104.862946,31.333467]
                        }
                    }]
                }
            },
            "layout": {
                "icon-image": "cat",
                "icon-size": 0.25,
            
            }
        });
    });
    },

    mapAddIcon(that){

        that.map.addLayer({
            "id": "wudu",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [104.862946,31.333467]
                        }
                    }]
                }
            },
            "layout": {
                "icon-image": "marker-15",
                "icon-size": 1
            }
        });
    },

    mapAddCircle(that){

        that.map.addSource("wubai", {
          "type": "geojson",
          "data": {
              "type": "FeatureCollection",
              "features": [{
                  "properties":{
                      "name":"五柏村",
                  },
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [104.862946,31.333467]
                  }
              }]
           }
        })
      
        that.map.addLayer({
            "id": "wubai-circle",
            "type": "circle",
            "source": 'wubai',
            'paint': {
                // make circles larger as the user zooms from z12 to z22
                'circle-radius': 7,
                'circle-color': '#FCE246',
                "circle-stroke-width": 3,
                "circle-stroke-color": "#FE7F2D"
             
            }
            
        });

        that.map.addLayer({
            "id": "wubai-text",
            "type": "symbol",
            "source": 'wubai',
             layout: {
              "text-field": "{name}",
             // "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12,
              "text-offset": [0, 1.2],
              "text-anchor": "top",

            },
            "paint": {
                "text-color": '#fff',
              
            }
        });

        that.map.on('click', 'wubai-circle', function (e) {
          new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(e.features[0].properties.name)
              .addTo(that.map);
        });

    },

  },

   data() {
      return {
        data: [],
        loading: true,
       };
    },

};
</script>

<style lang="css">

div #map { 
    position:absolute; 
    width:100%; 
    height:100%;
}

body { margin:0; padding:0; }

</style>
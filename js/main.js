var express = require('express');
var app = express();
var d3 = require('d3');
var jsdom = require('jsdom');
var fs = require('fs');
var d3_dsv = require('d3-dsv');
var para = require('./para');
var project = require('./project');
var contrib = require('./contrib');
var trend = require('./trend');
var map = require('./map');

const {JSDOM} = jsdom;  
//const {document} = (new JSDOM('<!doctype html><html><body></body></html>')).window;  

if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch-polyfill');
}

app.get('/', function (req, res) {

    function get_data_dist(data, dimension){

        data_bucket = []

        data.forEach(d => data_bucket.push(parseFloat(d[dimension])))

        let data_max = d3.max(data_bucket)
        let data_min = d3.min(data_bucket)

        var histGenerator = d3.histogram()
        .domain([data_min, data_max])
        .thresholds(19); 

        let data_bined = histGenerator(data_bucket)

        let bins = []

        data_bined.forEach(function(block){

            let len = block.length

            bins.push({'count':len, 'x0':block.x0, 'x1':block.x1, 'dim': dimension})
        })

        return bins
    }

    function get_dimension_values(data, dimension){

        data_dict = {}

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


    fs.readFile('2010-population.csv', 'utf8', function(err, contents) {

        let {document} = (new JSDOM('<!doctype html><html><body style="width:100% height:100%"><script></script></body></html>')).window;  

        var mapContainer = d3.select(document.body).append('div')
            .style('id', 'map')
            .style('top', '1000px')
            .style('left','0px')
            .style('width', 1200)
            .style('height', 2500);

        let height = document.body.scrollHeight
            width = document.body.scrollWidth

        let population_data = d3_dsv.csvParse(contents.slice(1, contents.length));
        
        let columns = population_data['columns']

        columns.shift()

        let data_dict = get_dimension_values(population_data, columns)

        var svg = d3.select(document.body).append('svg')
            .style('display', 'block')
            .style('margin', 'auto')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('width', 1200)
            .attr('height', 2500);

        para.darw(svg, population_data, columns, data_dict)

        fs.readFile('2010-province-pca-points.csv', 'utf8', function(err, contents) {

            fs.readFile('china.json', 'utf8', function(err, mapData) {

                let origin_data = d3_dsv.csvParse(contents);
        
                points_data = []
        
                origin_data.forEach(function(d){
        
                    let x = +d['pc1']
                    let y = +d['pc2']
        
                    points_data.push({'x':x,'y':y,'name':d['省份']})
                })
    
                project.darw(svg, points_data)
    
                contrib.darw(svg)
    
                trend.darw(svg)
    
                map.darw(svg, JSON.parse(mapData), population_data)
        
                res.send(document.body.innerHTML);
            });
        });

    });

})
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})


// Set the margins for our graph as well as define the svg dimensions
var margin = { top: window.innerHeight * .025, right: window.innerWidth * .1, bottom: window.innerHeight * .025, left: window.innerWidth * .1},
    width = window.innerWidth - 16 - margin.left - margin.right,
    height = window.innerHeight - 110 - margin.top - margin.bottom;

// Create the svg within the DOM abd define margins 
let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "svg")
    .style('margin-left', margin.left)
    .style('margin-right', margin.right)
    .style('margin-top', margin.top)
    .style('margin-bottom', margin.bottom)

// nygeo data which contains information on the overall nyc map 
d3.json('./nygeo.json').then(function(data) {

    // data which contains information on individual points
    d3.csv('data.csv').then(function(pointData) {

        // scaling function to convert point data to map. Rotated to proper lat/long
        const albersProj = d3.geoAlbers()
            .scale(75000)
            .rotate([74.0060, 0])
            .center([0, 40.7120])
            .translate([width/2, height/2]);

        // projects points onto the map
        const geoPath = d3.geoPath()
        .projection(albersProj)

        // grouping for paths which compose nyc map
        let nyc = svg.append( "g" ).attr( "id", "nyc" );
        nyc.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
            .attr('fill', '#878787')
            .attr('stroke', 'black')
            .attr('d', geoPath)

        // plots circles on the nyc map and adds on-click function 
        // that transitions point to new direction + removes point from map.
        let bnb = svg.append( "g" ).attr( "id", "bnb" );
        bnb.selectAll('.circle')
            .data(pointData)
            .enter()
            .append('circle')
                .attr('cx', function(d) { 
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[0]
                })
                .attr('cy', function(d) {
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[1]
                })
                .attr('r', 4)
                .attr('fill', 'steelblue')
                .attr("stroke", "black")
                .on( "click", function(){
                    let thing = d3.select(this)
                        .attr("opacity", 1)
                        .transition()
                            .duration( 2000 )
                            .attr( "cy", 1000 )
                            .attr( "opacity", 0 )
                            .on("end", function(thing) {
                                d3.select(this).remove();
                            })
                  });

        
    })
  
})


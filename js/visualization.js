var cities = [
    { name: "Singapore", longitude: 103.851959, latitude: 1.29027 },
    { name: "London", longitude: -0.118092, latitude: 51.509865 },
    { name: "Tokyo", longitude: 139.839478, latitude: 35.652832 },
  ];

let width = "100%";
let height = "100%";
let svg = d3
  .select("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", `0 0 1000 600`);

// Map and projection
let projection = d3
  .geoOrthographic()
  .rotate([-112, -2, 0])
  .scale(230);
let geopath = d3.geoPath().projection(projection);

// Load GeoJSON data
d3.json(
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
).then((data) => {
  // Draw the map
  svg
    .append("g")
    .attr("id", "countries")
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "countries")
    .attr("d", (d) => geopath(d))
    .on("mouseover", (event, d) => {
      d3.select(".tooltip")
        .text(d.properties.name)
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px");
    })
    .on("mouseout", (event, d) => {
      d3.select(".tooltip").text("");
    });
});

svg
  .append("path")
  .datum({ type: "Sphere" })
  .attr("id", "ocean")
  .attr("d", geopath)
  .attr("fill", "lightBlue");

let graticule = d3.geoGraticule().step([10, 10]);

svg
  .append("g")
  .attr("id", "graticules")
  .selectAll("path")
  .data([graticule()])
  .enter()
  .append("path")
  .attr("d", (d) => geopath(d))
  .attr("fill", "none")
  .attr("stroke", "#aaa")
  .attr("stroke-width", 0.2);




svg.append("g")
.attr("id" , "cities")
.selectAll("circle")
.data(cities)
.enter().append("circle")
.attr("r" , 2)
.attr("cx", d => projection([d.longitude, d.latitude])[0])
.attr("cy", d => projection([d.longitude, d.latitude])[1])



let time = Date.now();

d3.timer(function() {
    let angle = (Date.now() - time) * 0.02;
    projection.rotate([angle, 0, 0]);
    svg.select("g#countries").selectAll("path")
      .attr("d", geopath.projection(projection));
    svg.select("g#graticules").selectAll("path")
      .attr("d", geopath.projection(projection));
    svg.select("g#cities").selectAll("circle")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("visibility", d => {
            var point = {type: 'Point', coordinates: [d.longitude, d.latitude]};
            if (geopath(point) == null) {
                return "hidden";
            } else { 
                return "visible";
            }
        });
});

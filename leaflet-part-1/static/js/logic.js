// data source for all earthquakes in the last 30 days: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson

// create tile layer for map background
let map_tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// create the map
let map = L.map("map", {
    center: [20, -30],
    zoom: 2.5
  });

// add tiles
map_tiles.addTo(map);

// retrieve geojson data
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
d3.json(url).then(function(data){

    // function for determining bubble color (depth)
    function bubbleColor(depth){
        switch(true) {
            case depth > 90:
                return "red";
            case depth >70:
                return "orange";
            case depth >50:
                return "yellow";
            case depth >30:
                return "green";
            case depth >10:
                return "blue";
            default:
                return "purple";
        };
    };

    // function for determining bubble size (magnitude)
    function bubbleSize(mag){
        if (mag == 0) {
            return 1;
        };

        return mag * 4;
    };

    // function for determining overall bubble settings
    function bubbleSettings(feature){
        return {
            opacity: 1,
            fillOpacity: 0.8,
            fillColor: bubbleColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: bubbleSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    };

    // add geojson data layer to map
    L.geoJson(data, {
        // make the bubble markers
        pointToLayer: function(feature, latlon){
            return L.circleMarker(latlon);
        },
        style: bubbleSettings,
        onEachFeature: function(feature, layer){
            layer.bindPopup(
                "Magnitude: " + feature.properties.mag 
                + "<br>Depth: " + feature.geometry.coordinates[2]
                + "<br>Location: " + feature.properties.place
            );
        }
    }).addTo(map);

    // make legend object
    let legend = L.control({
        position: "bottomright"
    });

    // define legend settings
    legend.onAdd = function(){
        let div = L.DomUtil.create("div", "info legend");

        let depths = [-10, 10, 30, 50, 70, 90];
        let colors = ["purple", "blue", "green", "yellow", "orange", "red"];

        for (let i = 0; i < depths.length; i++){
            div.innerHTML += "<i style= 'background: " + colors[i] + "'></i> " + depths[i] + (depths[i+1] ? "&ndash;" + depths[i+1] + "<br>" : "+");
        };
        return div;
    };

    // add legend to map
    legend.addTo(map);

    // geojsonLayer.on('add', function () {
    //     legend.addTo(map);
    // });

});





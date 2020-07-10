
 var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
  
});

// FUNCTIONS
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
function logscale(magnitude){

  if (typeof magnitude == 'number' && magnitude>1){
    return (Math.log(magnitude)*10)
    }

  else{
    return 1
    }
  
};

function colorcircles(mag){

  return mag > 5 ? '#e31a1c':
         mag > 4 ? '#fd8d3c':
         mag > 3 ? '#fecc5c':
         mag > 2 ? '#ffffb2':
                    '#fef0d9';
};

function createcircles(data){

  
  function onEachFeature(feature, layer) {

    layer.bindPopup("<h3>" +"Magnitude " + feature.properties.mag + "<br>"+"Location: "+ feature.properties.place+
    "</h3><hr><p>" + "Time: "+ new Date(feature.properties.time) + "</p>")

  }

var earthquakes = L.geoJSON(data, {
      pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng,{
          radius: logscale(feature.properties.mag),
          fillColor: colorcircles(feature.properties.mag),
          color:"#000",
          weight:1,
          opacity:.25,
          fillOpacity:.75

        })
        
      },
      onEachFeature: onEachFeature
    }).addTo(myMap)

    createMaps(earthquakes)
  };

function createMaps(data){

var url2 ="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_steps.json"


d3.json(url2, fdata=>{

  var dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
});

var sat = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
});

var def = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
});


var baseMaps = {
  "Default": def,
  "Dark": dark,
  "Satellite":sat
}



 L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox/streets-v11",
          accessToken: API_KEY
  }).addTo(myMap);




var mapStyle = {
    color: "Red",
    fillOpacity: 0.5,
    weight: 0.5
  };

  

   var faulty = L.geoJson(fdata,{
      // Passing in our style object
      style: mapStyle
    }).addTo(myMap);
  
  var overlayMaps = {

    "Earthquakes": data,
    "Fault Lines": faulty
  };

L.control.layers(baseMaps,overlayMaps,
  {collapsed:true
  
  }).addTo(myMap);

})

};


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(url, data=> createcircles(data.features));




// Legend
// ____________________________________________________________________
var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 2, 3, 4, 5, 6, ],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colorcircles(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  legend.addTo(myMap)

  // ____________________________________________________________________














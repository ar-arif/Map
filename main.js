function preload(){
  
    fetch("https://api.covid19api.com/summary")
      .then((apiData) => {
        return apiData.json();
      })
      .then((data) => {
        const coronaData = data;
        // console.log(coronaData);
  
        afterThat(coronaData);
      });
      
      
      fetch("https://raw.githubusercontent.com/ar-arif/Map/master/countries.json")
      .then((countysLocation) => {
        return countysLocation.json();
      })
      .then((data) => {
        const countrysLanLon = data;
        // console.log(countrysLanLon);
        
        afterThat(countrysLanLon);
      });
      
    
  }
  preload();
    
  
  
  function afterThat(coronaData, countrysLanLon) {
    
    const coronaDataLatest = coronaData;
    console.log(coronaDataLatest)
    
    
    const counLanLon = countrysLanLon;
    console.log(counLanLon);
  
  for (var i = 0; i < coronaDataLatest.Countries. length; i++) {
    
    let coronaCountriesID = coronaDataLatest.Countries[i].CountryCode.toLowerCase();
    
    console.log(coronaCountriesID);
    
    let latlon = counLanLon[coronaCountriesID];
    console.log(latlon);
    
  }
  
  }
  
  
  
  
  
  
  ///////////////////////MapBox///////////////////////////
  
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZHhqb255IiwiYSI6ImNrYTNvMTI1aDBoYnUzbWxtbHFtaDVoZHcifQ.1EID7xpJWjIjhBWqTp4Yug";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v10",
    center: [0, 20],
    zoom: 1,
  });
  
  map.touchZoomRotate.disableRotation();
  
  
  
  
  
  
  
  
  
  var size = 100;
  
  // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
  // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
  var pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
  
    // get rendering context for the map canvas when layer is added to the map
    onAdd: function () {
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext("2d");
    },
  
    // called once before every frame where the icon will be used
    render: function () {
      var duration = 1000;
      var t = (performance.now() % duration) / duration;
  
      var radius = (size / 2) * 0.3;
      var outerRadius = (size / 2) * 0.7 * t + radius;
      var context = this.context;
  
      // draw outer circle
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
      context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
      context.fill();
  
      // draw inner circle
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(255, 100, 100, 1)";
      context.strokeStyle = "white";
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();
  
      // update this image's data with data from the canvas
      this.data = context.getImageData(0, 0, this.width, this.height).data;
  
      // continuously repaint the map, resulting in the smooth animation of the dot
      map.triggerRepaint();
  
      // return `true` to let the map know that the image was updated
      return true;
    },
  };
  
  map.on("load", function () {
    map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });
  
    map.addSource("points", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [0, 0],
            },
          },
        ],
      },
    });
    map.addLayer({
      id: "points",
      type: "symbol",
      source: "points",
      layout: {
        "icon-image": "pulsing-dot",
      },
    });
  });
  
  /////////////////////from Stack OverFlow///////////////////////
  
  var geojson = {
    type: "FeatureCollection",
    features: [],
  };
  
  map.on("load", function () {
    map.addSource("custom", {
      type: "geojson",
      data: geojson,
    });
  
    // Add a marker feature to your geojson object
    var marker = 
      {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [50, 50],
      },
    }
  
    
    ;
  
    geojson.features.push(marker);
    map.getSource("points").setData(geojson);
  });
  
  
  
  
  
  
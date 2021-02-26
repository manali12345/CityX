
const URL = "http://localhost:9000"
const mapbox_URL= "Your_Mapbox_key";

let app= angular.module("Mashup",[])

app.controller("Controller",($scope,$http)=>{
    
      var userCoordinates;
      $scope.query=''
      var geojson = {
        type: 'FeatureCollection',
        features: []
      };
// **************** Map ********************
      var currentMarkers=[]
      mapboxgl.accessToken = mapbox_URL

      var map = new mapboxgl.Map({
        container: "map", // container id
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-96, 37.8], // starting position
        zoom: 3, // starting zoom
      });
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );
      plotMap=()=>{
        
        map.addSource("user-coordinates", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: userCoordinates
            }
          }
        });
        // map.on("load", function(e){
        //   e.map.resize();
        // });
        map.addLayer({
          id: "user-coordinates",
          source: "user-coordinates",
          type: "circle",
        });
        console.log(userCoordinates)
        map.flyTo({
          center: userCoordinates,
          zoom: 14
        });
      }
      removeCurrentMarkers=()=>{
        if (currentMarkers!==null) {
          for (var i = currentMarkers.length - 1; i >= 0; i--) {
            currentMarkers[i].remove();
          }
        }
      }
      makeMarkers=(home)=>{
        // var marker_tp = new mapboxgl.Marker().addTo(map);
        // marker_tp.remove();
        // removeCurrentMarkers();
        geojson.features=[]
        
          var latitude= home.address.latitude[0]
          var longitude= home.address.longitude[0]
          var link=home.links.homedetails[0] 
         
          geojson.features.push({
             type: 'Feature',
             geometry: {
               type: 'Point',
               coordinates: [longitude,latitude]
             },
             properties: {
               
                title: home.zestimate.amount[0]._+" "+home.zestimate.amount[0].$.currency,
                description: "More details: "+"<a href="+link+" target=_blank>"+link+"</a>"
             }
          })
      
      // console.log(geojson.features)
        geojson.features.forEach(function(marker) {
  
          // create a HTML element for each feature
          var el = document.createElement('div');
          el.className = 'marker';
          
          // console.log("Hello")
          // make a marker for each feature and add to the map
          oneMarker=new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
            .addTo(map);
            currentMarkers.push(oneMarker)
        });
        console.log(latitude+" "+longitude)
        map.flyTo({
          center: [longitude,latitude],
          zoom: 14
        });
      }
// **************** Fetch Home**************
      $scope.fetchhome=()=>{
        
        // console.log($scope.query)
        if($scope.query.length>=7){
          $scope.info=`You searched for "${$scope.query}"`;
          $http.get(`${URL}/zillow?zpid=${$scope.query}`,
          {
              mode: "cors",
              
          }
          )
          .then((response)=>{
             console.log(response.data)
             $scope.home=response.data.result.response
             console.log($scope.home)
             makeMarkers($scope.home);
            });
        
        }
         

    }

      navigator.geolocation.getCurrentPosition(position => {
        userCoordinates = [position.coords.longitude, position.coords.latitude];
        $scope.fetchhome()
        plotMap()
      });
      
  });
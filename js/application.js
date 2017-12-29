var ViewModal = function(){

	// create variables
	var map;
	var defaultNeighborhood = 'Mountain View';
	var defaultType = 'restaurant';
	var latVal;
	var lngVal;
	var preferredLocation;
	var request;
	var names;
	var mark;
	var activeMarker;
	var self = this;

	// create observable variables
	self.neighborhood = ko.observable(defaultNeighborhood);
	self.neighborhoodType = ko.observable(defaultType);
	self.places = ko.observableArray();
	self.name = ko.observable();
	self.infowindow;
	self.markers=ko.observableArray();

	//initialize map function
	initMap = function(){

		// Map styling JSON
		// Can be changed in the Future
		var styles = [
					  {
					    "elementType": "geometry",
					    "stylers": [
					      {
					        "color": "#212121"
					      }
					    ]
					  },
					  {
					    "elementType": "labels.icon",
					    "stylers": [
					      {
					        "visibility": "off"
					      }
					    ]
					  },
					  {
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#757575"
					      }
					    ]
					  },
					  {
					    "elementType": "labels.text.stroke",
					    "stylers": [
					      {
					        "color": "#212121"
					      }
					    ]
					  },
					  {
					    "featureType": "administrative",
					    "elementType": "geometry",
					    "stylers": [
					      {
					        "color": "#757575"
					      }
					    ]
					  },
					  {
					    "featureType": "administrative.country",
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#9e9e9e"
					      }
					    ]
					  },
					  {
					    "featureType": "administrative.land_parcel",
					    "stylers": [
					      {
					        "visibility": "off"
					      }
					    ]
					  },
					  {
					    "featureType": "administrative.locality",
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#bdbdbd"
					      }
					    ]
					  },
					  {
					    "featureType": "poi",
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#757575"
					      }
					    ]
					  },
					  {
					    "featureType": "poi.park",
					    "elementType": "geometry",
					    "stylers": [
					      {
					        "color": "#181818"
					      }
					    ]
					  },
					  {
					    "featureType": "poi.park",
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#616161"
					      }
					    ]
					  },
					  {
					    "featureType": "poi.park",
					    "elementType": "labels.text.stroke",
					    "stylers": [
					      {
					        "color": "#1b1b1b"
					      }
					    ]
					  },
					  {
					    "featureType": "road",
					    "elementType": "geometry.fill",
					    "stylers": [
					      {
					        "color": "#2c2c2c"
					      }
					    ]
					  },
					  {
					    "featureType": "road",
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#8a8a8a"
					      }
					    ]
					  },
					  {
					    "featureType": "road.arterial",
					    "elementType": "geometry",
					    "stylers": [
					      {
					        "color": "#373737"
					      }
					    ]
					  },
					  {
					    "featureType": "road.highway",
					    "elementType": "geometry",
					    "stylers": [
					      {
					        "color": "#3c3c3c"
					      }
					    ]
					  },
					  {
					    "featureType": "road.highway.controlled_access",
					    "elementType": "geometry",
					    "stylers": [
					      {
					        "color": "#4e4e4e"
					      }
					    ]
					  },
					  {
					    "featureType": "road.local",
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#616161"
					      }
					    ]
					  },
					  {
					    "featureType": "transit",
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#757575"
					      }
					    ]
					  },
					  {
					    "featureType": "water",
					    "elementType": "geometry",
					    "stylers": [
					      {
					        "color": "#000000"
					      }
					    ]
					  },
					  {
					    "featureType": "water",
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#3d3d3d"
					      }
					    ]
					  }
					];
			map = new google.maps.Map(document.getElementById("map"),{
			styles:styles,
			zoom: 14
			/*disableDefaultUI: true*/
		});

		self.infowindow = new google.maps.InfoWindow({
			maxWidth: 200
		});
	};

	//Geocoding request for obtaining the latitudes and longitudes of the entered neighborhood location
	initRequest = function(){
		if(self.neighborhood != ''){
			console.log(self.neighborhood());

			var geocoder =  new google.maps.Geocoder();
	 		geocoder.geocode( { 'address': self.neighborhood()}, function(results, status) {
       	if (status == google.maps.GeocoderStatus.OK) {
        		// alert("location : " + results[0].geometry.location.lat() + " " +results[0].geometry.location.lng());
        		 latVal = results[0].geometry.location.lat();
        		 lngVal = results[0].geometry.location.lng();
        		 preferredLocation = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        		 map.setCenter(preferredLocation);
        		 initPlacesRequest(preferredLocation);
        		 
       	} else {
         	alert("Something got wrong " + status);
       	}
     	});
	    initMap();	 			     		
		}
	};

	// Obtaining the Neighborhood Places on the basis of the types
	initPlacesRequest = function(pLocation){
		mark = 0;
		self.markers = 0;

		request = {
			location: pLocation,
			radius: '1000',
			types: [self.neighborhoodType()]
		};

		var place;
		mark = [];
		self.markers = ko.observableArray();

		var service = new google.maps.places.PlacesService(map);	
		service.nearbySearch(request, function(results, status) {
	    if (status == google.maps.places.PlacesServiceStatus.OK) {

	      for (var i = 0; i < results.length; i++) {


	        place = results[i];

	        self.places.push(results[i]);

	       self.markers.push(new self.createMarker(place));
	  	  }
	    }
	    else{
	    	alert("Something got wrong " + status);
	    }
  	});  	
	};


	// Creating Markers collect all the markers in an array "mark"
	self.createMarker = function(place){

		marker = new google.maps.Marker({
          	map: map,
          	position: place.geometry.location,
          	name: place.name,
          	address: place.vicinity,
          	rating: place.rating,
          	//icon: place.icon,
          	photos: place.photos,
          	animation: google.maps.Animation.DROP

        });
    	if(marker.rating===undefined){
    		marker.rating = "N/A";
    	}

    	self.clickListener(marker);

    	return marker;
	};

	// Function for listening clicks on the markers
	self.clickListener = function(marker){
        marker.addListener('click',function(){
        	self.resetMarker(marker);
        });
	}

	// Handles marker animations, marker infowindows, marker icons etc in short
	self.resetMarker=function(marker){

		//if activeMarker != marker set animation and icon to default
		if(activeMarker){
			activeMarker.setAnimation(false);
			activeMarker.setIcon('https://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png');	
			self.infowindow.marker = null;
		}

		//if activeMarker == marker set animation and icon
		marker.setAnimation(google.maps.Animation.BOUNCE);
		marker.setIcon('https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-blue.png&psize=16&font=fonts/Roboto-Regular.ttf&color=ff333333&ax=44&ay=48&scale=1');
		// get infowindow for selected marker
		self.createInfowindow(marker);
		self.infowindow.open(map,marker);

		//set active marker
		activeMarker = marker;
	};


	// Create InfoWindow function for the markers 
	// Also adds Content to the InfoWindows
	self.createInfowindow = function(marker){
		var content;
		content = "<div><h3>"+marker.name+"</h3>"+"<div> Position : "+marker.position+"</div>"+"<div> Address : "+marker.address+"</div>"+"<div> Rating : "+marker.rating+"</div></div>";
		self.infowindow.setContent(content);
		self.infowindow.addListener('closeclick',function(){
			self.infowindow.marker = null;
		});
	};

	// Display List function for the Places in the Neighborhood 
	self.listFunction = ko.computed(function(marker){
		if(mark!= self.places()){

		}
		return self.markers();
	},this);

}

// Applying all the bindings of the viewmodal
ko.applyBindings(new ViewModal());


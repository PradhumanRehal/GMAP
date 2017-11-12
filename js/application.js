var ViewModal = function(){

	var map;
	var self = this;
	var defaultNeighborhood = 'Mountain View';
	var latVal;
	var lngVal;
	var preferredLocation;
	var request;

	self.neighborhood = ko.observable(defaultNeighborhood);
	self.places = ko.observableArray();

	initMap = function(){
			map = new google.maps.Map(document.getElementById("map"),{
			zoom: 14,
			//disableDefaultUI: true,
			//center: {lat: 37.3860517,lng: -122.0838511}
		});
	};

	initRequest = function(){
		if(self.neighborhood != ''){
			console.log(self.neighborhood());

			var geocoder =  new google.maps.Geocoder();
	 		geocoder.geocode( { 'address': self.neighborhood()}, function(results, status) {
		       	if (status == google.maps.GeocoderStatus.OK) {
		        		// alert("location : " + results[0].geometry.location.lat() + " " +results[0].geometry.location.lng());
		        		 latVal = results[0].geometry.location.lat();
		        		 console.log(latVal);
		        		 lngVal = results[0].geometry.location.lng();
		        		 console.log(lngVal);
		        		 preferredLocation = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
		        		 map.setCenter(preferredLocation);
		        		 console.log(preferredLocation);
		        		 initPlacesRequest(preferredLocation);
		        		 
		       	} else {
		         	alert("Something got wrong " + status);
		       	}
	     	});

	     	initMap();	 			     		
		}
	};

	initPlacesRequest = function(pLocation){
			request = {
				location: pLocation,
				radius: '1000',
				types: ['history']
			};

			var place;

			var service = new google.maps.places.PlacesService(map);	
			service.nearbySearch(request, function(results, status) {
			    if (status == google.maps.places.PlacesServiceStatus.OK) {
			      for (var i = 0; i < results.length; i++) {
			      	//console.log(self.places);
			      	//console.log(results[i]);
			        place = results[i];
			        self.places.push(place.name);
			        // If the request succeeds, draw the place location on
			        // the map as a marker, and register an event to handle a
			        // click on the marker.
			        marker = new google.maps.Marker({
			          map: map,
			          position: place.geometry.location
			        });
						console.log(place);	        
			      }
		     	console.log(self.places);
			    }
		  	});

	}

}

ko.applyBindings(new ViewModal());
var ViewModal = function(){

	var map;
	var self = this;
	var defaultNeighborhood = 'Mountain View';
	var latVal;
	var lngVal;
	var preferredLocation;

	self.neighborhood = ko.observable(defaultNeighborhood);
	self.places = ko.observableArray();

	initMap = function(){
			map = new google.maps.Map(document.getElementById("map"),{
			zoom: 14,
			//disableDefaultUI: true,
			center: {lat: 37.3860517,lng: -122.0838511}
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
	        		 
	       	} else {
	         	alert("Something got wrong " + status);
	       	}
	     	});

	     	initMap();
		}
	};


		

}

ko.applyBindings(new ViewModal());
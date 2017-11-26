var ViewModal = function(){

	var map;
	var self = this;
	var defaultNeighborhood = 'Mountain View';
	var latVal;
	var lngVal;
	var preferredLocation;
	var request;
	var names;

	self.neighborhood = ko.observable(defaultNeighborhood);
	self.places = ko.observableArray();
	self.name = ko.observable();
	self.infowindow;
	self.markers = ko.observableArray();

	initMap = function(){
			map = new google.maps.Map(document.getElementById("map"),{
			zoom: 14,
			//disableDefaultUI: true,
			//center: {lat: 37.3860517,lng: -122.0838511}
		});
		self.infowindow = new google.maps.InfoWindow();

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
		names = 0;

		request = {
			location: pLocation,
			radius: '1000',
			types: ['history']
		};

		var place;
		names = [];

		var service = new google.maps.places.PlacesService(map);	
		service.nearbySearch(request, function(results, status) {
		    if (status == google.maps.places.PlacesServiceStatus.OK) {

		      for (var i = 0; i < results.length; i++) {

		        place = results[i];

		        names.push(place.name);
		        console.log(names[i]);
		        // If the request succeeds, draw the place location on
		        // the map as a marker, and register an event to handle a
		        // click on the marker.
		        self.markers.push(new self.createMarker(place.geometry.location,names[i]));

		       		self.places.push(names[i]);

		  	  }
		    }
	  	});
	};

	self.createMarker = function(pLoc,pName){
		marker = new google.maps.Marker({
          	map: map,
          	position: pLoc
        });
        self.clickListener(marker,pName);
        return pName;
        //self.places.push(pName);
	};

	self.clickListener = function(marker,pName){
		marker.addListener('click',function(){
			self.createInfowindow(marker,pName);
			self.infowindow.open(map,marker);
		});
	}

	self.createInfowindow = function(marker,content){
		//marker.setAnimation(google.maps.Animation.BOUNCE);
		console.log(content);
		self.infowindow.setContent(content);
		self.infowindow.addListener('closeclick',function(){
			self.infowindow.marker = null;
			//marker.setAnimation(false);
		});
		//self.places = ko.observableArray();
	};

	self.displayList = ko.computed(function(){
		if(names!= self.places()){
		}
		console.log(names);
		return names;
	},this);

}

ko.applyBindings(new ViewModal());
// ----------------------------------
// var placeSearch, autocomplete;

// var componentForm = {
//   street_number: 'short_name',
//   route: 'long_name',
//   locality: 'long_name',
//   administrative_area_level_1: 'short_name',
//   country: 'long_name',
//   postal_code: 'short_name'
// };



// function fillInAddress() {
//   // Get the place details from the autocomplete object.
//   var place = autocomplete.getPlace();

//   let lat = place.geometry.location.lat();
//   let lng = place.geometry.location.lng();
//   console.log(lat + " - " + lng);

//   for (var component in componentForm) {
//     document.getElementById(component).value = '';
//     document.getElementById(component).disabled = false;
//   }

//   // Get each component of the address from the place details,
//   // and then fill-in the corresponding field on the form.
//   for (var i = 0; i < place.address_components.length; i++) {
//     var addressType = place.address_components[i].types[0];
//     if (componentForm[addressType]) {
//       var val = place.address_components[i][componentForm[addressType]];
//       document.getElementById(addressType).value = val;
//     }
//   }
// }

// // Bias the autocomplete object to the user's geographical location,
// // as supplied by the browser's 'navigator.geolocation' object.
// function geolocate() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function (position) {
//       var geolocation = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       };
//       var circle = new google.maps.Circle({
//         center: geolocation,
//         radius: position.coords.accuracy
//       });
//       autocomplete.setBounds(circle.getBounds());
//     });
//   }
// }

// //--------------------------------------------


// function initAutocomplete() {
//   // ---------------------
//   // Create the autocomplete object, restricting the search predictions to
//   // geographical location types.
//   autocomplete = new google.maps.places.Autocomplete(
//     document.getElementById('autocomplete'), {
//       types: ['geocode']
//     });

//   // Avoid paying for data that you don't need by restricting the set of
//   // place fields that are returned to just the address components.
//   autocomplete.setFields(['address_component', 'geometry']);

//   // When the user selects an address from the drop-down, populate the
//   // address fields in the form.
//   autocomplete.addListener('place_changed', fillInAddress);
//   var place = autocomplete.getPlace();


//   // let lat = document.getElementById('lat').value = place.geometry.location.lat();
//   // let lng = document.getElementById('lon').value = place.geometry.location.lng();
//   // console.log(lat + " - " + lng);

//   // ----------------------

//   var map;
//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: {
//       lat: -33.8688,
//       lng: 151.2195
//     },
//     zoom: 13,
//     mapTypeId: 'roadmap',
//     mapTypeControl: false
//   });

//   // Create the search box and link it to the UI element.
//   var input = document.getElementById('pac-input');
//   var searchBox = new google.maps.places.SearchBox(input);
//   map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

//   // Bias the SearchBox results towards current map's viewport.
//   map.addListener('bounds_changed', function () {
//     searchBox.setBounds(map.getBounds());
//   });

//   console.log('hello');
//   var markers = [];
//   // Listen for the event fired when the user selects a prediction and retrieve
//   // more details for that place.
//   searchBox.addListener('places_changed', function () {
//     var places = searchBox.getPlaces();
//     console.log('hello')
//     console.log(places);


//     if (places.length == 0) {
//       return;
//     }

//     // Clear out the old markers.
//     markers.forEach(function (marker) {
//       marker.setMap(null);
//     });
//     markers = [];

//     // For each place, get the icon, name and location.
//     var bounds = new google.maps.LatLngBounds();
//     places.forEach(function (place) {
//       if (!place.geometry) {
//         console.log("Returned place contains no geometry");
//         return;
//       }

//       var icon = {
//         url: place.icon,
//         size: new google.maps.Size(71, 71),
//         origin: new google.maps.Point(0, 0),
//         anchor: new google.maps.Point(17, 34),
//         scaledSize: new google.maps.Size(25, 25)
//       };

//       // Create a marker for each place.
//       markers.push(new google.maps.Marker({
//         map: map,
//         icon: icon,
//         title: place.name,
//         position: place.geometry.location
//       }));

//       if (place.geometry.viewport) {
//         // Only geocodes have viewport.
//         bounds.union(place.geometry.viewport);
//       } else {
//         bounds.extend(place.geometry.location);
//       }
//     });
//     map.fitBounds(bounds);
//   });

//   var center;

//   function calculateCenter() {
//     center = map.getCenter();
//   }
//   google.maps.event.addDomListener(map, 'idle', function () {
//     calculateCenter();
//   });
//   google.maps.event.addDomListener(window, 'resize', function () {
//     map.setCenter(center);
//   });
// }
 document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    if (document.querySelector('html').lang)
      lang = document.querySelector('html').lang;
    else
      lang = 'en';

    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=true&language=' + lang + '&key=AIzaSyDvHrH49ggg4zB2tpRsu8I6ygD989Bx7go';
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
});

var map;

// API Key: AIzaSyDvHrH49ggg4zB2tpRsu8I6ygD989Bx7go

function initMap()
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.4569400, lng: -70.6482700},
    zoom: 8
  });

  // fetch-Aufruf mit Pfad zur XML-Datei
  fetch ('KZK126.xml')
    .then (function (response) {
      // Antwort kommt als Text-String
      return response.text();
    })
    .then (function (data) {
      //console.log (data);       // schnell mal in der Konsole checken

      var x2js = new X2JS();

      var jsonObj = x2js.xml_str2json(data);

      var airTravel = jsonObj.root.airTravel;
      var country = jsonObj.root.country;
      var itinerary = jsonObj.root.itinerary;
      var location = jsonObj.root.location;
      var organizer = jsonObj.root.organizer;

      plotMarkers(itinerary.day);

    }).catch (function (error) {
       console.log ("Fehler: bei Auslesen der XML-Datei " + error);
    });

  fetch('markers.json')
    .then(function(response){return response.json()})
    .then(plotMarkers);
}

var markers;
var bounds;

function plotMarkers(days)
{
  markers = [];
  bounds = new google.maps.LatLngBounds();

  console.log('plotMarkers');
  console.log(days);

  days.forEach(function (day) {
    console.log(day);

    if (typeof day.destination_ref.destination != "undefined") {
      console.log(typeof day.destination_ref.destination);
      var position = new google.maps.LatLng(day.destination_ref.destination.latitude, day.destination_ref.destination.longitude);

      var infowindow = new google.maps.InfoWindow({
        content: day.name,
      });

      var marker = new google.maps.Marker({
          position: position,
          map: map,
          animation: google.maps.Animation.DROP,
          title: day.name
        });

      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      });

      markers.push(marker)
      bounds.extend(position);
    }
  });

  map.fitBounds(bounds);
}
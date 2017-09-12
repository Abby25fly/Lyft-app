"use strict";

const app = {
  map: undefined,

  init: function(){
    app.map = new google.maps.Map($('#map')[0],{
        zoom: 10,
        center: {lat: -9.1191427, lng: -77.0349046},
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl:false
    });

    let autocompleteOrigen = new google.maps.places.Autocomplete($("#origen")[0], {});
    autocompleteOrigen.bindTo('bounds', app.map);
    let detalleUbicacionOrigen = new google.maps.InfoWindow();
    let markerOrigen = app.crearMarcador(app.map);

    app.crearListener(autocompleteOrigen, detalleUbicacionOrigen, markerOrigen);

    let autocompleteDestino = new google.maps.places.Autocomplete($("#destino")[0], {});
    autocompleteDestino.bindTo('bounds', app.map);
    let detalleUbicacionDestino = new google.maps.InfoWindow();
    let markerDestino = app.crearMarcador(app.map);

    app.crearListener(autocompleteDestino, detalleUbicacionDestino, markerDestino);

    /* Mi ubicación actual */
    $("#encuentrame").click(app.buscarMiUbicacion);
    /* Ruta */
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    document.getElementById("ruta").addEventListener("click", function(){app.dibujarRuta(directionsService, directionsDisplay)});
    directionsDisplay.setMap(app.map);

},
    crearListener: function(autocomplete, detalleUbicacion, marker) {
        autocomplete.addListener('place_changed', function() {
            detalleUbicacion.close();
            marker.setVisible(false);
            let place = autocomplete.getPlace();
            app.marcarUbicacion(place, detalleUbicacion, marker);
        });
    },

    buscarMiUbicacion: function() {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(app.marcarUbicacionAutomatica,app.funcionError);
        }
    },

    funcionError: function(error) {
        alert("Tenemos un problema para encontrar tu ubicación");
    },

    marcarUbicacionAutomatica: function(posicion) {
      let latitud=posicion.coords.latitude;
      let longitud=posicion.coords.longitude;

      let miUbicacion= new google.maps.Marker({
        position:{lat:latitud,lng:longitud},
        animation: google.maps.Animation.DROP,
        map:app.map
      });
        app.map.setZoom(17);
        app.map.setCenter(miUbicacion.position);
    },

    marcarUbicacion:function(place, detalleUbicacion, marker) {
        if (!place.geometry) {
            // Error si no encuentra el lugar indicado
            window.alert("No encontramos el lugar que indicaste: '" + place.name + "'");
            return;
        }
        // If the place has a geometry, then present it on a app.map.
        if (place.geometry.viewport) {
            app.map.fitBounds(place.geometry.viewport);
        } else {
            app.map.setCenter(place.geometry.location);
            app.map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        let address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        detalleUbicacion.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        detalleUbicacion.open(app.map, marker);
    },

    crearMarcador: function(map) {
        let icono = {
            url: 'http://icons.iconarchive.com/icons/sonya/swarm/128/Bike-icon.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        };

        let marker = new google.maps.Marker({
            map: app.map,
            animation: google.maps.Animation.DROP,
            icon: icono,
            anchorPoint: new google.maps.Point(0, -29)
        });

        return marker;
    },

    dibujarRuta: function(directionsService, directionsDisplay) {
        let origin = document.getElementById("origen").value;
        let destination = document.getElementById('destino').value;

        if(destination != "" && destination != "") {
            directionsService.route({
                origin: origin,
                destination: destination,
                travelMode: "DRIVING"
            },
            function(response, status) {
                if (status === "OK") {
                    directionsDisplay.setDirections(response);
                } else {
                    funcionErrorRuta();
                }
            });
        }
    },

    funcionErrorRuta: function() {
        alert("No ingresaste un origen y un destino validos");
    }
  }

function initMap(){
  app.init();
}

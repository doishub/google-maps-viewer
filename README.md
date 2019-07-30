# Google Maps Viewer
A simple plugin to display Google Maps

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/doishub/google-maps-viewer/blob/master/LICENSE)

## How to Use
##### Google Maps Viewer has a .js file in addition to the Google Maps library and other useful Plugins.
```html
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR-API-TOKEN&callback=onGoogleMapsApiReady" async></script>
    <script src="js/google-maps-viewer.js"></script>
    
    <!-- Optional for Cluster use -->
    <script src="https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/markerclusterer.js"></script>
    
    <!-- Optional for Spiderfier use -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js"></script>
```

##### Create a container for the map
```html
    <div id="myMap"></div>
```

##### Initialize a simple map
 ```javascript
     var map = new GoogleMapsViewer('map', {
         initInstant: true,
         map: {
             zoom: 12,
             lat: 51.0968605,
             lng: 5.9690903
         }
     });
 ```
 
## Options
##### Defaults
```javascript
{
    mapId: '',
    initInstant: false,
    source: {
        id: 'source',
        type: 'geojson',
        path: null,
        param: null,
    },
    marker: null,
    popup: {
        showEvent: 'click',
        hideEvent: false,
        options: null
    },
    spider: {
        spiderfier: false,
        closePopupOnUnspiderfy: true,
        format: null,
        options: {
            keepSpiderfied: false,
            markersWontMove: false,
            markersWontHide: false,
            basicFormatEvents: false
        }
    },
    cluster: {
        clustering: false,
        clusterSteps: null,
        styles: null,
        options: {
            maxZoom: 14
        }
    },
    map: {
        bounds: false,
        interactive: true,
        mapTypeControl: false,
        fullscreen: true,
        streetview: true,
        scrollwheel: false,
        gestureHandling: 'cooperative',
        style: 'roadmap',
        styles: null,
        zoom: 6,
        minZoom: 3,
        maxZoom: 16,
        lat: null,
        lng: null
    }
}
```

# Google Maps Viewer
A simple plugin to display Google Maps

## How to Use
##### Google Maps Viewer has a .js file in addition to the Google Maps library.
```html
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR-API-TOKEN&callback=onGoogleMapsApiReady" async></script>
    <script src="js/google-maps-viewer.js"></script>
    
    <!-- Optional for Cluster use -->
    <script src="https://googlemaps.github.io/js-marker-clusterer/src/markerclusterer.js"></script>
```

##### Create a container for the map
```html
    <div id="myMap"></div>
```

##### Initialize
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
    cluster: {
        clustering: false,
        clusterSteps: null,
        styles: null,
        clusterMaxZoom: 14,
        clusterRadius: 50
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
        lng: null,
        onLoad: function(){},
        onLoadStyle: function(){},
        onLoadAssets: function(){}
    }
}
```

 
# License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/doishub/google-maps-viewer/blob/master/LICENSE)
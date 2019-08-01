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
        path: false,
        param: null,
    },
    marker: {
        icon: null,
        options: null
    },
    popup: {
        showEvent: 'click',
        hideEvent: false,
        options: null,
        propSelector: 'template',
        source: {
            path: false,
            param: null,
            loader: true,
            loaderMarkup: '<span class="loader"></span>'
        }
    },
    spider: {
        spiderfier: false,
        closePopupOnUnspiderfy: true,
        format: null,
        options: {
            keepSpiderfied: true,
            markersWontMove: true,
            markersWontHide: true,
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

## Examples
### Load Data via GEOJson
```javascript
source: {
    id: 'source',               // Source-ID
    type: 'geojson',            // Source-Type
    path: 'your/geosjon/path',  // Path to your GEOJson 
    param: {                    // optional Parameters
        param1: 'Hello',
        param2: 'World'
    }
}
``` 

#### Popups via GEOJson
The HTML content can be transmitted in any property field, which can be defined via `propSelector`.
```javascript
popup: {
    propSelector: 'template',   // Property name to define from which field the content of a popup is read (asynchronous only)
}
```

### Popups
```javascript
popup: {
    showEvent: 'mouseover', 
    hideEvent: 'mouseleave',
    options: {
        ...                     //  See google documentation
    }
}
```

#### Loading Popups asynchronously
If you want to load popups asynchronously, you have several options. You can load popups directly via GEOJson, or only by clicking (or any other event).
```javascript
popup: {
    propSelector: 'template',                           // Property name to define from which field the content of a popup is read (asynchronous only) 
    source: {
        path: 'your/popup/template/path',               // Path to your HTML content
        param: {                                        // optional Parameters
            param1: 'Hello',
            param2: 'World'
        }
        loader: true,                                   // Show a loader while loading
        loaderMarkup: '<span class="loader"></span>'
    }
}
```

##### Use placeholders to add dynamic data to the path
Sometimes it is necessary to define a separate query for each marker on the map. In order to be able to use placeholders, it is necessary to specify them using `markerProps` (Markers loaded via a GEOJson are automatically filled with the transmitted `properties`-Object).
```javascript
popup: { 
    source: {
        path: 'your/popup/template/%id%',               // Path to your HTML content with placeholder
    }
}
```
In this example, the `markerProps` object must contain the field `id`. If this is not the case, the value is not replaced.

## Methods

##### Returns the Viewer-Object
```javascript
getViewer()
```

##### Add a Marker to the map 
```javascript
addMarker(
    latLng,        // Array or google.maps.LatLng Object
    htmlContent,   // Popup content (optional)
    markerOptions, // Passing more options for added marker (optional)
    markerProps    // Own marker properties (optional)
)
```
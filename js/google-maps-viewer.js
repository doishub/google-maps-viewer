/**
 * Google Maps Viewer
 *
 * @author Daniele Sciannimanica <https://github.com/doishub>
 * @version 0.0.7
 * @licence https://github.com/doishub/google-maps-viewer/blob/master/LICENSE
 */
var GoogleMapsViewer = (function () {

    'use strict';

    var Constructor = function (mapId, settings) {
        var pub = {};
        var viewer = {};
        var useClustering = false;
        var useSpiderfier = false;

        var defaults = {
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
                lng: null,
                onLoad: function(){},
                onLoadStyle: function(){},
                onLoadAssets: function(){}
            }
        };

        /**
         * Initialize Google Maps Viewer and create a Map
         */
        var init = function () {
            // extend default settings
            viewer.settings = extend(true, defaults, settings);

            // get dom object
            viewer.dom = document.getElementById(mapId);

            // add marker array
            viewer.markers = [];

            if(!viewer.dom){
                console.warn('GoogleMapsViewer: Dom object could not be loaded by ID', mapId);
                return;
            }

            // check if the api ready for use
            if(viewer.settings.initInstant && typeof google !== 'object'){
                console.warn('GoogleMapsViewer: google.maps is not defined. If you load the script by async, use onGoogleMapsApiReady-Callback and set option initInstant to false.');
                return;
            }

            // init on api ready callback
            if(!viewer.settings.initInstant){
                document.addEventListener('googlemaps.onApiReady', createMap);

                // init map directly
            }else{
                createMap();
            }
        };

        var createMap  = function(){
            // create map
            viewer.map = new google.maps.Map(viewer.dom, {
                zoom: parseInt(viewer.settings.map.zoom),
                minZoom: parseInt(viewer.settings.map.minZoom),
                maxZoom: parseInt(viewer.settings.map.maxZoom),

                center: {
                    lat: parseFloat(viewer.settings.map.lat),
                    lng: parseFloat(viewer.settings.map.lng)
                },

                mapTypeControl:    viewer.settings.map.mapTypeControl,
                zoomControl:       viewer.settings.map.controls,
                fullscreenControl: viewer.settings.map.fullscreen,
                streetViewControl: viewer.settings.map.streetview,

                disableDoubleClickZoom: !viewer.settings.map.interactive,
                draggable:               viewer.settings.map.interactive,
                gestureHandling:         viewer.settings.map.gestureHandling,
            });

            // create bounds object
            viewer.bounds = new google.maps.LatLngBounds();

            // add custom styles
            if(viewer.settings.map.styles !== null){
                var customStyle = new google.maps.StyledMapType(viewer.settings.map.styles, {name: 'Normal'});

                viewer.map.mapTypes.set('custom_style', customStyle);
                viewer.map.setMapTypeId('custom_style');
            }

            // load source
            if(viewer.settings.source.path){
                loadSource(viewer.settings.source.path, viewer.settings.source.param);
            }else{
                initPlugins();
            }
        };

        var initPlugins = function(){
            // add spiderfier
            if(viewer.settings.spider !== null && viewer.settings.spider.spiderfier){
                addSpiderSupport();
            }

            // add cluster object
            if(viewer.settings.cluster !== null && viewer.settings.cluster.clustering){
                addClusterSupport();
            }
        };

        var addClusterSupport = function(){
            viewer.cluster = new MarkerClusterer(viewer.map, viewer.markers, viewer.settings.cluster.options);

            // set styles
            if(viewer.settings.cluster.styles){
                viewer.cluster.setStyles(viewer.settings.cluster.styles);
            }

            // count to style calculator
            viewer.cluster.setCalculator(function(markers, numStyles) {
                var count = markers.length;
                var steps = viewer.settings.cluster.clusterSteps;
                var index = 0;

                for (var i=0; i<steps.length; i++) {
                    if (count > steps[i])
                    {
                        index++;
                    }
                }

                index = Math.min(index, numStyles);

                return {
                    text: count,
                    index: index
                };
            });

            useClustering = true;
        };

        var addSpiderSupport = function(){
            viewer.spider = new OverlappingMarkerSpiderfier(viewer.map, viewer.settings.spider.options);

            // set marker format
            if(viewer.settings.spider.format !== null) {
                if(viewer.settings.spider.format.length === 3){
                    viewer.spider.addListener('format', function (marker, status) {
                        var p,w,h;
                        var validStatus = [
                            OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED,
                            OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE,
                            OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE
                        ];

                        for(var i=0; i<validStatus.length; i++)
                        {
                            if(status === validStatus[i]){
                                p = viewer.settings.spider.format[i][0];
                                w = viewer.settings.spider.format[i][1];
                                h = viewer.settings.spider.format[i][2];

                                break;
                            }
                        }

                        marker.setIcon({
                            url: p,
                            scaledSize: new google.maps.Size(w, h)
                        });
                    });
                }else{
                    console.warn('GoogleMapsViewer: Wrong parameter for format (spiderfier:format)');
                }
            }

            // close active info windows on unspiderfy
            viewer.spider.addListener('unspiderfy', function (a,b) {
                if(viewer.settings.spider.closePopupOnUnspiderfy && viewer.currentInfoWindow){
                    viewer.currentInfoWindow.close();
                }
            });

            useSpiderfier = true;
        };

        var loadSource = function(path, param){
            var url = path;

            if(typeof param === 'object'){
                url += '?' + serialize(param);
            }

            // load source by xhr request
            var sourceLoader = new XMLHttpRequest();

            sourceLoader.open('GET', url, true);
            sourceLoader.onload = function() {

                if (sourceLoader.status >= 200 && sourceLoader.status < 400) {

                    // parse geojson
                    var results = JSON.parse(sourceLoader.responseText);

                    // set data
                    viewer.geojson = results;

                    // initialize plugins after all data has been loaded
                    initPlugins();

                    // create marker by geojson
                    for (var i = 0; i < results.features.length; i++) {

                        // add single marker
                        var coords = results.features[i].geometry.coordinates;
                        var latLng = new google.maps.LatLng(coords[1],coords[0]);

                        pub.addMarker(latLng, {}, results.features[i].properties.popup);
                    }

                    // set viewport including all markers
                    if(!viewer.bounds.isEmpty()){
                        viewer.map.fitBounds(viewer.bounds);
                    }
                }
            };

            sourceLoader.onerror = function() {
                // stuff for error (hide loader etc)
            };

            sourceLoader.send();
        };

        var serialize = function (obj, prefix) {
            var str = [],
                p;
            for (p in obj) {
                if (obj.hasOwnProperty(p)) {
                    var k = prefix ? prefix + "[" + p + "]" : p,
                        v = obj[p];
                    str.push((v !== null && typeof v === "object") ?
                        serialize(v, k) :
                        encodeURIComponent(k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        };

        var extend = function () {
            // Variables
            var extended = {};
            var deep = false;
            var i = 0;
            var length = arguments.length;

            // Check if a deep merge
            if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
                deep = arguments[0];
                i++;
            }

            // Merge the object into the extended object
            var merge = function (obj) {
                for ( var prop in obj ) {
                    if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                        // If deep merge and property is an object, merge properties
                        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                            extended[prop] = extend( true, extended[prop], obj[prop] );
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            };

            // Loop through each object and conduct a merge
            for ( ; i < length; i++ ) {
                var obj = arguments[i];
                merge(obj);
            }

            return extended;
        };

        /**
         * Add Marker
         */
        pub.addMarker = function(latLng, markerOptions, popupContent){
            if(Array.isArray(latLng)){
                latLng = new google.maps.LatLng(latLng[0],latLng[1])
            }

            var defaultOptions = {
                position: latLng,
                map: viewer.map
            };

            if(viewer.settings.marker !== null && viewer.settings.marker.imagePath){
                defaultOptions = extend(defaultOptions, {
                    icon: viewer.settings.marker.imagePath
                });
            }

            var marker = new google.maps.Marker(
                extend(defaultOptions, markerOptions)
            );

            if(popupContent) {
                var popup = new google.maps.InfoWindow(
                    extend({content: popupContent}, viewer.settings.popup.options)
                );

                if(viewer.settings.popup.showEvent){
                    marker.addListener(viewer.settings.popup.showEvent === 'click' && useSpiderfier ? 'spider_click' : viewer.settings.popup.showEvent, function() {
                        if(viewer.currentInfoWindow){
                            viewer.currentInfoWindow.close();
                        }

                        popup.open(viewer.map, marker);

                        viewer.currentInfoWindow = popup;
                    });
                }

                if(viewer.settings.popup.hideEvent){
                    marker.addListener(viewer.settings.popup.hideEvent, function() {
                        if(viewer.currentInfoWindow){
                            viewer.currentInfoWindow.close();
                        }

                        viewer.currentInfoWindow = null;
                    });
                }
            }

            // push to marker collection
            viewer.markers.push(marker);

            // push marker to cluster object
            if(useClustering){
                viewer.cluster.addMarker(marker);
            }

            // push marker to spider object
            if(useSpiderfier){
                viewer.spider.addMarker(marker);
            }

            // push to bounds
            if(viewer.settings.map.bounds){
                viewer.bounds.extend(latLng);
            }
        };

        init();

        return pub;
    };

    return Constructor;
})();

/**
 * Listen to Google Callback for start building the map
 */
function onGoogleMapsApiReady (e){
    if (document.readyState !== 'complete') {
        var stateCheck = setInterval(() => {
            if (document.readyState === 'complete') {
                clearInterval(stateCheck);
                onGoogleMapsApiReady(e);
            }
        }, 100);

        return false;
    }

    var customOnReadyEvent = new CustomEvent('googlemaps.onApiReady', {detail: e});

    document.dispatchEvent(customOnReadyEvent);
}

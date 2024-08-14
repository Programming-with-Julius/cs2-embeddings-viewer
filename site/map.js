window.initializeMap = function (mapId, mapImageUrl, coords, callback) {
    console.log("Initializing map with ID: " + mapId);
    console.log("Map Image URL: " + mapImageUrl);
    
    var map = L.map(mapId, {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
    });

    var bounds = [[0, 0], [1000, 1000]]; // Adjust based on the map image size
    var image = L.imageOverlay(mapImageUrl, bounds).addTo(map);

    map.fitBounds(bounds);

    map.on('click', function (e) {
        var x = Math.round(e.latlng.lng);
        var y = Math.round(e.latlng.lat);
        console.log("Click coordinates: ", x, y); // Debug click coordinates
        callback.invokeMethodAsync('OnMapClick', x, y);
    });
};

window.initializeMap = function (mapId, mapImageUrl, minx, miny, maxx, maxy, callback) {
    var mapBounds = [
        [miny, minx], // bottom-left
        [maxy, maxx]  // top-right
    ];

    var map = L.map(mapId, {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 2,
    });

    var image = L.imageOverlay(mapImageUrl, mapBounds).addTo(map);
    map.fitBounds(mapBounds);

    map.on('click', function (e) {
        var x = Math.round(e.latlng.lng);
        var y = Math.round(e.latlng.lat);
        console.log("Click coordinates: ", x, y); // Debug click coordinates
        callback.invokeMethodAsync('OnMapClick', x, y);
    });

    window.addMarker = function (x, y) {
        var marker = L.circle([y, x], {
            color: 'red',
            fillColor: '#f03',
        }).addTo(map);
    };
};

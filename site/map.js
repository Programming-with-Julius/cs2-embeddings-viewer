window.initializeMap = function (mapId, mapImageUrl, minx, miny, maxx, maxy, callback) {
    var mapBounds = [
        [miny, minx], // bottom-left
        [maxy, maxx]  // top-right
    ];

    var map = L.map(mapId, {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 2,
        preferCanvas: false,
    });

    var image = L.imageOverlay(mapImageUrl, mapBounds).addTo(map);
    map.fitBounds(mapBounds);

    map.on('click', function (e) {
        var x = Math.round(e.latlng.lng);
        var y = Math.round(e.latlng.lat);
        console.log("Click coordinates: ", x, y); // Debug click coordinates
        callback.invokeMethodAsync('OnMapClick', x, y);
    });

    window.addMarkersAndPolylines = function (xGuess, yGuess, xAi, yAi, xReal, yReal) {
        // Add invariant size markers
        addInvariantMarker(xGuess, yGuess, 'blue');
        addInvariantMarker(xAi, yAi, 'red');
        addInvariantMarker(xReal, yReal, 'green');

        // Draw polylines
        var userToReal = new L.Polyline([[yGuess, xGuess], [yReal, xReal]], {
            color: 'blue',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        }).addTo(map);

        var aiToReal = new L.Polyline([[yAi, xAi], [yReal, xReal]], {
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        }).addTo(map);

        // Calculate distances
        var userDistance = calculateDistance(xGuess, yGuess, xReal, yReal);
        var aiDistance = calculateDistance(xAi, yAi, xReal, yReal);

        // Display distances on the map
        var userMidpoint = [(yGuess + yReal) / 2, (xGuess + xReal) / 2];
        var aiMidpoint = [(yAi + yReal) / 2, (xAi + xReal) / 2];

        var userDistanceLabel = L.tooltip({
            permanent: true,
            direction: 'center',
            className: 'distance-label'
        }).setContent(userDistance.toFixed(2) + ' m')
            .setLatLng(userMidpoint)
            .addTo(map);

        var aiDistanceLabel = L.tooltip({
            permanent: true,
            direction: 'center',
            className: 'distance-label'
        }).setContent(aiDistance.toFixed(2) + ' m')
            .setLatLng(aiMidpoint)
            .addTo(map);
    };

    function addInvariantMarker(x, y, color) {
        var marker = L.marker([y, x], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid ${color};"></div>`,
                iconSize: [15, 15], // This keeps the size invariant
                iconAnchor: [7.5, 7.5] // Center the icon
            })
        }).addTo(map);
    }

    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
};

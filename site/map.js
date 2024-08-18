window.initializeMap = function (mapId, callback) {

    var map = L.map(mapId, {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 2,
        preferCanvas: false,
        zoomAnimation: true
    });

    var existingImage = null;

    window.loadMapImage = function (mapImageUrl, minx, miny, maxx, maxy) {
        var mapBounds = [
            [miny, minx], // bottom-left
            [maxy, maxx]  // top-right
        ];

        if (existingImage != null && map.hasLayer(existingImage)) {
            map.removeLayer(existingImage);
        }

        existingImage = L.imageOverlay(mapImageUrl, mapBounds);
        existingImage.addTo(map);
        map.fitBounds(mapBounds);
    }


    map.on('click', function (e) {
        var x = Math.round(e.latlng.lng);
        var y = Math.round(e.latlng.lat);
        console.log("Click coordinates: ", x, y); // Debug click coordinates
        callback.invokeMethodAsync('OnMapClick', x, y);
    });

    window.addMarkersAndPolylines = function (xGuess, yGuess, xAi, yAi, xReal, yReal) {
        // Add invariant size markers with tooltips
        addInvariantMarkerWithTooltip(xGuess, yGuess, 'blue', 'You');
        addInvariantMarkerWithTooltip(xAi, yAi, 'red', 'AI');
        addInvariantMarkerWithTooltip(xReal, yReal, 'green', 'Real');

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

        // Calculate the center and zoom level to fit the bounds
        var group = new L.featureGroup([
            L.marker([yGuess, xGuess]),
            L.marker([yAi, yAi]),
            L.marker([yReal, xReal])
        ]);

        var bounds = group.getBounds();
        var center = bounds.getCenter();
        var zoom = map.getBoundsZoom(bounds);

        // Animate to the calculated view with custom duration
        map.flyTo(center, zoom, {
            animate: true,
            duration: 2.0  // Duration in seconds
        });
    };

    function addInvariantMarkerWithTooltip(x, y, color, label) {
        var marker = L.marker([y, x], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid ${color};"></div>`,
                iconSize: [15, 15], // This keeps the size invariant
                iconAnchor: [7.5, 7.5] // Center the icon
            })
        }).addTo(map);

        // Add a tooltip below the marker
        marker.bindTooltip(label, {
            permanent: true,
            direction: 'bottom',
            offset: [0, 10], // Adjust the offset to position the label below the marker
            className: 'distance-label'
        }).openTooltip();
    }
};

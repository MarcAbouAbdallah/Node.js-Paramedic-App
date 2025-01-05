// Mapbox access token
const mapElement = document.getElementById('map');
mapboxgl.accessToken = mapElement.getAttribute("data-mapboxtoken");

// API request to fetch emergencies
axios.get("/emergencies/info")
    .then( (res) => {
        console.log(res.data);

        // Initialize heat map
        map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/dark-v9",
            center: [-73.610369,45.513182],
            zoom: 11.5
        });

        map.on("load", () => {
            // Add a new source from the GeoJSON data and set the 'cluster' option to true.
            map.addSource("emergency-requests", {
                type: "geojson",
                data: res.data
            });

            
            map.addLayer({
                "id": "emergencies",
                "type": "circle",
                "source": "emergency-requests",
                "paint": {
                    "circle-color": {
                        property: "status",
                        type: "categorical",
                        stops: [
                            ["pending", "rgba(255,0,0,0.5)"], // Red for pending requests
                            ["accepted", "rgba(0,255,0,0.5)"] // Green for accepted requests
                        ]
                    },
                    "circle-radius": 14,
                    "circle-blur": 1
                }
            });
        });
    })
    .catch( (error) => {console.log(error);});

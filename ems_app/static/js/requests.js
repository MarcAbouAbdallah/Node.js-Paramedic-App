
// Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoibWFyY2FhIiwiYSI6ImNtMjlxMHk0ODA4ZDMyaXB6ZDg3cWZ6cDcifQ.C3FHC7grg9-1kMoFCEcXEQ";

// API request to fetch emergencies
axios.get("/emergencies/info")
    .then( (res) => {
        console.log(res.data);

        // Initialize heat map
        map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/dark-v9",
            center: [-73.610369,45.513182],
            zoom: 10.5
        });

        map.on("load", () => {
            // Add a new source from our GeoJSON data and set the 'cluster' option to true.
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
                    "circle-radius": 10,
                    "circle-blur": 1
                }
            });
        });
    })
    .catch( (error) => {console.log(error);});

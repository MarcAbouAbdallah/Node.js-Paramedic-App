
// Mapbox access token
// mapboxgl.accessToken = ....
mapboxgl.accessToken = "pk.eyJ1IjoibWFyY2FhIiwiYSI6ImNtMjlxMHk0ODA4ZDMyaXB6ZDg3cWZ6cDcifQ.C3FHC7grg9-1kMoFCEcXEQ";

const socket = io(); //object to emit events to and listen to events from the server
const userId = document.body.getAttribute("data-userId");

socket.emit("join", {userId: userId}); //join event to join a room named after userId

// Default Data (Updated later when user interacts with map)
let emergencyDetails = {
    patientId: userId,
    location: {
        address: "Montreal Museum of Fine Arts, 1380 Sherbrooke St W, Montreal, QC H3G 1J5, Canada",
        longitude: -73.5804,
        latitude: 45.4980
    }
};

// Emit "emergency-request" signal to the server
function requestHelp() {
    console.log("Requested Help");
    socket.emit("emergency-request", emergencyDetails);
}


// Listen to "request-accepted" signal from the server
let paramedicDetails = {};
socket.on("request-accepted", (paramedicInfo) => {
    paramedicDetails = paramedicInfo;
    console.log(`Paramedic ${paramedicDetails.userId} accepted your emergency request`)

    document.getElementById("notification").innerHTML = `
    ${paramedicDetails.displayName} is en route from ${paramedicDetails.location.address} and will reach you shortly. <br>
    For any urgent inquiries, please contact them directly at ${paramedicDetails.phone}`

    // Add a marker to show paramedic's location
    new mapboxgl.Marker({
        element: createCustomMarker('url(/static/images/paramedic.png)'), // Custom paramedic marker
    })
    .setLngLat([paramedicDetails.location.longitude, paramedicDetails.location.latitude])
    .addTo(map);
});




// Initialize the map
const map = new mapboxgl.Map({
    container: 'map', // ID of HTML element
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-73.5804, 45.4980], // Starting position
    zoom: 12
});

// Add a marker at the initial position
const marker = new mapboxgl.Marker()
.setLngLat([-73.5804, 45.4980])
.addTo(map);


// Initialize the Mapbox Geocoder
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: 'Search for places',
    mapboxgl: mapboxgl,
    marker: false, // Prevent default marker from being added
    bbox: [-73.7077, 45.4215, -73.5145, 45.5773] // bounding box for search area
});

// Add the geocoder to the map
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


// Listen for the selection of a place
geocoder.on('result', (e) => {
    // Extract address and coordinates from the results and save it
    emergencyDetails.location = {
        address: e.result.place_name,
        latitude: e.result.geometry.coordinates[1], // latitude
        longitude: e.result.geometry.coordinates[0] // longitude
    };

    console.log('Emergency Details:', emergencyDetails);

    // Update marker to chosen location and pan the map
    marker.setLngLat(e.result.geometry.coordinates);
    map.flyTo({ center: e.result.geometry.coordinates });
});



//Method to create a custom marker
function createCustomMarker(url) {
    const element = document.createElement('div');
    element.style.backgroundImage = url;
    element.style.width = '40px';
    element.style.height = '40px';
    element.style.backgroundSize = 'contain'; // Make sure the image fits within the element
    element.style.backgroundRepeat = 'no-repeat'; // Prevent repetition
    element.style.backgroundPosition = 'center';
    element.style.marginTop = '-20px';
    element.style.marginLeft = '-20px';
    return element;
}


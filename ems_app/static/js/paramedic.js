
// Mapbox access token
// mapboxgl.accessToken = ....

const socket = io(); //object to emit events to and listen to events from the server
const userId = document.body.getAttribute("data-userId");

socket.emit("join", {userId: userId}); //Send a join signal to the server to join a room named after userId



/* Axios API to make Http requests
Get request to retrieve paramedic info, display it and set map location*/
let paramedicInfo = {};
let map = {};

axios.get(`/paramedics/info?userId=${userId}`)
    .then( (res) => {
        paramedicInfo = res.data.paramedicDetails;
        paramedicInfo.location = {
            address: paramedicInfo.location.address,
            longitude: paramedicInfo.location.coordinates[0],
            latitude: paramedicInfo.location.coordinates[1]
        }

        //display Info
        document.getElementById("paramedicDetails").innerHTML = `
            Name: ${paramedicInfo.displayName} <br>
            Address: ${paramedicInfo.location.address} <br>
            Phone: ${paramedicInfo.phone}
            `;

        // Initialize the map
        map = new mapboxgl.Map({
            container: 'map', // ID of HTML element
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [paramedicInfo.location.longitude, paramedicInfo.location.latitude], // Starting position
            zoom: 12
        });

        // Add a marker at the initial position
        const marker = new mapboxgl.Marker()
        .setLngLat([paramedicInfo.location.longitude, paramedicInfo.location.latitude])
        .addTo(map);

    })
    .catch((error) => {
        console.log(error)
     })


    
// Listen to "emergency-request" event from the server
let emergencyDetails = {};

socket.on("emergency-request", (emergencyInfo) => {

    console.log(`Paramedic ${userId} received the emergency request`)
    emergencyDetails = emergencyInfo;

    document.getElementById("notification").innerHTML = 
    `Urgent: Patient ${emergencyDetails.patientId} needs assistance immediately\! <br>
    Location: ${emergencyDetails.location.address}`

    // Marker to show the emergency location
    new mapboxgl.Marker({
        element: createCustomMarker('url(/static/images/patient.png)'), // Custom patient marker
    })
    .setLngLat([emergencyDetails.location.longitude, emergencyDetails.location.latitude])
    .addTo(map);

})


// Send a "request-accepted" signal to the server
function AcceptHelp(){
    socket.emit("request-accepted", {
        emergencyInfo: emergencyDetails,
        paramedicInfo: paramedicInfo
    });
}


//Helper method to create a custom marker
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
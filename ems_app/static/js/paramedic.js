
// Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoibWFyY2FhIiwiYSI6ImNtMjlxMHk0ODA4ZDMyaXB6ZDg3cWZ6cDcifQ.C3FHC7grg9-1kMoFCEcXEQ";

const socket = io(); //object to emit events to and listen to events from the server
const username = document.body.getAttribute("data-username");
const notificationElement = document.getElementById('notification');
const emergencyRequestsTable = document.getElementById('emergency-requests').getElementsByTagName('tbody')[0];

socket.emit("join", {username: username}); //Send a join signal to the server to join a room named after username


/* Axios API to make Http requests
Get request to retrieve paramedic info, display it and set map location*/
let paramedicInfo = {};
let map = {};

axios.get(`/paramedics/info?username=${username}`)
    .then( (res) => {
        paramedicInfo = res.data.paramedicDetails;
        paramedicInfo.location = {
            address: paramedicInfo.location.address,
            longitude: paramedicInfo.location.coordinates[0],
            latitude: paramedicInfo.location.coordinates[1]
        }

        /*display Info
        document.getElementById("paramedicDetails").innerHTML = `
            Name: ${paramedicInfo.displayName} <br>
            Address: ${paramedicInfo.location.address} <br>
            Phone: ${paramedicInfo.phone}
            `;
        */

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

    console.log(`Paramedic ${username} received the emergency request`)
    console.log(`EMERGENCY ${JSON.stringify(emergencyInfo)}`)

    // Latest notification
    notificationElement.innerHTML = 
    `Urgent: Patient ${emergencyInfo.patientId} needs assistance immediately\! <br>
    Location: ${emergencyInfo.location.address}`

    // Marker to show the new emergency location
    new mapboxgl.Marker({
        element: createCustomMarker('url(/static/images/patient.png)'), // Custom patient marker
    })
    .setLngLat([emergencyInfo.location.longitude, emergencyInfo.location.latitude])
    .addTo(map);

    // Add new row to the emergency table
    const newRow = emergencyRequestsTable.insertRow();
    newRow.innerHTML = `
        <td>${emergencyInfo.patientId}</td>
        <td>${emergencyInfo.location.address}</td>
        <td>${emergencyInfo.emergencyTime}</td>
        <td><button class="accept-btn" data-emergency-id="${emergencyInfo.emergencyId}">Accept</button></td>
    `;

})

// Accept buttons
emergencyRequestsTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('accept-btn')) {
        AcceptHelp(event.target.getAttribute('data-emergency-id'));
    }
});


// Send a "request-accepted" signal to the server
function AcceptHelp(emergencyId){
    socket.emit("request-accepted", {
        emergencyId: emergencyId,
        paramedicInfo: paramedicInfo
    });

    const acceptButton = document.querySelector(`button[data-emergency-id='${emergencyId}']`);
    acceptButton.textContent = 'Accepted';
    acceptButton.disabled = true;
    acceptButton.classList.remove('accept-btn');
    acceptButton.classList.add('accepted-btn');

    // Update the notification
    notificationElement.textContent = `You have accepted the emergency with Id ${emergencyId}`;
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
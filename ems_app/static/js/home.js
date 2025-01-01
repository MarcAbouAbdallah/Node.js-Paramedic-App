document.addEventListener('DOMContentLoaded', () => {
    const patientToggle = document.getElementById('patientToggle');
    const paramedicToggle = document.getElementById('paramedicToggle');
    const loginForm = document.getElementById('loginForm');
    const backgroundAnimation = document.querySelector('.background-animation');

    patientToggle.addEventListener('click', () => {
        patientToggle.classList.add('active');
        paramedicToggle.classList.remove('active');
    });

    paramedicToggle.addEventListener('click', () => {
        paramedicToggle.classList.add('active');
        patientToggle.classList.remove('active');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = patientToggle.classList.contains('active') ? 'patient' : 'paramedic';

        // Here you would typically send a request to your server to authenticate
        try {
            // Send login request to the server
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, role })
            });
    
            if (!response.ok) {
                const message = await response.json();
                alert(message.error);
                return;
            }
    
            const { token } = await response.json();
            //console.log('JWT Token:', token);
    
            // Store the token securely (localStorage)
            //localStorage.setItem('authToken', token);
    
            // Make GET request with the token to the appropriate page
            let pageUrl = role === 'patient' ? '/patient.html' : '/paramedic.html';

            /*
            
            // Make the GET request with Authorization header
            const pageResponse = await fetch(pageUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            // Check if the request was successful
            if (!pageResponse.ok) {
                const error = await pageResponse.json();
                alert(error.message);
                return;
            }
            */

            window.location.href = pageUrl+`?token=${token}`;

            // Server will render and send the appropriate pages
            //const pageContent = await pageResponse.text();
            //document.body.innerHTML = pageContent; // Replace the current page with the server's response

        } catch (error) {
            console.error("Login Failed", error);
            alert("Please try login again")
        }
    });

    // Background animation
    function createHeartbeat() {
        const heartbeat = document.createElement('div');
        heartbeat.classList.add('heartbeat');
        heartbeat.style.left = `${Math.random() * 100}%`;
        heartbeat.style.top = `${Math.random() * 100}%`;
        heartbeat.style.animationDuration = `${Math.random() * 3 + 2}s`;
        backgroundAnimation.appendChild(heartbeat);

        setTimeout(() => {
            heartbeat.remove();
        }, 5000);
    }

    setInterval(createHeartbeat, 500);
});
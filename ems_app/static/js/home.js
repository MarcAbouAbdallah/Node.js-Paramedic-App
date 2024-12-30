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

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = patientToggle.classList.contains('active') ? 'patient' : 'paramedic';

        // Here you would typically send a request to your server to authenticate
        console.log('Login attempt:', { username, password, role });
        alert(`Login attempt for ${role}: ${username}`);
        // After successful login, you would redirect to the appropriate dashboard
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
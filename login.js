document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    // SAMPLE vrijednosti
    const validUsername = 'admin';
    const validPassword = 'password123';

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Provjera
        if (username === validUsername && password === validPassword) {
            window.location.href = 'admin-dashboard.html'; // trenutno primjer samo
        } else {
            errorMessage.textContent = 'Invalid username or password. Please try again.';
        }
    });
});

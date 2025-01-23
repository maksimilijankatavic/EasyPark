document.addEventListener("DOMContentLoaded", function () {
    let infoKorisnik = JSON.parse(localStorage.getItem("info_korisnik"));
    let isLoggedIn = infoKorisnik !== null && infoKorisnik.admin === false;

    let statusDiv = document.createElement("div");
    statusDiv.style.position = "fixed";
    statusDiv.style.bottom = "10px";
    statusDiv.style.right = "10px";
    statusDiv.style.backgroundColor = "black";
    statusDiv.style.color = "white";
    statusDiv.style.padding = "10px";
    statusDiv.style.borderRadius = "5px";
    statusDiv.style.zIndex = "1000";

    if (isLoggedIn) {
        statusDiv.innerHTML = "✅ Ulogiran";
    } else {
        statusDiv.innerHTML = "❌ Nije ulogiran";
    }

    document.body.appendChild(statusDiv);

    if (isLoggedIn) {
        // Elementi za logirane korisnike
        document.getElementById("monthly-ticket").style.display = "inline";
        document.getElementById("ticket-history").style.display = "inline";
        document.getElementById("monthly-reservation").style.display = "block";

        // Sakrij sa logirane korisnike
        document.getElementById("login-service").style.display = "none";

        // Set margin for the navigation ul
        const navUl = document.querySelector('nav ul');
        navUl.style.marginLeft = '180px'; // Set left margin for the navigation
    } else {
        // Elements for non-logged-in users
        const navUl = document.querySelector('nav ul');
        navUl.style.marginLeft = '0'; // Reset left margin for non-logged-in users

        // Hide the Sign Out button
        const signOutButton = document.querySelector('.sign-out');
        signOutButton.style.display = 'none'; // Hide the Sign Out button
    }
    
});
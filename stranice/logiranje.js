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
        document.getElementById('monthly-ticket').style.display = 'block';
        document.getElementById('ticket-history').style.display = 'block';
        document.getElementById('login').style.display = 'none';

        const navUl = document.querySelector('nav ul');
        navUl.style.marginLeft = '180px';
    } else {
    // Elementi za ne logirane korisnike
    const navUl = document.querySelector('nav ul');
    navUl.style.marginLeft = '0';

    // Sakrij sign out tipku
    const signOutButton = document.querySelector('.sign-out');
    signOutButton.style.display = 'none';
}
    
});
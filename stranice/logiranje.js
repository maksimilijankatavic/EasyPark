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
        document.getElementById('monthly-ticket').style.display = 'block';
        document.getElementById('login').style.display = 'none';
        document.getElementById('extend').style.display = 'block';

        // Prikazivanje Sign Out gumba
        const signOutButton = document.getElementById('sign-out');
        signOutButton.style.display = 'block';

        const navUl = document.querySelector('nav ul');
        navUl.style.marginLeft = '180px';

        // Dodavanje funkcionalnosti za odjavu
        signOutButton.addEventListener("click", function () {
            localStorage.removeItem("info_korisnik");
            window.location.href = "../pocetna/pocetna.html";
        });

    } else {
        statusDiv.innerHTML = "❌ Nije ulogiran";

        const navUl = document.querySelector('nav ul');
        navUl.style.marginLeft = '0';

        // Sakrij sign-out tipku
        document.getElementById('sign-out').style.display = 'none';
    }

    document.body.appendChild(statusDiv);
});

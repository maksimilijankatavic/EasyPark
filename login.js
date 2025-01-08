const loginForm = document.getElementById('login-form');
const messageDiv = document.getElementById('message');

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const isAdmin = document.getElementById("admin-check").checked;

    const isSignup = event.submitter.classList.contains("signup");

    function validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasSymbol;
    }

    if (isSignup) {
        if (!validatePassword(password)) {
            messageDiv.textContent = "Lozinka mora imati najmanje 8 znakova, barem jedno malo slovo, jedno veliko slovo i jedan simbol.";
            messageDiv.style.color = "red";
            return;
        }
    }

    let url = "";
    let body = {};
    if (isSignup) {
        url = "http://localhost:3000/osoba/dodaj";
        body = {
            korisnicko_ime: username,
            lozinka: password,
            admin: isAdmin,
        };
    } else {
        url = "http://localhost:3000/osoba/provjeri";
        body = {
            korisnicko_ime: username,
            lozinka: password,
        };
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
            if (url === "http://localhost:3000/osoba/provjeri") {
                if (data.success === true && data.admin === true) {
                    localStorage.setItem("info_korisnik", JSON.stringify(data.info_korisnik));
                    window.location.href = "add-parking-lot.html";
                    return;
                } else if (data.success === false && data.message) {
                    messageDiv.textContent = data.message;
                    messageDiv.style.color = "red";
                } else {
                    messageDiv.textContent = "Prijava uspješna, ali nemate administratorska prava.";
                    messageDiv.style.color = "orange";
                }
            } else if (data.message) {
                messageDiv.textContent = data.message;
                messageDiv.style.color = "green";
            }
        } else {
            messageDiv.textContent = data.error || "Nepoznata greška.";
            messageDiv.style.color = "red";
        }
    } catch (err) {
        messageDiv.textContent = "Greška pri povezivanju sa serverom.";
        messageDiv.style.color = "red";
        console.error("Error:", err);
    }
});
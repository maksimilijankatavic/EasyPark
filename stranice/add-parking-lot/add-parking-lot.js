document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-parking-lot-form");
    const messageDiv = document.getElementById("message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const adminInfo = localStorage.getItem("info_korisnik");
        if (!adminInfo) {
            displayMessage("Admin information not found in localStorage.", "error");
            return;
        }

        const adminData = JSON.parse(adminInfo);
        const FK_admin = adminData.id_osobe;

        const broj_mjesta = parseInt(document.getElementById("capacity").value, 10);
        const FK_grad = parseInt(document.getElementById("location").value, 10);
        const FK_zona = parseInt(document.getElementById("zone").value, 10);

        if (!broj_mjesta || !FK_grad || !FK_zona) {
            displayMessage("Please fill in all the fields correctly.", "error");
            return;
        }

        const requestData = {
            broj_mjesta,
            FK_admin,
            FK_grad,
            FK_zona
        };

        try {
            const response = await fetch("http://localhost:3000/add-parking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (response.ok) {
                displayMessage(result.message, "success");
                form.reset();
            } else {
                displayMessage(result.error || "Failed to add parking lot.", "error");
            }
        } catch (error) {
            console.error("Error while adding parking lot:", error);
            displayMessage("An error occurred. Please try again later.", "error");
        }
    });

    function displayMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
    }

    const signOutButton = document.getElementById("sign-out");
    if (signOutButton) {
        signOutButton.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.clear();
            window.location.href = "../login/login.html";
        });
    }
});

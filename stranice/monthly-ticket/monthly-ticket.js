const monthlyTicketForm = document.getElementById('monthly-ticket-form');
const ticketMessageDiv = document.getElementById('ticket-message');

monthlyTicketForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const licensePlate = document.getElementById("license-plate").value;
    const startDate = document.getElementById("start-date").value;
    const paymentMethod = document.getElementById("payment-method").value;

    const body = {
        username: username,
        license_plate: licensePlate,
        start_date: startDate,
        payment_method: paymentMethod,
    };

    try {
        const response = await fetch("http://localhost:3000/tickets/monthly", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
            ticketMessageDiv.textContent = "Monthly ticket purchased successfully!";
            ticketMessageDiv.style.color = "green";
        } else {
            ticketMessageDiv.textContent = data.error || "Purchase failed.";
            ticketMessageDiv.style.color = "red";
        }
    } catch (err) {
        ticketMessageDiv.textContent = "Error connecting to the server.";
        ticketMessageDiv.style.color = "red";
        console.error("Error:", err);
    }
}); 
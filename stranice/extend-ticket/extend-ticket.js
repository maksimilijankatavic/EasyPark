document.addEventListener("DOMContentLoaded", async function () {
    const korisnikInfo = JSON.parse(localStorage.getItem("info_korisnik"));
    const korisnickoIme = korisnikInfo.korisnicko_ime;
    const serviceGrid = document.querySelector(".service-grid");

    async function fetchTickets() {
        try {
            const response = await fetch(`http://localhost:3000/osoba/karte/${korisnickoIme}`);
            const data = await response.json();
            if (data.karte) {
                data.karte.forEach(createTicketCard);
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    }

    async function fetchParkingPrice(parkingId) {
        try {
            const response = await fetch(`http://localhost:3000/parking/podaci/${parkingId}`);
            const data = await response.json();
            return data.cijena_satne || 0;
        } catch (error) {
            console.error("Error fetching parking price:", error);
            return 0;
        }
    }

    function createTicketCard(ticket) {
        const card = document.createElement("div");
        card.className = "ticket-card";
        card.innerHTML = `
            <div class="service-card">
            <p>Vehicle ID: ${ticket.fk_vozilo}</p>
            <p>Expires: ${new Date(ticket.vrijeme_isteka).toLocaleString()}</p>
            <p>Parking ID: ${ticket.fk_parking}</p>
            <button class="extend-btn">Extend</button>
            </div>
        `;
        
        card.querySelector(".extend-btn").addEventListener("click", () => openPaymentWindow(ticket));
        serviceGrid.appendChild(card);
    }

    function openPaymentWindow(ticket) {
        const overlay = document.querySelector(".overlay");
        overlay.innerHTML = `
            <div class="payment-window">
                <h2>Extend Ticket</h2>
                <p>Vehicle: ${ticket.fk_vozilo}</p>
                <p>Parking ID: ${ticket.fk_parking}</p>
                <label>Card Number: <input type="text" id="card-number"></label>
                <label>Expiry Date: <input type="text" id="expiry-date"></label>
                <label>CVV: <input type="text" id="cvv"></label>
                <p id="price-info">Price: Calculating...</p>
                <button id="pay-now">Pay Now</button>
                <button id="close-window">Close</button>
            </div>
        `;
        overlay.style.display = "block";
        
        document.getElementById("close-window").addEventListener("click", () => {
            overlay.style.display = "none";
        });
        
        fetchParkingPrice(ticket.fk_parking).then(price => {
            document.getElementById("price-info").textContent = `Price: ${price} EUR`;
        });
        
        document.getElementById("pay-now").addEventListener("click", () => processPayment(ticket));
    }

    async function processPayment(ticket) {
        const cardNumber = document.getElementById("card-number").value;
        const expiryDate = document.getElementById("expiry-date").value;
        const cvv = document.getElementById("cvv").value;
        if (!cardNumber || !expiryDate || !cvv) {
            alert("All payment fields must be filled.");
            return;
        }
        
        const newExpiry = new Date(ticket.vrijeme_isteka);
        newExpiry.setHours(newExpiry.getHours() + 2);

        await fetch("http://localhost:3000/kupljena-karta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                voziloId: ticket.fk_vozilo,
                parkingId: ticket.fk_parking,
                vrijemeIsteka: newExpiry.toISOString(),
            }),
        });

        await fetch("http://localhost:3000/parking/prihod", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idParking: ticket.fk_parking,
                iznos: await fetchParkingPrice(ticket.fk_parking)
            })
        });

        newExpiry.setHours(newExpiry.getHours() - 1);

        alert(`Ticket extended!\nVehicle: ${ticket.fk_vozilo}\nNew Expiry: ${newExpiry.toLocaleString()}`);
        document.querySelector(".overlay").style.display = "none";
        serviceGrid.innerHTML = "";
        fetchTickets();
    }

    fetchTickets();
});

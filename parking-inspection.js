document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // Zatvori menu kada kliknemo overlay
    overlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Zatvori meni kada kliknemo link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    async function fetchParkingDetails(parkingId) {
        const parkingCard = document.querySelector(`#parking${parkingId} .parkingDetails`);
        if (parkingCard) {
            parkingCard.innerHTML = "<p>Loading...</p>";
        }

        try {
            const response = await fetch(`http://localhost:3000/parking/podaci/${parkingId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const { id_zone, cijena_satne, cijena_dnevne, slobodna_mjesta } = data;

            if (parkingCard) {
                parkingCard.innerHTML = `
                    <div class="detail">
                        <span>📍</span>
                        <p>Zone: ${id_zone}</p>
                    </div>
                    <div class="detail">
                        <span>⏱️</span>
                        <p>Hourly: ${cijena_satne} €</p>
                    </div>
                    <div class="detail">
                        <span>🌞</span>
                        <p>Daily: ${cijena_dnevne} €</p>
                    </div>
                    <div class="detail">
                        <span>🟢</span>
                        <p>Free: ${slobodna_mjesta}</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            if (parkingCard) {
                parkingCard.innerHTML = `<p>Error: ${error.message}</p>`;
            }
        }
    }

    async function fetchAllParkingDetails() {
        try {
            const response = await fetch('http://localhost:3000/parking/sve');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const parkingIds = await response.json();

            parkingIds.sort((a, b) => a.id_parkinga - b.id_parkinga);

            const serviceGrid = document.querySelector('.service-grid');
            serviceGrid.innerHTML = '';

            parkingIds.forEach(({ id_parkinga }) => {
                const parkingCard = document.createElement('div');
                parkingCard.classList.add('service-card');
                parkingCard.id = `parking${id_parkinga}`;
                parkingCard.innerHTML = `
                    <h2>Parking ${id_parkinga}</h2>
                    <div class="details-grid parkingDetails">
                        <p class="parkingDetails">Loading...</p>
                    </div>
                `;
                serviceGrid.appendChild(parkingCard);

                fetchParkingDetails(id_parkinga);
            });
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    fetchAllParkingDetails();
});

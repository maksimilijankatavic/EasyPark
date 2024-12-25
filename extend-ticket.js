document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');
    const serviceCards = document.querySelectorAll('.service-card');

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
    });

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    // Selekcija ticketa
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            serviceCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
});

document.getElementById('pay-button').addEventListener('click', function() {
    const selectedTicket = document.querySelector('input[name="ticket"]:checked');
    if (selectedTicket) {
        alert(`You have chosen to extend ${selectedTicket.value}. Proceeding to payment...`);
        // Ovdje ce ici funkcionalnost plaćanja
    } else {
        alert('Please select a ticket to extend.');
    }
});

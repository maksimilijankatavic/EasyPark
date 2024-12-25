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
});

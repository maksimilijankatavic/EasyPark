document.addEventListener('DOMContentLoaded', function() {
    // Funkcionalnost navigacije
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');

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

    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    let currentStep = 0;

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateFormSteps();
                updateProgressBar();
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            updateFormSteps();
            updateProgressBar();
        });
    });

    function updateFormSteps() {
        formSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === currentStep) {
                step.classList.add('active');
            }
        });
    }

    function updateProgressBar() {
        progressSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index <= currentStep) {
                step.classList.add('active');
            }
        });
    }

    function validateStep(step) {
        const currentFormStep = formSteps[step];
        const inputs = currentFormStep.querySelectorAll('input, select');
        let isValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    // Forma
    const form = document.getElementById('ticketForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // Ovdje šalji na server podatke
            alert('Payment successful! Your ticket has been purchased.');
        }
    });

    // Računanje cijene
    const duration = document.getElementById('duration');
    const parkingFee = document.getElementById('parkingFee');
    const totalPrice = document.getElementById('totalPrice');

    duration.addEventListener('change', function() {
        const hours = parseInt(this.value);
        let fee = 0;
        
        switch(hours) {
            case 1: fee = 2.00; break;
            case 2: fee = 3.50; break;
            case 4: fee = 6.00; break;
            default: fee = 10.00;
        }

        parkingFee.textContent = `$${fee.toFixed(2)}`;
        totalPrice.textContent = `$${fee.toFixed(2)}`;
    });
}); 
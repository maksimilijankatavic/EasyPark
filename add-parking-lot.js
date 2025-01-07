function addParkingLot() {
    const lotName = document.getElementById('lot-name').value.trim();
    const location = document.getElementById('location').value.trim();
    const capacity = document.getElementById('capacity').value;
    const availability = document.getElementById('availability').value;

    // Provjera validacije
    const resultMessage = document.getElementById('result-message');
    resultMessage.textContent = '';

    if (!lotName) {
        resultMessage.textContent = 'Please enter a valid parking lot name.';
        resultMessage.style.color = 'red';
        return;
    }

    if (!location) {
        resultMessage.textContent = 'Please enter a valid location.';
        resultMessage.style.color = 'red'; 
        return;
    }

    if (!capacity || capacity <= 0) {
        resultMessage.textContent = 'Please enter a valid capacity greater than 0.';
        resultMessage.style.color = 'red'; 
        return;
    }

    const confirmation = confirm(`You are about to add a new parking lot:\n\nName: ${lotName}\nLocation: ${location}\nCapacity: ${capacity}\nAvailability: ${availability}\n\nDo you want to proceed?`);

    if (confirmation) {
        // Simulacija dodavanja parkinga (zamijeniti stvarnim API pozivom)
        const parkingLot = {
            name: lotName,
            location: location,
            capacity: capacity,
            availability: availability
        };

        // uspjesno
        resultMessage.textContent = `Parking Lot "${parkingLot.name}" added successfully!`;
        resultMessage.style.color = 'green';

        document.getElementById('add-parking-lot-form').reset();
    } else {
        resultMessage.textContent = 'Operation cancelled.';
        resultMessage.style.color = 'orange';
    }
} 
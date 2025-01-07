function editParkingLot() {
    const parkingLotSelect = document.getElementById('parking-lot-select').value;
    const lotName = document.getElementById('lot-name').value.trim();
    const location = document.getElementById('location').value.trim();
    const capacity = document.getElementById('capacity').value;
    const availability = document.getElementById('availability').value;

    // Provjera validacije
    const resultMessage = document.getElementById('result-message');
    resultMessage.textContent = '';

    if (!parkingLotSelect) {
        resultMessage.textContent = 'Please select a parking lot.';
        resultMessage.style.color = 'red'; 
        return;
    }

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

    const confirmation = confirm(`You are about to update the parking lot:\n\nName: ${lotName}\nLocation: ${location}\nCapacity: ${capacity}\nAvailability: ${availability}\n\nDo you want to proceed?`);

    if (confirmation) {
        // Simulacija dodavanja parkinga (zamijeniti stvarnim API pozivom)
        const updatedParkingLot = {
            name: lotName,
            location: location,
            capacity: capacity,
            availability: availability
        };

        // uspjesno
        resultMessage.textContent = `Parking Lot "${updatedParkingLot.name}" updated successfully!`;
        resultMessage.style.color = 'green';

        document.getElementById('edit-parking-lot-form').reset();
    } else {
        resultMessage.textContent = 'Operation cancelled.';
        resultMessage.style.color = 'orange'; 
    }
} 
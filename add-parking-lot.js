function addParkingLot() {
    const lotName = document.getElementById('lot-name').value.trim();
    const location = document.getElementById('location').value.trim();
    const capacity = document.getElementById('capacity').value;
    const availability = document.getElementById('availability').value;

    // Validation checks
    const resultMessage = document.getElementById('result-message');
    resultMessage.textContent = ''; // Clear previous messages

    if (!lotName) {
        resultMessage.textContent = 'Please enter a valid parking lot name.';
        resultMessage.style.color = 'red'; // Error message color
        return;
    }

    if (!location) {
        resultMessage.textContent = 'Please enter a valid location.';
        resultMessage.style.color = 'red'; // Error message color
        return;
    }

    if (!capacity || capacity <= 0) {
        resultMessage.textContent = 'Please enter a valid capacity greater than 0.';
        resultMessage.style.color = 'red'; // Error message color
        return;
    }

    // Confirmation popup
    const confirmation = confirm(`You are about to add a new parking lot:\n\nName: ${lotName}\nLocation: ${location}\nCapacity: ${capacity}\nAvailability: ${availability}\n\nDo you want to proceed?`);

    if (confirmation) {
        // Simulate adding the parking lot (replace with actual API call)
        const parkingLot = {
            name: lotName,
            location: location,
            capacity: capacity,
            availability: availability
        };

        // Display success message
        resultMessage.textContent = `Parking Lot "${parkingLot.name}" added successfully!`;
        resultMessage.style.color = 'green'; // Success message color

        // Clear the form
        document.getElementById('add-parking-lot-form').reset();
    } else {
        resultMessage.textContent = 'Operation cancelled.';
        resultMessage.style.color = 'orange'; // Cancel message color
    }
} 
document.addEventListener("DOMContentLoaded", () => {
    const parkingLotSelect = document.getElementById("parking-lot-select");
    const capacityInput = document.getElementById("capacity");
    const locationSelect = document.getElementById("location");
    const zoneSelect = document.getElementById("zone");
    const messageDiv = document.getElementById("message");
    const editParkingLotForm = document.getElementById("edit-parking-lot-form");
  
    const userInfo = JSON.parse(localStorage.getItem("info_korisnik"));
  
    if (!userInfo || !userInfo.parking_ids) {
      messageDiv.textContent = "Error: User data is missing or invalid.";
      messageDiv.classList.add("error");
      return;
    }
  
    userInfo.parking_ids.forEach((id) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = `Parking ${id}`;
      parkingLotSelect.appendChild(option);
    });
  
    editParkingLotForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      messageDiv.textContent = "";
      messageDiv.classList.remove("success", "error");
  
      const selectedParkingLot = parkingLotSelect.value;
      const capacity = capacityInput.value;
      const location = locationSelect.value;
      const zone = zoneSelect.value;
  
      if (!selectedParkingLot || !capacity || !location || !zone) {
        messageDiv.textContent = "All fields are required.";
        messageDiv.classList.add("error");
        return;
      }
  
      const requestData = {
        broj_mjesta: parseInt(capacity, 10),
        FK_admin: userInfo.id_osobe,
        FK_grad: parseInt(location, 10),
        FK_zona: parseInt(zone, 10),
      };
  
      try {
        const response = await fetch(`http://localhost:3000/parking/${selectedParkingLot}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update parking lot.");
        }
  
        const responseData = await response.json();
        messageDiv.textContent = responseData.message || "Parking lot updated successfully.";
        messageDiv.classList.add("success");
  
        editParkingLotForm.reset();
      } catch (error) {
        console.error("Error updating parking lot:", error);
        messageDiv.textContent = "Error updating parking lot: " + error.message;
        messageDiv.classList.add("error");
      }
    });
  });
  
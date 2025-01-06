document.addEventListener("DOMContentLoaded", function () {
  // Funkcionalnost navigacije
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  const overlay = document.querySelector(".overlay");

  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    menuToggle.classList.toggle("active");
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", function () {
    menuToggle.classList.remove("active");
    nav.classList.remove("active");
    overlay.classList.remove("active");
  });

  const nextButtons = document.querySelectorAll(".next-step");
  const prevButtons = document.querySelectorAll(".prev-step");
  const formSteps = document.querySelectorAll(".form-step");
  const progressSteps = document.querySelectorAll(".step");
  let currentStep = 0;

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        currentStep++;
        updateFormSteps();
        updateProgressBar();
        if (currentStep === 2) {
          calculatePrice(); // Calculate price at step 2
        }
      }
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentStep--;
      updateFormSteps();
      updateProgressBar();
    });
  });

  function updateFormSteps() {
    formSteps.forEach((step, index) => {
      step.classList.remove("active");
      if (index === currentStep) {
        step.classList.add("active");
      }
    });
  }

  function updateProgressBar() {
    progressSteps.forEach((step, index) => {
      step.classList.remove("active");
      if (index <= currentStep) {
        step.classList.add("active");
      }
    });
  }

  document.querySelector(".finish-button").addEventListener("click", () => {
    alert("Thank you for using EasyPark!");
    location.href = "pocetna.html"; // Redirect to the homepage
  });

  function validateStep(step) {
    const currentFormStep = formSteps[step];
    const inputs = currentFormStep.querySelectorAll("input, select");
    let isValid = true;

    inputs.forEach((input) => {
      if (input.hasAttribute("required") && !input.value) {
        isValid = false;
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    });

    return isValid;
  }

  async function fetchParkingData(parkingId) {
    try {
      const response = await fetch(
        `http://localhost:3000/parking/podaci/${parkingId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch parking data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching parking data:", error);
      return null;
    }
  }

  async function calculatePrice() {
    const parkingId = document.getElementById("parkingLocation").value;
    const duration = document.getElementById("duration").value;

    if (!parkingId || !duration) return;

    const parkingData = await fetchParkingData(parkingId);
    if (!parkingData) {
      alert("Unable to retrieve parking data");
      return;
    }

    let price = 0;
    if (duration === "hour") {
      price = parkingData.cijena_satne;
    } else if (duration === "day") {
      price = parkingData.cijena_dnevne;
    }

    document.getElementById("parkingFee").textContent = `$${price.toFixed(2)}`;
    document.getElementById("totalPrice").textContent = `$${price.toFixed(2)}`;
  }

  document
    .getElementById("parkingLocation")
    .addEventListener("change", calculatePrice);
  document
    .getElementById("duration")
    .addEventListener("change", calculatePrice);

  const form = document.getElementById("ticketForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way
    buyTicket(); // Call buyTicket function
  });

  // Function to handle ticket purchase
  async function buyTicket() {
    const vehicleId = document.getElementById("plateNumber").value;
    const parkingId = document.getElementById("parkingLocation").value;
    const duration = document.getElementById("duration").value;

    // Get the current date and time
    let currentDate = new Date();

    // Add time based on the selected duration
    if (duration === "hour") {
      currentDate.setHours(currentDate.getHours() + 1); // Add 1 hour
    } else if (duration === "day") {
      currentDate.setDate(currentDate.getDate() + 1); // Add 1 day
    }

    // Adjust to local time zone
    let expiryTime = currentDate
      .toLocaleString("sv-SE", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour12: false,
      })
      .replace(" ", "T");
    
    let displayExpiryTime = currentDate.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    try {
      // Check if the vehicle exists or add it
      const vehicleResponse = await fetch(
        "http://localhost:3000/vozilo/dodaj",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idRegistarskaOzn: vehicleId,
            fkKorisnik: null, // Optional, adjust based on your requirements
          }),
        }
      );

      const vehicleData = await vehicleResponse.json();

      if (!vehicleResponse.ok) {
        throw new Error(vehicleData.error || "Failed to check or add vehicle.");
      }

      // Proceed with ticket creation or update
      const ticketResponse = await fetch(
        "http://localhost:3000/kupljena-karta",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voziloId: vehicleId,
            parkingId: parkingId,
            vrijemeIsteka: expiryTime,
          }),
        }
      );

      const ticketData = await ticketResponse.json();

      if (!ticketResponse.ok) {
        throw new Error(
          ticketData.error || "Failed to create or update ticket."
        );
      }

      // Populate ticket details
      document.getElementById("ticketVehicleId").textContent = vehicleId;
      document.getElementById("ticketParkingId").textContent = parkingId;
      document.getElementById("ticketExpiryDate").textContent = displayExpiryTime;

      // Move to the ticket details step
      currentStep++;
      updateFormSteps();
      updateProgressBar();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
});

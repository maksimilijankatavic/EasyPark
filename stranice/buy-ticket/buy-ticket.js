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
  const parkingLocation = document.getElementById("parkingLocation");
  let currentStep = 0;

  async function fetchAllParkingDetails() {
    try {
        const response = await fetch('http://localhost:3000/parking/sve');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const parkingIds = await response.json();

        parkingIds.sort((a, b) => a.id_parkinga - b.id_parkinga);

        parkingIds.forEach((parking) => {
          const option = document.createElement("option");
          option.value = parking.id_parkinga;
          option.textContent = `Parking ${parking.id_parkinga}`;
          parkingLocation.appendChild(option);
        });
    } catch (error) {
        console.error('Fetch error:', error);
    }
  }

  fetchAllParkingDetails();

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        currentStep++;
        updateFormSteps();
        updateProgressBar();
        if (currentStep === 2) {
          calculatePrice();
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
    location.href = "../pocetna/pocetna.html";
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

  async function calculatePriceCalculation(parkingId, duration) {
    if (!parkingId || !duration) return null;

    const parkingData = await fetchParkingData(parkingId);
    if (!parkingData) return null;

    let price = 0;
    if (duration === "hour") {
        price = parkingData.cijena_satne;
    } else if (duration === "day") {
        price = parkingData.cijena_dnevne;
    }

    if (price === null) {
      alert("Unable to retrieve parking data");
      return;
    }

    return price;
}


  async function calculatePrice() {
    const parkingId = parkingLocation.value;
    const duration = document.getElementById("duration").value;
  
    const price = await calculatePriceCalculation(parkingId, duration);
  
    if (price !== null && price !== undefined) {
      document.getElementById("parkingFee").textContent = `$${price.toFixed(2)}`;
      document.getElementById("totalPrice").textContent = `$${price.toFixed(2)}`;
    }
}

  document
    .getElementById("parkingLocation")
    .addEventListener("change", calculatePrice);
  document
    .getElementById("duration")
    .addEventListener("change", calculatePrice);

  const form = document.getElementById("ticketForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    buyTicket();
  });

  async function buyTicket() {
    const vehicleId = document.getElementById("plateNumber").value;
    const parkingId = parkingLocation.value;
    const duration = document.getElementById("duration").value;

    if (!parkingId) {
      alert("Please select a parking location.");
      return;
    }

    try {
      const parkingData = await fetchParkingData(parkingId);
      if (!parkingData) {
        alert("Unable to retrieve parking data. Please try again.");
        return;
      }

      const availableSpots = parkingData.slobodna_mjesta;
      const price =
        duration === "hour"
          ? parkingData.cijena_satne
          : parkingData.cijena_dnevne;

      if (availableSpots <= 0) {
        alert("No parking spots available. Please choose another location.");
        return;
      }

      let currentDate = new Date();

      if (duration === "hour") {
        currentDate.setHours(currentDate.getHours() + 1);
      } else if (duration === "day") {
        currentDate.setDate(currentDate.getDate() + 1);
      }

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

      let infoKorisnik = localStorage.getItem("info_korisnik");
      let fkKorisnik = null;

      if (infoKorisnik) {
        infoKorisnik = JSON.parse(infoKorisnik);
        if (infoKorisnik.admin === false) {
          fkKorisnik = infoKorisnik.id_osobe;
        }
      }

      const vehicleResponse = await fetch(
        "http://localhost:3000/vozilo/dodaj",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idRegistarskaOzn: vehicleId,
            fkKorisnik: fkKorisnik,
          }),
        }
      );

      const vehicleData = await vehicleResponse.json();

      if (!vehicleResponse.ok) {
        throw new Error(vehicleData.error || "Failed to check or add vehicle.");
      }

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

      const incomeResponse = await fetch(
        "http://localhost:3000/parking/prihod",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idParking: parkingId,
            iznos: price,
          }),
        }
      );

      if (!incomeResponse.ok) {
        throw new Error("Failed to update parking income.");
      }

      document.getElementById("ticketVehicleId").textContent = vehicleId;
      document.getElementById("ticketParkingId").textContent = parkingId;
      document.getElementById("ticketExpiryDate").textContent =
        displayExpiryTime;

      currentStep++;
      updateFormSteps();
      updateProgressBar();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
});

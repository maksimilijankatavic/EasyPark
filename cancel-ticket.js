document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  const overlay = document.querySelector(".overlay");

  // Navigation menu toggle
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

  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      nav.classList.remove("active");
      overlay.classList.remove("active");
    });
  });

  // Delete ticket functionality
  const deleteTicketButton = document.getElementById("deleteTicketButton");
  deleteTicketButton.addEventListener("click", function () {
    const vehicleId = document.getElementById("vehicleIdDelete").value.trim();
    const messageElement = document.getElementById("deleteMessage");

    if (!vehicleId) {
      messageElement.textContent = "Please enter a valid Vehicle ID.";
      messageElement.style.color = "red";
      return;
    }

    fetch(`http://localhost:3000/kupljena-karta/${vehicleId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        messageElement.textContent = data.message;
        messageElement.style.color = "green";
      })
      .catch((error) => {
        messageElement.textContent = "Error: " + error;
        messageElement.style.color = "red";
      });
  });
});

document.addEventListener("DOMContentLoaded", async () => {
    const userInfo = JSON.parse(localStorage.getItem("info_korisnik"));
    if (!userInfo || !userInfo.parking_ids) {
        console.error("No user info found in local storage");
        return;
    }

    const parkingIds = userInfo.parking_ids.sort((a, b) => a - b);
    const container = document.getElementById("parkingStatsContainer");
    container.classList.add("grid-container");

    const allEarnings = [];

    const overallChartContainer = document.createElement("div");
    overallChartContainer.classList.add("parking-card", "overall-chart-container");

    container.appendChild(overallChartContainer);

    for (const id of parkingIds) {
        try {
            const response = await fetch(`http://localhost:3000/parking/prihod/${id}`);
            const data = await response.json();
            if (data.mjesecni_prihod && Array.isArray(data.mjesecni_prihod)) {
                allEarnings.push(data.mjesecni_prihod);
                createParkingCard(id, data.mjesecni_prihod, container);
            }
        } catch (error) {
            console.error(`Error fetching earnings for parking ID ${id}:`, error);
        }
    }

    const combinedEarnings = combineEarnings(allEarnings);

    if (combinedEarnings.length > 0) {
        createCombinedChart(combinedEarnings, overallChartContainer);
    }

    const signOutButton = document.getElementById("sign-out");
    if (signOutButton) {
        signOutButton.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.clear();
            window.location.href = "../login/login.html";
        });
    }
});

function createParkingCard(parkingId, earnings, container) {
    const card = document.createElement("div");
    card.classList.add("parking-card");

    const title = document.createElement("h3");
    title.textContent = `Parking ${parkingId}`;
    card.appendChild(title);

    const canvas = document.createElement("canvas");
    canvas.id = `chart-${parkingId}`;
    card.appendChild(canvas);

    container.appendChild(card);
    plotEarnings(`chart-${parkingId}`, earnings);
}

function plotEarnings(chartId, earnings) {
    const ctx = document.getElementById(chartId).getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: earnings.map((_, index) => `Month ${index + 1}`),
            datasets: [{
                label: "Earnings",
                data: earnings,
                borderColor: "#4A90E2",
                backgroundColor: "rgba(74, 144, 226, 0.2)",
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    display: false
                }
            }
        }
    });
}

function combineEarnings(allEarnings) {
    const maxLength = Math.max(...allEarnings.map(arr => arr.length));
    const combined = [];

    for (let i = 0; i < maxLength; i++) {
        let combinedMonthEarnings = 0;

        for (const earnings of allEarnings) {
            const monthIndex = earnings.length - 1 - i;
            if (monthIndex >= 0) {
                combinedMonthEarnings += earnings[monthIndex];
            }
        }

        combined.unshift(combinedMonthEarnings);
    }

    return combined;
}

function createCombinedChart(combinedEarnings, overallChartContainer) {
    const card = document.createElement("div");
    card.classList.add("parking-card");

    const title = document.createElement("h3");
    title.textContent = "Overall";
    card.appendChild(title);

    const canvas = document.createElement("canvas");
    canvas.id = "combined-chart";
    card.appendChild(canvas);

    overallChartContainer.appendChild(card);

    const ctx = document.getElementById("combined-chart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: combinedEarnings.map((_, index) => `Month ${index + 1}`),
            datasets: [{
                label: "Earnings",
                data: combinedEarnings,
                borderColor: "#f9c23c",
                backgroundColor: "rgba(249, 194, 60, 0.2)",
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    display: false
                }
            }
        }
    });
}
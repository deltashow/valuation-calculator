let paymentChart;

document.addEventListener("DOMContentLoaded", () => {
    initChart();
    calculateValuation();

    // Event Listeners for inputs
    const inputs = ["location", "area", "finishing", "downPayment", "years"];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener("input", (e) => {
            if (id === "area") document.getElementById("areaVal").textContent = e.target.value;
            if (id === "downPayment") document.getElementById("downPaymentVal").textContent = e.target.value;
            calculateValuation();
        });
    });
});

function calculateValuation() {
    const basePricePerMeter = Number(document.getElementById("location").value);
    const area = Number(document.getElementById("area").value);
    const finishingMultiplier = Number(document.getElementById("finishing").value);
    const downPaymentPercent = Number(document.getElementById("downPayment").value) / 100;
    const years = Number(document.getElementById("years").value);

    // Calculations
    const totalPrice = basePricePerMeter * area * finishingMultiplier;
    const downPaymentAmount = totalPrice * downPaymentPercent;
    const remainingAmount = totalPrice - downPaymentAmount;
    
    // Simple Interest Rate Estimate (8% annual)
    const totalWithInterest = remainingAmount * (1 + (0.08 * years));
    const monthlyInstallment = totalWithInterest / (years * 12);

    // Update UI
    document.getElementById("totalPrice").textContent = `${Math.round(totalPrice).toLocaleString()} ج.م`;
    document.getElementById("monthlyInstallment").textContent = `${Math.round(monthlyInstallment).toLocaleString()} ج.م`;

    updateChart(downPaymentAmount, remainingAmount);
}

function initChart() {
    const ctx = document.getElementById("paymentChart").getContext("2d");
    paymentChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["الدفعة الأولى (المقدم)", "إجمالي الأقساط المتبقية"],
            datasets: [{
                data: [20, 80],
                backgroundColor: ["#fbbf24", "#6366f1"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: "#9ca3af", font: { family: "Cairo" } } }
            }
        }
    });
}

function updateChart(downPayment, remaining) {
    if (paymentChart) {
        paymentChart.data.datasets[0].data = [downPayment, remaining];
        paymentChart.update();
    }
}
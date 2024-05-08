document.addEventListener("DOMContentLoaded", function () {
    const uniqueNames = {};
    let selectedStartDates = [];
    let selectedEndDates = {};

    // Fetching names and populating dropdown
    fetch('/records')
        .then(response => response.json())
        .then(names => {
            const select = document.getElementById('name');
            names.forEach(name => {
                if (!uniqueNames[name]) {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    select.appendChild(option);
                    uniqueNames[name] = true;
                }
            });
        })
        .catch(error => console.error('Error fetching names:', error));
});

// Add row function for specific rates
var rateindex = 0;
function addRow() {
    var name = document.getElementById("name").value;
    var rate = document.getElementById("rate").value;
    var fromDate = document.getElementById("from").value;
    var toDate = document.getElementById("to").value;

    if (selectedStartDates.includes(fromDate) || selectedEndDates[toDate]) {
        alert("Start date or end date already selected for another row.");
        return;
    }

    selectedStartDates.push(fromDate);
    selectedEndDates[toDate] = true;

    fetch('/getrecords')
        .then(response => response.json())
        .then(data => {
            let totalWeight = 0;
            data.forEach(record => {
                const recordDate = record.date;
                if (record.name === name && recordDate >= fromDate && recordDate <= toDate) {
                    totalWeight += record.weight;
                } else {
                    console.log("Error");
                }
            });
            console.log(totalWeight);
            const tableBody = document.getElementById('rateTable');
            const newRow = tableBody.insertRow();
            const rate1 = newRow.insertCell();
            const rateCell = newRow.insertCell();
            const startDateCell = newRow.insertCell();
            const endDateCell = newRow.insertCell();
            const totalWeightCell = newRow.insertCell();
            const netAmountCell = newRow.insertCell();

            rate1.innerHTML = `Rate ${++rateindex}`;
            rateCell.innerHTML = `${rate}`;
            startDateCell.innerHTML = `${fromDate}`;
            endDateCell.innerHTML = `${toDate}`;
            totalWeightCell.innerHTML = `${totalWeight}`;
            netAmountCell.innerHTML = totalWeight * rate;
        })
        .catch(error => console.error('Error:', error));
}

// Add row function for general rates
var rateindexGen = 0;
function addGeneralRow() {
    var name = document.getElementById("name").value;
    var rate = document.getElementById("rateGen").value;
    var fromDate = document.getElementById("Genfrom").value;
    var toDate = document.getElementById("Gento").value;

    if (selectedStartDates.includes(fromDate) || selectedEndDates[toDate]) {
        alert("Start date or end date already selected for another row.");
        return;
    }
    selectedStartDates.push(fromDate);
    selectedEndDates[toDate] = true;

    fetch('/getrecords')
        .then(response => response.json())
        .then(data => {
            let totalWeight = 0;
            data.forEach(record => {
                const recordDate = record.date;
                if (record.name === name && recordDate >= fromDate && recordDate <= toDate) {
                    totalWeight += record.weight;
                } else {
                    console.log("Error");
                }
            });
            console.log(totalWeight);
            const tableBody = document.getElementById("genTable");
            const newRow = tableBody.insertRow();
            const rate1 = newRow.insertCell();
            const rateCell = newRow.insertCell();
            const startDateCell = newRow.insertCell();
            const endDateCell = newRow.insertCell();
            const totalWeightCell = newRow.insertCell();
            const netAmountCell = newRow.insertCell();

            rate1.innerHTML = `Rate ${++rateindexGen}`;
            rateCell.innerHTML = `${rate}`;
            startDateCell.innerHTML = `${fromDate}`;
            endDateCell.innerHTML = `${toDate}`;
            totalWeightCell.innerHTML = `${totalWeight}`;
            netAmountCell.innerHTML = totalWeight * rate;
        })
        .catch(error => console.error('Error:', error));
}
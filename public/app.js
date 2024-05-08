const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();


function adjustDateToLocal(dateString) {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);
  return date;
}

function generateCalendar(month, year, names, records) {
  const monthName = months[month];
  const daysInMonth = new Date(year, month + 1, 0).getUTCDate();

  let calendarHTML = `
    <h3>${monthName} ${year}</h3>
    <table>
      <tr>
        <th>Name</th>
        <th colspan="${daysInMonth}">Date & Weight</th>
        <th>Total Weight</th>
        <th>Rate1</th>
        <th>Rate2</th>
        <th>Rate3</th>
        <th>Net Amount</th>
        <th>Commission</th>
        <th>Net Payable</th>
        <th>Paid</th>
        <th>Unpaid</th>
      </tr>
      <tr>
        <td></td>
  `;

  for (let i = 1; i <= daysInMonth; i++) {
    calendarHTML += `<td>${i}</td>`;
  }

  calendarHTML += `
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  `;
  //the error was that "names" was undefined so i added a if condition it checks if "names" is undefined or as a value 
  if (names.length > 0) {
    names.forEach(name => {
      let totalWeight = 0;
      calendarHTML += `<tr><td>${name}</td>`;
      for (let i = 1; i <= daysInMonth; i++) {
        // Filter records to get the ones for the current name and date within the current month
        const filteredRecords = records.filter(entry => {
          const entryDate = adjustDateToLocal(entry.date);//converts the date to local timeline
          return entry.name === name && entryDate.getUTCDate() === i && entryDate.getUTCMonth() === month && entryDate.getUTCFullYear() === year; 
        });
        if (filteredRecords.length > 0) {
          const record = filteredRecords[0];
          totalWeight += parseFloat(record.weight);
          calendarHTML += `<td>${record.weight}</td>`;
        } else {
          calendarHTML += `<td></td>`;
        }
      }
      calendarHTML += `
        <td>${totalWeight}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>`;
    });
  } else {
    calendarHTML += `<tr><td colspan="${daysInMonth + 6}">No data available</td></tr>`;
  }

  calendarHTML += `</table>`;
  document.getElementById('calendar').innerHTML = calendarHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndGenerateCalendar(currentMonth, currentYear);
});

function prevMonth() {
  currentMonth -= 1;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  }
  fetchAndGenerateCalendar(currentMonth, currentYear);
}

function nextMonth() {
  currentMonth += 1;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  fetchAndGenerateCalendar(currentMonth, currentYear);
}
//made a new function that filters the fetched data accordingly to the month that as to be displayed 
function fetchAndGenerateCalendar(month, year) {
  fetch('http://localhost:3300/getrecords')
    .then(response => response.json())
    .then(data => {
      const filteredRecords = data.filter(entry => {
        const entryDate = adjustDateToLocal(entry.date);
        return entryDate.getUTCMonth() === month && entryDate.getUTCFullYear() === year;
      });

      if (filteredRecords.length > 0) {
        const uniqueNames = [...new Set(filteredRecords.map(entry => entry.name))];
        generateCalendar(month, year, uniqueNames, filteredRecords);
      } else {
        const monthName = months[month];
        const calendarHTML = `<h3>${monthName} ${year}</h3><p>No records available.</p>`;
        document.getElementById('calendar').innerHTML = calendarHTML;
      }
    })
    .catch(error => console.error('Error:', error));
}

// Your existing code

// Function to open the add rate modal
function openAddRateModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "block";
}

// Function to close the add rate modal
function closeAddRateModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

// Function to save the rates entered in the modal
function saveRates() {
  // Retrieve rate values from input fields
  const rate1 = document.getElementById("rate1").value;
  const startDate1 = document.getElementById("start_date1").value;
  const endDate1 = document.getElementById("end_date1").value;

  const rate2 = document.getElementById("rate2").value;
  const startDate2 = document.getElementById("start_date2").value;
  const endDate2 = document.getElementById("end_date2").value;

  const rate3 = document.getElementById("rate3").value;
  const startDate3 = document.getElementById("start_date3").value;
  const endDate3 = document.getElementById("end_date3").value;

  // You can perform further processing or send this data to the server as needed

  // Close the modal after saving
  closeAddRateModal();
}

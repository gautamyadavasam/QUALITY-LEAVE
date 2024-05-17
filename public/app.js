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

let mtn = document.getElementById("mtn");
function generateCalendar(month, year, names, records) {
  const monthName = months[month];
  const daysInMonth = new Date(year, month + 1, 0).getUTCDate();
  mtn.innerHTML = `${monthName} ${year}`
  let calendarHTML = `
    <table>
      <tr>
        <th>Name</th>
        <th colspan="${daysInMonth}">Weight</th>
        <th>Total Weight</th>
        <th>Rate 1</th>
        <th>Rate 2</th>
        <th>Rate 3</th>
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
          // calendarHTML += `<td>${record.weight}</td>`;
          if (record.quality == "Q1"){
            calendarHTML += `<td class="good">${record.weight}</td>`;
          } else {
            calendarHTML += `<td class="bad">${record.weight}</td>`;
          } 

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
        const calendarHTML = `<p>No records available.</p>`;
        document.getElementById('calendar').innerHTML = calendarHTML;
        mtn.innerHTML = `${monthName} ${year}`
      }
    })
    .catch(error => console.error('Error:', error));
}


document.addEventListener("DOMContentLoaded", function() {
  // Fetch names from records table on the server
  fetch('/records')
      .then(response => response.json())
      .then(names => {
          const select = document.getElementById('name');
          names.forEach(name => {
              const option = document.createElement('option');
              option.value = name;
              option.textContent = name;
              select.appendChild(option);
          });
      })
      .catch(error => console.error('Error fetching names:', error));

  // Set the default value of the date input field
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, '0');
  var day = String(now.getDate()).padStart(2, '0');
  
  document.getElementById("date").value = `${year}-${month}-${day}T${hours}:${minutes}`;
});




const addRateElement = document.getElementById("AddRate");
const offRatebtn = document.getElementById("rateDown");

const addQuaElement = document.getElementById("AddQua");
const offQuabtn = document.getElementById("quaDown");

const addComElement = document.getElementById("AddCom");
const offCombtn = document.getElementById("comdown");

const addRecElement = document.getElementById("addrecord");
const offRecbtn = document.getElementById("recDown");
// ----------
addRateElement.addEventListener("click", RatePopup);
offRatebtn.addEventListener("click", RatePopdown);

addQuaElement.addEventListener("click", QuaPopup);
offQuabtn.addEventListener("click", QuaPopdown);

addComElement.addEventListener("click", ComPopup);
offCombtn.addEventListener("click", ComPopdown);

addRecElement.addEventListener("click", RecPopup);
offRecbtn.addEventListener("click", RecPopdown);
// --------------
function RatePopup(){
const element = document.querySelector('.ra');
element.style.display = 'flex';
}
function RatePopdown(){
const element = document.querySelector('.ra');
element.style.display = 'none';
}
// ----------------
function QuaPopup(){
const element = document.querySelector('.qu');
element.style.display = 'flex';
}
function QuaPopdown(){
const element = document.querySelector('.qu');
element.style.display = 'none';
}
// -----------------
function ComPopup(){
const element = document.querySelector('.comi');
element.style.display = 'flex';
console.log("clicked");
}
function ComPopdown(){
const element = document.querySelector('.comi');
element.style.display = 'none';
}
// -----------------
function RecPopup(){
const element = document.querySelector('.rec');
element.style.display = 'flex';
}
function RecPopdown(){
const element = document.querySelector('.rec');
element.style.display = 'none';
}






const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {        document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);
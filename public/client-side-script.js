
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10, // adjust as needed
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'tea_garden'
});
// Connect to the MySQL server
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database as ID ' + connection.threadId);
 // Release the connection back to the pool
});
    // Fetch data from server when the page loads
    document.addEventListener("DOMContentLoaded", function() {
        fetch('/records')
            .then(response => response.json())
            .then(data => populateTable(data))
            .catch(error => console.error('Error fetching data:', error));
    });

    // Function to populate table with data
    function populateTable(data) {
        const tableBody = document.getElementById('data-body');
        tableBody.innerHTML = ''; // Clear existing rows

        data.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.name}</td>
                <td>${record.date}</td>
                <td>${record.weight}</td>
            `;
            tableBody.appendChild(row);
        });
    }


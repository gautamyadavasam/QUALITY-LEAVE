const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3300;

// Middleware for parsing incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Song!4736251',
    database: 'teagarden'
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware to set CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Function to get current date in Indian time zone
function getCurrentDate() {
    const now = new Date();
    return now.toLocaleString('en-IN', options);
}

// Handle form submission to save data to records table
app.post('/submit-record', (req, res) => {
    const { name, date, weight, quality} = req.body;


    // Insert data into the records table
    const sql = 'INSERT INTO records (name, date, weight, quality) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, date, weight, quality], (err, result) => {
        if (err) {
            console.error('Error saving data to MySQL:', err);
            res.status(500).json({ error: 'An error occurred while saving the data.' });
            return;
        }

        console.log('Data saved to records table');
        // res.json({ message: 'Data saved successfully!' });

    });

});

// Fetch records from the records table
app.get('/getrecords', (req, res) => {
    connection.query('SELECT name, date, weight, quality FROM records', (err, results) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('No data found');
            return;
        }
        res.json(results);
    });
});

// Admin Main Menu endpoint
app.get('/admin_main_menu', (req, res) => {
    // Get current date
    const currentDate = getCurrentDate();

    // Render Admin_main_menu.ejs with current date
    res.render('Admin_main_menu', { currentDate: currentDate });
});

// Admin Login endpoint
app.post('/admin', (req, res) => {
    const { user_id, password } = req.body;

    // Query the database to check if the username and password are valid
    const sql = 'SELECT * FROM admin WHERE user_id = ? AND password = ?';
    connection.query(sql, [user_id, password], (err, rows) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (rows.length === 0) {
            res.status(401).send('Invalid user_id or password.');
            return;
        }

        res.redirect('/admin_landing page.html');
    });
});

// Admin Registration endpoint
app.post('/admin_registration', (req, res) => {
    const { user_id, name, gender, address, phone_no, bank_account_no, pan_card, aadhar_card, date_of_birth, upi_no_upi_id, password } = req.body;

    // Insert new admin data into the database
    const sql = 'INSERT INTO admin (user_id, name, gender, address, phone_no, bank_account_no, pan_card, aadhar_card, date_of_birth, upi_no_upi_id, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [user_id, name, gender, address, phone_no, bank_account_no, pan_card, aadhar_card, date_of_birth, upi_no_upi_id, password], (err, result) => {
        if (err) {
            console.error('Error saving admin data to MySQL:', err);
            res.status(500).send('An error occurred while saving the admin data.');
            return;
        }

        console.log('Admin data saved to MySQL');
        res.send('Admin registration successful and data saved to the database!');
    });
});

// Farmer Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database to check if the username and password are valid
    connection.query('SELECT * FROM registrations WHERE username = ? AND password = ?', [username, password], (err, rows) => {
        if (err) {
            console.error('Error checking username and password:', err);
            res.status(500).send('An error occurred while checking the username and password.');
            return;
        }

        if (rows.length === 0) {
            res.status(401).send('Invalid username or password.');
            return;
        }

        res.redirect('/farmer_main_menu.html');
    });
});

// Farmer Registration endpoint
app.post('/register', (req, res) => {
    const { username, password, name, address, dob, agent_id } = req.body;

    
    // Insert new farmer data into the database
    const sql = 'INSERT INTO registrations (username, password, name, address, dob, agent_id) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [username, password, name, address, dob, agent_id], (err, result) => {
        if (err) {
            console.error('Error saving farmer data to MySQL:', err);
            res.status(500).send('An error occurred while saving the farmer data.');
            return;
        }

        console.log('Farmer data saved to MySQL');
        res.send('Farmer registration successful and data saved to the database!');
    });
});

// Fetch names from the records table
app.get('/records', (req, res) => {
    const sql = 'SELECT name FROM records';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        const names = results.map(result => result.name);
        res.json(names);
    });
});

app.get('/admin', (req, res) => {
    const sql = 'SELECT user_id FROM admin';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


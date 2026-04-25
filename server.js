const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

// MIDDLEWARE - Very Important!
app.use(cors());
app.use(express.json()); // This allows the server to read your form data
app.use(express.static(path.join(__dirname, 'public')));

// DATABASE CONNECTION
const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'pujitha@2007', // <--- CHANGE THIS TO YOUR ACTUAL PASSWORD
    database: 'student_analysis'
});

db.connect(err => {
    if (err) {
        console.error("MySQL Connection Error: " + err.message);
        return;
    }
    console.log("Connected to MySQL Database!");
});

// ROUTES (Note the /api prefix)

// 1. SIGNUP
app.post('/api/signup', (req, res) => {
    const { fname, lname, username, password, role } = req.body;
    const sql = "INSERT INTO users (fname, lname, username, password, role) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [fname, lname, username, password, role], (err, result) => {
        if (err) {
            console.error("Signup Error:", err);
            return res.status(500).json({ error: "Username might already exist" });
        }
        res.status(200).json({ message: "User registered" });
    });
});

// 2. SIGNIN
app.post('/api/signin', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

// 3. GET ALL USERS (Admin)
app.get('/api/users', (req, res) => {
    db.query("SELECT id, fname, lname, username, role FROM users", (err, results) => {
        res.json(results);
    });
});

// 4. MARKS (DBMS, Python, FullStack)
app.get('/api/marks', (req, res) => {
    db.query("SELECT * FROM marks", (err, results) => {
        res.json(results);
    });
});

app.post('/api/marks', (req, res) => {
    const { name, dbms, python, fullstack, total, avg, grade } = req.body;
    const sql = "INSERT INTO marks (name, dbms, python, fullstack, total, avg, grade) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, dbms, python, fullstack, total, avg, grade], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId });
    });
});
// Admin: Delete a user
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User deleted successfully" });
    });
});

// Faculty: Delete Student Marks
// Route to delete marks
app.delete('/api/marks/:id', (req, res) => {
    const markId = req.params.id;
    const sql = "DELETE FROM marks WHERE id = ?";
    
    db.query(sql, [markId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database failure" });
        }
        res.status(200).json({ message: "Deleted successfully" });
    });
});
// Start Server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
# 🎓 Student Performance Analysis System (SPAS)

A modern, full-stack academic portal designed to track, analyze, and manage student performance. The system features a professional "Academic Blue" and "Pastel" aesthetic, providing a high-end dashboard experience for Students, Faculty, and Administrators.

![Project Status](https://img.shields.io/badge/Status-Complete-success)
![Tech Stack](https://img.shields.io/badge/Stack-Node.js%20|%20MySQL%20|%20Vanilla%20JS-blue)

## 🌟 Key Features

### 🏠 Landing Page
- **Modern Hero Section:** A centralized greeting with a high-resolution campus background (low opacity for readability).
- **Interactive Feature Cards:** Eye-catchy pastel cards highlighting "View Marks," "CGPA Tracking," and "Average Analysis."
- **Professional Navigation:** Centered system title with top-right Sign In/Sign Up actions.

### 🔐 Multi-Role Authentication
- **Secure Sign-Up:** Fields for Name, Username, Password, and Role selection (Admin, Faculty, Student).
- **Validated Sign-In:** Credentials verified against a MySQL database.
- **Forgot Password:** Identity verification (Username + First Name) to reset credentials.
- **Persistent Sessions:** Remains logged in on refresh using `localStorage`.

### 📊 Role-Based Dashboards
- **👨‍🎓 Student Portal:** 
    - Subject-wise cards (DBMS, Python, Full Stack).
    - Automated calculation of **Total Marks**, **Average Percentage**, and **CGPA**.
    - **Class Rank:** Dynamic ranking calculated by comparing performance with all other students.
- **👨‍🏫 Faculty Portal:** 
    - Full Grading Suite: Add and Delete student academic records.
    - Automated Grade generation (A+, A, B, C, etc.).
- **🔑 Admin Portal:** 
    - System User Management: View all registered accounts.
    - Account Control: Permanently delete/remove users.
    - Profile Details: Deep-dive view of user account information.

## 🛠️ Technology Stack
- **Frontend:** HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL.
- **Icons:** FontAwesome 6.0.

---

## 🚀 Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MySQL Server](https://www.mysql.com/downloads/) (Workbench or XAMPP) installed and running.

### 2. Database Configuration
Open MySQL Workbench and run the following script to set up the database and tables:

```sql
CREATE DATABASE student_analysis;
USE student_analysis;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50),
    lname VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role ENUM('Admin', 'Faculty', 'Student')
);

-- Marks Table
CREATE TABLE marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    dbms INT,
    python INT,
    fullstack INT,
    total INT,
    avg DECIMAL(5,2),
    grade VARCHAR(5)
);
```

### 3. Project Setup
Clone or download the project folder. Inside the folder, install the necessary dependencies:

```bash
npm install express mysql2 cors body-parser
```

### 4. Connect to MySQL
Open `server.js` and update your MySQL credentials:
```javascript
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',      // Your MySQL username
    password: 'your_password', // Your MySQL password
    database: 'student_analysis'
});
```

---

## 📂 Folder Structure
```text
/student-performance-analysis
│
├── public/                 # Frontend Files
│   ├── index.html          # Main structure
│   ├── style.css           # Pastel & Dashboard styling
│   ├── script.js           # Frontend logic & API calls
│   └── background.jpg      # Campus background image
│
├── server.js               # Node.js Express Backend & SQL Routes
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

---

## 🏃 How to Run
1. Start the MySQL service.
2. Open your terminal in the project directory.
3. Run the command:
   ```bash
   node server.js
   ```
4. Open your browser and navigate to:
   `http://localhost:3000`

---

## 🎨 UI/UX Previews
- **Sidebar:** Pins the Logout button to the very bottom for a desktop-app feel.
- **Hero Banner:** Displays a personalized "Welcome back" message with the current date.
- **Tables:** Styled with rounded corners and separate rows for a modern, clean look.

## 📝 License
This project is for educational purposes. You are free to modify and use it for academic submissions.

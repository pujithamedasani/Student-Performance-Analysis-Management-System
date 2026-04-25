const API_URL = "http://localhost:3000/api";
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) routeDashboard();
    else showSection('home');
});

function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('dashboard-container').classList.add('hidden');
    document.getElementById('public-nav').classList.remove('hidden');
    document.getElementById('public-content').classList.remove('hidden');
    document.getElementById(id).classList.remove('hidden');
}

// NAVIGATION & DASHBOARD ROUTING
function routeDashboard() {
    document.getElementById('public-nav').classList.add('hidden');
    document.getElementById('public-content').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');

    document.getElementById('display-name').innerText = currentUser.fname;
    document.getElementById('display-role').innerText = currentUser.role;
    document.getElementById('banner-welcome').innerText = `Welcome back, ${currentUser.fname}!`;
    document.getElementById('today-date').innerText = new Date().toDateString();

    document.getElementById('admin-link').classList.toggle('hidden', currentUser.role !== 'Admin');
    document.getElementById('faculty-link').classList.toggle('hidden', currentUser.role !== 'Faculty');

    // Sidebar active state management
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));

    if (currentUser.role === 'Student') {
        renderStudentDash();
    } else if (currentUser.role === 'Faculty') {
        renderFacultyTable();
    } else {
        renderAdminTable(); // Fix: Ensures admin page opens on login
    }
}

// --- ADMIN MANAGEMENT (FIXED ALIGNMENT & NAVIGATION) ---
async function renderAdminTable() {
    // Update Sidebar Active State
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    const adminBtn = document.getElementById('admin-link');
    if(adminBtn) adminBtn.classList.add('active');

    const view = document.getElementById('dynamic-view');
    view.innerHTML = '<div class="stat-card">Loading Users...</div>';

    try {
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();

        view.innerHTML = `
            <div class="table-responsive" style="margin-top: 2rem;">
                <h3 style="margin-bottom: 20px; color: #1b2559;">System User Management</h3>
                <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
                    <thead>
                        <tr style="text-align: left; color: #a3aed0;">
                            <th style="padding: 10px 20px; width: 30%;">Full Name</th>
                            <th style="padding: 10px 20px; width: 30%;">Username</th>
                            <th style="padding: 10px 20px; width: 20%;">Role</th>
                            <th style="padding: 10px 20px; width: 20%; text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(u => `
                            <tr style="cursor: pointer;" onclick="viewUserDetails(${u.id})">
                                <td style="padding: 15px 20px; background: white; border-radius: 15px 0 0 15px; font-weight: 700;">${u.fname} ${u.lname}</td>
                                <td style="padding: 15px 20px; background: white;">@${u.username}</td>
                                <td style="padding: 15px 20px; background: white;"><span class="badge">${u.role}</span></td>
                                <td style="padding: 15px 20px; background: white; border-radius: 0 15px 15px 0; text-align: right;" onclick="event.stopPropagation()">
                                    <button class="logout-btn" style="padding: 8px 15px; margin: 0; font-size: 0.8rem;" onclick="deleteUser(${u.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>`;
    } catch (err) { console.error(err); }
}

// --- PROFILE DETAIL VIEW ---
async function viewUserDetails(id) {
    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();
    const user = users.find(u => u.id === id);

    const view = document.getElementById('dynamic-view');
    view.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button class="btn btn-outline" onclick="renderAdminTable()"><i class="fas fa-arrow-left"></i> Back to List</button>
        </div>
        <div class="stat-card" style="max-width: 500px; margin: 0 auto; padding: 40px;">
            <img src="https://ui-avatars.com/api/?name=${user.fname}+${user.lname}&size=128&background=random" style="width: 100px; border-radius: 50%; margin-bottom: 20px;">
            <h2>${user.fname} ${user.lname}</h2>
            <p style="color: #a3aed0; margin-bottom: 20px;">${user.role}</p>
            <div style="text-align: left; background: #f4f7fe; padding: 20px; border-radius: 15px;">
                <p><strong>Username:</strong> @${user.username}</p>
                <p><strong>Status:</strong> Active Account</p>
                <p><strong>User ID:</strong> #00${user.id}</p>
            </div>
            <button class="logout-btn" style="width: 100%; margin-top: 20px;" onclick="deleteUser(${user.id})">Delete Account</button>
        </div>
    `;
}

// --- STUDENT VIEW (Rank, CGPA, Total) ---
async function renderStudentDash() {
    const view = document.getElementById('dynamic-view');
    view.innerHTML = '<p>Loading Performance Data...</p>';

    const res = await fetch(`${API_URL}/marks`);
    const all = await res.json();
    
    const sorted = [...all].sort((a, b) => b.avg - a.avg);
    const myData = all.find(m => m.name.toLowerCase() === currentUser.fname.toLowerCase());
    const myRank = sorted.findIndex(m => m.name.toLowerCase() === currentUser.fname.toLowerCase()) + 1;

    if (myData) {
        const cgpa = (myData.avg / 10).toFixed(2);
        view.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card mint"><h4>DBMS</h4><h2>${myData.dbms}</h2></div>
                <div class="stat-card purple"><h4>Python</h4><h2>${myData.python}</h2></div>
                <div class="stat-card pink"><h4>Full Stack</h4><h2>${myData.fullstack}</h2></div>
            </div>
            <div class="stats-grid" style="margin-top: 1rem;">
                <div class="stat-card"><h4>Total Marks</h4><h2>${myData.total}/300</h2></div>
                <div class="stat-card"><h4>Class Rank</h4><h2>#${myRank}</h2></div>
                <div class="stat-card"><h4>Current CGPA</h4><h2>${cgpa}</h2></div>
            </div>`;
    } else {
        view.innerHTML = `<div class="stat-card">No records found. Ask Faculty to upload marks for "${currentUser.fname}".</div>`;
    }
}

// --- FACULTY VIEW ---
async function renderFacultyTable() {
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    const facBtn = document.getElementById('faculty-link');
    if(facBtn) facBtn.classList.add('active');

    const view = document.getElementById('dynamic-view');
    const res = await fetch(`${API_URL}/marks`);
    const data = await res.json();

    view.innerHTML = `
        <div class="table-responsive" style="margin-top: 2rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom: 20px;">
                <h3>Student Marksheet</h3>
                <button class="btn btn-primary" onclick="openModal()">+ Add Marks</button>
            </div>
            <table style="width:100%; border-collapse: separate; border-spacing: 0 10px;">
                <thead><tr style="text-align: left; color: #a3aed0;"><th>Student</th><th>DBMS</th><th>Python</th><th>FS</th><th>Avg</th><th>Grade</th><th>Actions</th></tr></thead>
                <tbody>${data.map(m => `
                    <tr>
                        <td style="padding: 15px 20px; background: white; border-radius: 15px 0 0 15px; font-weight:700;">${m.name}</td>
                        <td style="padding: 15px 20px; background: white;">${m.dbms}</td>
                        <td style="padding: 15px 20px; background: white;">${m.python}</td>
                        <td style="padding: 15px 20px; background: white;">${m.fullstack}</td>
                        <td style="padding: 15px 20px; background: white;">${m.avg}%</td>
                        <td style="padding: 15px 20px; background: white;">${m.grade}</td>
                        <td style="padding: 15px 20px; background: white; border-radius: 0 15px 15px 0;">
                            <button class="logout-btn" style="padding: 5px 10px;" onclick="deleteMark(${m.id})">Delete</button>
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
}

// --- API ACTIONS ---
async function deleteUser(id) {
    if (confirm("Permanently delete this user?")) {
        await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        renderAdminTable();
    }
}

async function deleteMark(id) {
    if (confirm("Are you sure you want to delete this record?")) {
        try {
            // Ensure API_URL is "http://localhost:3000/api"
            const response = await fetch(`${API_URL}/marks/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("Record deleted!");
                renderFacultyTable(); // Refresh the table
            } else {
                alert("Server returned an error. Check console.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Failed to reach server. Is the backend running?");
        }
    }
}

// --- AUTHENTICATION ---
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = {
        fname: document.getElementById('reg-fname').value,
        lname: document.getElementById('reg-lname').value,
        username: document.getElementById('reg-username').value,
        password: document.getElementById('reg-password').value,
        role: document.getElementById('reg-role').value
    };
    await fetch(`${API_URL}/signup`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(userData)});
    alert("Success!"); showSection('signin');
});

document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/signin`, { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({username: document.getElementById('login-username').value, password: document.getElementById('login-password').value})
    });
    if(res.ok) {
        currentUser = await res.json();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        routeDashboard();
    } else alert("Invalid Login");
});

function logout() { localStorage.clear(); location.reload(); }
function openModal() { document.getElementById('mark-modal').classList.remove('hidden'); }
function closeModal() { document.getElementById('mark-modal').classList.add('hidden'); }

document.getElementById('mark-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dbms = parseInt(document.getElementById('m-dbms').value);
    const python = parseInt(document.getElementById('m-python').value);
    const fs = parseInt(document.getElementById('m-fs').value);
    const total = dbms + python + fs;
    const avg = (total/3).toFixed(2);
    const entry = {
        name: document.getElementById('stu-name').value,
        dbms, python, fullstack: fs, total, avg,
        grade: avg >= 90 ? 'A+' : avg >= 80 ? 'A' : avg >= 60 ? 'B' : 'C'
    };
    await fetch(`${API_URL}/marks`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(entry)});
    closeModal();
    renderFacultyTable();
});
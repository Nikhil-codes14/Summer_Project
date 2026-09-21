# SAMS (Smart Ambalika Management System) - Python, Flask & SQLite Edition

## Overview
This is the complete, standalone **Python (Flask)** backend with **SQLite database** and **HTML5, CSS3, Vanilla JavaScript** frontend for the Smart Ambalika Management System.

### Tech Stack:
- **Backend:** Python 3.10+ with Flask
- **Database:** SQLite (`sams.db` with automated migrations and seeding)
- **Frontend:** Semantic HTML5, Vanilla CSS3 (Ambalika Crimson Theme), Vanilla JavaScript (ES6)

---

## 📁 Directory Structure
```text
python_flask_sams/
├── app.py                 # Core Flask Application & REST API Endpoints
├── database.py            # SQLite Database Connection, Schemas & Initial Seed Data
├── requirements.txt       # Python Dependencies (Flask, Werkzeug)
├── sams.db                # SQLite Database file (Auto-generated on first run)
├── templates/
│   └── index.html         # Complete Single-Page HTML5 Web Application
└── static/
    ├── style.css          # Modern Tailwind-inspired Responsive CSS
    └── app.js             # Vanilla JS State Management, Views, & API Fetch Handlers
```

---

## 🚀 How to Run Locally

### 1. Install Requirements
```bash
pip install -r requirements.txt
```

### 2. Initialize Database (Optional, app.py runs this automatically)
```bash
python database.py
```

### 3. Start the Flask Server
```bash
python app.py
```

Open your browser and navigate to:
👉 **`http://127.0.0.1:5000`**

---

## 🔑 Default Login Credentials

### Executive & Admin Portals:
- **College Dean:** `dean@ambalika.ac.in` / `dean123`
- **Additional Director:** `director@ambalika.ac.in` / `director123`
- **Maintenance HOD / Admin:** `admin@ambalika.ac.in` / `admin123`

### Student Portal:
- **Student Demo:** `rahul.sharma@ambalika.ac.in` / `password123`
- *(Or register any new student directly through the "New Registration" tab)*

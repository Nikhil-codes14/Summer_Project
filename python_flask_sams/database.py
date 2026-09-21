import sqlite3
import os
from datetime import datetime

DB_NAME = "sams.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Students Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            student_id TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            course TEXT NOT NULL,
            department TEXT NOT NULL,
            year TEXT NOT NULL,
            semester TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')

    # 2. Admins Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admins (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            department TEXT NOT NULL
        )
    ''')

    # 3. Complaints Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS complaints (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            student_name TEXT NOT NULL,
            student_roll TEXT NOT NULL,
            department TEXT NOT NULL,
            course TEXT NOT NULL,
            semester TEXT NOT NULL,
            category TEXT NOT NULL,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            specific_location TEXT,
            description TEXT NOT NULL,
            priority TEXT NOT NULL,
            image_url TEXT,
            status TEXT NOT NULL DEFAULT 'Submitted',
            assigned_department TEXT DEFAULT 'Administration',
            assigned_resolver TEXT,
            admin_response TEXT,
            executive_note TEXT,
            executive_signoff TEXT,
            report_count INTEGER DEFAULT 1,
            is_widespread INTEGER DEFAULT 0,
            date_time TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (student_id) REFERENCES students (id)
        )
    ''')

    # 4. Timeline Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS complaint_timeline (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            complaint_id TEXT NOT NULL,
            status TEXT NOT NULL,
            date_str TEXT NOT NULL,
            note TEXT NOT NULL,
            FOREIGN KEY (complaint_id) REFERENCES complaints (id)
        )
    ''')

    # 5. Resolvers / Technicians Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS resolvers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            phone TEXT NOT NULL,
            department TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Available'
        )
    ''')

    # 6. Feedback Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id TEXT PRIMARY KEY,
            complaint_id TEXT NOT NULL,
            student_id TEXT NOT NULL,
            student_name TEXT NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (complaint_id) REFERENCES complaints (id)
        )
    ''')

    # 7. Notifications Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )
    ''')

    # Seed Default Admins (Super Admin, HOD, Dean, Additional Director)
    default_admins = [
        ("admin_1", "Dr. Alok Kumar (Super Admin)", "admin@ambalika.ac.in", "admin123", "Super Admin", "Administration"),
        ("admin_2", "Er. R. K. Singh (Estate & Maintenance HOD)", "maintenance@ambalika.ac.in", "admin123", "HOD", "Maintenance Department"),
        ("admin_dean", "Prof. (Dr.) V. K. Sharma (College Dean)", "dean@ambalika.ac.in", "dean123", "Dean", "Academic & Executive Council"),
        ("admin_director", "Brig. (Retd.) S. P. Mishra (Additional Director)", "director@ambalika.ac.in", "director123", "Additional Director", "Directorate General")
    ]
    for admin in default_admins:
        cursor.execute("INSERT OR IGNORE INTO admins (id, name, email, password, role, department) VALUES (?, ?, ?, ?, ?, ?)", admin)

    # Seed Default Technicians / Problem Resolvers
    default_resolvers = [
        ("res_1", "Ramesh Kumar", "Plumber & Pipe Specialist", "+91 98765 43210", "Civil/Maintenance", "Available"),
        ("res_2", "Suresh Verma", "Senior Electrician & Wiring Expert", "+91 98765 43211", "Electrical Department", "Available"),
        ("res_3", "Vikram Singh", "Carpenter & Furniture Maker", "+91 98765 43212", "Maintenance Department", "Available"),
        ("res_4", "Amit Patel", "IT & Wi-Fi Network Engineer", "+91 98765 43213", "IT Department", "Available"),
        ("res_5", "Dinesh Kumar", "AC & Fan Technician", "+91 98765 43214", "Electrical Department", "Available"),
        ("res_6", "Rohan Sharma", "Smart Board & Projector Technician", "+91 98765 43215", "IT Department", "Available"),
        ("res_7", "Manoj Das", "Sanitation & Cleanliness Supervisor", "+91 98765 43216", "Cleaning Department", "Available"),
        ("res_8", "Santosh Kumar", "Mess & Hostel Warden", "+91 98765 43217", "Mess & Hostel Committee", "Available")
    ]
    for resolver in default_resolvers:
        cursor.execute("INSERT OR IGNORE INTO resolvers (id, name, role, phone, department, status) VALUES (?, ?, ?, ?, ?, ?)", resolver)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("SAMS SQLite Database Initialized Successfully!")

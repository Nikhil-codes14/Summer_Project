import os
import time
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify, render_template, send_from_directory
from database import get_db_connection, init_db

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = 'sams-ambalika-secret-key-2026'

# Initialize database on startup
init_db()

@app.route('/')
def home():
    return render_template('index.html')

# Health Check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "backend": "Python/Flask", "database": "SQLite", "system": "SAMS v2.0"})

# 1. Student Registration
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    full_name = data.get('fullName')
    student_id = data.get('studentId')
    email = data.get('email')
    password = data.get('password')
    course = data.get('course')
    department = data.get('department')
    year = data.get('year')
    semester = data.get('semester')

    if not all([full_name, student_id, email, password, course, department, year, semester]):
        return jsonify({"error": "All registration fields are required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check for duplicate
    cursor.execute("SELECT * FROM students WHERE student_id = ? OR email = ?", (student_id, email))
    if cursor.fetchone():
        conn.close()
        return jsonify({"error": "Student ID or Email is already registered."}), 400

    new_id = f"stud_{int(time.time()*1000)}"
    created_at = datetime.now().isoformat()

    cursor.execute(
        "INSERT INTO students (id, full_name, student_id, email, password, course, department, year, semester, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (new_id, full_name, student_id, email, password, course, department, year, semester, created_at)
    )
    conn.commit()
    conn.close()

    user_info = {
        "id": new_id,
        "fullName": full_name,
        "studentId": student_id,
        "email": email,
        "course": course,
        "department": department,
        "year": year,
        "semester": semester
    }
    return jsonify({"success": True, "user": user_info, "role": "STUDENT"})

# 2. Student Login
@app.route('/api/auth/student-login', methods=['POST'])
def student_login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE email = ? AND password = ?", (email, password))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "Invalid student email or password."}), 401

    user_info = {
        "id": row["id"],
        "fullName": row["full_name"],
        "studentId": row["student_id"],
        "email": row["email"],
        "course": row["course"],
        "department": row["department"],
        "year": row["year"],
        "semester": row["semester"]
    }
    return jsonify({"success": True, "user": user_info, "role": "STUDENT"})

# 3. Admin Login (Dean, Director, HOD, Super Admin)
@app.route('/api/auth/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM admins WHERE email = ? AND password = ?", (email, password))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "Invalid admin credentials."}), 401

    user_info = {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "role": row["role"],
        "department": row["department"]
    }
    return jsonify({"success": True, "user": user_info, "role": "ADMIN"})

# 4. Complaints List
@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    student_id = request.args.get('studentId')
    conn = get_db_connection()
    cursor = conn.cursor()

    if student_id:
        cursor.execute("SELECT * FROM complaints WHERE student_id = ? ORDER BY date_time DESC", (student_id,))
    else:
        cursor.execute("SELECT * FROM complaints ORDER BY date_time DESC")

    rows = cursor.fetchall()
    complaints = []
    for r in rows:
        c_dict = dict(r)
        # Fetch timeline
        cursor.execute("SELECT status, date_str as date, note FROM complaint_timeline WHERE complaint_id = ? ORDER BY id ASC", (c_dict["id"],))
        timeline_rows = cursor.fetchall()
        c_dict["timeline"] = [dict(t) for t in timeline_rows]
        complaints.append(c_dict)

    conn.close()
    return jsonify(complaints)

# 5. Submit Complaint
@app.route('/api/complaints', methods=['POST'])
def submit_complaint():
    data = request.get_json() or {}
    student_id = data.get('studentId')
    student_name = data.get('studentName', 'Student')
    student_roll = data.get('studentRoll', 'SAMS2026')
    department = data.get('department', 'Computer Applications')
    course = data.get('course', 'BCA')
    semester = data.get('semester', '4th Semester')
    category = data.get('category')
    title = data.get('title')
    location = data.get('location')
    specific_location = data.get('specificLocation', '')
    description = data.get('description')
    priority = data.get('priority', 'Medium')
    image_url = data.get('image', '')

    if not all([student_id, category, location, description]):
        return jsonify({"error": "Missing required complaint fields."}), 400

    complaint_title = title or f"{category} at {specific_location or location}"
    now_str = datetime.now().strftime("%d/%m/%Y, %I:%M:%S %p")
    iso_now = datetime.now().isoformat()

    conn = get_db_connection()
    cursor = conn.cursor()

    # Generate sequential ID
    cursor.execute("SELECT COUNT(*) as cnt FROM complaints")
    count = cursor.fetchone()["cnt"] + 1
    complaint_id = f"SAMS-2026-{1000 + count}"

    # Check for similar active complaints (Widespread detection)
    cursor.execute("""
        SELECT COUNT(*) as count FROM complaints 
        WHERE status NOT IN ('Resolved', 'Rejected') 
        AND category = ? AND location = ? AND student_id != ?
    """, (category, location, student_id))
    similar_count = cursor.fetchone()["count"]

    report_count = 1
    is_widespread = 0
    final_priority = priority

    if similar_count > 0:
        report_count = similar_count + 1
        is_widespread = 1
        if final_priority != "Emergency":
            final_priority = "Emergency" if report_count >= 3 else "High"

    cursor.execute("""
        INSERT INTO complaints (
            id, student_id, student_name, student_roll, department, course, semester,
            category, title, location, specific_location, description, priority, image_url,
            status, assigned_department, date_time, updated_at, report_count, is_widespread
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        complaint_id, student_id, student_name, student_roll, department, course, semester,
        category, complaint_title, location, specific_location, description, final_priority, image_url,
        "Submitted", "Administration", iso_now, iso_now, report_count, is_widespread
    ))

    # Add initial timeline
    initial_note = f"⚠️ Auto-escalated: {report_count} students reported this problem. Priority set to {final_priority}." if is_widespread else "Complaint registered by student."
    cursor.execute("INSERT INTO complaint_timeline (complaint_id, status, date_str, note) VALUES (?, ?, ?, ?)",
                   (complaint_id, "Submitted", now_str, initial_note))

    # Add student notification
    cursor.execute("INSERT INTO notifications (id, user_id, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                   (f"notif_{int(time.time()*1000)}", student_id, "Complaint Registered Successfully",
                    f"Your complaint ({complaint_id}) was received and is under review.", 0, iso_now))

    conn.commit()
    conn.close()

    return jsonify({"success": True, "complaint": {"id": complaint_id, "title": complaint_title, "status": "Submitted"}})

# 6. Update Complaint & Assign Resolver (Admin Action)
@app.route('/api/complaints/<id>', methods=['PUT'])
def update_complaint(id):
    data = request.get_json() or {}
    status = data.get('status')
    assigned_department = data.get('assignedDepartment')
    assigned_resolver = data.get('assignedResolver')
    admin_response = data.get('adminResponse')
    executive_note = data.get('executiveNote')
    executive_signoff = data.get('executiveSignoff', 'College Dean / Additional Director')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM complaints WHERE id = ?", (id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({"error": "Complaint not found."}), 404

    now_str = datetime.now().strftime("%d/%m/%Y, %I:%M:%S %p")
    iso_now = datetime.now().isoformat()

    updates = []
    params = []

    if status:
        updates.append("status = ?")
        params.append(status)
        note = f"Assigned to {assigned_department or row['assigned_department']}" if status == 'Assigned' else f"Status updated to {status}"
        cursor.execute("INSERT INTO complaint_timeline (complaint_id, status, date_str, note) VALUES (?, ?, ?, ?)", (id, status, now_str, note))

    if assigned_department:
        updates.append("assigned_department = ?")
        params.append(assigned_department)

    if assigned_resolver is not None:
        updates.append("assigned_resolver = ?")
        params.append(assigned_resolver)
        cursor.execute("INSERT INTO complaint_timeline (complaint_id, status, date_str, note) VALUES (?, ?, ?, ?)",
                       (id, status or row['status'], now_str, f"Assigned technician: {assigned_resolver or 'None'}"))

    if admin_response is not None:
        updates.append("admin_response = ?")
        params.append(admin_response)

    if executive_note is not None:
        updates.append("executive_note = ?")
        params.append(executive_note)
        updates.append("executive_signoff = ?")
        params.append(executive_signoff)
        cursor.execute("INSERT INTO complaint_timeline (complaint_id, status, date_str, note) VALUES (?, ?, ?, ?)",
                       (id, status or row['status'], now_str, f"🏛️ Executive Acknowledgment by {executive_signoff}: \"{executive_note}\""))

    updates.append("updated_at = ?")
    params.append(iso_now)
    params.append(id)

    query = f"UPDATE complaints SET {', '.join(updates)} WHERE id = ?"
    cursor.execute(query, params)

    # Add notification for student
    cursor.execute("INSERT INTO notifications (id, user_id, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                   (f"notif_{int(time.time()*1000)}", row['student_id'], f"Complaint Update: {id}",
                    f"Status changed to {status or row['status']}.", 0, iso_now))

    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Complaint updated successfully."})

# 7. Problem Resolvers / Technicians Directory
@app.route('/api/resolvers', methods=['GET', 'POST'])
def handle_resolvers():
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == 'POST':
        data = request.get_json() or {}
        name = data.get('name')
        role = data.get('role')
        phone = data.get('phone')
        department = data.get('department')
        status = data.get('status', 'Available')

        if not all([name, role, phone, department]):
            conn.close()
            return jsonify({"error": "Missing required technician fields."}), 400

        res_id = f"res_{int(time.time()*1000)}"
        cursor.execute("INSERT INTO resolvers (id, name, role, phone, department, status) VALUES (?, ?, ?, ?, ?, ?)",
                       (res_id, name, role, phone, department, status))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "resolver": {"id": res_id, "name": name, "role": role, "phone": phone, "department": department, "status": status}})

    cursor.execute("SELECT * FROM resolvers")
    rows = cursor.fetchall()
    resolvers = [dict(r) for r in rows]
    conn.close()
    return jsonify(resolvers)

@app.route('/api/resolvers/<id>', methods=['DELETE'])
def delete_resolver(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM resolvers WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Technician removed."})

# 8. Feedback API
@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json() or {}
    complaint_id = data.get('complaintId')
    student_id = data.get('studentId')
    student_name = data.get('studentName', 'Student')
    rating = data.get('rating', 5)
    comment = data.get('comment', '')

    conn = get_db_connection()
    cursor = conn.cursor()
    fb_id = f"fb_{int(time.time()*1000)}"
    cursor.execute("INSERT INTO feedback (id, complaint_id, student_id, student_name, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                   (fb_id, complaint_id, student_id, student_name, int(rating), comment, datetime.now().isoformat()))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "feedbackId": fb_id})

# 9. Notifications API
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    user_id = request.args.get('userId')
    conn = get_db_connection()
    cursor = conn.cursor()
    if user_id:
        cursor.execute("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    else:
        cursor.execute("SELECT * FROM notifications ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 SAMS Python/Flask Server running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)

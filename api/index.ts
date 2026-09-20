import express from "express";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());

// Database file path (using /tmp on Vercel serverless)
const DATA_DIR = path.join("/tmp", "sams_data");
const DB_FILE = path.join(DATA_DIR, "sams_db.json");

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {}

const initialData = {
  students: [
    {
      id: "stud_1",
      fullName: "Rahul Sharma",
      studentId: "SAMS2026001",
      email: "rahul.sharma@ambalika.ac.in",
      password: "password123",
      course: "BCA",
      department: "Computer Applications",
      year: "2nd Year",
      semester: "4th Semester",
      createdAt: new Date().toISOString()
    }
  ],
  admins: [
    {
      id: "admin_1",
      name: "Dr. Alok Kumar (Super Admin / Dean)",
      email: "admin@ambalika.ac.in",
      password: "admin123",
      role: "Super Admin",
      department: "Administration"
    },
    {
      id: "admin_2",
      name: "Er. R. K. Singh (Estate & Maintenance HOD)",
      email: "maintenance@ambalika.ac.in",
      password: "admin123",
      role: "HOD",
      department: "Maintenance Department"
    },
    {
      id: "admin_dean",
      name: "Prof. (Dr.) V. K. Sharma (College Dean)",
      email: "dean@ambalika.ac.in",
      password: "dean123",
      role: "Dean",
      department: "Academic & Executive Council"
    },
    {
      id: "admin_director",
      name: "Brig. (Retd.) S. P. Mishra (Additional Director)",
      email: "director@ambalika.ac.in",
      password: "director123",
      role: "Additional Director",
      department: "Directorate General"
    }
  ],
  departments: [
    "Electrical Department",
    "Maintenance Department",
    "Cleaning Department",
    "IT Department",
    "Civil/Maintenance",
    "Security Department",
    "Administration"
  ],
  complaints: [],
  resolvers: [],
  notifications: [],
  feedback: []
};

function getDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return initialData;
  }
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {}
}

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: "Vercel Serverless" });
});

app.post("/api/auth/register", (req, res) => {
  const db = getDB();
  const { fullName, studentId, email, password, course, department, year, semester } = req.body;
  if (!fullName || !studentId || !email || !password || !course || !department || !year || !semester) {
    return res.status(400).json({ error: "All registration fields are required." });
  }
  const existing = db.students.find((s: any) => s.studentId === studentId || s.email === email);
  if (existing) {
    return res.status(400).json({ error: "Student ID or Email is already registered." });
  }
  const newStudent = {
    id: "stud_" + Date.now(),
    fullName,
    studentId,
    email,
    password,
    course,
    department,
    year,
    semester,
    createdAt: new Date().toISOString()
  };
  db.students.push(newStudent);
  saveDB(db);
  const { password: _, ...studentWithoutPassword } = newStudent;
  res.json({ success: true, user: studentWithoutPassword, role: "STUDENT" });
});

app.post("/api/auth/student-login", (req, res) => {
  const db = getDB();
  const { email, password } = req.body;
  const student = db.students.find((s: any) => s.email === email && s.password === password);
  if (!student) {
    return res.status(401).json({ error: "Invalid email or password for student account." });
  }
  const { password: _, ...studentWithoutPassword } = student;
  res.json({ success: true, user: studentWithoutPassword, role: "STUDENT" });
});

app.post("/api/auth/admin-login", (req, res) => {
  const db = getDB();
  const { email, password } = req.body;
  const admin = db.admins.find((a: any) => a.email === email && a.password === password);
  if (!admin) {
    return res.status(401).json({ error: "Invalid admin credentials." });
  }
  const { password: _, ...adminWithoutPassword } = admin;
  res.json({ success: true, user: adminWithoutPassword, role: "ADMIN" });
});

app.get("/api/complaints", (req, res) => {
  const db = getDB();
  res.json(db.complaints);
});

app.post("/api/complaints", (req, res) => {
  const db = getDB();
  const { studentId, studentName, studentRoll, category, title, location, specificLocation, description, priority, image } = req.body;
  if (!studentId || !category || !location || !description || !priority) {
    return res.status(400).json({ error: "Missing required complaint fields." });
  }
  const complaintTitle = title || `${category} at ${specificLocation || location}`;
  const newComplaint = {
    id: "SAMS-2026-" + Math.floor(1000 + Math.random() * 9000),
    studentId,
    studentName: studentName || "Student",
    studentRoll: studentRoll || "SAMS2026",
    department: "Computer Applications",
    course: "BCA",
    semester: "4th Semester",
    category,
    title: complaintTitle,
    location,
    specificLocation: specificLocation || "",
    description,
    priority,
    image: image || "",
    dateTime: new Date().toISOString(),
    status: "Submitted",
    assignedDepartment: "Maintenance Department",
    adminResponse: "",
    updatedAt: new Date().toISOString(),
    timeline: [
      { status: "Submitted", date: new Date().toLocaleString(), note: "Complaint registered successfully." }
    ]
  };
  db.complaints.unshift(newComplaint);
  saveDB(db);
  res.json({ success: true, complaint: newComplaint });
});

app.get("/api/resolvers", (req, res) => {
  const db = getDB();
  res.json(db.resolvers || []);
});

app.get("/api/notifications", (req, res) => {
  const db = getDB();
  res.json(db.notifications || []);
});

export default app;

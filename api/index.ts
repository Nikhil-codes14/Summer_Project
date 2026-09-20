import express, { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json({ limit: "15mb" }));

// In-memory + /tmp file persistent database for Vercel Serverless
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
    },
    {
      id: "stud_2",
      fullName: "Priya Verma",
      studentId: "SAMS2026002",
      email: "priya.verma@ambalika.ac.in",
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
  complaints: [
    {
      id: "SAMS-2026-0001",
      studentId: "stud_1",
      studentName: "Rahul Sharma",
      studentRoll: "SAMS2026001",
      department: "Computer Applications",
      course: "BCA",
      semester: "4th Semester",
      category: "Fan / Light Failure",
      title: "Ceiling Fan Regulator Malfunction",
      location: "BCA / IT Building",
      specificLocation: "Room 204 (2nd Floor)",
      description: "The ceiling fan near the 3rd row makes excessive noise and the speed regulator is jammed.",
      priority: "High",
      image: "",
      dateTime: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "In Progress",
      assignedDepartment: "Electrical Department",
      assignedResolver: "Suresh Verma (Electrician)",
      adminResponse: "Electrician assigned with ticket #ELEC-402. Work in progress.",
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      reportCount: 1,
      isWidespread: false,
      timeline: [
        { status: "Submitted", date: new Date(Date.now() - 86400000 * 2).toLocaleString(), note: "Complaint registered by student." },
        { status: "Under Review", date: new Date(Date.now() - 86400000 * 1.8).toLocaleString(), note: "Reviewed by Maintenance Admin." },
        { status: "Assigned", date: new Date(Date.now() - 86400000 * 1.5).toLocaleString(), note: "Assigned to Electrical Department (Suresh Verma)." },
        { status: "In Progress", date: new Date(Date.now() - 86400000 * 1).toLocaleString(), note: "Technician inspecting fan wiring." }
      ]
    },
    {
      id: "SAMS-2026-0002",
      studentId: "stud_1",
      studentName: "Rahul Sharma",
      studentRoll: "SAMS2026001",
      department: "Computer Applications",
      course: "BCA",
      semester: "4th Semester",
      category: "Furniture Problem",
      title: "Broken Student Desk Leg",
      location: "B.Tech Building (All Sections)",
      specificLocation: "Room 105",
      description: "One of the wooden student desks has a broken leg and is unstable.",
      priority: "Medium",
      image: "",
      dateTime: new Date(Date.now() - 86400000 * 1).toISOString(),
      status: "Submitted",
      assignedDepartment: "Administration",
      adminResponse: "",
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      timeline: [
        { status: "Submitted", date: new Date(Date.now() - 86400000 * 1).toLocaleString(), note: "Complaint registered by student." }
      ]
    },
    {
      id: "SAMS-2026-0003",
      studentId: "stud_2",
      studentName: "Priya Verma",
      studentRoll: "SAMS2026002",
      department: "Computer Applications",
      course: "BCA",
      semester: "4th Semester",
      category: "Water Leakage",
      title: "Leaking Pipe in Mess Area",
      location: "Mess Area (Hostellers)",
      specificLocation: "Dining Hall Water Cooler",
      description: "Water tap is continuously leaking near the mess dining area, causing slippery floor.",
      priority: "High",
      image: "",
      dateTime: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: "Resolved",
      assignedDepartment: "Maintenance Department",
      assignedResolver: "Ramesh Kumar (Plumber)",
      adminResponse: "Plumber replaced the faulty valve and tested the water line. Fully resolved.",
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      timeline: [
        { status: "Submitted", date: new Date(Date.now() - 86400000 * 3).toLocaleString(), note: "Complaint registered." },
        { status: "Under Review", date: new Date(Date.now() - 86400000 * 2.8).toLocaleString(), note: "Verified by HOD." },
        { status: "Assigned", date: new Date(Date.now() - 86400000 * 2.5).toLocaleString(), note: "Assigned to Maintenance Department." },
        { status: "In Progress", date: new Date(Date.now() - 86400000 * 2.2).toLocaleString(), note: "Plumber working on site." },
        { status: "Resolved", date: new Date(Date.now() - 86400000 * 2).toLocaleString(), note: "Pipe repaired successfully." }
      ]
    }
  ],
  resolvers: [
    {
      id: "res_1",
      name: "Ramesh Kumar",
      role: "Plumber & Pipe Specialist",
      phone: "+91 98765 43210",
      department: "Civil/Maintenance",
      status: "Available"
    },
    {
      id: "res_2",
      name: "Suresh Verma",
      role: "Senior Electrician & Wiring Expert",
      phone: "+91 98765 43211",
      department: "Electrical Department",
      status: "Available"
    },
    {
      id: "res_3",
      name: "Vikram Singh",
      role: "Carpenter & Furniture Maker",
      phone: "+91 98765 43212",
      department: "Maintenance Department",
      status: "Available"
    },
    {
      id: "res_4",
      name: "Amit Patel",
      role: "IT & Wi-Fi Network Engineer",
      phone: "+91 98765 43213",
      department: "IT Department",
      status: "Available"
    },
    {
      id: "res_5",
      name: "Dinesh Kumar",
      role: "AC & Fan Technician",
      phone: "+91 98765 43214",
      department: "Electrical Department",
      status: "Available"
    },
    {
      id: "res_6",
      name: "Rohan Sharma",
      role: "Smart Board & Projector Technician",
      phone: "+91 98765 43215",
      department: "IT Department",
      status: "Available"
    },
    {
      id: "res_7",
      name: "Manoj Das",
      role: "Sanitation & Cleanliness Supervisor",
      phone: "+91 98765 43216",
      department: "Cleaning Department",
      status: "Available"
    },
    {
      id: "res_8",
      name: "Santosh Kumar",
      role: "Mess & Hostel Warden / Manager",
      phone: "+91 98765 43217",
      department: "Mess & Hostel Committee",
      status: "Available"
    }
  ],
  notifications: [
    {
      id: "notif_1",
      userId: "stud_1",
      title: "Complaint Status Update",
      message: "Your complaint SAMS-2026-0001 status changed to In Progress.",
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "notif_2",
      userId: "stud_2",
      title: "Complaint Resolved",
      message: "Your complaint SAMS-2026-0003 has been marked as Resolved.",
      read: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],
  feedback: [
    {
      id: "fb_1",
      complaintId: "SAMS-2026-0003",
      studentId: "stud_2",
      studentName: "Priya Verma",
      rating: 5,
      comment: "Quick maintenance response! Thank you SAMS team.",
      createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString()
    }
  ]
};

// In-memory fallback
let memoryDB = JSON.parse(JSON.stringify(initialData));

function getDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return memoryDB;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    
    // Ensure essential collections exist
    if (!parsed.resolvers) parsed.resolvers = initialData.resolvers;
    if (!parsed.admins) parsed.admins = initialData.admins;
    if (!parsed.students) parsed.students = initialData.students;
    if (!parsed.complaints) parsed.complaints = initialData.complaints;
    if (!parsed.notifications) parsed.notifications = initialData.notifications;
    if (!parsed.feedback) parsed.feedback = initialData.feedback;

    memoryDB = parsed;
    return parsed;
  } catch (err) {
    return memoryDB;
  }
}

function saveDB(data: any) {
  memoryDB = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {}
}

const router = Router();

// Health Check
router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", environment: "Vercel Serverless / Production Ready", timestamp: new Date().toISOString() });
});

// Seed / Reset
router.post("/seed", (req: Request, res: Response) => {
  saveDB(JSON.parse(JSON.stringify(initialData)));
  res.json({ success: true, message: "Database re-seeded successfully." });
});

// 1. Student Registration
router.post("/auth/register", (req: Request, res: Response) => {
  const db = getDB();
  const { fullName, studentId, email, password, course, department, year, semester } = req.body;

  if (!fullName || !studentId || !email || !password || !course || !department || !year || !semester) {
    return res.status(400).json({ error: "All registration fields are required." });
  }

  const existing = (db.students || []).find((s: any) => s.studentId === studentId || s.email === email);
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

  if (!db.students) db.students = [];
  db.students.push(newStudent);
  saveDB(db);

  const { password: _, ...studentWithoutPassword } = newStudent;
  res.json({ success: true, user: studentWithoutPassword, role: "STUDENT" });
});

// 2. Student Login
router.post("/auth/student-login", (req: Request, res: Response) => {
  const db = getDB();
  const { email, password } = req.body;

  const student = (db.students || []).find((s: any) => s.email === email && s.password === password);
  if (!student) {
    return res.status(401).json({ error: "Invalid email or password for student account." });
  }

  const { password: _, ...studentWithoutPassword } = student;
  res.json({ success: true, user: studentWithoutPassword, role: "STUDENT" });
});

// 3. Admin Login
router.post("/auth/admin-login", (req: Request, res: Response) => {
  const db = getDB();
  const { email, password } = req.body;

  const admin = (db.admins || []).find((a: any) => a.email === email && a.password === password);
  if (!admin) {
    return res.status(401).json({ error: "Invalid admin credentials or unauthorized role." });
  }

  const { password: _, ...adminWithoutPassword } = admin;
  res.json({ success: true, user: adminWithoutPassword, role: "ADMIN" });
});

// Departments
router.get("/departments", (req: Request, res: Response) => {
  const db = getDB();
  res.json(db.departments || initialData.departments);
});

// Complaints Retrieval
router.get("/complaints", (req: Request, res: Response) => {
  const db = getDB();
  const { studentId } = req.query;

  if (studentId) {
    const studentComplaints = (db.complaints || []).filter((c: any) => c.studentId === studentId);
    return res.json(studentComplaints);
  }

  res.json(db.complaints || []);
});

// Complaint Submission
router.post("/complaints", (req: Request, res: Response) => {
  const db = getDB();
  const { studentId, studentName, studentRoll, department, course, semester, category, title, location, specificLocation, description, priority, image } = req.body;

  if (!studentId || !category || !location || !description || !priority) {
    return res.status(400).json({ error: "Missing required complaint fields." });
  }

  const complaintTitle = title || `${category} at ${specificLocation || location}`;
  const nowStr = new Date().toLocaleString();

  const existingSimilarComplaints = (db.complaints || []).filter((c: any) => 
    c.status !== "Resolved" && 
    c.status !== "Rejected" && 
    c.category === category && 
    c.location === location &&
    c.studentId !== studentId
  );

  let finalPriority = priority as any;
  let reportCount = 1;
  let isWidespread = false;

  if (existingSimilarComplaints.length > 0) {
    reportCount = existingSimilarComplaints.length + 1;
    isWidespread = true;
    if (finalPriority !== "Emergency") {
      finalPriority = reportCount >= 3 ? "Emergency" : "High";
    }

    existingSimilarComplaints.forEach((ec: any) => {
      ec.priority = finalPriority;
      ec.reportCount = reportCount;
      ec.isWidespread = true;
      if (!ec.timeline) ec.timeline = [];
      ec.timeline.push({
        status: ec.status,
        date: nowStr,
        note: `⚠️ Multi-Student Alert: ${reportCount} students reported this issue. Priority escalated to ${finalPriority}!`
      });
    });
  }

  const nextNum = (db.complaints || []).length + 1;
  const complaintId = `SAMS-2026-${String(nextNum + 1000).slice(-4)}`;

  const newComplaint = {
    id: complaintId,
    studentId,
    studentName: studentName || "Student",
    studentRoll: studentRoll || "SAMS2026",
    department: department || "Computer Applications",
    course: course || "BCA",
    semester: semester || "4th Semester",
    category,
    title: complaintTitle,
    location,
    specificLocation: specificLocation || "",
    description,
    priority: finalPriority,
    image: image || "",
    dateTime: new Date().toISOString(),
    status: "Submitted",
    assignedDepartment: "Administration",
    assignedResolver: "",
    adminResponse: isWidespread ? `🔥 Widespread Issue detected! Reported by ${reportCount} students.` : "",
    updatedAt: new Date().toISOString(),
    reportCount,
    isWidespread,
    timeline: [
      { 
        status: "Submitted", 
        date: nowStr, 
        note: isWidespread ? `⚠️ Auto-escalated: ${reportCount} students reported this issue. Priority set to ${finalPriority}.` : "Complaint registered by student." 
      }
    ]
  };

  if (!db.complaints) db.complaints = [];
  db.complaints.unshift(newComplaint);

  if (!db.notifications) db.notifications = [];
  db.notifications.unshift({
    id: "notif_" + Date.now(),
    userId: studentId,
    title: isWidespread ? "Complaint Auto-Escalated" : "Complaint Registered Successfully",
    message: `Your complaint (${complaintId}) has been successfully submitted.`,
    read: false,
    createdAt: new Date().toISOString()
  });

  saveDB(db);
  res.json({ success: true, complaint: newComplaint });
});

// Single Complaint
router.get("/complaints/:id", (req: Request, res: Response) => {
  const db = getDB();
  const complaint = (db.complaints || []).find((c: any) => c.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: "Complaint not found." });
  }
  res.json(complaint);
});

// Complaint Update & Staff Assignment (Admin action)
router.put("/complaints/:id", (req: Request, res: Response) => {
  const db = getDB();
  const { status, assignedDepartment, adminResponse, assignedResolver, executiveNote, executiveSignoff } = req.body;
  const index = (db.complaints || []).findIndex((c: any) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Complaint not found." });
  }

  const complaint = db.complaints[index];
  const nowStr = new Date().toLocaleString();

  if (status && status !== complaint.status) {
    complaint.status = status;
    if (!complaint.timeline) complaint.timeline = [];
    complaint.timeline.push({
      status: status,
      date: nowStr,
      note: status === 'Assigned' ? `Assigned to ${assignedDepartment || complaint.assignedDepartment}` : `Status updated to ${status}`
    });
  }

  if (assignedDepartment && assignedDepartment !== complaint.assignedDepartment) {
    complaint.assignedDepartment = assignedDepartment;
    if (!complaint.timeline) complaint.timeline = [];
    complaint.timeline.push({
      status: 'Assigned',
      date: nowStr,
      note: `Assigned to department: ${assignedDepartment}`
    });
  }

  if (assignedResolver !== undefined && assignedResolver !== complaint.assignedResolver) {
    complaint.assignedResolver = assignedResolver;
    if (!complaint.timeline) complaint.timeline = [];
    complaint.timeline.push({
      status: complaint.status,
      date: nowStr,
      note: `Assigned technician / resolver: ${assignedResolver || 'None'}`
    });
  }

  if (adminResponse !== undefined) {
    complaint.adminResponse = adminResponse;
  }

  if (executiveNote !== undefined) {
    complaint.executiveNote = executiveNote;
    complaint.executiveSignoff = executiveSignoff || "College Dean / Additional Director";
    if (!complaint.timeline) complaint.timeline = [];
    complaint.timeline.push({
      status: complaint.status,
      date: nowStr,
      note: `🏛️ Executive Acknowledgment by ${complaint.executiveSignoff}: "${executiveNote}"`
    });
  }

  complaint.updatedAt = new Date().toISOString();
  db.complaints[index] = complaint;

  if (!db.notifications) db.notifications = [];
  db.notifications.unshift({
    id: "notif_" + Date.now(),
    userId: complaint.studentId,
    title: `Complaint Update: ${complaint.id}`,
    message: `Status is now '${complaint.status}' (Assigned Resolver: ${complaint.assignedResolver || 'Pending'}).`,
    read: false,
    createdAt: new Date().toISOString()
  });

  saveDB(db);
  res.json({ success: true, complaint });
});

// Resolvers / Technicians API
router.get("/resolvers", (req: Request, res: Response) => {
  const db = getDB();
  res.json(db.resolvers || initialData.resolvers);
});

router.post("/resolvers", (req: Request, res: Response) => {
  const db = getDB();
  const { name, role, phone, department, status } = req.body;
  if (!name || !role || !phone || !department) {
    return res.status(400).json({ error: "Missing required technician fields (name, role, phone, department)." });
  }

  const newResolver = {
    id: "res_" + Date.now(),
    name,
    role,
    phone,
    department,
    status: status || "Available"
  };

  if (!db.resolvers) db.resolvers = [];
  db.resolvers.push(newResolver);
  saveDB(db);
  res.json({ success: true, resolver: newResolver });
});

router.delete("/resolvers/:id", (req: Request, res: Response) => {
  const db = getDB();
  if (!db.resolvers) db.resolvers = [];
  const index = db.resolvers.findIndex((r: any) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Technician / Resolver not found." });
  }
  const removed = db.resolvers.splice(index, 1)[0];
  saveDB(db);
  res.json({ success: true, removed });
});

// Feedback API
router.post("/feedback", (req: Request, res: Response) => {
  const db = getDB();
  const { complaintId, studentId, studentName, rating, comment } = req.body;

  const complaint = (db.complaints || []).find((c: any) => c.id === complaintId);
  if (!complaint) {
    return res.status(404).json({ error: "Complaint not found." });
  }
  if (complaint.status !== "Resolved") {
    return res.status(400).json({ error: "Feedback can only be submitted for Resolved complaints." });
  }

  const newFeedback = {
    id: "fb_" + Date.now(),
    complaintId,
    studentId,
    studentName: studentName || "Student",
    rating: Number(rating) || 5,
    comment: comment || "",
    createdAt: new Date().toISOString()
  };

  if (!db.feedback) db.feedback = [];
  db.feedback.push(newFeedback);
  saveDB(db);
  res.json({ success: true, feedback: newFeedback });
});

router.get("/feedback", (req: Request, res: Response) => {
  const db = getDB();
  const { complaintId } = req.query;
  if (complaintId) {
    const fb = (db.feedback || []).filter((f: any) => f.complaintId === complaintId);
    return res.json(fb);
  }
  res.json(db.feedback || []);
});

// Notifications
router.get("/notifications", (req: Request, res: Response) => {
  const db = getDB();
  const { userId } = req.query;
  if (userId) {
    const notifs = (db.notifications || []).filter((n: any) => n.userId === userId);
    return res.json(notifs);
  }
  res.json(db.notifications || []);
});

router.put("/notifications/:id/read", (req: Request, res: Response) => {
  const db = getDB();
  const notif = (db.notifications || []).find((n: any) => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    saveDB(db);
  }
  res.json({ success: true });
});

// Student Profile
router.put("/students/:id", (req: Request, res: Response) => {
  const db = getDB();
  if (!db.students) db.students = [];
  const index = db.students.findIndex((s: any) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Student not found." });
  }

  const { fullName, course, department, year, semester } = req.body;
  const student = db.students[index];
  if (fullName) student.fullName = fullName;
  if (course) student.course = course;
  if (department) student.department = department;
  if (year) student.year = year;
  if (semester) student.semester = semester;

  db.students[index] = student;
  saveDB(db);

  const { password: _, ...studentWithoutPassword } = student;
  res.json({ success: true, user: studentWithoutPassword });
});

// Mount router on both '/api' and '/' to ensure zero routing mismatch on Vercel
app.use("/api", router);
app.use("/", router);

export default app;

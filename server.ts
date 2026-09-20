import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const PORT = 3000;

// Database file path
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "sams_db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
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
      category: "Electricity Problem",
      title: "Damaged Laboratory Socket & Sparking",
      location: "BCA Building (BCA, BBA, B.Com, MBA Courses)",
      specificLocation: "Room 204",
      description: "Electricity wire/socket is damaged and spark is observed when plugging projector.",
      priority: "High",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
      dateTime: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "In Progress",
      assignedDepartment: "Electrical Department",
      adminResponse: "Electrician team assigned to inspect Room 204 socket today afternoon.",
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      timeline: [
        { status: "Submitted", date: new Date(Date.now() - 86400000 * 2).toLocaleString(), note: "Complaint registered by student." },
        { status: "Under Review", date: new Date(Date.now() - 86400000 * 1.5).toLocaleString(), note: "Reviewed by Super Admin." },
        { status: "Assigned", date: new Date(Date.now() - 86400000 * 1.2).toLocaleString(), note: "Assigned to Electrical Department." },
        { status: "In Progress", date: new Date(Date.now() - 86400000).toLocaleString(), note: "Electrician team dispatched." }
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
    },
    {
      id: "res_9",
      name: "Rajesh Guard",
      role: "Chief Security Officer",
      phone: "+91 98765 43218",
      department: "Security Department",
      status: "Available"
    }
  ]
};

// Load DB
function getDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const db = JSON.parse(data);
    
    // Ensure all initial admins (Dean, Director, HOD, Super Admin) exist
    if (!db.admins) db.admins = [];
    initialData.admins.forEach((defaultAdmin: any) => {
      const existingIdx = db.admins.findIndex((a: any) => a.email === defaultAdmin.email);
      if (existingIdx === -1) {
        db.admins.push(defaultAdmin);
      } else {
        // update password / role to ensure correctness
        db.admins[existingIdx] = { ...db.admins[existingIdx], ...defaultAdmin };
      }
    });

    return db;
  } catch (err) {
    console.error("Error reading DB, using initial data", err);
    return initialData;
  }
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving DB", err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", system: "SAMS API Running" });
  });

  // Seed / Reset DB
  app.post("/api/seed", (req, res) => {
    saveDB(initialData);
    res.json({ success: true, message: "Database re-seeded successfully with demo data." });
  });

  // Student Registration
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

  // Student Login
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

  // Admin Login
  app.post("/api/auth/admin-login", (req, res) => {
    const db = getDB();
    const { email, password } = req.body;

    const admin = db.admins.find((a: any) => a.email === email && a.password === password);
    if (!admin) {
      return res.status(401).json({ error: "Invalid admin credentials or unauthorized role." });
    }

    const { password: _, ...adminWithoutPassword } = admin;
    res.json({ success: true, user: adminWithoutPassword, role: "ADMIN" });
  });

  // Get Departments
  app.get("/api/departments", (req, res) => {
    const db = getDB();
    res.json(db.departments);
  });

  // Get Complaints
  app.get("/api/complaints", (req, res) => {
    const db = getDB();
    const { studentId } = req.query;

    if (studentId) {
      const studentComplaints = db.complaints.filter((c: any) => c.studentId === studentId);
      return res.json(studentComplaints);
    }

    res.json(db.complaints);
  });

  // Submit Complaint
  app.post("/api/complaints", (req, res) => {
    const db = getDB();
    const { studentId, studentName, studentRoll, department, course, semester, category, title, location, specificLocation, description, priority, image } = req.body;

    if (!studentId || !category || !location || !description || !priority) {
      return res.status(400).json({ error: "Missing required complaint fields (studentId, category, location, description, priority)." });
    }

    const complaintTitle = title || `${category} at ${specificLocation || location}`;

    // Check if other active complaints exist with the same category and location
    const existingSimilarComplaints = db.complaints.filter((c: any) => 
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
      // Automatically escalate priority if multiple students are facing the same problem
      if (finalPriority !== "Emergency") {
        finalPriority = reportCount >= 3 ? "Emergency" : "High";
      }

      // Also escalate existing matching complaints' priority
      existingSimilarComplaints.forEach((ec: any) => {
        ec.priority = finalPriority;
        ec.reportCount = reportCount;
        ec.isWidespread = true;
        if (!ec.timeline) ec.timeline = [];
        ec.timeline.push({
          status: ec.status,
          date: nowStr,
          note: `⚠️ Multi-Student Alert: ${reportCount} students have reported this same issue (${category} at ${location}). Priority escalated to ${finalPriority}!`
        });
      });
    }

    // Generate unique Complaint ID e.g., SAMS-2026-XXXX
    const nextNum = db.complaints.length + 1;
    const complaintId = `SAMS-2026-${String(nextNum + 1000).slice(-4)}`;

    const nowStr = new Date().toLocaleString();
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
      adminResponse: isWidespread ? `🔥 Widespread Issue detected! Reported by ${reportCount} students. High priority assigned for immediate resolution.` : "",
      updatedAt: new Date().toISOString(),
      reportCount,
      isWidespread,
      timeline: [
        { 
          status: "Submitted", 
          date: nowStr, 
          note: isWidespread ? `⚠️ Auto-escalated: ${reportCount} students reported this same problem (${category} at ${location}). Priority set to ${finalPriority}.` : "Complaint registered by student." 
        }
      ]
    };

    db.complaints.unshift(newComplaint);

    db.notifications.unshift({
      id: "notif_" + Date.now(),
      userId: studentId,
      title: isWidespread ? "Complaint Auto-Escalated (Widespread Issue)" : "Complaint Registered Successfully",
      message: isWidespread 
        ? `Your complaint (${complaintId}) matches reports from ${reportCount} other students. Priority auto-escalated to ${finalPriority}.` 
        : `Your complaint (${complaintId}) has been successfully submitted.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    // Notify all admins instantly with urgent highlighting if widespread
    if (db.admins && Array.isArray(db.admins)) {
      db.admins.forEach((admin: any) => {
        db.notifications.unshift({
          id: "notif_admin_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
          userId: admin.id,
          title: isWidespread ? `🚨 WIDESPREAD ISSUE (${reportCount} Reports) - ${category}` : "New Student Complaint Registered",
          message: isWidespread 
            ? `URGENT: ${reportCount} students reported ${category} at ${location}. Priority escalated to ${finalPriority}.` 
            : `${studentName || 'A student'} submitted ${complaintId} (${category}) at ${location}.`,
          read: false,
          createdAt: new Date().toISOString()
        });
      });
    }

    saveDB(db);
    res.json({ success: true, complaint: newComplaint });
  });

  // Get Single Complaint
  app.get("/api/complaints/:id", (req, res) => {
    const db = getDB();
    const complaint = db.complaints.find((c: any) => c.id === req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found." });
    }
    res.json(complaint);
  });

  // Update Complaint (Admin action only)
  app.put("/api/complaints/:id", (req, res) => {
    const isAdmin = req.headers['x-admin-auth'] === 'true' || req.body.isAdmin === true;
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Admin portal security enforced: Unauthorized access attempt blocked." });
    }

    const db = getDB();
    const { status, assignedDepartment, adminResponse } = req.body;
    const index = db.complaints.findIndex((c: any) => c.id === req.params.id);

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

    const { assignedResolver } = req.body;
    if (assignedResolver !== undefined && assignedResolver !== complaint.assignedResolver) {
      complaint.assignedResolver = assignedResolver;
      if (!complaint.timeline) complaint.timeline = [];
      complaint.timeline.push({
        status: complaint.status,
        date: nowStr,
        note: `Assigned resolver/technician: ${assignedResolver || 'None'}`
      });
    }

    if (adminResponse !== undefined) {
      complaint.adminResponse = adminResponse;
    }

    const { executiveNote, executiveSignoff } = req.body;
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

  // Resolvers API
  app.get("/api/resolvers", (req, res) => {
    const db = getDB();
    res.json(db.resolvers || []);
  });

  app.post("/api/resolvers", (req, res) => {
    const isAdmin = req.headers['x-admin-auth'] === 'true' || req.body.isAdmin === true;
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Admin portal security enforced." });
    }
    const db = getDB();
    const { name, role, phone, department, status } = req.body;
    if (!name || !role || !phone || !department) {
      return res.status(400).json({ error: "Missing required resolver fields." });
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

  app.delete("/api/resolvers/:id", (req, res) => {
    const isAdmin = req.headers['x-admin-auth'] === 'true' || req.query.isAdmin === 'true';
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Admin portal security enforced." });
    }
    const db = getDB();
    const index = (db.resolvers || []).findIndex((r: any) => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Resolver not found." });
    }
    const removed = db.resolvers.splice(index, 1)[0];
    saveDB(db);
    res.json({ success: true, removed });
  });

  // Submit Feedback
  app.post("/api/feedback", (req, res) => {
    const db = getDB();
    const { complaintId, studentId, studentName, rating, comment } = req.body;

    const complaint = db.complaints.find((c: any) => c.id === complaintId);
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

    db.feedback.push(newFeedback);
    saveDB(db);
    res.json({ success: true, feedback: newFeedback });
  });

  // Get Feedback
  app.get("/api/feedback", (req, res) => {
    const db = getDB();
    const { complaintId } = req.query;
    if (complaintId) {
      const fb = db.feedback.filter((f: any) => f.complaintId === complaintId);
      return res.json(fb);
    }
    res.json(db.feedback);
  });

  // Get Notifications
  app.get("/api/notifications", (req, res) => {
    const db = getDB();
    const { userId } = req.query;
    if (userId) {
      const notifs = db.notifications.filter((n: any) => n.userId === userId);
      return res.json(notifs);
    }
    res.json(db.notifications);
  });

  // Mark Notification Read
  app.put("/api/notifications/:id/read", (req, res) => {
    const db = getDB();
    const notif = db.notifications.find((n: any) => n.id === req.params.id);
    if (notif) {
      notif.read = true;
      saveDB(db);
    }
    res.json({ success: true });
  });

  // Update Student Profile
  app.put("/api/students/:id", (req, res) => {
    const db = getDB();
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

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SAMS Server running on http://localhost:${PORT}`);
  });
}

startServer();

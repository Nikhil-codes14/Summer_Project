export interface User {
  id: string;
  fullName?: string;
  name?: string;
  studentId?: string;
  rollNumber?: string;
  email: string;
  course?: string;
  department?: string;
  year?: string;
  semester?: string;
  role?: string;
  createdAt?: string;
}

export type UserRole = 'STUDENT' | 'ADMIN' | null;

export interface Resolver {
  id: string;
  name: string;
  role: string;
  phone: string;
  department: string;
  status: 'Available' | 'On Task' | 'Off Duty';
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  department?: string;
  course?: string;
  semester?: string;
  category: string;
  title: string;
  location: string;
  specificLocation: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  image: string;
  dateTime: string;
  status: 'Submitted' | 'Pending' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
  assignedDepartment: string;
  assignedResolver?: string;
  adminResponse: string;
  executiveNote?: string;
  executiveSignoff?: string;
  updatedAt: string;
  timeline?: { status: string; date: string; note: string }[];
  reportCount?: number;
  isWidespread?: boolean;
}

export interface Feedback {
  id: string;
  complaintId: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const CAMPUS_LOCATIONS = [
  "B.Tech Building (All Sections)",
  "BCA Building (BCA, BBA, B.Com, MBA Courses)",
  "Mess Area (Hostellers)",
  "Hostel Block & Residential Area",
  "Central Library",
  "Computer Labs & IT Center",
  "Mechanical & Engineering Labs",
  "Administrative Block",
  "Seminar Hall & Auditorium",
  "Canteen & Cafeteria",
  "Sports Complex & Ground",
  "Main Gate & Parking"
];

export const COMPLAINT_CATEGORIES = [
  "Electricity Problem",
  "Water Leakage",
  "Plumbing Problem",
  "Furniture Problem",
  "Classroom Problem",
  "Washroom Problem",
  "Laboratory Problem",
  "Internet/Wi-Fi Problem",
  "Cleanliness Problem",
  "Security Problem",
  "Road/Parking Problem",
  "Hostel & Mess Problem",
  "Library Problem",
  "AC/Fan Problem",
  "Projector/Smart Board Problem",
  "Other"
];

export const DEPARTMENTS_LIST = [
  "Electrical Department",
  "Maintenance Department",
  "Cleaning Department",
  "IT Department",
  "Civil/Maintenance",
  "Security Department",
  "Mess & Hostel Committee",
  "Administration"
];

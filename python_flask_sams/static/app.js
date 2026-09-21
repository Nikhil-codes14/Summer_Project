// State
let currentUser = null;
let currentRole = null; // 'STUDENT' or 'ADMIN'
let allComplaints = [];
let allResolvers = [];
let selectedAdminRoleType = 'dean';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  loadResolvers();
});

// View Navigation
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);
}

// Modal Management
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Navigation Bar Rendering
function renderNavbar() {
  const nav = document.getElementById('navActions');
  if (!currentUser) {
    nav.innerHTML = `
      <button class="btn btn-primary" onclick="showView('viewStudentLogin')">Student Sign In</button>
      <button class="btn btn-outline" style="color:white; border-color:#475569;" onclick="showView('viewAdminLogin')">Executive Portal</button>
    `;
  } else {
    nav.innerHTML = `
      <span style="font-size:13px; color:#cbd5e1;">👤 ${currentUser.fullName || currentUser.name} (${currentRole})</span>
      <button class="btn btn-outline" style="color:#f87171; border-color:#991b1b;" onclick="handleLogout()">Sign Out</button>
    `;
  }
}

function handleLogout() {
  currentUser = null;
  currentRole = null;
  renderNavbar();
  showView('viewLanding');
}

// Student Auth Tabs
function toggleStudentAuthTab(tab) {
  const loginForm = document.getElementById('formStudentLogin');
  const regForm = document.getElementById('formStudentReg');
  const tabLoginBtn = document.getElementById('tabStudentLoginBtn');
  const tabRegBtn = document.getElementById('tabStudentRegBtn');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
    tabLoginBtn.classList.add('active');
    tabRegBtn.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
    tabLoginBtn.classList.remove('active');
    tabRegBtn.classList.add('active');
  }
}

// Select Admin Role
function selectAdminRole(role) {
  selectedAdminRoleType = role;
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  const title = document.getElementById('adminPortalTitle');
  const sub = document.getElementById('adminPortalSub');
  const btn = document.getElementById('adminSubmitBtn');
  const emailInput = document.getElementById('adminEmail');
  const passInput = document.getElementById('adminPassword');

  if (role === 'dean') {
    title.innerText = "🏛️ College Dean Login";
    sub.innerText = "Academic & Executive Council Portal";
    btn.innerText = "🏛️ Login as College Dean";
    emailInput.value = "dean@ambalika.ac.in";
    passInput.value = "dean123";
  } else if (role === 'director') {
    title.innerText = "👔 Additional Director Login";
    sub.innerText = "Directorate General & Operations";
    btn.innerText = "👔 Login as Additional Director";
    emailInput.value = "director@ambalika.ac.in";
    passInput.value = "director123";
  } else {
    title.innerText = "⚙️ Maintenance HOD / Admin Login";
    sub.innerText = "Estate & Campus Operations";
    btn.innerText = "⚙️ Login as Admin / HOD";
    emailInput.value = "admin@ambalika.ac.in";
    passInput.value = "admin123";
  }
}

// 1. Handle Student Login
async function handleStudentLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/auth/student-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    currentUser = data.user;
    currentRole = 'STUDENT';
    renderNavbar();
    document.getElementById('studentWelcomeText').innerText = `Welcome, ${currentUser.fullName} (${currentUser.course} - ${currentUser.studentId})`;
    showView('viewStudentDashboard');
    loadStudentComplaints();
  } catch (err) {
    alert(err.message);
  }
}

// 2. Handle Student Registration
async function handleStudentRegister(e) {
  e.preventDefault();
  const payload = {
    fullName: document.getElementById('regFullName').value,
    studentId: document.getElementById('regStudentId').value,
    email: document.getElementById('regEmail').value,
    course: document.getElementById('regCourse').value,
    department: document.getElementById('regDepartment').value,
    year: document.getElementById('regYear').value,
    semester: document.getElementById('regSemester').value,
    password: document.getElementById('regPassword').value
  };

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    currentUser = data.user;
    currentRole = 'STUDENT';
    renderNavbar();
    document.getElementById('studentWelcomeText').innerText = `Welcome, ${currentUser.fullName} (${currentUser.course} - ${currentUser.studentId})`;
    showView('viewStudentDashboard');
    loadStudentComplaints();
  } catch (err) {
    alert(err.message);
  }
}

// 3. Handle Admin Login
async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  try {
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Admin authentication failed');

    currentUser = data.user;
    currentRole = 'ADMIN';
    renderNavbar();
    document.getElementById('adminDashboardHeading').innerText = `${currentUser.name} (${currentUser.role})`;
    document.getElementById('adminWelcomeText').innerText = `Department: ${currentUser.department}`;
    showView('viewAdminDashboard');
    loadComplaints();
  } catch (err) {
    alert(err.message);
  }
}

// 4. Load Complaints for Admin
async function loadComplaints() {
  try {
    const res = await fetch('/api/complaints');
    allComplaints = await res.json();
    renderAdminTable();
  } catch (err) {
    console.error(err);
  }
}

// 5. Load Complaints for Student
async function loadStudentComplaints() {
  if (!currentUser) return;
  try {
    const res = await fetch(`/api/complaints?studentId=${currentUser.id}`);
    const complaints = await res.json();
    renderStudentList(complaints);
  } catch (err) {
    console.error(err);
  }
}

// Render Student Complaints
function renderStudentList(complaints) {
  const container = document.getElementById('studentComplaintsContainer');
  if (!complaints || complaints.length === 0) {
    container.innerHTML = `
      <div style="background:white; padding:32px; border-radius:12px; text-align:center; color:#64748b;">
        <p>No complaints submitted yet. Click <strong>+ Submit New Grievance</strong> above to report a problem.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = complaints.map(c => `
    <div class="card" style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
        <div>
          <span style="font-size:11px; font-weight:700; color:#dc2626;">${c.id}</span>
          <h3 style="margin:4px 0;">${c.title}</h3>
          <p style="font-size:13px; color:#64748b;">📍 ${c.location} ${c.specific_location ? `(${c.specific_location})` : ''}</p>
        </div>
        <span class="badge-status status-${c.status.replace(/\s+/g, '')}">${c.status}</span>
      </div>
      <p style="font-size:14px; margin-bottom:12px;">${c.description}</p>
      ${c.assigned_resolver ? `<div style="font-size:12px; background:#f1f5f9; padding:6px 10px; border-radius:6px;">🔧 Assigned Resolver: <strong>${c.assigned_resolver}</strong></div>` : ''}
      ${c.executive_note ? `<div style="font-size:12px; background:#fee2e2; padding:6px 10px; border-radius:6px; margin-top:6px; color:#991b1b;">🏛️ Executive Signoff (${c.executive_signoff}): "${c.executive_note}"</div>` : ''}
    </div>
  `).join('');
}

// Render Admin Complaints Table
function renderAdminTable() {
  const tbody = document.getElementById('adminComplaintsTableBody');
  if (!allComplaints || allComplaints.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#94a3b8; padding:24px;">No complaints registered in system.</td></tr>`;
    return;
  }

  tbody.innerHTML = allComplaints.map(c => `
    <tr>
      <td><strong>${c.id}</strong></td>
      <td>${c.student_name || 'Student'}<br><small style="color:#64748b;">${c.student_roll || ''}</small></td>
      <td><strong>${c.category}</strong><br><small style="color:#64748b;">${c.title}</small></td>
      <td>${c.location}<br><small style="color:#64748b;">${c.specific_location || ''}</small></td>
      <td><span style="font-weight:700; color:${c.priority === 'Emergency' || c.priority === 'High' ? '#dc2626' : '#475569'};">${c.priority}</span></td>
      <td><span class="badge-status status-${c.status.replace(/\s+/g, '')}">${c.status}</span></td>
      <td>${c.assigned_resolver || '<span style="color:#94a3b8;">Unassigned</span>'}</td>
      <td>
        <button class="btn btn-secondary" style="padding:4px 10px; font-size:12px;" onclick="openUpdateModal('${c.id}')">Manage</button>
      </td>
    </tr>
  `).join('');
}

// Submit Complaint (Student)
async function handleComplaintSubmit(e) {
  e.preventDefault();
  if (!currentUser) return;

  const payload = {
    studentId: currentUser.id,
    studentName: currentUser.fullName,
    studentRoll: currentUser.studentId,
    department: currentUser.department,
    course: currentUser.course,
    semester: currentUser.semester,
    category: document.getElementById('cmpCategory').value,
    location: document.getElementById('cmpLocation').value,
    specificLocation: document.getElementById('cmpSpecificLocation').value,
    description: document.getElementById('cmpDescription').value,
    priority: document.getElementById('cmpPriority').value
  };

  try {
    const res = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit complaint');

    hideModal('modalNewComplaint');
    document.getElementById('formNewComplaint').reset();
    alert(`Complaint ${data.complaint.id} submitted successfully!`);
    loadStudentComplaints();
  } catch (err) {
    alert(err.message);
  }
}

// Open Update Modal
function openUpdateModal(complaintId) {
  const c = allComplaints.find(item => item.id === complaintId);
  if (!c) return;

  document.getElementById('editComplaintId').value = c.id;
  document.getElementById('editStatus').value = c.status;
  document.getElementById('editAdminResponse').value = c.executive_note || c.admin_response || '';

  // Populate resolvers dropdown
  const select = document.getElementById('editResolver');
  select.innerHTML = '<option value="">-- Select Technician --</option>' + 
    allResolvers.map(r => `<option value="${r.name} (${r.role})" ${c.assigned_resolver && c.assigned_resolver.includes(r.name) ? 'selected' : ''}>${r.name} - ${r.role} (${r.department})</option>`).join('');

  showModal('modalUpdateComplaint');
}

// Handle Complaint Update Submission
async function handleComplaintUpdateSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('editComplaintId').value;
  const payload = {
    status: document.getElementById('editStatus').value,
    assignedResolver: document.getElementById('editResolver').value,
    executiveNote: document.getElementById('editAdminResponse').value,
    executiveSignoff: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Administrator'
  };

  try {
    const res = await fetch(`/api/complaints/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');

    hideModal('modalUpdateComplaint');
    alert('Complaint status and technician assignment updated successfully!');
    loadComplaints();
  } catch (err) {
    alert(err.message);
  }
}

// Load Resolvers
async function loadResolvers() {
  try {
    const res = await fetch('/api/resolvers');
    allResolvers = await res.json();
    renderResolvers();
  } catch (err) {
    console.error(err);
  }
}

function renderResolvers() {
  const container = document.getElementById('resolversContainer');
  if (!container) return;
  container.innerHTML = allResolvers.map(r => `
    <div class="resolver-card">
      <h4>${r.name}</h4>
      <p style="color:#dc2626; font-weight:600;">${r.role}</p>
      <p style="color:#64748b;">${r.department}</p>
      <p>📞 ${r.phone}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <span style="font-size:10px; background:#dcfce7; color:#16a34a; padding:2px 6px; border-radius:4px; font-weight:700;">${r.status}</span>
        <button style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:12px;" onclick="deleteResolver('${r.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Add Resolver
async function handleAddResolver(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('resName').value,
    role: document.getElementById('resRole').value,
    phone: document.getElementById('resPhone').value,
    department: document.getElementById('resDept').value,
    status: 'Available'
  };

  try {
    const res = await fetch('/api/resolvers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add resolver');

    document.getElementById('formAddResolver').reset();
    loadResolvers();
  } catch (err) {
    alert(err.message);
  }
}

// Delete Resolver
async function deleteResolver(id) {
  if (!confirm('Remove this technician from campus directory?')) return;
  try {
    const res = await fetch(`/api/resolvers/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete');
    loadResolvers();
  } catch (err) {
    alert(err.message);
  }
}

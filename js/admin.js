// Admin Dashboard Logic

const currentUser = checkAuth('admin');
if (!currentUser) throw new Error("Unauthorized");

document.getElementById('admin-name').textContent = currentUser.name || 'Admin';

// ==================== STUDENTS MANAGEMENT ====================

async function renderStudents() {
    const contentArea = document.getElementById('content-area');
    try {
        const students = await api.getStudents();

        contentArea.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Students Management</h2>
                <button onclick="showAddStudentModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <span>+</span> Add Student
                </button>
            </div>

            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Enrollment</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Year</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Course</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                            ${students.map(student => `
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">${student.name}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">${student.enrollmentNo}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">${student.year || 'N/A'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">${student.course || 'N/A'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onclick='editStudent(${JSON.stringify(student)})' class="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button onclick="deleteStudent('${student.id}')" class="text-rose-600 hover:text-rose-900">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">Error loading students: ${error.message}</p>`;
    }
}

function showAddStudentModal() {
    const modal = createModal('Add Student', `
        <form onsubmit="addStudent(event)" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Name</label>
                    <input type="text" id="student-name" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Enrollment No</label>
                    <input type="text" id="student-enrollment" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Email/ID</label>
                    <input type="text" id="student-id" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Year</label>
                    <input type="text" id="student-year" value="1st Year" class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Course</label>
                    <input type="text" id="student-course" class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Batch</label>
                    <input type="text" id="student-batch" class="w-full px-3 py-2 border rounded-lg">
                </div>
            </div>
            <div class="flex justify-end gap-2 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add Student</button>
            </div>
        </form>
    `);
}

async function addStudent(e) {
    e.preventDefault();
    const student = {
        id: document.getElementById('student-id').value,
        name: document.getElementById('student-name').value,
        enrollmentNo: document.getElementById('student-enrollment').value,
        year: document.getElementById('student-year').value,
        course: document.getElementById('student-course').value,
        batch: document.getElementById('student-batch').value,
        email: document.getElementById('student-id').value,
        fatherName: '',
        motherName: '',
        dob: '',
        marks: {},
        clubs: [],
        timetable: [],
        todo: []
    };

    try {
        await api.createStudent(student);
        closeModal();
        renderStudents();
        alert('Student added successfully!');
    } catch (error) {
        alert('Failed to add student: ' + error.message);
    }
}

function editStudent(student) {
    const modal = createModal('Edit Student', `
        <form onsubmit="updateStudent(event, '${student.id}')" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Name</label>
                    <input type="text" id="edit-student-name" value="${student.name}" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Year</label>
                    <input type="text" id="edit-student-year" value="${student.year || ''}" class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Course</label>
                    <input type="text" id="edit-student-course" value="${student.course || ''}" class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Batch</label>
                    <input type="text" id="edit-student-batch" value="${student.batch || ''}" class="w-full px-3 py-2 border rounded-lg">
                </div>
            </div>
            <div class="flex justify-end gap-2 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Update</button>
            </div>
        </form>
    `);
}

async function updateStudent(e, id) {
    e.preventDefault();
    const updates = {
        name: document.getElementById('edit-student-name').value,
        year: document.getElementById('edit-student-year').value,
        course: document.getElementById('edit-student-course').value,
        batch: document.getElementById('edit-student-batch').value
    };

    try {
        const students = await api.getStudents();
        const student = students.find(s => s.id === id);
        const updated = { ...student, ...updates };
        await api.updateStudent(id, updated);
        closeModal();
        renderStudents();
        alert('Student updated successfully!');
    } catch (error) {
        alert('Failed to update student: ' + error.message);
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
        await api.deleteStudent(id);
        renderStudents();
        alert('Student deleted successfully!');
    } catch (error) {
        alert('Failed to delete student: ' + error.message);
    }
}

// ==================== TEACHERS MANAGEMENT ====================

async function renderTeachers() {
    const contentArea = document.getElementById('content-area');
    try {
        const teachers = await api.getTeachers();

        contentArea.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Teachers Management</h2>
                <button onclick="showAddTeacherModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <span>+</span> Add Teacher
                </button>
            </div>

            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Subject</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cubicle</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Contact</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                            ${teachers.map(teacher => `
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">${teacher.name}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">${teacher.subject}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">${teacher.cubicle || 'N/A'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">${teacher.contact || 'N/A'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onclick='editTeacher(${JSON.stringify(teacher)})' class="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button onclick="deleteTeacher('${teacher.id}')" class="text-rose-600 hover:text-rose-900">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">Error loading teachers: ${error.message}</p>`;
    }
}

function showAddTeacherModal() {
    const modal = createModal('Add Teacher', `
        <form onsubmit="addTeacher(event)" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Name</label>
                    <input type="text" id="teacher-name" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Email/ID</label>
                    <input type="text" id="teacher-id" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Subject</label>
                    <input type="text" id="teacher-subject" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Cubicle</label>
                    <input type="text" id="teacher-cubicle" class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Contact</label>
                    <input type="tel" id="teacher-contact" class="w-full px-3 py-2 border rounded-lg">
                </div>
            </div>
            <div class="flex justify-end gap-2 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add Teacher</button>
            </div>
        </form>
    `);
}

async function addTeacher(e) {
    e.preventDefault();
    const teacher = {
        id: document.getElementById('teacher-id').value,
        name: document.getElementById('teacher-name').value,
        subject: document.getElementById('teacher-subject').value,
        cubicle: document.getElementById('teacher-cubicle').value || 'TBD',
        contact: document.getElementById('teacher-contact').value || '',
        isContactHidden: false,
        isEmailHidden: false,
        isCubicleHidden: false,
        department: 'General',
        classes: [],
        availableSlots: []
    };

    try {
        await api.createTeacher(teacher);
        closeModal();
        renderTeachers();
        alert('Teacher added successfully!');
    } catch (error) {
        alert('Failed to add teacher: ' + error.message);
    }
}

function editTeacher(teacher) {
    const modal = createModal('Edit Teacher', `
        <form onsubmit="updateTeacher(event, '${teacher.id}')" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Name</label>
                    <input type="text" id="edit-teacher-name" value="${teacher.name}" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Subject</label>
                    <input type="text" id="edit-teacher-subject" value="${teacher.subject}" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Cubicle</label>
                    <input type="text" id="edit-teacher-cubicle" value="${teacher.cubicle || ''}" class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Contact</label>
                    <input type="tel" id="edit-teacher-contact" value="${teacher.contact || ''}" class="w-full px-3 py-2 border rounded-lg">
                </div>
            </div>
            <div class="flex justify-end gap-2 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Update</button>
            </div>
        </form>
    `);
}

async function updateTeacher(e, id) {
    e.preventDefault();
    const updates = {
        name: document.getElementById('edit-teacher-name').value,
        subject: document.getElementById('edit-teacher-subject').value,
        cubicle: document.getElementById('edit-teacher-cubicle').value,
        contact: document.getElementById('edit-teacher-contact').value
    };

    try {
        const teachers = await api.getTeachers();
        const teacher = teachers.find(t => t.id === id);
        const updated = { ...teacher, ...updates };
        await api.updateTeacher(id, updated);
        closeModal();
        renderTeachers();
        alert('Teacher updated successfully!');
    } catch (error) {
        alert('Failed to update teacher: ' + error.message);
    }
}

async function deleteTeacher(id) {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
        await api.deleteTeacher(id);
        renderTeachers();
        alert('Teacher deleted successfully!');
    } catch (error) {
        alert('Failed to delete teacher: ' + error.message);
    }
}

// ==================== CLUBS MANAGEMENT ====================

async function renderClubs() {
    const contentArea = document.getElementById('content-area');
    try {
        const clubs = await api.getClubs();

        contentArea.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Clubs Management</h2>
                <button onclick="showAddClubModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <span>+</span> Add Club
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${clubs.map(club => `
                    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-slate-800 dark:text-white">${club.name}</h3>
                                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">President: ${club.president}</p>
                            </div>
                            <div class="flex gap-2">
                                <button onclick='editClub(${JSON.stringify(club).replace(/'/g, "\\'")})'  class="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
                                <button onclick="deleteClub('${club.id}')" class="text-rose-600 hover:text-rose-900 text-sm">Delete</button>
                            </div>
                        </div>
                        <p class="text-sm text-slate-600 dark:text-slate-300 mb-3">${club.description}</p>
                        <div class="text-sm">
                            <p class="text-slate-500">WhatsApp: <a href="${club.whatsappLink || '#'}" target="_blank" class="text-indigo-600">${club.whatsappLink ? 'Link' : 'Not set'}</a></p>
                            <p class="text-slate-500 mt-1">Members: ${club.members.length}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">Error loading clubs: ${error.message}</p>`;
    }
}

function showAddClubModal() {
    const modal = createModal('Add Club', `
        <form onsubmit="addClub(event)" class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Club Name</label>
                <input type="text" id="club-name" required class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Description</label>
                <textarea id="club-description" required rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">President</label>
                    <input type="text" id="club-president" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">WhatsApp Link</label>
                    <input type="url" id="club-whatsapp" class="w-full px-3 py-2 border rounded-lg">
                </div>
            </div>
            <div class="flex justify-end gap-2 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add Club</button>
            </div>
        </form>
    `);
}

async function addClub(e) {
    e.preventDefault();
    const club = {
        name: document.getElementById('club-name').value,
        description: document.getElementById('club-description').value,
        president: document.getElementById('club-president').value,
        whatsappLink: document.getElementById('club-whatsapp').value || '',
        members: [],
        meeting: 'TBD',
        teamMembers: { tech: [], design: [], pr: [] }
    };

    try {
        await api.createClub(club);
        closeModal();
        renderClubs();
        alert('Club added successfully!');
    } catch (error) {
        alert('Failed to add club: ' + error.message);
    }
}

function editClub(club) {
    const modal = createModal('Edit Club', `
        <form onsubmit="updateClub(event, '${club.id}')" class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Club Name</label>
                <input type="text" id="edit-club-name" value="${club.name}" required class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Description</label>
                <textarea id="edit-club-description" required rows="3" class="w-full px-3 py-2 border rounded-lg">${club.description}</textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">President</label>
                    <input type="text" id="edit-club-president" value="${club.president}" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">WhatsApp Link</label>
                    <input type="url" id="edit-club-whatsapp" value="${club.whatsappLink || ''}" class="w-full px-3 py-2 border rounded-lg">
                </div>
            </div>
            <div class="flex justify-end gap-2 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Update</button>
            </div>
        </form>
    `);
}

async function updateClub(e, id) {
    e.preventDefault();
    const updates = {
        name: document.getElementById('edit-club-name').value,
        description: document.getElementById('edit-club-description').value,
        president: document.getElementById('edit-club-president').value,
        whatsappLink: document.getElementById('edit-club-whatsapp').value
    };

    try {
        const clubs = await api.getClubs();
        const club = clubs.find(c => c.id === id);
        const updated = { ...club, ...updates };
        await api.updateClub(id, updated);
        closeModal();
        renderClubs();
        alert('Club updated successfully!');
    } catch (error) {
        alert('Failed to update club: ' + error.message);
    }
}

async function deleteClub(id) {
    if (!confirm('Are you sure you want to delete this club?')) return;

    try {
        await api.deleteClub(id);
        renderClubs();
        alert('Club deleted successfully!');
    } catch (error) {
        alert('Failed to delete club: ' + error.message);
    }
}

// ==================== OUTLETS MANAGEMENT ====================

async function renderOutlets() {
    const contentArea = document.getElementById('content-area');
    try {
        const outlets = await api.getOutlets();

        contentArea.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Campus Outlets Management</h2>
                <button onclick="showAddOutletModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <span>+</span> Add Outlet
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${outlets.map(outlet => `
                    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-slate-800 dark:text-white">${outlet.name}</h3>
                                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">📍 ${outlet.location}</p>
                            </div>
                            <div class="flex gap-2">
                                <button onclick='editOutlet(${JSON.stringify(outlet).replace(/'/g, "\\'")})'  class="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
                                <button onclick="deleteOutlet('${outlet.id}')" class="text-rose-600 hover:text-rose-900 text-sm">Delete</button>
                            </div>
                        </div>
                        <p class="text-sm text-slate-600 dark:text-slate-300 mb-3">⏰ ${outlet.timings}</p>
                        <div class="flex flex-wrap gap-2">
                            ${outlet.menu.map(item => `
                                <span class="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs">
                                    ${item}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">Error loading outlets: ${error.message}</p>`;
    }
}

function showAddOutletModal() {
    const modal = createModal('Add Outlet', `
        <form onsubmit="addOutlet(event)" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Outlet Name</label>
                    <input type="text" id="outlet-name" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Location</label>
                    <input type="text" id="outlet-location" required class="w-full px-3 py-2 border rounded-lg">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Timings</label>
                <input type="text" id="outlet-timings" placeholder="e.g., 9:00 AM - 9:00 PM" required class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Menu Items (comma-separated)</label>
                <textarea id="outlet-menu" placeholder="Pizza, Burger, Fries" required rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea>
            </div>
            <div class="flex justify-end gap-2 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add Outlet</button>
            </div>
        </form>
    `);
}

async function addOutlet(e) {
    e.preventDefault();
    const outlet = {
        name: document.getElementById('outlet-name').value,
        location: document.getElementById('outlet-location').value,
        timings: document.getElementById('outlet-timings').value,
        menu: document.getElementById('outlet-menu').value.split(',').map(item => item.trim())
    };

    try {
        await api.createOutlet(outlet);
        closeModal();
        renderOutlets();
        alert('Outlet added successfully!');
    } catch (error) {
        alert('Failed to add outlet: ' + error.message);
    }
}

function editOutlet(outlet) {
    const modal = createModal('Edit Outlet', `
        <form onsubmit="updateOutlet(event, '${outlet.id}')" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Outlet Name</label>
                    <input type="text" id="edit-outlet-name" value="${outlet.name}" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Location</label>
                    <input type="text" id="edit-outlet-location" value="${outlet.location}" required class="w-full px-3 py-2 border rounded-lg">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Timings</label>
                <input type="text" id="edit-outlet-timings" value="${outlet.timings}" required class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Menu Items (comma-separated)</label>
                <textarea id="edit-outlet-menu" required rows="3" class="w-full px-3 py-2 border rounded-lg">${outlet.menu.join(', ')}</textarea>
            </div>
            <div class="flex justify-end gap-2 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Update</button>
            </div>
        </form>
    `);
}

async function updateOutlet(e, id) {
    e.preventDefault();
    const updates = {
        name: document.getElementById('edit-outlet-name').value,
        location: document.getElementById('edit-outlet-location').value,
        timings: document.getElementById('edit-outlet-timings').value,
        menu: document.getElementById('edit-outlet-menu').value.split(',').map(item => item.trim())
    };

    try {
        const outlets = await api.getOutlets();
        const outlet = outlets.find(o => o.id === id);
        const updated = { ...outlet, ...updates };
        await api.updateOutlet(id, updated);
        closeModal();
        renderOutlets();
        alert('Outlet updated successfully!');
    } catch (error) {
        alert('Failed to update outlet: ' + error.message);
    }
}

async function deleteOutlet(id) {
    if (!confirm('Are you sure you want to delete this outlet?')) return;

    try {
        await api.deleteOutlet(id);
        renderOutlets();
        alert('Outlet deleted successfully!');
    } catch (error) {
        alert('Failed to delete outlet: ' + error.message);
    }
}

// ==================== NOTICES MANAGEMENT ====================

async function renderAnnouncements() {
    const contentArea = document.getElementById('content-area');
    try {
        const notices = await api.getNotices();

        contentArea.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Notices Management</h2>
                <button onclick="showAddNoticeModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <span>+</span> Add Notice
                </button>
            </div>

            <div class="space-y-4">
                ${notices.length === 0 ? '<p class="text-slate-500 text-center py-8">No notices found</p>' : notices.map(notice => `
                    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-slate-800 dark:text-white">${notice.title}</h3>
                                <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">${notice.content}</p>
                                <p class="text-xs text-slate-400 mt-3">${notice.date || 'No date'}</p>
                            </div>
                            <button onclick="deleteNotice('${notice.id}')" class="text-rose-600 hover:text-rose-900 text-sm ml-4">Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">Error loading notices: ${error.message}</p>`;
    }
}

function showAddNoticeModal() {
    const modal = createModal('Add Notice', `
        <form onsubmit="addNotice(event)" class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Title</label>
                <input type="text" id="notice-title" required class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Content</label>
                <textarea id="notice-content" required rows="4" class="w-full px-3 py-2 border rounded-lg"></textarea>
            </div>
            <div class="flex justify-end gap-2 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add Notice</button>
            </div>
        </form>
    `);
}

async function addNotice(e) {
    e.preventDefault();
    const notice = {
        title: document.getElementById('notice-title').value,
        content: document.getElementById('notice-content').value,
        date: new Date().toLocaleDateString()
    };

    try {
        await api.createNotice(notice);
        closeModal();
        renderAnnouncements();
        alert('Notice added successfully!');
    } catch (error) {
        alert('Failed to add notice: ' + error.message);
    }
}

async function deleteNotice(id) {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
        await api.deleteNotice(id);
        renderAnnouncements();
        alert('Notice deleted successfully!');
    } catch (error) {
        alert('Failed to delete notice: ' + error.message);
    }
}

// ==================== UTILITY FUNCTIONS ====================

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.id = 'admin-modal';
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 class="text-xl font-bold text-slate-800 dark:text-white">${title}</h3>
                <button onclick="closeModal()" class="text-slate-400 hover:text-rose-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-6">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function closeModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.remove();
}

// Default View
renderStudents();

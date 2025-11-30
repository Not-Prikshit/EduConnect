// Student Dashboard Logic

const currentUser = checkAuth('student');
if (!currentUser) throw new Error("Unauthorized");

document.getElementById('student-name').textContent = currentUser.name;
document.getElementById('student-class').textContent = `${currentUser.year} | ${currentUser.enrollmentNo}`;

// Initialize Data if missing
if (!currentUser.timetable) currentUser.timetable = [];
if (!currentUser.todo) currentUser.todo = [];
// No need to saveUser immediately on load unless data was missing and we want to persist defaults.
// But currentUser is from localStorage (session), so we might want to sync with server if needed.
// For now, we'll rely on explicit saves.

// Render Functions
function renderOverview() {
    const contentArea = document.getElementById('content-area');
    const isEditing = false; // Will be toggled

    contentArea.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Student Profile</h2>
            <button onclick="toggleProfileEdit()" id="edit-profile-btn" class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                <span>✏️</span> Edit Profile
            </button>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 max-w-3xl">
            <div id="profile-view">
                <!-- Profile Picture -->
                <div class="flex justify-center mb-6">
                    <div class="relative">
                        <img src="${currentUser.profilePicture || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Crect fill=%22%236366f1%22 width=%22120%22 height=%22120%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2248%22 fill=%22white%22%3E${currentUser.name.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E'}" 
                             alt="Profile" 
                             class="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <label class="text-sm font-medium text-slate-500 dark:text-slate-400">Name</label>
                            <p class="text-lg font-semibold text-slate-800 dark:text-white">${currentUser.name}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-slate-500 dark:text-slate-400">Date of Birth</label>
                            <p class="text-lg font-semibold text-slate-800 dark:text-white">${currentUser.dob || 'Not provided'}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-slate-500 dark:text-slate-400">Course</label>
                            <p class="text-lg font-semibold text-slate-800 dark:text-white">${currentUser.course || 'Not provided'}</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="text-sm font-medium text-slate-500 dark:text-slate-400">Enrollment Number</label>
                            <p class="text-lg font-semibold text-slate-800 dark:text-white">${currentUser.enrollmentNo}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-slate-500 dark:text-slate-400">Batch</label>
                            <p class="text-lg font-semibold text-slate-800 dark:text-white">${currentUser.batch || 'Not provided'}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-slate-500 dark:text-slate-400">Year</label>
                            <p class="text-lg font-semibold text-slate-800 dark:text-white">${currentUser.year}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="profile-edit" class="hidden">
                <form onsubmit="saveProfile(event)" class="space-y-6">
                    <!-- Profile Picture Upload -->
                    <div class="flex flex-col items-center mb-6">
                        <div class="relative mb-4">
                            <img id="profile-preview" 
                                 src="${currentUser.profilePicture || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Crect fill=%22%236366f1%22 width=%22120%22 height=%22120%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2248%22 fill=%22white%22%3E${currentUser.name.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E'}" 
                                 alt="Profile Preview" 
                                 class="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg">
                        </div>
                        <label class="cursor-pointer bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">
                            <span>📷 Upload Photo</span>
                            <input type="file" id="profile-picture-input" accept="image/*" class="hidden" onchange="handleProfilePictureUpload(event)">
                        </label>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Max size: 2MB</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                            <input type="text" id="edit-name" value="${currentUser.name}" required class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                            <input type="date" id="edit-dob" value="${currentUser.dob || ''}" class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course</label>
                            <input type="text" id="edit-course" value="${currentUser.course || ''}" class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Batch</label>
                            <input type="text" id="edit-batch" value="${currentUser.batch || ''}" class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                        </div>
                    </div>
                    <div class="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button type="button" onclick="toggleProfileEdit()" class="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <h3 class="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">Recent Performance</h3>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${Object.entries(currentUser.marks || {}).length === 0 ?
            '<p class="text-slate-500 col-span-2 text-center py-4">No marks recorded yet</p>' :
            Object.entries(currentUser.marks).map(([subject, mark]) => `
                        <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <span class="font-medium text-slate-700 dark:text-slate-200">${subject}</span>
                            <span class="font-bold ${getMarkColor(mark)}">${mark}/100</span>
                        </div>
                    `).join('')}
            </div>
        </div>
    `;
}

function toggleProfileEdit() {
    const viewDiv = document.getElementById('profile-view');
    const editDiv = document.getElementById('profile-edit');
    const editBtn = document.getElementById('edit-profile-btn');

    if (viewDiv.classList.contains('hidden')) {
        viewDiv.classList.remove('hidden');
        editDiv.classList.add('hidden');
        editBtn.innerHTML = '<span>✏️</span> Edit Profile';
    } else {
        viewDiv.classList.add('hidden');
        editDiv.classList.remove('hidden');
        editBtn.innerHTML = '<span>👁️</span> View Profile';
    }
}

async function saveProfile(e) {
    e.preventDefault();

    currentUser.name = document.getElementById('edit-name').value;
    currentUser.dob = document.getElementById('edit-dob').value;
    currentUser.course = document.getElementById('edit-course').value;
    currentUser.batch = document.getElementById('edit-batch').value;
    // Profile picture is updated via handleProfilePictureUpload

    try {
        await api.updateStudent(currentUser.id, currentUser);
        localStorage.setItem('edu_current_user', JSON.stringify(currentUser));
        document.getElementById('student-name').textContent = currentUser.name;
        alert('Profile updated successfully!');
        renderOverview();
    } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile: ' + error.message);
    }
}

// Profile Picture Upload Handler
function handleProfilePictureUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Image = e.target.result;
        currentUser.profilePicture = base64Image;

        // Update preview
        document.getElementById('profile-preview').src = base64Image;
    };
    reader.readAsDataURL(file);
}

function renderTimetable() {
    const contentArea = document.getElementById('content-area');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    let html = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">My Timetable</h2>
        </div>

        <!-- Add Entry Form -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-8">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Add New Class</h3>
            <form onsubmit="addTimetableEntry(event)" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select id="tt-day" class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                    ${days.map(d => `<option value="${d}">${d}</option>`).join('')}
                </select>
                <input type="time" id="tt-time" required class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                <input type="text" id="tt-note" placeholder="Subject / Note" required class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">Add</button>
            </form>
        </div>

        <!-- Timetable Display -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${days.map(day => {
        const entries = currentUser.timetable.filter(e => e.day === day).sort((a, b) => a.time.localeCompare(b.time));
        if (entries.length === 0) return '';
        return `
                    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border-t-4 border-indigo-500">
                        <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4">${day}</h3>
                        <div class="space-y-3">
                            ${entries.map(entry => `
                                <div class="flex justify-between items-start p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg group">
                                    <div>
                                        <span class="block text-xs font-bold text-indigo-500 uppercase tracking-wide">${formatTime(entry.time)}</span>
                                        <span class="text-slate-700 dark:text-slate-200 font-medium">${entry.note}</span>
                                    </div>
                                    <button onclick="deleteTimetableEntry('${entry.id}')" class="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
    contentArea.innerHTML = html;
}

function renderTodoList() {
    const contentArea = document.getElementById('content-area');

    // Group tasks by date
    const tasksByDate = {};
    currentUser.todo.forEach(task => {
        const date = task.date || 'No Date';
        if (!tasksByDate[date]) tasksByDate[date] = [];
        tasksByDate[date].push(task);
    });

    // Sort dates (No Date at the end, then chronological)
    const sortedDates = Object.keys(tasksByDate).sort((a, b) => {
        if (a === 'No Date') return 1;
        if (b === 'No Date') return -1;
        return new Date(a) - new Date(b);
    });

    let html = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">To-Do List</h2>
        </div>

        <!-- Add Task Form -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-8">
            <form onsubmit="addTodoItem(event)" class="flex flex-col md:flex-row gap-4">
                <input type="date" id="todo-date" required class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                <input type="text" id="todo-input" placeholder="What needs to be done?" required class="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">Add Task</button>
            </form>
        </div>

        <!-- Tasks List -->
        <div class="space-y-6">
            ${currentUser.todo.length === 0 ?
            `<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 text-center text-slate-400">No tasks yet. Enjoy your day! 🎉</div>` :
            sortedDates.map(date => `
                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <div class="bg-slate-50 dark:bg-slate-700/50 px-6 py-3 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200">
                        ${date === 'No Date' ? 'Unscheduled' : new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <ul class="divide-y divide-slate-100 dark:divide-slate-700">
                        ${tasksByDate[date].map(task => `
                            <li class="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <button onclick="toggleTodoItem('${task.id}')" class="flex-shrink-0 w-6 h-6 rounded-full border-2 ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-500'} flex items-center justify-center transition-colors">
                                    ${task.completed ? '<span class="text-white text-xs">✓</span>' : ''}
                                </button>
                                <span class="flex-1 text-lg ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}">${task.text}</span>
                                <button onclick="deleteTodoItem('${task.id}')" class="text-slate-400 hover:text-rose-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    `;
    contentArea.innerHTML = html;
}

async function renderOutlets() {
    const contentArea = document.getElementById('content-area');
    try {
        const outlets = await api.getOutlets();

        contentArea.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Campus Outlets</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${outlets.length === 0 ?
                `<div class="col-span-full text-center p-8 text-slate-500">No outlets found.</div>` :
                outlets.map(outlet => `
                    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border-l-4 border-orange-500 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-slate-800 dark:text-white">${outlet.name}</h3>
                                <p class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                    <span>📍</span> ${outlet.location}
                                </p>
                            </div>
                            <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                                ${outlet.timings}
                            </span>
                        </div>
                        
                        <div class="mt-4">
                            <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Menu Highlights</h4>
                            <div class="flex flex-wrap gap-2">
                                ${outlet.menu.map(item => `
                                    <span class="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-sm">
                                        ${item}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">Error loading outlets: ${error.message}</p>`;
    }
}

async function renderTeachers() {
    const contentArea = document.getElementById('content-area');
    try {
        const teachers = await api.getTeachers();

        let html = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">My Teachers</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${teachers.length === 0 ?
                `<div class="col-span-full text-center p-8 text-slate-500">No teacher information available.</div>` :
                teachers.map(teacher => `
                    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h3 class="text-lg font-bold text-slate-800 dark:text-white">${teacher.name}</h3>
                                <p class="text-sm text-indigo-600 font-medium">${teacher.subject}</p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl">
                                👨‍🏫
                            </div>
                        </div>
                        
                        <div class="space-y-3 text-sm">
                            <div class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <span class="w-5 text-center">🏢</span>
                                <span>Cubicle: <span class="font-semibold text-slate-800 dark:text-white">${teacher.cubicle || 'N/A'}</span></span>
                            </div>
                            
                            <div class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <span class="w-5 text-center">📞</span>
                                <span>
                                    ${teacher.isContactHidden ?
                        '<span class="text-slate-400 italic">Contact Hidden</span>' :
                        `<a href="tel:${teacher.contact}" class="text-emerald-600 hover:underline font-medium">${teacher.contact || 'N/A'}</a>`
                    }
                                </span>
                            </div>

                            <div class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <span class="w-5 text-center">📧</span>
                                <a href="mailto:${teacher.id}" class="text-indigo-600 hover:underline truncate" title="${teacher.id}">${teacher.id}</a>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                        <button onclick="viewTeacherSlots('${teacher.id}', '${teacher.name}')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                            <span>🕐</span> View Free Slots
                        </button>
                        <button onclick="bookSlot('${teacher.id}', '${teacher.name}')" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                            <span>📅</span> Book Slot
                        </button>
                    </div>
                </div>
                `).join('')}
            </div>
        `;
        contentArea.innerHTML = html;
    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">Error loading teachers: ${error.message}</p>`;
    }
}

// Logic Functions
async function addTimetableEntry(e) {
    e.preventDefault();
    const day = document.getElementById('tt-day').value;
    const time = document.getElementById('tt-time').value;
    const note = document.getElementById('tt-note').value;

    const entry = {
        id: Date.now().toString(),
        day,
        time,
        note
    };

    currentUser.timetable.push(entry);
    await saveUser();
    renderTimetable();
}

async function deleteTimetableEntry(id) {
    currentUser.timetable = currentUser.timetable.filter(e => e.id !== id);
    await saveUser();
    renderTimetable();
}

async function addTodoItem(e) {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');
    const text = input.value;
    const date = dateInput.value;

    const task = {
        id: Date.now().toString(),
        text,
        date,
        completed: false
    };

    currentUser.todo.unshift(task);
    await saveUser();
    renderTodoList();
    input.value = ''; // Clear input
    input.focus();
}

async function toggleTodoItem(id) {
    const task = currentUser.todo.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        await saveUser();
        renderTodoList();
    }
}

async function deleteTodoItem(id) {
    currentUser.todo = currentUser.todo.filter(t => t.id !== id);
    await saveUser();
    renderTodoList();
}

async function saveUser() {
    // Update current user in session
    localStorage.setItem('edu_current_user', JSON.stringify(currentUser));

    // Update in backend
    try {
        await api.updateStudent(currentUser.id, currentUser);
    } catch (error) {
        console.error("Failed to save user data to server:", error);
        alert("Warning: Failed to save changes to server.");
    }
}

// Helpers
function calculateAverage(marks) {
    const values = Object.values(marks);
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round(sum / values.length);
}

function getMarkColor(mark) {
    if (mark >= 90) return 'text-emerald-500';
    if (mark >= 75) return 'text-indigo-500';
    if (mark >= 50) return 'text-yellow-500';
    return 'text-rose-500';
}

function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
}

// Booking Functions
function bookSlot(teacherId, teacherName) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('booking-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'booking-modal';
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 m-4 transform transition-all">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white">Book Appointment</h3>
                    <button onclick="closeBookingModal()" class="text-slate-400 hover:text-rose-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <form onsubmit="submitBooking(event)">
                    <input type="hidden" id="booking-teacher-id">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teacher</label>
                        <input type="text" id="booking-teacher-name" readonly class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-600 dark:text-slate-300 cursor-not-allowed">
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                        <input type="date" id="booking-date" required min="${new Date().toISOString().split('T')[0]}" class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                        <select id="booking-time" required class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                            <option value="">Select a time...</option>
                            <option value="09:00">09:00 AM - 10:00 AM</option>
                            <option value="10:00">10:00 AM - 11:00 AM</option>
                            <option value="11:00">11:00 AM - 12:00 PM</option>
                            <option value="12:00">12:00 PM - 01:00 PM</option>
                            <option value="14:00">02:00 PM - 03:00 PM</option>
                            <option value="15:00">03:00 PM - 04:00 PM</option>
                            <option value="16:00">04:00 PM - 05:00 PM</option>
                        </select>
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason</label>
                        <textarea id="booking-reason" required rows="3" placeholder="Briefly explain why you want to meet..." class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500"></textarea>
                    </div>
                    
                    <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Send Request
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Set values and show
    document.getElementById('booking-teacher-id').value = teacherId;
    document.getElementById('booking-teacher-name').value = teacherName;
    document.getElementById('booking-date').value = '';
    document.getElementById('booking-time').value = '';
    document.getElementById('booking-reason').value = '';

    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function submitBooking(e) {
    e.preventDefault();

    const teacherId = document.getElementById('booking-teacher-id').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const reason = document.getElementById('booking-reason').value;

    const meeting = {
        studentId: currentUser.id,
        studentName: currentUser.name,
        teacherId: teacherId,
        date: date,
        time: time,
        reason: reason,
        status: 'pending', // pending, approved, rejected
        createdAt: new Date().toISOString()
    };

    try {
        await api.createMeeting(meeting);
        closeBookingModal();
        alert('Booking request sent successfully! Wait for teacher approval.');
    } catch (error) {
        alert("Failed to create meeting request: " + error.message);
    }
}

// View Teacher Free Slots Function
async function viewTeacherSlots(teacherId, teacherName) {
    try {
        const teachers = await api.getTeachers();
        const teacher = teachers.find(t => t.id === teacherId);

        if (!teacher) {
            alert('Teacher not found');
            return;
        }

        const slots = teacher.availableSlots || [];

        // Create modal if it doesn't exist
        let modal = document.getElementById('slots-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'slots-modal';
            modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
            document.body.appendChild(modal);
        }

        // Group slots by day
        const slotsByDay = {};
        slots.forEach(slot => {
            if (!slotsByDay[slot.day]) slotsByDay[slot.day] = [];
            slotsByDay[slot.day].push(slot);
        });

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const orderedDays = days.filter(day => slotsByDay[day]);

        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 m-4 transform transition-all max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-white">${teacherName}'s Free Time Slots</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${teacher.subject}</p>
                    </div>
                    <button onclick="closeSlotsModal()" class="text-slate-400 hover:text-rose-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                ${slots.length === 0 ? `
                    <div class="text-center py-12">
                        <div class="text-6xl mb-4">📅</div>
                        <h4 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">No Available Slots</h4>
                        <p class="text-slate-500 dark:text-slate-400">This teacher hasn't set any free time slots yet.</p>
                    </div>
                ` : `
                    <div class="space-y-4">
                        ${orderedDays.map(day => `
                            <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                <h4 class="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-3">${day}</h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    ${slotsByDay[day].map(slot => `
                                        <div class="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                                            <div class="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                                <span class="text-emerald-500">🕐</span>
                                                <span class="font-medium">${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button onclick="bookSlot('${teacherId}', '${teacherName}'); closeSlotsModal();" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            📅 Book Appointment
                        </button>
                    </div>
                `}
            </div>
        `;

        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    } catch (error) {
        alert('Failed to load teacher slots: ' + error.message);
    }
}

function closeSlotsModal() {
    const modal = document.getElementById('slots-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// My Meeting Requests Functions
async function renderMyMeetings() {
    const contentArea = document.getElementById('content-area');
    try {
        const meetings = await api.getMeetings();
        const teachers = await api.getTeachers();

        // Filter meetings for current student
        const myMeetings = meetings.filter(m => m.studentId === currentUser.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Group meetings by status
        const pending = myMeetings.filter(m => m.status === 'pending');
        const approved = myMeetings.filter(m => m.status === 'approved');
        const rejected = myMeetings.filter(m => m.status === 'rejected');
        const rescheduled = myMeetings.filter(m => m.status === 'rescheduled');

        contentArea.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">My Meeting Requests</h2>
            </div>

            ${myMeetings.length === 0 ? `
                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-12 text-center">
                    <div class="text-6xl mb-4">📅</div>
                    <h3 class="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">No Meeting Requests Yet</h3>
                    <p class="text-slate-500 dark:text-slate-400">Visit the Teachers section to book a meeting with your teachers.</p>
                </div>
            ` : `
                <!-- Pending Meetings -->
                ${pending.length > 0 ? `
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <span>⏳</span> Pending Requests (${pending.length})
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${pending.map(meeting => renderMeetingCard(meeting, teachers)).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Approved Meetings -->
                ${approved.length > 0 ? `
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <span>✓</span> Approved Meetings (${approved.length})
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${approved.map(meeting => renderMeetingCard(meeting, teachers)).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Rescheduled Meetings -->
                ${rescheduled.length > 0 ? `
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <span>🕐</span> Rescheduled Requests (${rescheduled.length})
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${rescheduled.map(meeting => renderMeetingCard(meeting, teachers)).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Rejected Meetings -->
                ${rejected.length > 0 ? `
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <span>✕</span> Rejected Requests (${rejected.length})
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${rejected.map(meeting => renderMeetingCard(meeting, teachers)).join('')}
                        </div>
                    </div>
                ` : ''}
            `}
        `;
    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">Error loading meeting requests: ${error.message}</p>`;
    }
}

function renderMeetingCard(meeting, teachers) {
    const teacher = teachers.find(t => t.id === meeting.teacherId);
    const teacherName = teacher ? teacher.name : meeting.teacherId;

    return `
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border-l-4 ${getStatusBorderColor(meeting.status)} hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h4 class="text-lg font-bold text-slate-800 dark:text-white">${teacherName}</h4>
                    <p class="text-sm text-slate-500 dark:text-slate-400">${teacher ? teacher.subject : ''}</p>
                </div>
                ${getStatusBadge(meeting.status)}
            </div>
            
            <div class="space-y-2 text-sm mb-4">
                <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span>📅</span>
                    <span>${formatMeetingDate(meeting.date)}</span>
                </div>
                <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span>🕐</span>
                    <span>${formatTime(meeting.time)}</span>
                </div>
                <div class="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                    <span>💬</span>
                    <span class="flex-1">${meeting.reason}</span>
                </div>
                ${meeting.suggestedTime ? `
                    <div class="flex items-start gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg mt-2">
                        <span>🕐</span>
                        <span class="flex-1"><strong>Suggested Time:</strong> ${meeting.suggestedTime}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700">
                Requested on ${formatMeetingDate(meeting.createdAt)}
            </div>
        </div>
    `;
}

function getStatusBadge(status) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        rejected: 'bg-rose-100 text-rose-700 border-rose-200',
        rescheduled: 'bg-amber-100 text-amber-700 border-amber-200'
    };
    const icons = {
        pending: '⏳',
        approved: '✓',
        rejected: '✕',
        rescheduled: '🕐'
    };
    return `<span class="px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending} inline-flex items-center gap-1">
        ${icons[status] || ''} ${status.charAt(0).toUpperCase() + status.slice(1)}
    </span>`;
}

function getStatusBorderColor(status) {
    const colors = {
        pending: 'border-yellow-500',
        approved: 'border-emerald-500',
        rejected: 'border-rose-500',
        rescheduled: 'border-amber-500'
    };
    return colors[status] || colors.pending;
}

function formatMeetingDate(dateStr) {
    if (!dateStr) return 'Not specified';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Default View
renderOverview();

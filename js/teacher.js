// Teacher Dashboard Logic

const currentUser = checkAuth('teacher');
if (!currentUser) throw new Error("Unauthorized");

document.getElementById('teacher-name').textContent = currentUser.name;
document.getElementById('teacher-subject').textContent = currentUser.subject;

// Render Functions

function renderProfile() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">My Profile</h2>
        
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 max-w-2xl">
            <form onsubmit="updateProfile(event)" class="space-y-6">
                
                <!-- Personal Details -->
                <div>
                    <h3 class="text-lg font-semibold text-indigo-600 mb-4">Personal Details</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                            <input type="text" id="p-name" value="${currentUser.name}" required class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                            <input type="text" id="p-dept" value="${currentUser.department}" readonly class="w-full bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg px-4 py-2 text-slate-500 dark:text-slate-400 cursor-not-allowed">
                        </div>
                    </div>
                </div>

                <!-- Contact Info -->
                <div>
                    <h3 class="text-lg font-semibold text-indigo-600 mb-4">Contact Information</h3>
                    
                    <div class="space-y-4">
                        <!-- Email -->
                        <div class="flex items-start gap-4">
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email ID</label>
                                <input type="email" id="p-email" value="${currentUser.id}" readonly class="w-full bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg px-4 py-2 text-slate-500 dark:text-slate-400 cursor-not-allowed">
                            </div>
                            <div class="pt-7">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" id="p-hide-email" ${currentUser.isEmailHidden ? 'checked' : ''} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500">
                                    <span class="text-sm text-slate-600 dark:text-slate-300">Hide from students</span>
                                </label>
                            </div>
                        </div>

                        <!-- Contact Number -->
                        <div class="flex items-start gap-4">
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Number</label>
                                <input type="tel" id="p-contact" value="${currentUser.contact}" placeholder="+91 XXXXXXXXXX" class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                            </div>
                            <div class="pt-7">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" id="p-hide-contact" ${currentUser.isContactHidden ? 'checked' : ''} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500">
                                    <span class="text-sm text-slate-600 dark:text-slate-300">Hide from students</span>
                                </label>
                            </div>
                        </div>

                        <!-- Cubicle -->
                        <div class="flex items-start gap-4">
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cubicle Number</label>
                                <input type="text" id="p-cubicle" value="${currentUser.cubicle}" placeholder="e.g. EB-301" class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                            </div>
                            <div class="pt-7">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" id="p-hide-cubicle" ${currentUser.isCubicleHidden ? 'checked' : ''} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500">
                                    <span class="text-sm text-slate-600 dark:text-slate-300">Hide from students</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    `;
}

async function renderClubs() {
    const contentArea = document.getElementById('content-area');
    try {
        const clubs = await api.getClubs();

        contentArea.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">School Clubs</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${clubs.length === 0 ?
                `<div class="col-span-full text-center p-8 text-slate-500">No clubs found.</div>` :
                clubs.map(club => `
                    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-full">
                        <div class="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <span class="text-4xl">🎩</span>
                        </div>
                        <div class="p-6 flex flex-col flex-1">
                            <h3 class="text-xl font-bold mb-2 text-slate-800 dark:text-white">${club.name}</h3>
                            <p class="text-slate-500 dark:text-slate-400 text-sm mb-4 flex-1">${club.description}</p>
                            
                            <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-slate-500 dark:text-slate-400">👑 ${club.president}</span>
                                    <span class="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">${club.members.length} Members</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">Error loading clubs: ${error.message}</p>`;
    }
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

async function renderMeetingRequests() {
    const contentArea = document.getElementById('content-area');
    try {
        const meetings = await api.getMeetings();
        const myMeetings = meetings.filter(m => m.teacherId === currentUser.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        contentArea.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Meeting Requests</h2>
            </div>

            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
                ${myMeetings.length === 0 ?
                `<div class="p-8 text-center text-slate-500">No meeting requests found.</div>` :
                `<div class="divide-y divide-slate-100 dark:divide-slate-700">
                    ${myMeetings.map(meeting => `
                        <div class="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <span class="font-bold text-slate-800 dark:text-white text-lg">${meeting.studentName}</span>
                                        <span class="text-sm text-slate-500 dark:text-slate-400">(${meeting.studentId})</span>
                                        ${getStatusBadge(meeting.status)}
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <p class="flex items-center gap-2"><span>📅</span> ${meeting.requestedDate}</p>
                                        <p class="flex items-center gap-2"><span>⏰</span> ${meeting.requestedTime}</p>
                                    </div>
                                    <p class="mt-3 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                        "${meeting.reason}"
                                    </p>
                                    ${meeting.suggestedTime ? `
                                        <p class="mt-2 text-sm text-amber-600 dark:text-amber-400">
                                            <span class="font-semibold">Suggested Time:</span> ${meeting.suggestedTime}
                                        </p>
                                    ` : ''}
                                </div>
                                
                                ${meeting.status === 'pending' ? `
                                    <div class="flex flex-col gap-2 shrink-0">
                                        <button onclick="updateMeetingStatus('${meeting.id}', 'approved')" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center">
                                            <span>✓</span> Approve
                                        </button>
                                        <button onclick="suggestNewTime('${meeting.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center">
                                            <span>🕐</span> Suggest Time
                                        </button>
                                        <button onclick="updateMeetingStatus('${meeting.id}', 'rejected')" class="bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center">
                                            <span>✕</span> Reject
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>`
            }
            </div>
        `;
    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">Error loading meeting requests: ${error.message}</p>`;
    }
}

async function renderTimeSlots() {
    const contentArea = document.getElementById('content-area');
    if (!currentUser.availableSlots) currentUser.availableSlots = [];

    contentArea.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Meeting Time Slots</h2>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Add Available Time Slot</h3>
            <form onsubmit="addTimeSlot(event)" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select id="slot-day" required class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                </select>
                <input type="time" id="slot-start" required class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                <input type="time" id="slot-end" required class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-indigo-500">
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">Add Slot</button>
            </form>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${currentUser.availableSlots.length === 0 ?
            '<p class="col-span-full text-center text-slate-500 py-8">No time slots configured. Students cannot request meetings until you add available slots.</p>' :
            currentUser.availableSlots.map(slot => `
                    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border-l-4 border-indigo-500">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-bold text-slate-800 dark:text-white">${slot.day}</p>
                                <p class="text-sm text-slate-600 dark:text-slate-300">${slot.startTime} - ${slot.endTime}</p>
                            </div>
                            <button onclick="deleteTimeSlot('${slot.id}')" class="text-rose-500 hover:text-rose-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
        </div>
    `;
}

// Logic Functions

async function updateProfile(e) {
    e.preventDefault();

    const name = document.getElementById('p-name').value;
    const contact = document.getElementById('p-contact').value;
    const cubicle = document.getElementById('p-cubicle').value;

    const isEmailHidden = document.getElementById('p-hide-email').checked;
    const isContactHidden = document.getElementById('p-hide-contact').checked;
    const isCubicleHidden = document.getElementById('p-hide-cubicle').checked;

    // Update local object
    currentUser.name = name;
    currentUser.contact = contact;
    currentUser.cubicle = cubicle;
    currentUser.isEmailHidden = isEmailHidden;
    currentUser.isContactHidden = isContactHidden;
    currentUser.isCubicleHidden = isCubicleHidden;

    try {
        // Update backend
        await api.updateTeacher(currentUser.id, currentUser);

        // Update session
        localStorage.setItem('edu_current_user', JSON.stringify(currentUser));

        // Update UI
        document.getElementById('teacher-name').textContent = currentUser.name;
        alert("Profile updated successfully!");
    } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile: " + error.message);
    }
}

async function updateMeetingStatus(meetingId, status) {
    try {
        const meetings = await api.getMeetings();
        const meeting = meetings.find(m => m.id === meetingId);
        if (meeting) {
            meeting.status = status;
            await api.updateMeeting(meetingId, meeting);
            renderMeetingRequests();
        }
    } catch (error) {
        alert("Failed to update meeting status: " + error.message);
    }
}

async function suggestNewTime(meetingId) {
    const suggestedTime = prompt("Suggest a new time (e.g., 'Monday 3:00 PM' or 'Tomorrow at 10:00 AM'):");
    if (suggestedTime) {
        try {
            const meetings = await api.getMeetings();
            const meeting = meetings.find(m => m.id === meetingId);
            if (meeting) {
                meeting.status = 'rescheduled';
                meeting.suggestedTime = suggestedTime;
                await api.updateMeeting(meetingId, meeting);
                renderMeetingRequests();
            }
        } catch (error) {
            alert("Failed to suggest new time: " + error.message);
        }
    }
}

async function addTimeSlot(e) {
    e.preventDefault();

    const day = document.getElementById('slot-day').value;
    const startTime = document.getElementById('slot-start').value;
    const endTime = document.getElementById('slot-end').value;

    const slot = {
        id: Date.now().toString(),
        day,
        startTime,
        endTime
    };

    if (!currentUser.availableSlots) currentUser.availableSlots = [];
    currentUser.availableSlots.push(slot);

    try {
        await api.updateTeacher(currentUser.id, currentUser);
        localStorage.setItem('edu_current_user', JSON.stringify(currentUser));
        renderTimeSlots();
    } catch (error) {
        alert("Failed to add time slot: " + error.message);
    }
}

async function deleteTimeSlot(slotId) {
    if (!confirm('Are you sure you want to delete this time slot?')) return;

    currentUser.availableSlots = currentUser.availableSlots.filter(s => s.id !== slotId);

    try {
        await api.updateTeacher(currentUser.id, currentUser);
        localStorage.setItem('edu_current_user', JSON.stringify(currentUser));
        renderTimeSlots();
    } catch (error) {
        alert("Failed to delete time slot: " + error.message);
    }
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
    return `<span class="px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending} flex items-center gap-1">
        ${icons[status] || ''} ${status.charAt(0).toUpperCase() + status.slice(1)}
    </span>`;
}

// Default View
renderProfile();

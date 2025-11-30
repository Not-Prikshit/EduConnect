const API_BASE_URL = 'http://localhost:5000/api';

const api = {
    async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || result.error || 'API Error');
            }
            return result;
        } catch (error) {
            console.error('API Request Failed:', error);
            // Check if it's a network error (e.g., backend not running)
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                alert("Connection Error: Backend server is not running or unreachable. Please start the Python server.");
            }
            throw error;
        }
    },

    // Auth
    async login(role, id, name) {
        return this.request('/auth/login', 'POST', { role, id, name });
    },
    async signup(role, data) {
        return this.request('/auth/signup', 'POST', { role, ...data });
    },

    // Students
    async getStudents() {
        return this.request('/students');
    },
    async createStudent(data) {
        return this.request('/students', 'POST', data);
    },
    async updateStudent(id, data) {
        return this.request(`/students/${id}`, 'PUT', data);
    },
    async deleteStudent(id) {
        return this.request(`/students/${id}`, 'DELETE');
    },

    // Teachers
    async getTeachers() {
        return this.request('/teachers');
    },
    async createTeacher(data) {
        return this.request('/teachers', 'POST', data);
    },
    async updateTeacher(id, data) {
        return this.request(`/teachers/${id}`, 'PUT', data);
    },
    async deleteTeacher(id) {
        return this.request(`/teachers/${id}`, 'DELETE');
    },

    // Clubs
    async getClubs() {
        return this.request('/clubs');
    },
    async createClub(data) {
        return this.request('/clubs', 'POST', data);
    },
    async deleteClub(id) {
        return this.request(`/clubs/${id}`, 'DELETE');
    },

    // Notices
    async getNotices() {
        return this.request('/notices');
    },
    async createNotice(data) {
        return this.request('/notices', 'POST', data);
    },
    async deleteNotice(id) {
        return this.request(`/notices/${id}`, 'DELETE');
    },

    // Bookings
    async getBookings() {
        return this.request('/bookings');
    },
    async createBooking(data) {
        return this.request('/bookings', 'POST', data);
    },
    async updateBooking(id, data) {
        return this.request(`/bookings/${id}`, 'PUT', data);
    },

    // Outlets
    async getOutlets() {
        return this.request('/outlets');
    },
    async createOutlet(data) {
        return this.request('/outlets', 'POST', data);
    },
    async updateOutlet(id, data) {
        return this.request(`/outlets/${id}`, 'PUT', data);
    },
    async deleteOutlet(id) {
        return this.request(`/outlets/${id}`, 'DELETE');
    },

    // Meetings
    async getMeetings() {
        return this.request('/meetings');
    },
    async createMeeting(data) {
        return this.request('/meetings', 'POST', data);
    },
    async updateMeeting(id, data) {
        return this.request(`/meetings/${id}`, 'PUT', data);
    },
    async deleteMeeting(id) {
        return this.request(`/meetings/${id}`, 'DELETE');
    },

    // Enhanced Club operations
    async updateClub(id, data) {
        return this.request(`/clubs/${id}`, 'PUT', data);
    }
};

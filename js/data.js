// Dummy Data Initialization
const INITIAL_DATA = {
    admin: {
        id: "EDU_ADMIN_SECRET_2025",
        name: "Super Admin"
    },
    students: [
        {
            id: "S25CSEU1590@bennett.edu.in",
            enrollmentNo: "S25CSEU1590",
            name: "Rohan Sharma",
            year: "3rd Year",
            email: "S25CSEU1590@bennett.edu.in",
            marks: { Math: 90, Science: 88 },
            clubs: ["Robotics"]
        },
        {
            id: "S25CSEU1591@bennett.edu.in",
            enrollmentNo: "S25CSEU1591",
            name: "Priya Patel",
            year: "2nd Year",
            email: "S25CSEU1591@bennett.edu.in",
            marks: { Math: 95, Science: 91 },
            clubs: ["Debate"]
        }
    ],
    teachers: [
        {
            id: "JASHWANT@bennett.edu.in",
            name: "Mr. Jashwant",
            subject: "Mathematics",
            cubicle: "C-101",
            contact: "9876543210",
            isContactHidden: false,
            department: "Science",
            classes: ["3rd Year", "2nd Year"]
        },
        {
            id: "ANJALI@bennett.edu.in",
            name: "Ms. Anjali",
            subject: "Physics",
            cubicle: "C-102",
            contact: "9876543211",
            isContactHidden: true,
            department: "Science",
            classes: ["2nd Year"]
        }
    ],
    clubs: [
        { id: "C001", name: "Robotics Club", president: "Rohan Sharma", members: ["S25CSEU1590@bennett.edu.in"], description: "Building the future.", meeting: "Friday 3PM" },
        { id: "C002", name: "Debate Club", president: "Priya Patel", members: ["S25CSEU1591@bennett.edu.in"], description: "Voice your opinion.", meeting: "Saturday 10AM" }
    ],
    notices: [
        { id: "N001", title: "Mid-Term Exams", date: "2025-11-25", content: "Mid-term exams start from next Monday.", type: "urgent" },
        { id: "N002", title: "Annual Sports Day", date: "2025-12-10", content: "Register for sports events by Friday.", type: "event" }
    ],
    bookings: []
};

function initializeData() {
    // Always re-initialize for this update to ensure data format is correct
    // In a real app, we'd migrate data. Here we'll just overwrite if the format looks old or just force it for the user's request.
    // Let's force update for this session to ensure the new format is used.
    localStorage.setItem('edu_students', JSON.stringify(INITIAL_DATA.students));
    localStorage.setItem('edu_teachers', JSON.stringify(INITIAL_DATA.teachers));
    localStorage.setItem('edu_clubs', JSON.stringify(INITIAL_DATA.clubs));
    localStorage.setItem('edu_notices', JSON.stringify(INITIAL_DATA.notices));
    if (!localStorage.getItem('edu_bookings')) {
        localStorage.setItem('edu_bookings', JSON.stringify(INITIAL_DATA.bookings));
    }
    localStorage.setItem('edu_data_initialized', 'true');
    localStorage.setItem('edu_data_initialized', 'true');
    console.log("EduConnect Data Re-Initialized with New Format");
}

initializeData();

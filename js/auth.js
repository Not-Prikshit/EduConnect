// Authentication Logic

const ADMIN_SECRET = "Bennett_Pioneers_2025_Project";

async function loginAdmin(secretId, name) {
    try {
        const result = await api.login('admin', secretId, name);
        if (result.success) {
            localStorage.setItem('edu_current_user', JSON.stringify(result.user));
            return { success: true, redirect: 'admin-dashboard.html' };
        }
        return { success: false, message: result.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function loginTeacher(id, name) {
    try {
        const result = await api.login('teacher', id, name);
        if (result.success) {
            localStorage.setItem('edu_current_user', JSON.stringify(result.user));
            return { success: true, redirect: 'teacher-dashboard.html' };
        }
        return { success: false, message: result.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function signupTeacher(name, id, subject) {
    try {
        const result = await api.signup('teacher', { name, id, subject });
        if (result.success) {
            localStorage.setItem('edu_current_user', JSON.stringify(result.user));
            return { success: true, redirect: 'teacher-dashboard.html', message: "Account created successfully!" };
        }
        return { success: false, message: result.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function loginStudent(id, name) {
    try {
        const result = await api.login('student', id, name);
        if (result.success) {
            localStorage.setItem('edu_current_user', JSON.stringify(result.user));
            return { success: true, redirect: 'student-dashboard.html' };
        }
        return { success: false, message: result.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function signupStudent(name, id, year) {
    try {
        const result = await api.signup('student', { name, id, year });
        if (result.success) {
            localStorage.setItem('edu_current_user', JSON.stringify(result.user));
            return { success: true, redirect: 'student-dashboard.html', message: "Account created successfully!" };
        }
        return { success: false, message: result.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function logout() {
    localStorage.removeItem('edu_current_user');
    window.location.href = 'index.html';
}

function checkAuth(requiredRole) {
    const user = JSON.parse(localStorage.getItem('edu_current_user'));
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    if (requiredRole && user.role !== requiredRole) {
        alert("Unauthorized Access");
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// Microsoft OAuth Login
async function loginWithMicrosoft(role) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/microsoft/login?role=${role}`);
        const data = await response.json();

        if (data.auth_url) {
            // Redirect to Microsoft login
            window.location.href = data.auth_url;
        } else {
            throw new Error('Failed to get authorization URL');
        }
    } catch (error) {
        console.error('Microsoft login error:', error);
        return { success: false, message: 'Failed to initiate Microsoft login. Please try again.' };
    }
}

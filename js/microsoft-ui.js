// Microsoft Sign-In UI Enhancement
// This script adds Microsoft Sign-In buttons to the login forms

// Store the original renderForm function
let originalRenderForm = null;

// Wait for page to load
document.addEventListener('DOMContentLoaded', function () {
    // Hook into renderForm after a short delay to ensure it's defined
    setTimeout(function () {
        if (typeof window.renderForm === 'function') {
            originalRenderForm = window.renderForm;
            window.renderForm = function () {
                originalRenderForm();
                setTimeout(addMicrosoftButtons, 100);
            };
        }
    }, 100);
});

function addMicrosoftButtons() {
    // Find all submit buttons in forms
    const submitButtons = document.querySelectorAll('form button[type="submit"]');

    submitButtons.forEach(button => {
        const form = button.closest('form');
        if (!form) return;

        // Check if Microsoft button already exists
        if (form.querySelector('.microsoft-signin-btn')) return;

        // Determine role from form
        let role = 'student';
        if (form.onsubmit) {
            const onsubmitStr = form.onsubmit.toString();
            if (onsubmitStr.includes('Teacher')) role = 'teacher';
            if (onsubmitStr.includes('Admin')) return; // Skip admin forms
        }

        // Create divider
        const divider = document.createElement('div');
        divider.className = 'relative my-6';
        divider.innerHTML = `
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-slate-800/50 text-slate-400">OR</span>
            </div>
        `;

        // Create Microsoft button
        const msButton = document.createElement('button');
        msButton.type = 'button';
        msButton.className = 'microsoft-signin-btn w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-3';
        msButton.onclick = () => loginWithMicrosoft(role);
        msButton.innerHTML = `
            <svg class="w-5 h-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h11v11H0z" fill="#f25022"/>
                <path d="M12 0h11v11H12z" fill="#00a4ef"/>
                <path d="M0 12h11v11H0z" fill="#7fba00"/>
                <path d="M12 12h11v11H12z" fill="#ffb900"/>
            </svg>
            Sign in with Microsoft
        `;

        // Insert after submit button
        button.insertAdjacentElement('afterend', divider);
        divider.insertAdjacentElement('afterend', msButton);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Constants for API URLs
    const API_URL = 'http://localhost:3000';
    
    // Grab elements
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    const addRecordForm = document.getElementById('add-record-form');

    // Check if elements exist before attaching event listeners
    if (loginBtn && signupBtn && loginForm && signupForm) {
        // Toggle between login and signup forms
        loginBtn.addEventListener('click', () => {
            loginBtn.classList.add('active');
            signupBtn.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        });

        signupBtn.addEventListener('click', () => {
            signupBtn.classList.add('active');
            loginBtn.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        });

        // Switch to signup form from login form
        if (switchToSignup) {
            switchToSignup.addEventListener('click', () => {
                signupBtn.classList.add('active');
                loginBtn.classList.remove('active');
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
            });
        }

        // Switch to login form from signup form
        if (switchToLogin) {
            switchToLogin.addEventListener('click', () => {
                loginBtn.classList.add('active');
                signupBtn.classList.remove('active');
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            });
        }

        // Handle login form submission
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = document.getElementById('userid').value;
            const password = document.getElementById('password').value;

            fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Login failed. Please check your credentials.");
                }
                return response.json();
            })
            .then(data => {
                if (data.message === 'Login successful') {
                    localStorage.setItem('uniqueId', data.uniqueId);
                    console.log('User Unique ID:', data.uniqueId);
                    window.location.href = data.redirectUrl;
                } else {
                    alert("Login failed. Please check your credentials.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred while logging in. Please try again later.");
            });
        });

        // Handle signup form submission
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const fullName = document.getElementById('username').value;
            const mobile = document.getElementById('mobile').value;
            const password = document.getElementById('new-password').value;

            fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: fullName, mobile, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'User signed up successfully') {
                    alert(data.message);
                    loginBtn.classList.add('active');
                    signupBtn.classList.remove('active');
                    loginForm.classList.add('active');
                    signupForm.classList.remove('active');
                } else {
                    alert("Signup failed. " + (data.message || ""));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred while signing up. Please try again later.");
            });
        });
    }

    // Handle add record form submission
    if (addRecordForm) {
        addRecordForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const disease = document.getElementById('disease').value;
            const doctor = document.getElementById('doctor').value;
            const medicine = document.getElementById('medicine').value;
            const date = document.getElementById('date').value;
            const uniqueId = localStorage.getItem('uniqueId');

            if (!uniqueId) {
                alert("User ID not found. Please log in again.");
                return;
            }

            const recordData = { id: uniqueId, disease, doctor, medicine, date };

            fetch(`${API_URL}/addrecord`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recordData)
            })
            .then(response => {
                if (!response.ok) throw new Error('Error adding record');
                return response.json();
            })
            .then(data => {
                if (data.message === 'Record added successfully') {
                    alert(data.message);
                    addRecordForm.reset();
                    window.location.href = data.redirectUrl;
                } else {
                    alert("Failed to add record: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred. Please try again.");
            });
        });
    }
});

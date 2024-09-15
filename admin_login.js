// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBky1m8XmelB3hFAy7MZ6aIe7BMn4AuGJE",
    authDomain: "ztna-238e7.firebaseapp.com",
    projectId: "ztna-238e7",
    storageBucket: "ztna-238e7.appspot.com",
    messagingSenderId: "89728704566",
    appId: "1:89728704566:web:03d989166154a0817db897"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', (event) => {
    const loginForm = document.getElementById('adminLoginForm');
    const messageElement = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Handle login logic
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Successfully logged in
                    const user = userCredential.user;

                    // Check if the user is an admin
                    firebase.database().ref('users/' + user.uid).once('value')
                        .then((snapshot) => {
                            const userData = snapshot.val();
                            if (userData && userData.admin) {
                                messageElement.textContent = "Login successful! Welcome, Admin.";
                                // Redirect to admin dashboard or another page
                                window.location.href = 'admin_dashboard.html';
                            } else {
                                firebase.auth().signOut();
                                messageElement.textContent = "You are not authorized as an admin.";
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching user data:", error);
                            messageElement.textContent = "Error fetching user data.";
                        });
                })
                .catch((error) => {
                    console.error("Error signing in:", error);
                    messageElement.textContent = "Invalid email or password.";
                });
        });
    } else {
        console.error('Form with id "adminLoginForm" not found.');
    }
});

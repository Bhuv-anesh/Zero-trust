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

// Session timeout in milliseconds (e.g., 30 minutes)
const SESSION_TIMEOUT =  1* 60 * 1000;

// Start the session timer
function startSessionTimer() {
    setTimeout(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            const email = user.email;
            const userId = normalizeEmail(email);

            firebase.auth().signOut().then(() => {
                firebase.database().ref('users/' + userId).update({
                    approved: false
                }).then(() => {
                    document.getElementById('message').textContent = "Session timed out. You have been signed out and your approval has been removed.";
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                }).catch((error) => {
                    console.error("Error removing approval status:", error);
                    document.getElementById('message').textContent = "Error removing approval status: " + error.message;
                });
            }).catch((error) => {
                console.error("Error signing out:", error);
                document.getElementById('message').textContent = "Error signing out: " + error.message;
            });
        }
    }, SESSION_TIMEOUT);
}

// Normalize email function
function normalizeEmail(email) {
    return email.replace(/\./g, ',');
}

// Logout button event listener
document.getElementById('signOutButton').addEventListener('click', function() {
    const user = firebase.auth().currentUser;
    if (user) {
        const email = user.email;
        const userId = normalizeEmail(email);

        firebase.auth().signOut().then(() => {
            firebase.database().ref('users/' + userId).update({
                approved: false
            }).then(() => {
                document.getElementById('message').textContent = "You have been signed out and your approval has been removed.";
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }).catch((error) => {
                console.error("Error removing approval status:", error);
                document.getElementById('message').textContent = "Error removing approval status: " + error.message;
            });
        }).catch((error) => {
            console.error("Error signing out:", error);
            document.getElementById('message').textContent = "Error signing out: " + error.message;
        });
    }
});

// Start the session timer when the page loads
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        startSessionTimer();
    }
});

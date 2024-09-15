const firebaseConfig = {
    apiKey: "AIzaSyBky1m8XmelB3hFAy7MZ6aIe7BMn4AuGJE",
    authDomain: "ztna-238e7.firebaseapp.com",
    projectId: "ztna-238e7",
    storageBucket: "ztna-238e7.appspot.com",
    messagingSenderId: "89728704566",
    appId: "1:89728704566:web:03d989166154a0817db897"
};
firebase.initializeApp(firebaseConfig);

// Initialize EmailJS
emailjs.init("X65VUdXpdzeIYmgHV");

function normalizeEmail(email) {
    return email.replace(/\./g, ',');
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const userId = normalizeEmail(email);
            firebase.database().ref('users/' + userId).once('value')
                .then((snapshot) => {
                    const userData = snapshot.val();
                    if (userData && userData.approved) {
                        // Redirect to home.html if the user is approved
                        window.location.href = 'employee dash.html';
                    } else {
                        sendLoginNotification(email); // Always send login notification

                        if (snapshot.exists()) {
                            firebase.database().ref('users/' + userId).update({
                                approved: false
                            });
                        } else {
                            firebase.database().ref('users/' + userId).set({
                                approved: false
                            });
                        }

                        firebase.auth().signOut(); // Sign out the user after login attempt to await approval
                        document.getElementById('message').textContent = "Login attempt recorded. Please wait for approval.";
                    }
                })
                .catch((error) => {
                    console.error("Error checking user approval:", error);
                    document.getElementById('message').textContent = "Error checking approval status.";
                });
        })
        .catch((error) => {
            console.error("Authentication error:", error);
            document.getElementById('message').textContent = "Invalid email or password.";
        });
});

function sendLoginNotification(email) {
    const token = Math.random().toString(36).substr(2, 9);
    firebase.database().ref('approval_tokens/' + token).set({
        email: email,
        timestamp: Date.now()
    }).then(() => {
        const approvalLink = `http://127.0.0.1:5501/approval.html?token=${token}`;
        emailjs.send("service_mbvt1of", "template_ftvrg6g", {
            to_email: "admin@yourcompany.com",
            user_email: email,
            approval_link: approvalLink
        }).then(
            function(response) {
                console.log("Email sent successfully", response);
            },
            function(error) {
                console.log("Failed to send email", error);
            }
        );
    }).catch((error) => {
        console.error("Error saving token:", error);
    });
}

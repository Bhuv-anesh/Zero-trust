const firebaseConfig = {
    apiKey: "AIzaSyBky1m8XmelB3hFAy7MZ6aIe7BMn4AuGJE",
    authDomain: "ztna-238e7.firebaseapp.com",
    projectId: "ztna-238e7",
    storageBucket: "ztna-238e7.appspot.com",
    messagingSenderId: "89728704566",
    appId: "1:89728704566:web:03d989166154a0817db897"
};
firebase.initializeApp(firebaseConfig);

// Get token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

const userInfoElement = document.getElementById('userInfo');
const approveButton = document.getElementById('approveButton');
const messageElement = document.getElementById('message');

if (token) {
    checkToken(token);
} else {
    messageElement.textContent = "Invalid approval link.";
}

function checkToken(token) {
    firebase.database().ref('approval_tokens/' + token).once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                userInfoElement.textContent = `User to approve: ${data.email}`;
                approveButton.style.display = 'block';
                approveButton.onclick = () => approveUser(token, data.email);
            } else {
                messageElement.textContent = "Invalid or expired approval token.";
            }
        })
        .catch((error) => {
            console.error("Error checking token:", error);
            messageElement.textContent = "Error checking approval token: " + error.message;
        });
}

function approveUser(token, email) {
    const userId = normalizeEmail(email);
    firebase.database().ref('users/' + userId).update({
        approved: true
    }).then(() => {
        messageElement.textContent = "User approved successfully!";
        approveButton.style.display = 'none';
        // Remove the used token
        firebase.database().ref('approval_tokens/' + token).remove();
        
        // Redirect to home.html after a short delay
        setTimeout(() => {
           // window.location.href = 'home.html';
        }, 2000); // 2 seconds delay for user to see the success message
    }).catch((error) => {
        console.error("Error approving user:", error);
        messageElement.textContent = "Error approving user: " + error.message;
    });
}

function normalizeEmail(email) {
    return email.replace(/\./g, ',');
}


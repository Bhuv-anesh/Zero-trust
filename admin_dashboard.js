// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBky1m8X-melB3hFAy7MZ6aIe7BMn4AuGJE",
    authDomain: "ztna-238e7.firebaseapp.com",
    projectId: "ztna-238e7",
    storageBucket: "ztna-238e7.appspot.com",
    messagingSenderId: "89728704566",
    appId: "1:89728704566:web:03d989166154a0817db897"
};
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        firebase.database().ref('users/' + user.uid).once('value')
            .then((snapshot) => {
                const userData = snapshot.val();
                if (!userData || !userData.admin) {
                    window.location.href = 'login.html'; // Redirect non-admins
                }
            });
    } else {
        window.location.href = 'login.html'; // Redirect unauthenticated users
    }
});

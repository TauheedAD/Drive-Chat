// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyC-0fUj1x9c-luQVvndqyx_4wUCGCWOgBE",
    authDomain: "chatapp-1b5e3.firebaseapp.com",
    databaseURL: "https://chatapp-1b5e3-default-rtdb.firebaseio.com",
    projectId: "chatapp-1b5e3",
    storageBucket: "chatapp-1b5e3.appspot.com",
    messagingSenderId: "396450741683",
    appId: "1:396450741683:web:72211e6b4b5e9ff6779fc6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Auth reference
const auth = firebase.auth();
const db = firebase.database();

// Login function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password).then(() => {

        console.log('Logged in successfully.');
        window.location.href = "contacts.html"
        auth.onAuthStateChanged(user => {
            if (user) {
                localStorage.setItem('uid', user.uid);
                userUidInput.value = user.uid;
                const contactUid = localStorage.getItem('activeContactUid');
                if (contactUid) {
                    loadChat(user.uid, contactUid);
                }
            } else {
                localStorage.removeItem('uid');
                userUidInput.value = '';
                messagesDiv.innerHTML = ''; // Clear messages if user is not authenticated
            }
        });

    }).catch(error => {
        // Handle errors
        console.error('Login error:', error.message);
        alert(error.message);
    });
}



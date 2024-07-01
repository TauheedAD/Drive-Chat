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

// Firebase Auth and Database reference
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

// Function to preview image
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('profilePicPreview');
        output.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

// Signup function
function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const profilePic = document.getElementById('profilePic').files[0];

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Signup successful
            const user = userCredential.user;
            console.log('User registered successfully.');

            // If a profile picture is uploaded, upload it to Firebase Storage
            if (profilePic) {
                const storageRef = storage.ref('profilePictures/' + user.uid + '/' + profilePic.name);
                return storageRef.put(profilePic)
                    .then(() => storageRef.getDownloadURL())
                    .then(downloadURL => {
                        // Save user details to database including the profile picture URL
                        return db.ref('users/' + user.uid).set({
                            username: username,
                            email: email,
                            profilePic: downloadURL
                        });
                    });
            } else {
                // Save user details to database with a default profile picture
                const defaultPicURL = 'https://firebasestorage.googleapis.com/v0/b/chatapp-1b5e3.appspot.com/o/profilePictures%2Fdefualt-pp-removebg-preview.png?alt=media&token=110cee0d-2c2c-4be1-b36a-681413f08e4a';
                return db.ref('users/' + user.uid).set({
                    username: username,
                    email: email,
                    profilePic: defaultPicURL
                });
            }
        })
        .then(() => {
            console.log('User details saved to database.');
            alert('User registered and saved to database successfully.');
            window.location.href = "contacts.html";
        })
        .catch(error => {
            // Handle errors
            console.error('Registration error:', error.message);
            alert(error.message);
        });
}

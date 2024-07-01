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

// DOM elements
const contactsList = document.getElementById('contacts-list');
const connect = document.getElementById('connect-to-social-media').addEventListener('click', connectRedirect);
let userUidInput = localStorage.getItem("uid");
const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        localStorage.removeItem('uid');
        userUidInput.value = '';
        window.location.href = 'index.html'; // Redirect to login page
    }).catch(error => {
        console.error('Logout error:', error.message);
        alert(error.message);
    });
});

function connectRedirect() {
    window.location.href = "media.html";
}

// Realtime authentication state listener
auth.onAuthStateChanged(user => {
    if (user) {
        localStorage.setItem('uid', user.uid);
        userUidInput = user.uid;
        loadContacts(user.uid); // Load contacts when user is authenticated
    } else {
        localStorage.removeItem('uid');
        userUidInput.value = '';
        contactsList.innerHTML = ''; // Clear contacts list if user is not authenticated
    }
});

// Load contacts function
function loadContacts(uid) {
    contactsList.innerHTML = '';
    db.ref('users').once('value').then(snapshot => {
        snapshot.forEach(childSnapshot => {
            const contactUid = childSnapshot.key;
            if (contactUid !== uid) {
                const contact = childSnapshot.val();
                const li = document.createElement('li');
                
                // Create image element for profile picture
                const img = document.createElement('img');
                img.src = contact.profilePic || 'https://firebasestorage.googleapis.com/v0/b/chatapp-1b5e3.appspot.com/o/profilePictures%2Fdefualt-pp.png?alt=media&token=07041e4b-91b1-4606-81f1-c10e7c163e8a'; // Fallback to default profile picture if none exists
                img.alt = 'Profile Picture';
                img.classList.add('profile-pic');
                
                // Add profile picture and username to list item
                li.appendChild(img);
                li.appendChild(document.createTextNode(contact.username));
                li.dataset.uid = contactUid;
                li.addEventListener('click', () => {
                    setActiveContact(li);
                    localStorage.setItem('activeContactUid', contactUid); // Save active contact UID to localStorage
                    window.location.href = 'chat.html'; // Redirect to chat.html
                });
                contactsList.appendChild(li);
            }
        });
    }).catch(error => {
        console.error('Error loading contacts:', error.message);
    });
}

// Set active contact
function setActiveContact(selectedLi) {
    const contactItems = contactsList.children;
    for (let item of contactItems) {
        item.classList.remove('active');
    }
    selectedLi.classList.add('active');
}

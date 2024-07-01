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

// DOM elements
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message');
const logoutBtn = document.getElementById('logout');
const userUidInput = document.getElementById('user-uid');
const connectButton = document.getElementById('connect-to-social-media');
const backToContactsBtn = document.getElementById('back-to-contacts');
const chatHeading = document.getElementById('chat-heading');
const contactProfilePic = document.getElementById('contact-profile-pic');

// Event listener for the button click
connectButton.addEventListener('click', () => {
    window.location.href = 'media.html';
});

// Event listener for back to contacts button
backToContactsBtn.addEventListener('click', () => {
    localStorage.removeItem('activeContactUid')
    window.location.href = 'contacts.html';
});

// Realtime authentication state listener
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

// Load chat messages function
function loadChat(userUid, contactUid) {
    const chatId = [userUid, contactUid].sort().join('_');

    // Fetch the username and profile picture URL of the contact
    db.ref('users/' + contactUid).once('value').then(snapshot => {
        const contactData = snapshot.val(); // Assuming contact data is stored in Firebase
        const contactUsername = contactData.username;
        const contactProfilePicUrl = contactData.profilePic;

        // Update the chat heading with the contact's username and profile picture
        chatHeading.textContent = contactUsername;
        contactProfilePic.src = contactProfilePicUrl || 'assets/default-profile.png'; // Use default profile picture if none is provided
    }).catch(error => {
        console.error('Error fetching contact data:', error.message);
    });

    // Load chat messages from Firebase
    db.ref('chats/' + chatId).on('value', snapshot => {
        messagesDiv.innerHTML = '';
        snapshot.forEach(childSnapshot => {
            const message = childSnapshot.val();
            const messageId = childSnapshot.key;

            const messageItem = document.createElement('div');
            messageItem.classList.add('message-item');
            messageItem.setAttribute('data-id', messageId);

            const messageText = document.createElement('p');
            messageText.textContent = `${message.senderUsername}: ${message.text}`;

            messageText.classList.add('message-text'); // Add class for common styling
            
            // Apply different styles based on message sender
            if (message.senderUid === userUid) {
                messageItem.classList.add('message-sent'); // Sent by current user
            } else {
                messageItem.classList.add('message-received'); // Sent by other user
            }

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.display = 'none'; // Initially hide delete button
            deleteButton.addEventListener('click', () => deleteMessage(chatId, messageId));

            // Append message text and delete button to message item
            messageItem.appendChild(deleteButton); // Append delete button first
            messageItem.appendChild(messageText); // Then append message text

            // Toggle delete button visibility on message item click
            messageItem.addEventListener('click', () => {
                if (deleteButton.style.display === 'none') {
                    deleteButton.style.display = 'block';
                } else {
                    deleteButton.style.display = 'none';
                }
            });
            
            messagesDiv.appendChild(messageItem);
        });
    });
}

// Function to delete a message
function deleteMessage(chatId, messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
        const userUid = localStorage.getItem('uid');

        // Check if the message belongs to the current user
        db.ref('chats/' + chatId + '/' + messageId).once('value').then(snapshot => {
            const message = snapshot.val();
            if (message.senderUid === userUid) {
                // Remove the message from Firebase Realtime Database
                db.ref('chats/' + chatId + '/' + messageId).remove()
                    .then(() => {
                        console.log('Message deleted successfully.');
                        // Optionally, remove the message from the DOM
                        document.querySelector(`[data-id="${messageId}"]`).remove();
                    })
                    .catch(error => {
                        console.error('Error deleting message:', error);
                        alert('Message deleted');
                    });
            } else {
                alert('You are not authorized to delete this message.');
            }
        }).catch(error => {
            console.error('Error checking message ownership:', error.message);
        });
    }
}

// Send message function
sendMessageBtn.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    const userUid = userUidInput.value;
    const activeContact = localStorage.getItem('activeContactUid');
    if (!activeContact) {
        alert('Please select a contact to send a message.');
        return;
    }
    const contactUid = activeContact;
    const chatId = [userUid, contactUid].sort().join('_');

    db.ref('users/' + userUid).once('value').then(snapshot => {
        const username = snapshot.val().username;
        const messageData = {
            text: messageText,
            senderUid: userUid,
            senderUsername: username,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        db.ref('chats/' + chatId).push(messageData);
    }).catch(error => {
        console.error('Error sending message:', error.message);
    });

    messageInput.value = '';
});

// Logout function
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

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC-0fUj1x9c-luQVvndqyx_4wUCGCWOgBE",
    authDomain: "chatapp-1b5e3.firebaseapp.com",
    databaseURL: "https://chatapp-1b5e3-default-rtdb.firebaseio.com",
    projectId: "chatapp-1b5e3",
    storageBucket: "chatapp-1b5e3.appspot.com",
    messagingSenderId: "396450741683",
    appId: "1:396450741683:web:72211e6b4b5e9ff6779fc6"
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const storage = firebase.storage();
const connectButton = document.getElementById('post-your-pics');
const backbtn = document.getElementById('back');

// Check if user is logged in
if (!localStorage.getItem('uid')) {
    alert("Please login or register first");
    window.location.href = "index.html"; // Redirect to login page
}

// Event listener for the button click to post photos
connectButton.addEventListener('click', () => {
    window.location.href = 'upload.html'; // Redirect to upload page
});

// Event listener for the back button click to go back to chats
backbtn.addEventListener('click', () => {
    window.location.href = 'contacts.html'; // Redirect to chat page
});

// Function to display uploaded images in the media feed
function displayImages() {
    const mediaFeed = document.getElementById('media-feed');
    const currentUserUid = localStorage.getItem('uid');

    // Fetch images from Firebase Realtime Database
    database.ref('media').on('child_added', (snapshot) => {
        const imageData = snapshot.val();
        const imageUrl = imageData.url;
        const userId = imageData.userId;

        // Create image element
        const image = document.createElement('img');
        image.src = imageUrl;

        // Create container for the image
        const mediaItem = document.createElement('div');
        mediaItem.classList.add('media-item');
        mediaItem.appendChild(image);

        // Fetch username based on userId
        database.ref('users/' + userId + '/username').once('value').then((usernameSnapshot) => {
            const username = usernameSnapshot.val();

            // Create element for username
            const usernameElement = document.createElement('div');
            usernameElement.classList.add('username');
            usernameElement.style.fontSize = '29px'; // Set font size here (adjust as needed)
            usernameElement.innerText = `Posted by: ${username || 'Unknown User'}`; // Handle null case
            mediaItem.appendChild(usernameElement);

            // Add delete button if current user is the uploader
            if (currentUserUid === userId) {
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deleteImage(snapshot.key); // Pass image key to delete function
                });
                mediaItem.appendChild(deleteButton);
            }

        }).catch((error) => {
            console.error('Error fetching username:', error);
            // Handle error fetching username
            const usernameElement = document.createElement('div');
            usernameElement.classList.add('username');
            usernameElement.innerText = 'Posted by: Unknown User';
            mediaItem.appendChild(usernameElement);
        }).finally(() => {
            // Create container for like button and count
            const likeContainer = document.createElement('div');
            likeContainer.classList.add('interaction-container');

            // Create like button as a circle with image
            const likeButton = document.createElement('button');
            likeButton.classList.add('circle-button');
            likeButton.innerHTML = '&#x1F44D;'; // Thumbs up emoji
            likeButton.addEventListener('click', () => {
                likeImage(snapshot.key); // Pass image name to like function
            });
            likeContainer.appendChild(likeButton);

            // Create like count element
            const likeCount = document.createElement('span');
            likeCount.classList.add('interaction-count');
            likeContainer.appendChild(likeCount);

            // Update like count when it changes
            database.ref('media/' + snapshot.key + '/likes').on('value', (likesSnapshot) => {
                const likes = likesSnapshot.numChildren();
                likeCount.innerText = `${likes} likes`;
            });

            mediaItem.appendChild(likeContainer);

                       // Create container for comments count
                       const commentsCountContainer = document.createElement('div');
                       commentsCountContainer.classList.add('comments-count');
                       mediaItem.appendChild(commentsCountContainer);
           
                       // Create comments button as a circle with image
                       const commentsButton = document.createElement('button');
                       commentsButton.classList.add('circle-button');
                       commentsButton.innerHTML = '&#x1F4AC;'; // Speech balloon emoji
                       commentsButton.addEventListener('click', () => {
                           toggleComments(mediaItem, snapshot.key);
                       });
                       mediaItem.appendChild(commentsButton);
           
                       // Update comments count when it changes
                       database.ref('media/' + snapshot.key + '/comments').on('value', (commentsSnapshot) => {
                           const comments = commentsSnapshot.numChildren();
                           commentsCountContainer.innerText = `${comments} comments`;
                       });
           
                       // Create container for comments
                       const commentsContainer = document.createElement('div');
                       commentsContainer.classList.add('comments-container');
                       mediaItem.appendChild(commentsContainer);
           
                       // Create input for new comments
                       const commentInput = document.createElement('input');
                       commentInput.type = 'text';
                       commentInput.classList.add('comment-input');
                       commentInput.placeholder = 'Write a comment...';
                       mediaItem.appendChild(commentInput);
           
                       // Create button to submit new comment
                       const submitCommentButton = document.createElement('button');
                       submitCommentButton.classList.add('comment-button');
                       submitCommentButton.innerText = 'Post Comment';
                       submitCommentButton.addEventListener('click', () => {
                           const commentText = commentInput.value.trim();
                           if (commentText !== '') {
                               commentImage(snapshot.key, commentText);
                               commentInput.value = ''; // Clear input after commenting
                           }
                       });
                       mediaItem.appendChild(submitCommentButton);
           
                       // Append media item to media feed
                       mediaFeed.appendChild(mediaItem);
                   });
               });
           }


// Function to delete an image
function deleteImage(imageKey) {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
        database.ref('media/' + imageKey).once('value').then((snapshot) => {
            const imageData = snapshot.val();
            const imageUrl = imageData.url;

            database.ref('media/' + imageKey).remove()
                .then(() => {
                    console.log('Image data deleted successfully from database.');

                    const storageRef = storage.refFromURL(imageUrl);
                    storageRef.delete()
                        .then(() => {
                            console.log('Image deleted successfully from storage.');

                            location.reload();

                            const mediaItem = document.getElementById(imageKey);
                            if (mediaItem) {
                                mediaItem.remove();
                                console.log('Image removed from UI.');

                            } else {
                                console.error('Image element not found in UI.');
                            }
                        })
                        .catch((error) => {
                            console.error('Error deleting image from storage:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error deleting image data from database:', error);
                });
        }).catch((error) => {
            console.error('Error fetching image data:', error);
        });
    }
}


// Function to update like count
function updateLikeCount(imageName, likeCountElement) {
    database.ref('media/' + imageName + '/likes').on('value', (snapshot) => {
        const likes = snapshot.numChildren();
        likeCountElement.innerText = `${likes} Likes`;
    });
}

// Function to update comments count
function updateCommentsCount(imageName, commentsCountElement) {
    database.ref('media/' + imageName + '/comments').on('value', (snapshot) => {
        const comments = snapshot.numChildren();
        commentsCountElement.innerText = `${comments} Comments`;
    });
}


// Function to update like count
function updateLikeCount(imageName, likeCountElement) {
    database.ref('media/' + imageName + '/likes').on('value', (snapshot) => {
        const likes = snapshot.numChildren();
        likeCountElement.innerText = `${likes} Likes`;
    });
}

// Function to update comments count
function updateCommentsCount(imageName, commentsCountElement) {
    database.ref('media/' + imageName + '/comments').on('value', (snapshot) => {
        const comments = snapshot.numChildren();
        commentsCountElement.innerText = `${comments} Comments`;
    });
}

function toggleComments(mediaItem, imageName) {
    const commentsContainer = mediaItem.querySelector('.comments-container');

    const computedStyle = window.getComputedStyle(commentsContainer);
    const displayStyle = computedStyle.getPropertyValue('display');

    if (displayStyle === 'none') {
        fetchComments(imageName, commentsContainer);
        commentsContainer.style.display = 'block';
    } else {

        commentsContainer.style.display = 'none';
    }
}



// Function to fetch and display comments for an image
function fetchComments(imageName, commentsContainer) {
    // Clear previous comments if any
    commentsContainer.innerHTML = '';

    // Fetch comments from Firebase
    database.ref('media/' + imageName + '/comments').on('child_added', (commentSnapshot) => {
        const commentData = commentSnapshot.val();
        const commentUserId = commentData.userId;
        const commentText = commentData.comment;

        // Fetch username based on userId
        database.ref('users/' + commentUserId + '/username').once('value').then((usernameSnapshot) => {
            const username = usernameSnapshot.val();

            // Display comment with username
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `<strong>${username}: </strong>${commentText}`;
            commentsContainer.appendChild(commentElement);
        }).catch((error) => {
            console.error('Error fetching username:', error);
        });
    });
}

// Function to add a new comment to an image
function commentImage(imageName, comment) {
    const userId = firebase.auth().currentUser.uid;

    // Push comment to database
    database.ref('media/' + imageName + '/comments').push({
        userId: userId,
        comment: comment
    }).then(() => {
        console.log('Comment added successfully.');
    }).catch((error) => {
        console.error('Error adding comment:', error);
    });
}

// Function to like an image
function likeImage(imageName) {
    const userId = firebase.auth().currentUser.uid;

    // Check if user already liked the image
    database.ref('media/' + imageName + '/likes/' + userId).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            // User already liked the image, so unlike it
            database.ref('media/' + imageName + '/likes/' + userId).remove();
        } else {
            // User hasn't liked the image, so like it
            database.ref('media/' + imageName + '/likes/' + userId).set(true);
        }
    }).catch((error) => {
        console.error('Error liking image:', error);
    });
}

// Load images and initialize on page load
window.onload = function () {
    displayImages();
};

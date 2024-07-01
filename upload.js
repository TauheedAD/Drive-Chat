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

const storage = firebase.storage();
const storageRef = storage.ref();
const database = firebase.database();
const backbtn = document.getElementById('back');

if (!localStorage.getItem('uid')) {
    alert("Please login or register first");
    window.location.href = "index.html";
}

// Fetch username based on current user's ID
function fetchUsername(uid) {
    return database.ref('users/' + uid + '/username').once('value')
        .then((snapshot) => {
            return snapshot.val(); // Return username
        })
        .catch((error) => {
            console.error('Error fetching username:', error);
            return null;
        });
}

// Event listener for back button to return to media page
backbtn.addEventListener('click', () => {
    window.location.href = 'media.html';
});

// Function to upload image and save details to Firebase
function uploadImage() {
    const file = document.getElementById('imageFile').files[0];

    // Check if file is an image
    if (!file.type.match('image.*')) {
        console.error('Selected file is not an image');
        return;
    }

    // Create a FileReader to read the file
    const reader = new FileReader();

    // Closure to capture the file information
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Resize the image to a maximum width and height
            const maxWidth = 350; // Adjust maximum width as needed
            const maxHeight = 300; // Adjust maximum height as needed
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Get resized image as data URL
            const resizedDataURL = canvas.toDataURL('image/jpeg', 0.8); // Adjust quality as needed

            // Convert data URL back to Blob for uploading
            const resizedImageBlob = dataURItoBlob(resizedDataURL);

            // Upload resized image to Firebase Storage
            const uploadTask = storageRef.child(`images/${file.name}`).put(resizedImageBlob);

            // Track upload progress
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Update progress bar
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    document.getElementById('uploadProgress').value = progress;
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.error('Error uploading file: ', error);
                },
                () => {
                    // Handle successful upload
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        // Save image details to Firebase Realtime Database
                        saveImageToDatabase(file.name, downloadURL);
                    });
                }
            );
        };

        // Set image src to data URL
        img.src = event.target.result;
    };

    // Read file as data URL
    reader.readAsDataURL(file);
}

// Save image details to Firebase Realtime Database
function saveImageToDatabase(fileName, downloadURL) {
    // Fetch current user's ID
    const uid = localStorage.getItem('uid');

    // Fetch username based on user ID
    fetchUsername(uid).then((username) => {
        if (username) {
            // Create image data object
            const imageData = {
                filename: fileName,
                url: downloadURL,
                uploadedBy: username, // Add username to image data
                likes: 0, // Initial likes count
                comments: [] ,// Empty array for comments
                userId : uid
            };

            // Save image data to Firebase Realtime Database under 'media' node
            const newImageKey = database.ref().child('media').push().key;
            const updates = {};
            updates[`/media/${newImageKey}`] = imageData;

            return database.ref().update(updates)
                .then(() => {
                    console.log('Image details saved to database');
                })
                .catch((error) => {
                    console.error('Error saving image details: ', error);
                });
        } else {
            console.error('Username not found.');
        }
    }).catch((error) => {
        console.error('Error fetching username:', error);
    });
}

// Function to convert data URI to Blob
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
}

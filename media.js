
body {
    background-image: url('assets/bg.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden; /* Disable page scroll */
}

#app {
    width: 90%;
    max-width: 600px;
    margin: 20px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    overflow-x:hidden;
    overflow-y: auto; 
    position: relative; 
    height: calc(100vh - 80px);
}

.circle-button {
    display: inline-block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #f0f0f0;
    border: none;
    cursor: pointer;
    margin-right: 10px;
    font-size: 24px;
    text-align: center;
    line-height: 50px;
    bottom: 20px;
    vertical-align: middle;
}

.circle-button:hover {
    background-color: #e0e0e0;
}

.comments-container {
    display: none;


}

.comment {
    cursor: pointer;
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.delete-comment-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    font-size: 12px;
    margin-left: 5px;
    border-radius: 3px;
    cursor: pointer;
}


a {
    text-decoration: none;
    color: #007bff;
    padding: 10px 20px;
    background-color: #ffffff;
    border: 1px solid #007bff;
    border-radius: 15px;
    display: inline-block;
    transition: background-color 0.3s, color 0.3s;
}

a:hover {
    background-color: #007bff;
    color: #ffffff;
}

input {
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;
}

button {
    padding: 10px 10px;
    margin: 10px ; 
    cursor: pointer;
    border: none;
    border-radius: 8px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    transition: background-color 0.3s;
    display: inline-block; /* Ensures buttons stack vertically */
    width: 100%; /* Makes buttons full width of their container */
}

button:hover {
    background-color: #0056b3;
}

/* Chat section styles */
#connect-to-social-media {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #007bff;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
}

.social-media-icon {
    width: 60%; /* Adjust icon size as needed */
    height: auto; /* Maintain aspect ratio */
    display: block; /* Ensure icon is block-level */
}

#contacts, #chat {
    margin-top: 20px;
    text-align: left;
}

#contacts h3, #chat h3 {
    margin-top: 0;
}

#contacts-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 90%;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
}

#contacts-list li {
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

#contacts-list li:hover {
    background-color: #f0f0f0;
}

#contacts-list li.active {
    background-color: #ddd;
}

#messages {
    border: 1px solid #ddd;
    height: 400px;
    overflow-y: scroll;
    margin-bottom: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    backdrop-filter: blur(10px);
}

#message-input {
    width: calc(100% - 80px);
    border-radius: 8px;
    border: 1px solid #ddd;
    padding: 10px;
    box-sizing: border-box;
}
.profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    vertical-align: middle;
}
#chat-heading-container {
    display: flex;
    align-items: center;
}

.profile-picc {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    margin-top: 40px;
    object-fit: cover;
}

.custom-file-input {
    display: inline-block;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
}

.upload-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
}



#contacts-list li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px;
    cursor: pointer;
}

#contacts-list li.active {
    background-color: #e0e0e0;
}

.message-input-container {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 20px; 
    left: 20px; 
    right: 20px; 
}

.send-icon {
    width: 20px;
    height: 20px;
    margin-left: 10px;
}

/* Hide delete button by default */
.message-item {
    margin-bottom: 10px;
    overflow: hidden;
    clear: both;
    position: relative;
    padding: 6px 10px; /* Adjust padding as needed */
    max-width: 70%; /* Adjust as needed */
    word-wrap: break-word;
}

.message-text {
    padding: 0px 2px; /* Adjust padding as needed */
    border-radius: 12px;
    color: white;
    font-size: 12px; /* Adjust font size as needed */
}

.message-sent {
    background-color: #007bff; /* Blue background for messages sent by current user */
    border-radius: 12px; /* Rounded corners */
    float: right;
    clear: both;
}

.message-received {
    background-color: #f01d3d; /* Red background for messages received from others */
    border-radius: 12px; /* Rounded corners */
    float: left;
    clear: both;
}

.message-item .delete-button {
    display: none;
    position: absolute;
    bottom: -20px;
    right: 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px;
    cursor: pointer;
    font-size: 12px;
    width: 80px; /* Adjust width as needed */
}

.message-item:hover .delete-button {
    display: block;
}


#send-message {
    background-color: transparent;
    border: none;
    padding: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
}

.send-icon {
    width: 70%; /* Adjust icon size as needed */
    height: auto;
    display: block;
    margin: auto;
}

.logout-button {
    position: absolute;
    top: 10px;
    left: 45%;
    width: 80px;
    height: 50px;
    border-radius: 10px;
    background-color: #007bff;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logout-icon {
    width: 70%; /* Adjust icon size as needed */
    height: auto; /* Maintain aspect ratio */
    display: block; /* Ensure icon is block-level */
}

.contacts-button {
    position: absolute;
    top: 10px;
    right: 60%;
    width: 80px;
    height: 50px;
    border-radius: 10px;
    background-color: #b1c6dd;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
}

.contacts-button img {
    width: 70%; /* Adjust icon size as needed */
    height: auto; /* Maintain aspect ratio */
    display: block; /* Ensure icon is block-level */
}

.send-icon {
    width: 70%; /* Adjust icon size as needed */
    height: auto; /* Maintain aspect ratio */
    display: block; /* Ensure icon is block-level */
    margin: auto; /* Center the icon horizontally and vertically */
}





#send-message:hover {
    background-color: #218838;
}

@media only screen and (max-width: 768px) {
    #app {
        padding: 10px;
    }
    #auth-section, #chat-section {
        width: 100%;
    }
    #contacts, #chat {
        padding: 10px;
    }
    #contacts-list li, #messages p {
        font-size: 14px;
    }
    #message-input {
        width: calc(100% - 80px);
    }

    #media-feed {
        max-height: 200px;
    }
}

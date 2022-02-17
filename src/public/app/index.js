// ./src/public/app/index.js

const chatArea = document.getElementById('chat-area');
const messageInput = document.getElementById('message');
const profileElement = document.getElementById('profile');
const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');
const locationText = document.getElementById('location');


messageInput.addEventListener('keyup', async (event) => {
    if (event.code !== 'Enter') return;
    firebaseClient.addMessage(messageInput.value);
    messageInput.value = '';
});

signInButton.addEventListener('click', async () => {

    var provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider)
        .then((result) => {
            activateChat();
        }).catch((error) => {
            alert(error.message);
        });
});

signOutButton.addEventListener('click', async () => {
    firebaseClient.signOut();
    deactivateChat();
});

function activateChat() {
    const { displayName } = firebase.auth().currentUser;
    profileElement.innerText = `Hello, ${displayName}.`;
    signInButton.style.display = 'none';
    signOutButton.style.display = 'inline-block';
    messageInput.disabled = false;

    firebaseClient.setMessagesListener((querySnapshot) => {
        chatArea.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const messageContainer = document.createElement('div');
            const timestampElement = document.createElement('small');
            const messageElement = document.createElement('p');

            const messageDate = new Date(doc.data().createdAt.seconds * 1000);
            timestampElement.innerText = doc.data().author + ' - ' + messageDate.toISOString().replace('T', ' ').substring(0, 19);
            messageElement.innerText = doc.data().message;
            messageContainer.appendChild(timestampElement);
            messageContainer.appendChild(messageElement);
            messageContainer.className = 'alert alert-secondary';
            chatArea.appendChild(messageContainer);
        });
    });
}

function deactivateChat() {
    chatArea.innerText = '';
    profileElement.innerText = '';
    signInButton.style.display = 'inline-block';
    signOutButton.style.display = 'none';
    messageInput.disabled = true;
}


function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

(async () => {
    locationText.innerText = 'Served From: ' + getCookie('cpln_location');
    deactivateChat();
})();
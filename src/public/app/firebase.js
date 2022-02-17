// ./src/public/app/firebase.js

let _messagesDb = null;

class Firebase {
    constructor() {

        firebase.initializeApp({
            apiKey: 'FROM_FIREBASE_REGISTRATION',
            authDomain: 'FROM_FIREBASE_REGISTRATION',
            projectId: 'FROM_FIREBASE_REGISTRATION',
            storageBucket: 'FROM_FIREBASE_REGISTRATION',
            messagingSenderId: 'FROM_FIREBASE_REGISTRATION',
            appId: 'FROM_FIREBASE_REGISTRATION'
        });

        const appCheck = firebase.appCheck();

        appCheck.activate('FROM_RECAPTCHA_REGISTRATION', true);

        // initialize Firestore through Firebase
        _messagesDb = firebase.firestore();

        // disable deprecated features
        _messagesDb.settings({
            timestampsInSnapshots: true
        });
    }

    async addMessage(message) {
        const createdAt = new Date();
        const author = firebase.auth().currentUser.displayName;
        return await _messagesDb.collection('messages').add({
            author,
            createdAt,
            message,
        });
    }

    getCurrentUser() {
        return firebase.auth().currentUser;
    }

    async updateProfile(profile) {
        if (!firebase.auth().currentUser) return;
        await firebase.auth().currentUser.updateProfile({
            displayName: profile.name,
            photoURL: profile.picture,
        });
    }

    async signOut() {
        await firebase.auth().signOut();
    }

    setAuthStateListener(listener) {
        firebase.auth().onAuthStateChanged(listener);
    }

    setMessagesListener(listener) {
        _messagesDb.collection('messages').orderBy('createdAt', 'desc').limit(10).onSnapshot(listener);
    }
}

const firebaseClient = new Firebase();
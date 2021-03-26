import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAqGbmrzko7btN675prcVSpslNNmp6L-84",
    authDomain: "nextfire-app-111c9.firebaseapp.com",
    projectId: "nextfire-app-111c9",
    storageBucket: "nextfire-app-111c9.appspot.com",
    messagingSenderId: "1030952770971",
    appId: "1:1030952770971:web:e5dd9efed8c9d532e4d53e"
};

if (!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

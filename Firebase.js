import { firebase } from '@firebase/app';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBrJa8L_3l12jFkhgUbWlGgOWt2mY859n0",
    authDomain: "mindfullnessapp-af4ea.firebaseapp.com",
    databaseURL: "https://mindfullnessapp-af4ea.firebaseio.com",
    projectId: "mindfullnessapp-af4ea",
    storageBucket: "mindfullnessapp-af4ea.appspot.com",
    messagingSenderId: "582152718052",
    appId: "1:582152718052:web:4f93df32f4c62ea1bb4ef1",
    measurementId: "G-TBQ5YD4DYQ"
};

if (!firebase.apps.length) {
    firebase.initializeApp({});
}
export default firebase;
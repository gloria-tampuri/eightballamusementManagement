import firebase from "firebase/app";
import "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyC5qFQYq7tYh2PX9mJGngbaeFN4LSJwweE",
  authDomain: "eightballamusement.firebaseapp.com",
  projectId: "eightballamusement",
  storageBucket: "eightballamusement.appspot.com",
  messagingSenderId: "462708931707",
  appId: "1:462708931707:web:b579b686b63ed2df4936de",
  measurementId: "G-MPVCXJBMCG"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

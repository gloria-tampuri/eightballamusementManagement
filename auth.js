import firebase from "./firebase";

// Function to sign up a new user
export const signUpWithEmailAndPassword = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

// Function to sign in an existing user
export const signInWithEmailAndPassword = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

// Function to sign out the current user
export const signOut = () => {
  return firebase.auth().signOut();
};

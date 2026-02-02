import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjdkO3oS32rvC9HE0mFuBKfIJpqUKS2ro",
  authDomain: "hujjat-web-app.firebaseapp.com",
  projectId: "hujjat-web-app",
  storageBucket: "hujjat-web-app.firebasestorage.app",
  messagingSenderId: "712658631056",
  appId: "1:712658631056:web:3d784ee0478c0e0c94db15",
  measurementId: "G-HGY6KGEVEJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app); 

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);
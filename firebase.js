import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBfYeNorIRSeskZQ5GceNQ8QVtL7oar-Tc",
    authDomain: "whatsapp-3048a.firebaseapp.com",
    projectId: "whatsapp-3048a",
    storageBucket: "whatsapp-3048a.appspot.com",
    messagingSenderId: "668572559275",
    appId: "1:668572559275:web:136b6dddf8b59a064694ee"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export { auth, provider, db }
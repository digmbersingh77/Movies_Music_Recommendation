import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAN3OxPgMan9m8Lhn3W9bNKhLQUXgoSyvo",
  authDomain: "movie-and-music-bcd56.firebaseapp.com",
  projectId: "movie-and-music-bcd56",
  storageBucket: "movie-and-music-bcd56.firebasestorage.app",
  messagingSenderId: "452852437680",
  appId: "1:452852437680:web:364011d2b1c5193b436175"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid || null,
      name,
      authProvider: "local",
      email,
    });
    toast.success("Sign up successful!");
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Login successful!");
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const logout = () => {
  signOut(auth);
  toast.success("Logged out successfully!");
};

export { auth, db, login, signup, logout };

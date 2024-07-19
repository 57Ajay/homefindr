// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "homefindr-ee2e1.firebaseapp.com",
  projectId: "homefindr-ee2e1",
  storageBucket: "homefindr-ee2e1.appspot.com",
  messagingSenderId: "754358717621",
  appId: "1:754358717621:web:196d78c1aa9940832042fc",
  measurementId: "G-ZSG9F4GLN5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
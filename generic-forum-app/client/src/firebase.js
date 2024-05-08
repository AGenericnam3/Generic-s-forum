
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC45K9SPhhN_1YralFBB5pIOIti-ZxFET0",
    authDomain: "generic-s-forum.firebaseapp.com",
    projectId: "generic-s-forum",
    storageBucket: "generic-s-forum.appspot.com",
    messagingSenderId: "516547316628",
    appId: "1:516547316628:web:d7441f2b1449f71a199d81",
    measurementId: "G-93BR9BPTFC"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default app;
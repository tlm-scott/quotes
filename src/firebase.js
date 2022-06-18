import {getFirestore} from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';
import {getAuth} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7UizadQHZhqLP7dxtCqUE_ueF6lCY76c",
  authDomain: "quote-blog.firebaseapp.com",
  projectId: "quote-blog",
  storageBucket: "quote-blog.appspot.com",
  messagingSenderId: "338228626963",
  appId: "1:338228626963:web:f430508e062694a19a21e6"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const db = getFirestore(app);
 const storage = getStorage(app);

 export {
    auth,
    db, 
    storage
 };
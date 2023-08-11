import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6JF29e0xTbZtZ7lgr6yUI_xrM9TtqlTE",
  authDomain: "newapp-e3c2f.firebaseapp.com",
  projectId: "newapp-e3c2f",
  storageBucket: "newapp-e3c2f.appspot.com",
  messagingSenderId: "992972523892",
  appId: "1:992972523892:web:902dc0ee7e86dd1fa7c421",
  measurementId: "G-HWMPNLY0RC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app)
export {db}
export default app;

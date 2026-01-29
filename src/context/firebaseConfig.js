import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAO7WIQ_FBOkb1iZy-xIQ4lmnn8o4Ihi5k", // This value needs to be retrieved from your Firebase Project settings.
  authDomain: "digifashion-9b0eb.firebaseapp.com",
  projectId: "digifashion-9b0eb",
  storageBucket: "digifashion-9b0eb.appspot.com", //
  messagingSenderId: "612975934664",
  appId: "1:612975934664:web:ce17e30cc1818959a8f9fd",
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

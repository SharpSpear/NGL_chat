import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAl5GvmWak6dia6NdCRlVzLsqFBYaqwuU0",
  projectId: "honest-c986c",
  storageBucket: "honest-c986c.appspot.com",

  messagingSenderId: "794254350995",
  appId: "1:794254350995:ios:f0c06ea75077e6be028b66",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

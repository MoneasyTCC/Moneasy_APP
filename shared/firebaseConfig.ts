import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCxeVhKHOa75e1uT5xSUl4kC4lsLVvGp4o",
  authDomain: "tcc-app-debbb.firebaseapp.com",
  projectId: "tcc-app-debbb",
  storageBucket: "tcc-app-debbb.appspot.com",
  messagingSenderId: "1051046103227",
  appId: "1:1051046103227:web:593aecbc3d46b2f2fc819e",
  measurementId: "G-076DTRPKD2"
};
 
const app =  initializeApp(firebaseConfig);

export { app };

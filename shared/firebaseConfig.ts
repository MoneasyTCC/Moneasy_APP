// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCxeVhKHOa75e1uT5xSUl4kC4lsLVvGp4o",
  authDomain: "tcc-app-debbb.firebaseapp.com",
  projectId: "tcc-app-debbb",
  storageBucket: "tcc-app-debbb.appspot.com",
  messagingSenderId: "1051046103227",
  appId: "1:1051046103227:web:593aecbc3d46b2f2fc819e",
  measurementId: "G-076DTRPKD2"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);








// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";

// // Inicialize o Firestore
// const db = getFirestore();

// // Função para carregar dados do usuário
// const loadUserData = async (uid) => {
//   const userDocRef = doc(db, "users", uid);
//   const userDocSnap = await getDoc(userDocRef);

//   if (userDocSnap.exists()) {
//     console.log("Dados do usuário:", userDocSnap.data());
//   } else {
//     // Doc não encontrado
//     console.log("Nenhum dado encontrado para esse usuário.");
//   }
// };

// // Rastrear estado de autenticação
// onAuthStateChanged(getAuth(), (user) => {
//   if (user) {
//     // Usuário está logado
//     loadUserData(user.uid);
//   } else {
//     // Usuário não está logado
//   }
// });

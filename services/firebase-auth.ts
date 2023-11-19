import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import {firebaseConfig} from "../shared/firebaseConfig"



import {
  Alert,
} from "react-native";
// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função para registrar um novo usuário
export const createAccountWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

// Função para fazer login
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

  // Função para resetar a senha
export const resetPasswordWithEmail = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Função para fazer logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Função para acompanhar o estado de autenticação do usuário
export const observeAuthState = (onUserChanged: (user: User | null) => void) => {
  return onAuthStateChanged(auth, onUserChanged);
};
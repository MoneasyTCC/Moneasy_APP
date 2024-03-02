import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import {app} from "../shared/firebaseConfig"



import {
  Alert,
} from "react-native";
import { Usuario } from "../Model/Usuario";
import { UsuariosDAL } from "../Repo/RepositorioUsuario";

// Inicializa o Firebase
const auth = getAuth(app);

// Função para registrar um novo usuário
export const createAccountWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const userEmail = firebaseUser.email;

    if (!userEmail) {
         console.log("O email do usuário não está disponível.");

      throw new Error("O email do usuário não está disponível.");
    }
    if (!firebaseUser) {
      console.log
      throw new Error("Erro ao criar a conta do usuário.");
    }

    // Cria um novo objeto Usuario
    const novoUsuario: Partial<Usuario> = {
      usuarioId: firebaseUser.uid,
      email: userEmail,
      nome: ""
    };
    // Adiciona o usuário na coleção 'usuarios' do Firestore
    await UsuariosDAL.adicionarUsuario(novoUsuario);

    return firebaseUser;
  } catch (error) {
    console.log("deu erroo")
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

export const getCurrentUserId  = async () =>  {
  const auth = getAuth(); 
  const user = auth.currentUser; 
  return user ? user.uid : null; 
};


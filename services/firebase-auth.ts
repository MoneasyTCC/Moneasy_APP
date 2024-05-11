import { initializeApp } from 'firebase/app';
import { EmailAuthProvider, initializeAuth, reauthenticateWithCredential } from 'firebase/auth';
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
import AsyncStorage from '@react-native-async-storage/async-storage';



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
    const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
    const user = userCredential.user;

    // Armazena o token no AsyncStorage
    await AsyncStorage.setItem('@login_token', user.refreshToken);

    return user;
  } catch (error) {
    throw error;
  }
};

export const checkLogin = async () => {
  try {
    const token = await AsyncStorage.getItem('@login_token');
    return token !== null; // Retorna true se um token for encontrado
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
    await signOut(getAuth());
    await AsyncStorage.removeItem('@login_token'); // Remove o token ao fazer logout
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


const storeRefreshToken = async (refreshToken: string) => {
  try {
    await AsyncStorage.setItem('@refreshToken', refreshToken);
  } catch (error) {
    throw error;
  }
};


export const reauthenticate = async (currentPassword : any) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !user.email) {
    Alert.alert('Erro', 'Nenhum usuário ou e-mail encontrado para reautenticação');
    return false;
  }

  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  try {
    await reauthenticateWithCredential(user, cred);
    return true; 
  } catch (error) {
    Alert.alert('Erro de Reautenticação', (error as Error).message);
    return false; 
  }
};

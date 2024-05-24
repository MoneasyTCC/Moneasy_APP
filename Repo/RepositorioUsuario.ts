import { getFirestore, collection, addDoc } from "firebase/firestore";
import { Usuario } from "../Model/Usuario"; 

const db = getFirestore();

export const UsuariosDAL = {
  adicionarUsuario: async (novoUsuario:Partial<Usuario>) => {
    try {
      const docRef = await addDoc(collection(db, 'usuario'), {
        usuarioId: novoUsuario.usuarioId,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      });
      const usuarioId = docRef.id;
 
      return usuarioId;
    } catch (error: unknown) {
      if (error instanceof Error) { 
        throw new Error(`Erro ao adicionar usuário: ${error.message}`);
      } else { 
        throw new Error('Ocorreu um erro ao adicionar usuário.');
      }
    }
  },

};

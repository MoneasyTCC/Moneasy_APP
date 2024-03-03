import { getFirestore, collection, addDoc, query, where, getDocs,updateDoc,deleteDoc, doc, Timestamp } from "firebase/firestore";
import { Orcamento } from "../Model/Orcamento";
import { getCurrentUserId } from "../services/firebase-auth"; 

const db = getFirestore();

export const OrcamentoDAL = {
  // Função para adicionar uma nova orcamento
  adicionarOrcamento: async (novorocamento: Orcamento) => {
    const usuarioId = await getCurrentUserId();
    if (!usuarioId) throw new Error("Usuário não autenticado.");

    try {
      const docRef = await addDoc(collection(db, 'orcamento'), {
        ...novorocamento,
        usuarioId : usuarioId,
      });
      const orcamentoid = docRef.id;

      await updateDoc(doc(db, 'orcamento', orcamentoid), {
          id: orcamentoid,
      });

      console.log("orcamento adicionada com ID: ", orcamentoid);
      return orcamentoid;

    } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Erro ao adicionar orcamento: ${error.message}`);
        } else {
          throw new Error('Ocorreu um erro ao adicionar orcamento.');
        }
      }
  },

  buscarOrcamento: async () => {
    const usuarioId = await  getCurrentUserId();
    if (!usuarioId) throw new Error("Usuário não autenticado.");

    try {
      const q = query(collection(db, 'orcamento'), where("usuarioId", "==", usuarioId));
      const querySnapshot = await getDocs(q);
      const orcamentos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(orcamentos);
      return orcamentos;
    }  catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Erro ao adicionar orcamento: ${error.message}`);
        } else {
          throw new Error('Ocorreu um erro ao adicionar orcamento.');
        }
      }
  },


  deletarOrcamento: async (orcamentoid: string) => {
    try {
      await deleteDoc(doc(db, 'orcamento', orcamentoid));
      console.log("orcamento deletada com sucesso.");
    }  catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Erro ao adicionar orcamento: ${error.message}`);
        } else {
          throw new Error('Ocorreu um erro  ao adicionar orcamento.');
        }
      }
  },

  // Método para alterar uma orcamento
  alterarOrcamento: async (orcamentoid: string, novosDados: Partial<Orcamento>) => {
    try {
      const orcamentoRef = doc(db, 'orcamento', orcamentoid);
      await updateDoc(orcamentoRef, novosDados);
      console.log("orcamento atualizada com sucesso.");
    }  catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Erro ao adicionar orcamento: ${error.message}`);
        } else {
          throw new Error('Ocorreu um erro ao adicionar orcamento.');
        }
      }
  }
};
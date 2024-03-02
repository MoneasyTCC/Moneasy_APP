import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { Divida } from "../Model/Divida"; 
import { getCurrentUserId } from "../services/firebase-auth"; 

const db = getFirestore();

export const DividaDAL = {
  // Função para adicionar uma nova dívida
  adicionarDivida: async (novaDivida: Divida) => {
    const usuarioId = await getCurrentUserId();
    if (!usuarioId) throw new Error("Usuário não autenticado.");

    try {
      const docRef = await addDoc(collection(db, 'dividas'), {
        ...novaDivida,
        usuarioId:usuarioId,
        dataInicio: Timestamp.fromDate(novaDivida.dataInicio),
        dataVencimento: Timestamp.fromDate(novaDivida.dataVencimento)


      });
      const dividaId = docRef.id;

      // Atualiza o campo 'idDocumento' da nova categoria com o ID do documento
      await updateDoc(doc(db, 'transacoes', dividaId), {
          id: dividaId,
      });
  
      console.log("Categoria adicionada com ID: ", dividaId);
      return dividaId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao adicionar dívida: ${error.message}`);
      } else {
        throw new Error('Ocorreu um erro ao adicionar dívida.');
      }
    }
  },

  // Função para recuperar todas as dívidas de um usuário
  buscarDividas: async () => {
    const usuarioId = await getCurrentUserId();
    if (!usuarioId) throw new Error("Usuário não autenticado.");

    try {
      const q = query(collection(db, 'dividas'), where("usuarioId", "==", usuarioId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar dívidas: ${error.message}`);
      } else {
        throw new Error('Ocorreu um erro ao buscar dívidas.');
      }
    }
  },

  // Função para deletar uma dívida
  deletarDivida: async (dividaId: string) => {
    try {
      await deleteDoc(doc(db, 'dividas', dividaId));
      console.log("Dívida deletada com sucesso.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao deletar dívida: ${error.message}`);
      } else {
        throw new Error('Ocorreu um erro ao deletar dívida.');
      }
    }
  },

  // Função para alterar uma dívida
  alterarDivida: async (dividaId: string, novosDados: Partial<Divida>) => {
    try {
      const dividaRef = doc(db, 'dividas', dividaId);
      await updateDoc(dividaRef, novosDados);
      console.log("Dívida atualizada com sucesso.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao atualizar dívida: ${error.message}`);
      } else {
        throw new Error('Ocorreu um erro ao atualizar dívida.');
      }
    }
  }
};

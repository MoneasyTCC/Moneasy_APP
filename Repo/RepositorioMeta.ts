import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { Meta } from "../Model/Meta"; 
import { getCurrentUserId } from "../services/firebase-auth"; 

const db = getFirestore();

export const MetasDAL = {
  adicionarMeta: async (novaMeta: Meta) => {
    const usuarioId = await getCurrentUserId();
    if (!usuarioId) throw new Error("Usuário não autenticado.");

    try {
      const docRef = await addDoc(collection(db, 'metas'), {
        ...novaMeta,
        usuarioId : usuarioId,
        dataInicio: Timestamp.fromDate(novaMeta.dataInicio),
        dataFimPrevista: Timestamp.fromDate(novaMeta.dataFimPrevista)

      });
      const metaId = docRef.id;

      // Atualiza o campo 'idDocumento' da nova categoria com o ID do documento
      await updateDoc(doc(db, 'metas', metaId), {
          id: metaId,
      });
  
      console.log("Categoria adicionada com ID: ", metaId);
      return metaId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao adicionar meta: ${error.message}`);
      } else {
        throw new Error('Ocorreu um erro ao adicionar meta.');
      }
    }
  },
// Função para recuperar todas as metas de um usuário
buscarMetas: async () => {
    const usuarioId = await getCurrentUserId();
    if (!usuarioId) throw new Error("Usuário não autenticado.");
  
    try {
      const q = query(collection(db, 'metas'), where("usuarioId", "==", usuarioId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar metas: ${error.message}`);
      } else {
        throw new Error('Ocorreu um erro ao buscar metas.');
      }
    }
  },
  
  // Função para deletar uma meta
  deletarMeta: async (metaId: string) => {
    try {
      await deleteDoc(doc(db, 'metas', metaId));
      console.log("Meta deletada com sucesso.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao deletar meta: ${error.message}`);
      } else {
        throw new Error('Ocorreu um erro ao deletar meta.');
      }
    }
  },
  
  // Função para alterar uma meta
  alterarMeta: async (metaId: string, novosDados: Partial<Meta>) => {
    try {
      const metaRef = doc(db, 'metas', metaId);
      await updateDoc(metaRef, novosDados);
      console.log("Meta atualizada com sucesso.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao atualizar meta: ${error.message}`);
      } else {
        throw new Error('Ocorreu um erro ao atualizar meta.');
      }
    }}
};
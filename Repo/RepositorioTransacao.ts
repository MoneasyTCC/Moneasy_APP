import { 
    getFirestore, 
    collection, 
    addDoc, 
    Timestamp,
    query, 
    where, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc 
  } from "firebase/firestore";
  
  import { Transacao } from "../Model/Transacao";

  import { getCurrentUserId } from "../services/firebase-auth";

  const db = getFirestore();
  
  export const TransacaoDAL = {
    // Função para adicionar uma nova transação
   adicionarTransacao: async (novaTransacao: Transacao) => {
    const usuarioId = await getCurrentUserId();
  if (!usuarioId) throw new Error("Usuário não autenticado.");

  try {
    const docRef = await addDoc(collection(db, 'transacoes'), {
      ...novaTransacao,
      usuarioId: usuarioId, 
      data: Timestamp.fromDate(novaTransacao.data)
    });
    const transacaoId = docRef.id;

    // Atualiza o campo 'idDocumento' da nova categoria com o ID do documento
    await updateDoc(doc(db, 'transacoes', transacaoId), {
        id: transacaoId,
    });

    console.log("Categoria adicionada com ID: ", transacaoId);
    return transacaoId;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Erro ao adicionar transação: ${error.message}`);
        } else {
          throw new Error('Ocorreu um erro ao adicionar transação.');
        }
      }
    },
  
    // Função para recuperar todas as transações de um usuário
      buscarTransacoes: async () => {
      const usuarioId = await getCurrentUserId();
      if (!usuarioId) throw new Error("Usuário não autenticado.");
  
      console.log(usuarioId);
      try {
        const q = query(collection(db, 'transacoes'), where("usuarioId", "==", usuarioId));
        const querySnapshot = await getDocs(q);
        const transacoes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(transacoes);
        return transacoes;
    

      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Erro ao buscar transações: ${error.message}`);
        } else {
          throw new Error('Ocorreu um erro ao buscar transações.');
        }
      }
    },
  
    // Função para deletar uma transação
    deletarTransacao: async (transacaoId: string) => {
      try {
        await deleteDoc(doc(db, 'transacoes', transacaoId));
        console.log("Transação deletada com sucesso.");
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Erro ao deletar transação: ${error.message}`);
        } else {
          throw new Error('Ocorreu um erro ao deletar transação.');
        }
      }
    },
  
    // Método para alterar uma transação
    alterarTransacao: async (transacaoId: string, novosDados: Partial<Transacao>) => {
      try {
        const transacaoRef = doc(db, 'transacoes', transacaoId);
        await updateDoc(transacaoRef, novosDados);
        console.log("Transação atualizada com sucesso.");
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Erro ao atualizar transação: ${error.message}`);
        } else {
          throw new Error('Ocorreu um erro  ao atualizar transação.');
        }
      }
    }
  };
  
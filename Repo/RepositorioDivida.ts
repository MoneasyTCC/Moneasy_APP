import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { Divida } from "../Model/Divida";
import { getCurrentUserId } from "../services/firebase-auth";

const db = getFirestore();

export const DividaDAL = {
  // Função para adicionar uma nova dívida
  adicionarDivida: async (novaDivida: Divida) => {
    const usuarioId = await getCurrentUserId();
    if (!usuarioId) throw new Error("Usuário não autenticado.");

    try {
      const docRef = await addDoc(collection(db, "dividas"), {
        ...novaDivida,
        usuarioId: usuarioId,
        dataInicio: Timestamp.fromDate(novaDivida.dataInicio),
        dataVencimento: Timestamp.fromDate(novaDivida.dataVencimento),
      });
      const dividaId = docRef.id;

      // Atualiza o campo 'idDocumento' da nova categoria com o ID do documento
      await updateDoc(doc(db, "dividas", dividaId), {
        id: dividaId,
      });
 
      return dividaId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao adicionar dívida: ${error.message}`);
      } else {
        throw new Error("Ocorreu um erro ao adicionar dívida.");
      }
    }
  },

  // Função para recuperar todas as dívidas de um usuário
  buscarDividas: async () => {
    const usuarioId = await getCurrentUserId();
    if (!usuarioId) throw new Error("Usuário não autenticado.");

    try {
      const q = query(collection(db, "dividas"), where("usuarioId", "==", usuarioId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar dívidas: ${error.message}`);
      } else {
        throw new Error("Ocorreu um erro ao buscar dívidas.");
      }
    }
  },

  buscarDividasPorData: async (dataSelecionada: string) => {
    const usuarioId = await getCurrentUserId();
    if (!usuarioId) throw new Error("Usuário não autenticado.");

    try {
      const q = query(collection(db, "dividas"), where("usuarioId", "==", usuarioId));
      const querySnapshot = await getDocs(q);
      let dividas: any[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const dateSelected = new Date(dataSelecionada);

      dividas = dividas.filter((divida) => {
        const dataDivida = divida.dataInicio.toDate();
        return (
          dataDivida.getFullYear() === dateSelected.getFullYear() &&
          dataDivida.getMonth() === dateSelected.getMonth()
        );
      });

      return dividas;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar dividas por data: ${error.message}`);
      } else {
        throw new Error("Ocorreu um erro ao buscar dividas por data.");
      }
    }
  },

    buscarDividasPorStatusEAno: async (dividaStatus: string, year: string) => {
      const usuarioId = await getCurrentUserId();
      if (!usuarioId) throw new Error("Usuário não autenticado.");

      try {
        const q = query(collection(db, "dividas"), where("usuarioId", "==", usuarioId));
        const querySnapshot = await getDocs(q);
        let dividas: any[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const dateSelected = new Date(year);

        dividas = dividas.filter((divida) => {
            const dataDivida = divida.dataInicio.toDate();
             if (dataDivida.getFullYear() !== dateSelected.getFullYear()) {
                      return false;
                    } else {
                      return dataDivida.getFullYear() === dateSelected.getFullYear(), divida.status === dividaStatus;
                    } 
        });

        return dividas;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Erro ao buscar dividas por data: ${error.message}`);
        } else {
          throw new Error("Ocorreu um erro ao buscar dividas por data.");
        }
      }
    },

  // Função para deletar uma dívida
  deletarDivida: async (dividaId: string) => {
    try {
      await deleteDoc(doc(db, "dividas", dividaId)); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao deletar dívida: ${error.message}`);
      } else {
        throw new Error("Ocorreu um erro ao deletar dívida.");
      }
    }
  },

  // Função para alterar uma dívida
  alterarDivida: async (dividaId: string, novosDados: Partial<Divida>) => {
    try {
      const dividaRef = doc(db, "dividas", dividaId);
      await updateDoc(dividaRef, novosDados); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao atualizar dívida: ${error.message}`);
      } else {
        throw new Error("Ocorreu um erro ao atualizar dívida.");
      }
    }
  },
};

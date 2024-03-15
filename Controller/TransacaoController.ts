import { FlatList, View } from "react-native";
import { Transacao } from "../Model/Transacao";
import { TransacaoDAL } from "../Repo/RepositorioTransacao";
import { useEffect, useRef } from "react";


async function obterTransacoesPorData(dataSelecionada: Date) {
    const dataFormatada = dataSelecionada.toISOString().split('T')[0];
    try {
        var lista = await  TransacaoDAL.buscarTransacoesPorData(dataFormatada);
        
        return lista
    } catch (error) {
        console.error("Erro ao buscar transações: ", error);
        throw new Error("Erro ao buscar transações");
    }
}

async function obterSaldoPorMes(dataSelecionada: Date) {
    try {
      const transacoes = await obterTransacoesPorData(dataSelecionada);
      const entradas = transacoes.filter((transacao: Transacao) => transacao.tipo === 'entrada');
      const saidas = transacoes.filter((transacao: Transacao) => transacao.tipo === 'saida');
      const totalEntradas = entradas.reduce((total, transacao) => total + transacao.valor, 0);
      const totalSaidas = saidas.reduce((total, transacao) => total + transacao.valor, 0);
      const saldo = totalEntradas - totalSaidas;
  
      console.log("Total de entradas:", totalEntradas);
      console.log("Total de saidas:", totalSaidas);
      console.log("Saldo (Entradas - Saidas):", saldo);
  
      return { totalEntradas, totalSaidas, saldo };
    } catch (error) {
      console.error("Erro ao obter saldo: ", error);
      throw new Error("Erro ao obter saldo");
    }
  }
export { obterTransacoesPorData, obterSaldoPorMes};
  



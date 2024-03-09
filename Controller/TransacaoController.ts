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
export default obterTransacoesPorData;
  



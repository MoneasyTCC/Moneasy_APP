import { FlatList, View } from "react-native";
import { Orcamento } from "../Model/Orcamento";
import { OrcamentoDAL } from "../Repo/RepositorioOrcamento";
import { useEffect, useRef } from "react";

async function obterOrcamentosPorData(dataSelecionada: Date) {
  const dataFormatada = dataSelecionada.toISOString().split("T")[0];
  try {
    var lista = await OrcamentoDAL.buscarOrcamentosPorData(dataFormatada);

    return lista;
  } catch (error) {
    console.error("Erro ao buscar orçamentos: ", error);
    throw new Error("Erro ao buscar orçamentos");
  }
}

async function obterTotalERestantePorMes(dataSelecionada: Date) {
  try {
    const orcamentos = await obterOrcamentosPorData(dataSelecionada);
    const valorDefinidoTotal = orcamentos.reduce(
      (total, orcamento) => total + orcamento.valorDefinido,
      0
    );
    const valorAtualTotal = orcamentos.reduce(
      (total, orcamento) => total + orcamento.valorAtual,
      0
    );

    // console.log("valorDefinidoTotal: ", valorDefinidoTotal);
    // console.log("valorAtualTotal: ", valorAtualTotal);

    return { valorDefinidoTotal, valorAtualTotal };
  } catch (error) {
    console.error("Erro ao obter saldo: ", error);
    throw new Error("Erro ao obter saldo");
  }
}

export { obterOrcamentosPorData, obterTotalERestantePorMes };

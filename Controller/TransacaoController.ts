import { FlatList, View } from "react-native";
import { Transacao } from "../Model/Transacao";
import { TransacaoDAL } from "../Repo/RepositorioTransacao";
import { useEffect, useRef } from "react";

async function obterTransacoesPorData(dataSelecionada: Date) {
  const dataFormatada = dataSelecionada.toISOString().split("T")[0];
  try {
    var lista = await TransacaoDAL.buscarTransacoesPorData(dataFormatada);

    return lista;
  } catch (error) {
    console.error("Erro ao buscar transações: ", error);
    throw new Error("Erro ao buscar transações");
  }
}

async function obterTransacoesPorAno(dataSelecionada: Date) {
  const dataFormatada = dataSelecionada.toISOString().split("T")[0];
  try {
    var lista = await TransacaoDAL.buscarTransacoesPorAno(dataFormatada);

    return lista;
  } catch (error) {
    console.error("Erro ao buscar transações: ", error);
    throw new Error("Erro ao buscar transações");
  }
}

async function obterSaldoPorMes(dataSelecionada: Date) {
  try {
    const transacoes = await obterTransacoesPorData(dataSelecionada);
    const entradas = transacoes.filter((transacao: Transacao) => transacao.tipo === "entrada");
    const saidas = transacoes.filter((transacao: Transacao) => transacao.tipo === "saida");
    const totalEntradas = entradas.reduce((total, transacao) => total + transacao.valor, 0);
    const totalSaidas = saidas.reduce((total, transacao) => total + transacao.valor, 0);
    const saldo = totalEntradas - totalSaidas;

    // console.log("Total de entradas:", totalEntradas);
    // console.log("Total de saidas:", totalSaidas);
    // console.log("Saldo (Entradas - Saidas):", saldo);

    return { totalEntradas, totalSaidas, saldo };
  } catch (error) {
    console.error("Erro ao obter saldo: ", error);
    throw new Error("Erro ao obter saldo");
  }
}

async function obterEntradasESaidasPorAno(dataSelecionada: Date) {
  try {
    const transacoes = await obterTransacoesPorAno(dataSelecionada);

    // Inicializar arrays para armazenar os valores de entradas e saídas por mês
    const entradasPorMes = Array(12).fill(0); // Array de 12 elementos, um para cada mês
    const saidasPorMes = Array(12).fill(0); // Array de 12 elementos, um para cada mês

    // Array contendo os nomes abreviados dos meses
    const mesesAbreviados = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    // Iterar sobre as transações para calcular os valores de entradas e saídas por mês
    transacoes.forEach((transacao) => {
      const dataTransacao = transacao.data.toDate(); // Converter timestamp para Date
      const mes = dataTransacao.getMonth(); // Obter o mês da transação
      if (transacao.tipo === "entrada") {
        entradasPorMes[mes] += transacao.valor;
      } else if (transacao.tipo === "saida") {
        saidasPorMes[mes] += transacao.valor;
      }
    });

    // Construir objetos contendo o nome do mês e os valores de entradas e saídas
    const entradasESaidasPorMes = mesesAbreviados.map((mes, index) => ({
      mes,
      totalEntradas: entradasPorMes[index],
      totalSaidas: saidasPorMes[index],
    }));

    // Calcular o saldo total para cada mês
    const saldoPorMes = entradasESaidasPorMes.map(
      ({ totalEntradas, totalSaidas }) => totalEntradas - totalSaidas
    );

    // Retornar os resultados
    return { entradasESaidasPorMes, saldoPorMes };
  } catch (error) {
    console.error("Erro ao obter entradas e saídas por ano: ", error);
    throw new Error("Erro ao obter entradas e saídas por ano");
  }
}

export { obterTransacoesPorData, obterSaldoPorMes, obterEntradasESaidasPorAno };

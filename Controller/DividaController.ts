import { DividaDAL } from "../Repo/RepositorioDivida";

async function obterDividasPorData(dataSelecionada: Date) {
  const dataFormatada = dataSelecionada.toISOString().split("T")[0];
  try {
    var lista = await DividaDAL.buscarDividasPorData(dataFormatada);

    return lista;
  } catch (erro) {
    console.error("Erro ao buscar dividas: ", erro);
    throw new Error("Erro ao buscar dividas");
  }
}

export { obterDividasPorData };

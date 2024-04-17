import { MetasDAL } from "../Repo/RepositorioMeta";

async function obterMetasPorData(dataSelecionada: Date) {
  const dataFormatada = dataSelecionada.toISOString().split("T")[0];
  try {
    var lista = await MetasDAL.buscarMetasPorData(dataFormatada);

    return lista;
  } catch (error) {
    console.error("Erro ao buscar metas: ", error);
    throw new Error("Erro ao buscar metas");
  }
}

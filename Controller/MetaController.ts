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

async function obterMetasPorStatusEAno(metaStatus: string, dataSelecionada: Date) {
  const dataFormatada = dataSelecionada.toISOString().split("T")[0];
  try {
    var lista = await MetasDAL.buscarMetasPorStatusEAno(metaStatus, dataFormatada);

    return lista;
  } catch (error) {
    console.error("Erro ao buscar metas: ", error);
    throw new Error("Erro ao buscar metas");
  }
}

async function obterMetasPorAno(metaStatus: string, dataSelecionada: Date) {
  try {
    const metas = await obterMetasPorStatusEAno(metaStatus, dataSelecionada);

    const metasFormatadas = metas.map((meta) => ({
      titulo: meta.titulo,
      valorAtual: meta.valorAtual,
      valorObjetivo: meta.valorObjetivo,
    }));

    return metasFormatadas;
  } catch (erro) {
    console.error("Erro ao buscar metas: ", erro);
    throw new Error("Erro ao buscar metas");
  }
}

export { obterMetasPorData, obterMetasPorAno };

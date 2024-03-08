import { Transacao } from "../Model/Transacao";
import { TransacaoDAL } from "../Repo/RepositorioTransacao";



export const calcularSaldo = async (dataSelecionada:Date) => {
    const transacoes = await TransacaoDAL.buscarTransacoes(); 
  
    const MesEAnoSelecionado = (dataTransacao:Date) => {
      return (
        dataTransacao.getMonth() + 1 === dataSelecionada.getMonth() &&
        dataTransacao.getFullYear() === dataSelecionada.getFullYear()
      );
    };
  
    const totalEntradas = transacoes
      .filter((transacao) => transacao.tipo === 'entrada' && MesEAnoSelecionado(transacao.data))
      .reduce((acumulador, transacao) => acumulador + transacao.valor, 0);
  
    const totalSaidas = transacoes
      .filter((transacao) => transacao.tipo === 'saida' && MesEAnoSelecionado(transacao.data))
      .reduce((acumulador, transacao) => acumulador + transacao.valor, 0);

      const saldo = totalEntradas - totalSaidas;
    console.log(saldo)

    return {
      totalEntradas,
      totalSaidas,
      saldo
    };
  };
  

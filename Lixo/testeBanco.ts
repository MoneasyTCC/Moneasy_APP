import { OrcamentoDAL } from '../Repo/RepositorioOrcamento';
import { MetasDAL } from '../Repo/RepositorioMeta';

import { getCurrentUserId } from '../services/firebase-auth';
import { Orcamento } from '../Model/Orcamento';
import { Transacao } from '../Model/Transacao';

import { Meta } from '../Model/Meta'; // Import the missing 'Metas' type
import { TransacaoDAL } from '../Repo/RepositorioTransacao';
// Supondo que você já esteja dentro de um componente ou função onde o usuário está autenticado
// Supondo que você já esteja dentro de um componente ou função onde o usuário está autenticado

// A função adicionarNovaTransacao precisa ser assíncrona para usar await
// A função adicionarNovaTransacao precisa ser assíncrona para usar await
// Esta função deve ser assíncrona, pois depende de uma chamada assíncrona para getCurrentUserId
export const adicionarNovaTransacao = async () => {

try {
  // Espera pela resolução da Promise retornada por getCurrentUserId
  const usuarioId = await getCurrentUserId();
  
  if (usuarioId) {
    // Se temos um usuário autenticado, criamos a nova transação
    const novosDados: Transacao = {
      id:"",
      usuarioId: "",
      tipo:"entrada",
      valor:300,
      data:new Date(Date.now()),
      descricao:"TESTE VIDEO SOCORRO",
      moeda:"BRL"
    };
    
    // Agora podemos adicionar a transação ao banco de dados
    const id = await TransacaoDAL.adicionarTransacao(novosDados);
    alert(`Transacao adicionada com sucesso. ID: ${id}`);
  } else {
    alert('Usuário não está autenticado.');
  }
} catch (error) {
  alert('Erro ao alterar o orcamento');
}};
// A função adicionarNovaMeta precisa ser assíncrona para usar await
// Esta função deve ser assíncrona, pois depende de uma chamada assíncrona para getCurrentUserId
export const adicionarNovaMeta = async () => {
  try {
    // Espera pela resolução da Promise retornada por getCurrentUserId
    const usuarioId = await getCurrentUserId();

    if (usuarioId) {
      // Se temos um usuário autenticado, criamos a nova meta
      const novosDados:Meta = {
        id:"",
        usuarioId: "",
        titulo: "Nova Meta",
        valorAtual: 1 ,
        valorObjetivo: 20, 
        dataInicio: new Date(Date.now()),
        dataFimPrevista: new Date(Date.now()),
        status: "Pendente"
      };

      // Agora podemos adicionar a meta ao banco de dados
      const id = await MetasDAL.adicionarMeta(novosDados); 
    } else {
      alert('Usuário não está autenticado.');
    }
  } catch (error) {
    alert('Erro ao altertar a meta');
  }
};

// Chame esta função onde faz sentido no seu aplicativo, 
// após a autenticação do usuário e quando você quiser testar a inserção


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { Transacao } from "../Model/Transacao";
import obterTransacoesPorData from '../Controller/TransacaoController';
 
interface ListaDeTransacoesProps {
    dataSelecionada: Date;
  }
  const ListaDeTransacoes: React.FC<ListaDeTransacoesProps> = ({ dataSelecionada }) => {
    
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  useEffect(() => {
    const buscarTransacoes = async () => {
      try {
        if (!(dataSelecionada instanceof Date)) {
          throw new Error("A data selecionada é inválida.");
        }
        const transacoesObtidas = await obterTransacoesPorData(dataSelecionada);
        setTransacoes(transacoesObtidas);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Um erro ocorreu.";
        Alert.alert("Erro", errorMessage);
      }
    };

    buscarTransacoes();
  }, [dataSelecionada]);

const renderItem = ({ item }: { item: Transacao }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text>ID: {item.id}</Text>
        <Text>Valor: {item.valor}</Text>
        <Text>Descricao: {item.descricao}</Text>
        <Text>Data: {item.data ? new Date(item.data).toLocaleDateString() : 'Sem data'}</Text>
    </View>
);

  

  return (
    <FlatList
      data={transacoes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
};

export default ListaDeTransacoes;

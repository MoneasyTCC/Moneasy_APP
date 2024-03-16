import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Alert, StyleSheet } from "react-native";
import { Transacao } from "../Model/Transacao";
import { obterTransacoesPorData } from "../Controller/TransacaoController";
// import Money from "../assets/transacoes/money.png";

interface ListaDeTransacoesProps {
  dataSelecionada: Date;
}
const ListaDeTransacoes: React.FC<ListaDeTransacoesProps> = ({
  dataSelecionada,
}) => {
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
        const errorMessage =
          error instanceof Error ? error.message : "Um erro ocorreu.";
        Alert.alert("Erro", errorMessage);
      }
    };

    buscarTransacoes();
  }, [dataSelecionada]);
  
  const getValueStyle = (tipo: string) => {
    return tipo === 'entrada' ? styles.valueEntrada : styles.valueSaida;
  };
  const renderItem = ({ item }: { item: Transacao }) => (
    <View style={styles.container}>
      <View style={styles.icon}>{}</View>
      <Text style={styles.text}>{item.tipo}</Text>
      <Text style={[styles.text, getValueStyle(item.tipo)]}>R${item.valor.toFixed(2)}</Text>
      <Text style={styles.checkmark}>
        {}
      </Text>
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
const styles = StyleSheet.create({
  valueEntrada: {
    color: '#0FEC32',
  },
  valueSaida: {
    color: '#B22222'
  },
  container: {
    padding: 20,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  value: {
    fontWeight: "bold",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  checkmark: {
    color: "green",
  },
});
export default ListaDeTransacoes;

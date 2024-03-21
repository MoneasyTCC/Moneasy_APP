import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
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
  const [isModalVisible, setModalVisible] = useState(false);

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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const getValueStyle = (tipo: string) => {
    return tipo === "entrada" ? styles.valueEntrada : styles.valueSaida;
  };
  const renderItem = ({ item }: { item: Transacao }) => (
    <TouchableOpacity onPress={toggleModal}>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button title="fechar" onPress={toggleModal}></Button>
            <Text>Teste</Text>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        {/* <View style={styles.icon}>{}</View> */}
        <Text style={styles.text}>{item.tipo}</Text>
        <Text style={[styles.text, getValueStyle(item.tipo)]}>
          R${item.valor.toFixed(2)}
        </Text>
        {/* <Text style={styles.checkmark}>
        {}
      </Text> */}
      </View>
    </TouchableOpacity>
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
    color: "#0FEC32",
  },
  valueSaida: {
    color: "#B22222",
  },
  container: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#424242",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 5.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
export default ListaDeTransacoes;

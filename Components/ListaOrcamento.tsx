import React, { useState, useEffect } from "react";
import { Orcamento } from "../Model/Orcamento";
import { obterOrcamentosPorData } from "../Controller/OrcamentoController";
import {
  Alert,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface ListaDeOrcamentosProps {
  dataSelecionada: Date;
}

const ListaDeOrcamentos: React.FC<ListaDeOrcamentosProps> = ({
  dataSelecionada,
}) => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItemCategoria, setSelectedItemCategoria] = useState("");
  const [selectedItemValorAtual, setSelectedItemValorAtual] = useState("");
  const [selectedItemValorDefinido, setSelectedItemValorDefinido] =
    useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemData, setSelectedItemData] = useState(new Date());

  useEffect(() => {
    const buscarOrcamentos = async () => {
      try {
        if (!(dataSelecionada instanceof Date)) {
          throw new Error("Data inválida");
        }
        const orcamentosObtidos = await obterOrcamentosPorData(dataSelecionada);
        setOrcamentos(orcamentosObtidos);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Um erro ocorreu";
        Alert.alert("Erro", errorMessage);
      }
    };
    buscarOrcamentos();
  }, [dataSelecionada]);

  const toggleModal = (
    itemCategoria: string,
    itemId: string,
    itemValorAtual: number,
    itemValorDefinido: number
  ) => {
    setSelectedItemCategoria(itemCategoria);
    setSelectedItemId(itemId);
    setSelectedItemValorAtual(itemValorAtual.toString());
    setSelectedItemValorDefinido(itemValorDefinido.toString());
    setIsModalVisible(!isModalVisible);
    console.log("modal aberto");
  };

  const renderItem = ({ item }: { item: Orcamento }) => (
    <TouchableOpacity
      onPress={() =>
        toggleModal(
          item.categoria,
          item.id,
          item.valorAtual,
          item.valorDefinido
        )
      }
    >
      <View style={styles.container}>
        <Text style={styles.text}>{item.categoria}</Text>
        <View style={styles.valoresContainer}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.text}>Valor Atual</Text>
            <Text style={styles.textValor}>R${item.valorAtual},00</Text>
          </View>
          <View style={styles.separador}></View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.text}>Valor Total</Text>
            <Text style={styles.textValor}>R${item.valorDefinido},00</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <FlatList
      data={orcamentos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => (
        <View style={{ borderBottomWidth: 1, borderBottomColor: "#fff" }} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  textValor: {
    color: "#0fec32",
    fontSize: 18,
    fontWeight: "bold",
  },
  valoresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 280,
    paddingTop: 10,
  },
  separador: {
    backgroundColor: "#656865",
    width: 1,
  },
});

export default ListaDeOrcamentos;

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
  TextInput,
} from "react-native";
import { Transacao } from "../Model/Transacao";
import { obterTransacoesPorData } from "../Controller/TransacaoController";
import { TransacaoDAL } from "../Repo/RepositorioTransacao";
// import Money from "../assets/transacoes/money.png";

interface ListaDeTransacoesProps {
  dataSelecionada: Date;
}
const ListaDeTransacoes: React.FC<ListaDeTransacoesProps> = ({
  dataSelecionada,
}) => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItemValue, setSelectedItemValue] = useState<number | null>(
    null
  );
  const [selectedItemTipo, setSelectedItemTipo] = useState<string | null>(null);
  const [selectedItemNome, setSelectedItemNome] = useState<string | null>(null);
  const [selectedItemData, setSelectedItemData] = useState<Date | null>(null);
  const [dataTextInput, setDataTextInput] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [isEditable, setIsEditable] = useState(false);
  const [updateLista, setUpdateLista] = useState(false);

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
    setUpdateLista(false);
  }, [dataSelecionada, updateLista]);

  const toggleModal = (
    itemValue: number,
    itemTipo: string,
    itemNome: string,
    itemData: Date,
    itemId: string
  ) => {
    setSelectedItemValue(itemValue);
    setSelectedItemTipo(itemTipo);
    setSelectedItemNome(itemNome);
    setSelectedItemId(itemId);
    let seconds = 0;
    let nanoseconds = 0;
    const matches = itemData.toString().match(/\d+/g);
    if (matches && matches.length >= 2) {
      seconds = parseInt(matches[0]);
      nanoseconds = parseInt(matches[1]);
    }
    const timestamp = new Date(seconds * 1000 + nanoseconds / 1000000);
    const formattedDate = timestamp;
    setSelectedItemData(formattedDate);
    setDataTextInput(formattedDate.toLocaleDateString("pt-BR"));
    //console.log(itemData.toString());
    //console.log(`seconds: ${seconds}, nanoseconds: ${nanoseconds}`);
    //console.log(formattedDate.toLocaleDateString("pt-BR"));
    console.log(itemId);
    setModalVisible(!isModalVisible);
  };

  const handleDeletarTransacao = async (transacaoId: string) => {
    try {
      TransacaoDAL.deletarTransacao(transacaoId);
      alert("Transação deletada com sucesso.");
      console.log("Transação deletada com sucesso.");
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const getValueStyle = (tipo: string) => {
    return tipo === "entrada" ? styles.valueEntrada : styles.valueSaida;
  };
  const renderItem = ({ item }: { item: Transacao }) => (
    <TouchableOpacity
      onPress={() =>
        toggleModal(item.valor, item.tipo, item.nome, item.data, item.id)
      }
    >
      <View style={styles.container}>
        {/* <View style={styles.icon}>{}</View> */}
        <Text style={styles.text}>
          {item.nome.length > 15
            ? `${item.nome.substring(0, 15)}...`
            : item.nome}
        </Text>
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
    <>
      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={selectedItemNome?.toString()}
              editable={isEditable}
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={selectedItemValue?.toString()}
              editable={isEditable}
            />
            <TextInput
              style={styles.input}
              placeholder="dd/mm/yyyy"
              //showSoftInputOnFocus={false}
              editable={isEditable}
              caretHidden={true}
              value={dataTextInput}
            />
            <View style={styles.buttonGroup}>
              {isEditable ? (
                <>
                  <Button title="Confirmar" color="#4CAF50" />
                  <Button
                    title="Cancelar"
                    color="#B22222"
                    onPress={() => setIsEditable(false)}
                  />
                </>
              ) : (
                <>
                  <Button
                    title="Editar"
                    color="#4CAF50"
                    onPress={() => setIsEditable(true)}
                  />
                  <Button
                    title="Excluir"
                    color="#B22222"
                    onPress={() => handleDeletarTransacao(selectedItemId)}
                  />
                  <Button
                    title="Cancelar"
                    onPress={() => setModalVisible(false)}
                    color="#757575"
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#616161",
    borderRadius: 10,
    color: "white",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 20,
    width: "100%",
  },
});
export default ListaDeTransacoes;

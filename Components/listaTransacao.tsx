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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItemValue, setSelectedItemValue] = useState<string>("");
  const [selectedItemTipo, setSelectedItemTipo] = useState<string>("");
  const [selectedItemNome, setSelectedItemNome] = useState<string>("");
  const [selectedItemData, setSelectedItemData] = useState<Date>(new Date());
  const [dataTextInput, setDataTextInput] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [isEditable, setIsEditable] = useState(false);
  const [updateLista, setUpdateLista] = useState(false);
  const [novoValor, setNovoValor] = useState<string>("");
  const [novoNome, setNovoNome] = useState<string>("");

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
    setSelectedItemValue(itemValue.toString());
    setSelectedItemTipo(itemTipo);
    setSelectedItemNome(itemNome);
    setSelectedItemId(itemId);
    setNovoNome(itemNome);
    setNovoValor(itemValue.toString());
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
    setIsModalVisible(!isModalVisible);
  };

  const handleDeletarTransacao = async (transacaoId: string) => {
    try {
      await TransacaoDAL.deletarTransacao(transacaoId);
      alert("Transação deletada com sucesso.");
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAlterarTransacao = async (transacaoId: string) => {
    const novoValorNumber = isNaN(parseFloat(novoValor))
      ? 0
      : parseFloat(novoValor);
    try {
      const novosDados: Partial<Transacao> = {
        valor: novoValorNumber,
        nome: novoNome,
      };
      await TransacaoDAL.alterarTransacao(transacaoId, novosDados);
      alert("Transação alterada com sucesso.");
      setIsModalVisible(false);
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
              value={isEditable ? novoNome : selectedItemNome?.toString()}
              editable={isEditable}
              onChangeText={setNovoNome}
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={
                isEditable
                  ? novoValor?.toString()
                  : selectedItemValue?.toString()
              }
              editable={isEditable}
              onChangeText={setNovoValor}
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
                  <Button
                    title="Confirmar"
                    color="#4CAF50"
                    onPress={() => {
                      handleAlterarTransacao(selectedItemId);
                      setIsEditable(false);
                    }}
                  />
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
                    onPress={() => setIsModalVisible(false)}
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

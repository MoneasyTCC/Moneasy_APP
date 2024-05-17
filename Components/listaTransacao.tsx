import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Alert, // Certifique-se de importar Alert do react-native
} from "react-native";
import { Transacao } from "../Model/Transacao";
import { obterTransacoesPorData } from "../Controller/TransacaoController";
import { TransacaoDAL } from "../Repo/RepositorioTransacao";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import AwesomeAlert from "react-native-awesome-alerts"; // Certifique-se de importar AwesomeAlert

interface ListaDeTransacoesProps {
  dataSelecionada: Date;
  onTransacaoAlterada: () => void; // Callback quando a transação é alterada
}

type DateTimePickerMode = "date" | "time" | "datetime";

const ListaDeTransacoes: React.FC<ListaDeTransacoesProps> = ({
  dataSelecionada,
  onTransacaoAlterada,
}) => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItemValue, setSelectedItemValue] = useState<string>("");
  const [selectedItemNome, setSelectedItemNome] = useState<string>("");
  const [dataTextInput, setDataTextInput] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [isEditable, setIsEditable] = useState(false);
  const [updateLista, setUpdateLista] = useState(false);
  const [novoValor, setNovoValor] = useState<string>("");
  const [novoNome, setNovoNome] = useState<string>("");
  const [modo, setModo] = useState<DateTimePickerMode | undefined>(undefined);
  const [show, setShow] = useState(false);
  const [novaData, setNovaData] = useState(new Date());

  // Variáveis para controlar os AwesomeAlerts
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [idParaDeletar, setIdParaDeletar] = useState("");

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

  const onChange = (
    evento: DateTimePickerEvent,
    dataSelecionada?: Date | undefined
  ) => {
    if (evento.type === "set" && dataSelecionada) {
      const dataAtual = dataSelecionada || novaData;
      setShow(Platform.OS === "ios");
      setNovaData(dataAtual);
      setDataTextInput(dataAtual.toLocaleDateString("pt-BR"));
      setShow(false);
    } else if (evento.type === "dismissed") {
      setShow(false);
    }
  };

  const showMode = (modoAtual: DateTimePickerMode) => {
    if (modoAtual === "date") {
      setShow(true);
    }
    setModo(modoAtual);
  };

  const toggleModal = (
    itemValue: number,
    itemNome: string,
    itemData: Date,
    itemId: string
  ) => {
    setSelectedItemValue(itemValue.toString());
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
    setDataTextInput(formattedDate.toLocaleDateString("pt-BR"));
    setIsModalVisible(!isModalVisible);
  };

  const handleDeletarTransacao = async (transacaoId: string) => {
    setIdParaDeletar(transacaoId);
    setShowConfirmAlert(true);
  };

  const confirmarDelecaoTransacao = async () => {
    try {
      await TransacaoDAL.deletarTransacao(idParaDeletar);
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
      onTransacaoAlterada();
      setShowSuccessAlert(true);
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao tentar deletar a transação.");
      setShowErrorAlert(true);
    }
    setShowConfirmAlert(false);
  };

  const handleAlterarTransacao = async (transacaoId: string) => {
    const novoValorNumber = isNaN(parseFloat(novoValor))
      ? 0
      : parseFloat(novoValor);
    try {
      const novosDados: Partial<Transacao> = {
        valor: novoValorNumber,
        nome: novoNome,
        data: novaData,
      };
      await TransacaoDAL.alterarTransacao(transacaoId, novosDados);
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
      onTransacaoAlterada(); // Callback chamado aqui
      setShowSuccessAlert(true); // Mostra o alert de sucesso
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao tentar alterar a transação.");
      setShowErrorAlert(true); // Mostra o alert de erro
    }
  };

  const getValueStyle = (tipo: string) => {
    return tipo === "entrada" ? styles.valueEntrada : styles.valueSaida;
  };

  const renderItem = ({ item }: { item: Transacao }) => (
    <TouchableOpacity
      onPress={() => toggleModal(item.valor, item.nome, item.data, item.id)}
    >
      <View style={styles.container}>
        <Text style={styles.text}>
          {item.nome.length > 15
            ? `${item.nome.substring(0, 15)}...`
            : item.nome}
        </Text>
        <Text style={[styles.text, getValueStyle(item.tipo)]}>
          R${item.valor.toFixed(2)}
        </Text>
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
              placeholderTextColor="#FFFFFF"
              value={isEditable ? novoNome : selectedItemNome?.toString()}
              editable={isEditable}
              onChangeText={setNovoNome}
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Valor"
              placeholderTextColor="#FFFFFF"
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
              placeholderTextColor="#FFFFFF"
              onPressIn={() => showMode("date")}
              showSoftInputOnFocus={false}
              editable={isEditable}
              caretHidden={true}
              value={dataTextInput}
            />
            <View style={styles.buttonGroup}>
              {isEditable ? (
                <>
                  <View style={styles.botoesDivRow}>
                    <TouchableOpacity
                      style={[styles.btn, styles.Editar]}
                      onPress={() => {
                        handleAlterarTransacao(selectedItemId);
                        setIsEditable(false);
                      }}
                    >
                      <Text style={styles.labelModal}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btn, styles.Excluir]}
                      onPress={() => setIsEditable(false)}
                    >
                      <Text style={styles.labelModal}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.botoesDiv}>
                    <View style={styles.botoesDivRow}>
                      <TouchableOpacity
                        style={[styles.btn, styles.Editar]}
                        onPress={() => setIsEditable(true)}
                      >
                        <Text style={styles.labelModal}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.btn, styles.Excluir]}
                        onPress={() => handleDeletarTransacao(selectedItemId)}
                      >
                        <Text style={styles.labelModal}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <Text
                        style={styles.labelModal}
                        onPress={() => setIsModalVisible(false)}
                      >
                        Cancelar
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={novaData}
                mode={modo}
                is24Hour={true}
                display="default"
                onChange={onChange}
                {...(Platform.OS === "android" && { is24Hour: true })}
              />
            )}
          </View>
        </View>
      </Modal>

      <AwesomeAlert
        show={showConfirmAlert}
        showProgress={false}
        title="Confirmar Exclusão"
        message="Você tem certeza que deseja deletar esta transação?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Cancelar"
        confirmText="Sim"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => setShowConfirmAlert(false)}
        onConfirmPressed={confirmarDelecaoTransacao}
      />

      <AwesomeAlert
        show={showSuccessAlert}
        showProgress={false}
        title="Sucesso!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#0FEC32"
        onConfirmPressed={() => setShowSuccessAlert(false)}
      />

      <AwesomeAlert
        show={showErrorAlert}
        showProgress={false}
        title="Erro"
        message={errorMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#EC0F0F"
        onConfirmPressed={() => setShowErrorAlert(false)}
      />
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
    width: "90%",
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
    width: "90%",
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#616161",
    borderRadius: 10,
    color: "#ffffff",
    opacity: 0.7,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 20,
    width: "100%",
  },
  labelModal: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    height: 40,
    borderRadius: 20,
    marginVertical: 12,
    marginHorizontal: 5,
  },
  Editar: {
    backgroundColor: "#0FEC32", // Verde para editar
  },
  Excluir: {
    backgroundColor: "#EC0F0F", // Vermelho para excluir
  },
  Cancelar: {
    backgroundColor: "#EC0F0F", // Vermelho escuro para cancelar
  },
  botoesDiv: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  botoesDivRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
export default ListaDeTransacoes;

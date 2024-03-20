import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
  Platform,
  TouchableOpacity,
  FlatList,
  FlatListProps,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import { Shadow } from "react-native-shadow-2";
import { adicionarNovaMeta } from "../../../services/testeBanco";
import { adicionarNovaTransacao } from "../../../services/testeBanco";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Transacao } from "../../../Model/Transacao";
import { TransacaoDAL } from "../../../Repo/RepositorioTransacao";
import ListaDeTransacoes from "../../../Components/listaTransacao";
import { obterSaldoPorMes } from "../../../Controller/TransacaoController";
import DropDownPicker from "react-native-dropdown-picker";
import NavigationBar from "../menuNavegation";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

type DateTimePickerMode = "date" | "time" | "datetime";

// Use as props na definição do seu componente
export default function HomeScreen({ navigation }: Props) {
  var [isModalVisible, setModalVisible] = useState(false);
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date());
  const [modo, setModo] = useState<DateTimePickerMode | undefined>(undefined);
  const [show, setShow] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState("");
  const [dataTextInput, setDataTextInput] = useState("");
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [checkNovaTransacao, setcheckNovaTransacao] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [items, setItems] = useState([
    { label: "Janeiro", value: "1" },
    { label: "Fevereiro", value: "2" },
    { label: "Março", value: "3" },
    { label: "Abril", value: "4" },
    { label: "Maio", value: "5" },
    { label: "Junho", value: "6" },
    { label: "Julio", value: "7" },
    { label: "Agosto", value: "8" },
    { label: "Setembro", value: "9" },
    { label: "Outubro", value: "10" },
    { label: "Novembro", value: "11" },
    { label: "Dezembro", value: "12" },
  ]);

  const dataParaTestes = new Date("2024-03-09T00:00:00Z");

  const [valuesObject, setValuesObject] = useState<{
    totalEntradas?: number;
    totalSaidas?: number;
    saldo?: number;
  }>({});

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleObterSaldoPorMes = async () => {
    try {
      const result = await obterSaldoPorMes(dataSelecionada);
      setValuesObject(result);
      console.log(result);
    } catch (error) {
      console.error("Erro ao obter saldo: ", error);
    }
  };

  const getCurrentMonth = () => {
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    const currentDate = new Date();
    return monthNames[currentDate.getMonth()];
  };

  /* const [dropdownValue, setdropdownValue] = useState(getCurrentMonth()); */

  /* const converterDataParaFirebase = () => {
    let mes = dropdownValue;
    const dataFirebase = new Date(
      `2024-${mes}-${new Date().getDate()}T${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}Z`
    );
    // console.log(dataFirebase);
    setDataSelecionada(dataFirebase);
    return dataFirebase;
  }; */

  /* useEffect(() => {
    handleObterSaldoPorMes();
    setcheckNovaTransacao(false);
  }, [dataSelecionada, checkNovaTransacao]); */

  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [saldo, setSaldo] = useState<number | null>(null);

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const [monthIndex, setMonthIndex] = useState(dataSelecionada.getMonth());

  const updateMonth = (newMonthIndex: number) => {
    setMonthIndex(newMonthIndex);
    const newData = new Date(dataSelecionada.getFullYear(), newMonthIndex, 1);
    setDataSelecionada(newData);
    updateSaldo(newData);
  };

  const handlePreviousMonth = () => {
    const newMonthIndex = monthIndex > 0 ? monthIndex - 1 : 11;
    updateMonth(newMonthIndex);
  };

  const handleNextMonth = () => {
    const newMonthIndex = monthIndex < 11 ? monthIndex + 1 : 0;
    updateMonth(newMonthIndex);
  };

  const updateSaldo = async (date: Date) => {
    try {
      const resultadoSaldo = await obterSaldoPorMes(date);
      if (resultadoSaldo && typeof resultadoSaldo.saldo === "number") {
        setSaldo(resultadoSaldo.saldo);
      } else {
        setSaldo(null); // ou um valor padrão que você desejar
        console.warn("Saldo não encontrado ou o valor não é um número.");
      }
    } catch (error) {
      console.error("Erro ao obter saldo:", error);
    }
  };

  useEffect(() => {
    updateSaldo(dataSelecionada);
  }, [dataSelecionada]);

  const handleNovoCalculo = () => {
    setcheckNovaTransacao(true);
  };

  const novosDados: Transacao = {
    id: "",
    usuarioId: "",
    tipo: tipoTransacao,
    valor: parseFloat(valor),
    data: data,
    descricao: descricao,
    moeda: "BRL",
  };

  const handleTransacao = async () => {
    try {
      const valorFloat = isNaN(parseFloat(valor)) ? 0 : parseFloat(valor); // Validação adicionada aqui
      const novosDados: Transacao = {
        id: "",
        usuarioId: "",
        tipo: tipoTransacao,
        valor: valorFloat,
        data: data,
        descricao: descricao,
        moeda: "BRL",
      };
      await TransacaoDAL.adicionarTransacao(novosDados);
      Alert.alert("Transação adicionada com Sucesso!");
      handleNovoCalculo();
    } catch (err) {
      Alert.alert("Erro ao adicionar transação");
    }
  };

  const onChange = (
    evento: DateTimePickerEvent,
    dataSelecionada?: Date | undefined
  ) => {
    if (evento.type === "set" && dataSelecionada) {
      const dataAtual = dataSelecionada || data;
      setShow(Platform.OS === "ios");
      setData(dataAtual);
      setDataTextInput(data.toLocaleDateString("pt-BR"));
      let tempData = new Date(dataAtual);
      let fData =
        tempData.getDate() +
        "/" +
        (tempData.getMonth() + 1) +
        "/" +
        tempData.getFullYear();
      // console.log(fData);
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

  const handleTipoTransacaoEntrada = () => {
    setTipoTransacao("entrada");
    toggleModal();
  };

  const handleTipoTransacaoSaida = () => {
    setTipoTransacao("saida");
    toggleModal();
  };

  const handleCancelarTransacao = () => {
    setTipoTransacao("");
    setDataTextInput("");
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuHeader}>
        <View style={styles.mesHeader}>
          <TouchableOpacity
            onPress={handlePreviousMonth}
            style={styles.arrowButton}
          >
            <Text style={styles.arrowText}>&lt;</Text>
          </TouchableOpacity>
          <Text style={styles.mesLabel}>{monthNames[monthIndex]}</Text>
          <TouchableOpacity
            onPress={handleNextMonth}
            style={styles.arrowButton}
          >
            <Text style={styles.arrowText}>&gt;</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.saldoAtual}>
            R$ {saldo ? saldo.toFixed(2) : "0.00"}
          </Text>
        </View>
        <View style={styles.buttons}>
          <View style={styles.rendas}>
            <TouchableOpacity
              style={styles.entradaBtn}
              onPress={handleTipoTransacaoEntrada}
            >
              <Text
                style={{ fontSize: 50, textAlign: "center", lineHeight: 55 }}
              >
                +
              </Text>
            </TouchableOpacity>
            <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
              R$ {String(valuesObject?.totalEntradas)}
            </Text>
          </View>
          <View style={styles.despesas}>
            <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
              R$ {String(valuesObject?.totalSaidas)}
            </Text>
            <TouchableOpacity
              style={styles.saidaBtn}
              onPress={handleTipoTransacaoSaida}
            >
              <Text
                style={{ fontSize: 50, textAlign: "center", lineHeight: 55 }}
              >
                -
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Valor"
                keyboardType="numeric"
                value={valor}
                onChangeText={setValor}
              />
              <TextInput
                style={styles.input}
                placeholder="dd/mm/yyyy"
                onPressIn={() => showMode("date")}
                showSoftInputOnFocus={false}
                caretHidden={true}
                value={dataTextInput}
              />
              <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={descricao}
                onChangeText={setDescricao}
              />
              <View style={styles.buttonGroup}>
                <Button
                  title="Adicionar"
                  onPress={handleTransacao}
                  color="#4CAF50"
                />
                <Button
                  title="Cancelar"
                  onPress={handleCancelarTransacao}
                  color="#757575"
                />
              </View>

              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={data}
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
      </View>
      <View style={styles.menuBody}>
        <View style={styles.content}>{/* Body */}</View>
      </View>
      <View style={styles.menuFooter}>
        <NavigationBar/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2B2B2B",
  },
  menuHeader: {
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "35%",
    backgroundColor: "#3A3E3A",
  },
  mesHeader: {
    flexDirection: "row",
  },
  menuBody: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  content: {
    borderRadius: 40,
    width: "90%",
    flex: 1,
    backgroundColor: "#3A3E3A",
    padding: 20,
  },
  menuFooter: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "15%",
    backgroundColor: "#3A3E3A",
  },
  text: {
    fontSize: 60,
    marginBottom: 20,
  },
  entradaBtn: {
    width: 50,
    height: 50,
    backgroundColor: "#17fc3d",
    borderRadius: 50,
    alignItems: "center",
  },
  saidaBtn: {
    width: 50,
    height: 50,
    backgroundColor: "#ff0f00",
    borderRadius: 50,
    alignItems: "center",
  },
  rendas: {
    alignItems: "center",
    flexDirection: "row",
    width:"40%",
  },
  despesas: {
    alignItems: "center",
    flexDirection: "row",
    width:"40%",
  },
  buttons: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  arrowButton: { padding: 5 , paddingBottom:15},
  arrowText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 30,
  },
  saldoBody: {
    alignItems: "center",
  },
  mesLabel: {
    color: "#ffffff",
    width: "35%",
    textAlign: "center",
    fontSize: 26,
  },
  saldoText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#ffffff",
  },
  saldoAtual: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#ffffff",
  },
});

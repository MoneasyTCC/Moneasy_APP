import React, { useState, useEffect, useRef } from "react";
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
  ActivityIndicator,
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
import CotacaoDolar from "../../../Components/cotacao";
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
  const [nome, setNome] = useState("");
  const [data, setData] = useState(new Date());
  const [modo, setModo] = useState<DateTimePickerMode | undefined>(undefined);
  const [show, setShow] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState("");
  const [dataTextInput, setDataTextInput] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [checkNovaTransacao, setcheckNovaTransacao] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const saldoCache = useRef<Map<string, SaldoMes>>(new Map());
  const [mostrarValores, setMostrarValores] = useState(true);

  const toggleValoresVisiveis = () => {
    setMostrarValores(!mostrarValores);
  };

  const [valuesObject, setValuesObject] = useState<{
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
  }>({
    totalEntradas: 0,
    totalSaidas: 0,
    saldo: 0,
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  interface SaldoMes {
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
  }

  const obterSaldoPorMesComCache = async (data: Date): Promise<SaldoMes> => {
    const chaveCache = data.toISOString().slice(0, 7); // Formato "AAAA-MM"
    if (saldoCache.current.has(chaveCache)) {
      return saldoCache.current.get(chaveCache)!;
    }
    // Supondo que obterSaldoPorMes retorne uma Promise<SaldoMes>
    const resultado = await obterSaldoPorMes(data);
    saldoCache.current.set(chaveCache, resultado);
    return resultado;
  };

  const handleObterSaldoPorMes = async () => {
    setIsLoading(true);
    try {
      // Assegure-se de que obterSaldoPorMesComCache retorne o objeto esperado
      const result: SaldoMes = await obterSaldoPorMesComCache(dataSelecionada);
      setValuesObject(result);
      // Não há necessidade de um estado separado para `saldo` se ele já está incluído em `valuesObject`
    } catch (error) {
      console.error("Erro ao obter saldo: ", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleNovoCalculo = () => {
    setcheckNovaTransacao(true);
  };

  const novosDados: Transacao = {
    id: "",
    usuarioId: "",
    tipo: tipoTransacao,
    valor: parseFloat(valor),
    data: data,
    nome: nome,
    moeda: "BRL",
  };

  const handleTransacao = async () => {
    try {
      const valorFloat = isNaN(parseFloat(valor)) ? 0 : parseFloat(valor);

      // Cria uma data de transação baseada no mês e ano selecionados, mas mantendo o dia atual,
      // ou o dia 1 se desejar representar a transação simplesmente no mês selecionado sem um dia específico.
      // Nota: Ajuste essa lógica conforme necessário para atender ao requisito exato de data da transação.
      const dataTransacao = new Date(
        dataSelecionada.getFullYear(),
        dataSelecionada.getMonth(),
        dataSelecionada.getDate()
      );

      const novosDados: Transacao = {
        id: "",
        usuarioId: "",
        tipo: tipoTransacao,
        valor: valorFloat,
        data: dataTransacao, // Usando a dataTransacao ajustada aqui
        nome: nome,
        moeda: "BRL",
      };

      await TransacaoDAL.adicionarTransacao(novosDados);
      Alert.alert("Transação adicionada com Sucesso!");

      // Invalidate o cache do mês específico da nova transação
      const chaveCache = dataTransacao.toISOString().slice(0, 7);
      saldoCache.current.delete(chaveCache);

      // Recarrega os dados do saldo para refletir a nova transação
      await handleObterSaldoPorMes();
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

  useEffect(() => {
    updateSaldo(dataSelecionada);
    handleObterSaldoPorMes();
  }, [dataSelecionada]);

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
          {isLoading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <Text style={styles.saldoAtual}>
              {mostrarValores
                ? `R$ ${
                    valuesObject.saldo ? valuesObject.saldo.toFixed(2) : "0.00"
                  }`
                : "R$ --"}
            </Text>
          )}
        </View>
        <View style={styles.spacer}></View>
        <View style={styles.buttons}>
          <View style={styles.rendas}>
            <TouchableOpacity
              style={styles.entradaBtn}
              onPress={handleTipoTransacaoEntrada}
            >
              <Image
                source={require("../../../assets/setaCima.png")} // Ajuste o caminho conforme necessário
                style={{ width: 32, height: 32 }} // Ajuste o tamanho conforme necessário
              />
            </TouchableOpacity>
            <Text style={styles.saldosText}>Rendas</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <Text style={styles.saldosText}>
                {mostrarValores
                  ? `R$ ${String(valuesObject?.totalEntradas)}`
                  : "R$ --"}
              </Text>
            )}
          </View>
          <View>
            <TouchableOpacity onPress={toggleValoresVisiveis}>
              <Image
                source={require("../../../assets/eye.png")} // Ajuste o caminho conforme necessário
                style={{ width: 32, height: 32 }} // Ajuste o tamanho conforme necessário
              />
            </TouchableOpacity>
          </View>
          <View style={styles.despesas}>
            <TouchableOpacity
              style={styles.saidaBtn}
              onPress={handleTipoTransacaoSaida}
            >
              <Image
                source={require("../../../assets/setaCima.png")} // Ajuste o caminho conforme necessário
                style={{
                  width: 32,
                  height: 32,
                  transform: [{ rotate: "180deg" }],
                }} // Ajuste o tamanho conforme necessário
              />
            </TouchableOpacity>
            <Text style={styles.saldosText}>Despesas</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <Text style={styles.saldosText}>
                {mostrarValores
                  ? `R$ ${String(valuesObject?.totalSaidas)}`
                  : "R$ --"}
              </Text>
            )}
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
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
              />
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
        <View style={styles.content}>{<CotacaoDolar />}</View>
      </View>
      <View style={styles.menuFooter}>
        <NavigationBar />
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
    marginTop: 15,
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
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#17fc3d",
    borderRadius: 50,
    alignItems: "center",
  },
  saidaBtn: {
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#ff0f00",
    borderRadius: 50,
    alignItems: "center",
  },
  rendas: {
    alignItems: "center",
    width: "40%",
  },
  despesas: {
    alignItems: "center",
    width: "40%",
  },
  buttons: {
    width: "80%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saldosText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    paddingTop: 10,
  },
  spacer: {
    padding: 2,
  },
  arrowButton: {
    padding: 5,
    paddingBottom: 15,
  },
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
    fontSize: 26,
    color: "#ffffff",
  },
});

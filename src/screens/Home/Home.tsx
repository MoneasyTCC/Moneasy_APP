import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TextInput,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Transacao } from "../../../Model/Transacao";
import { TransacaoDAL } from "../../../Repo/RepositorioTransacao";
import { obterSaldoPorMes } from "../../../Controller/TransacaoController";
import { DataContext } from "../../../Contexts/DataContext";
import SeletorMesAno from "../../../Components/SeletorMesAno";
import Graficos from "../../../Components/Graficos";
import NavigationBar from "../menuNavegation";
import AwesomeAlert from "react-native-awesome-alerts";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

type DateTimePickerMode = "date" | "time" | "datetime";

interface SaldoMes {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
}

export default function HomeScreen({ navigation }: Props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [valor, setValor] = useState("");
  const [nome, setNome] = useState("");
  const [data, setData] = useState(new Date());
  const [modo, setModo] = useState<DateTimePickerMode | undefined>(undefined);
  const [show, setShow] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState("");
  const [dataTextInput, setDataTextInput] = useState("");
  const { dataSelecionada, setDataSelecionada } = useContext(DataContext) as {
    dataSelecionada: Date;
    setDataSelecionada: (data: Date) => void;
  };
  const [checkNovaTransacao, setcheckNovaTransacao] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const saldoCache = useRef<Map<string, SaldoMes>>(new Map());
  const [fData, setFData] = useState<Date>(new Date());

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
  const [updateGraph, setUpdateGraph] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const obterSaldoPorMesComCache = async (data: Date): Promise<SaldoMes> => {
    const chaveCache = data.toISOString().slice(0, 7);
    if (saldoCache.current.has(chaveCache)) {
      return saldoCache.current.get(chaveCache)!;
    }
    const resultado = await obterSaldoPorMes(data);
    saldoCache.current.set(chaveCache, resultado);
    return resultado;
  };

  const handleObterSaldoPorMes = async () => {
    setIsLoading(true);
    try {
      const result: SaldoMes = await obterSaldoPorMesComCache(dataSelecionada);
      setValuesObject(result);
    } catch (error) {
      console.error("Erro ao obter saldo: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChangeMonth = (data: Date) => {
    setDataSelecionada(data);
  };

  const handleOnChangeYear = (data: Date) => {
    setDataSelecionada(data);
  };

  const [saldo, setSaldo] = useState<number | null>(null);

  const updateSaldo = async (date: Date) => {
    try {
      const resultadoSaldo = await obterSaldoPorMes(date);
      if (resultadoSaldo && typeof resultadoSaldo.saldo === "number") {
        setSaldo(resultadoSaldo.saldo);
      } else {
        setSaldo(null);
        console.warn("Saldo não encontrado ou o valor não é um número.");
      }
    } catch (error) {
      console.error("Erro ao obter saldo:", error);
    }
  };

  const handleNovoCalculo = () => {
    setcheckNovaTransacao(true);
  };

  const handleTransacao = async () => {
    try {
      const valorFloat = isNaN(parseFloat(valor)) ? 0 : parseFloat(valor);
      const dataTransacao = fData;
      console.log(dataTransacao);
      const novosDados: Transacao = {
        id: "",
        usuarioId: "",
        tipo: tipoTransacao,
        valor: valorFloat,
        data: dataTransacao,
        nome: nome,
        moeda: "BRL",
      };

      await TransacaoDAL.adicionarTransacao(novosDados);
      setUpdateGraph(!updateGraph);
      limparEstados();
      toggleModal();
      setShowSuccessAlert(true);
      const chaveCache = dataTransacao.toISOString().slice(0, 7);
      saldoCache.current.delete(chaveCache);
      await handleObterSaldoPorMes();
    } catch (err) {
      setErrorMessage("Erro ao adicionar transação");
      setShowErrorAlert(true);
    }
  };

  const onChange = (evento: DateTimePickerEvent, dataSelecionada?: Date | undefined) => {
    if (evento.type === "set" && dataSelecionada) {
      const dataAtual = dataSelecionada || data;
      setShow(Platform.OS === "ios");
      setData(dataAtual);
      setDataTextInput(dataAtual.toLocaleDateString("pt-br"));
      setFData(dataAtual);
      let tempData = new Date(dataAtual);
      const dataFormatada =
        tempData.getDate() + "/" + (tempData.getMonth() + 1) + "/" + tempData.getFullYear();

      console.log(dataFormatada);
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

  const limparEstados = () => {
    setNome("");
    setValor("");
    setDataTextInput("");
  };

  useEffect(() => {
    updateSaldo(dataSelecionada);
    handleObterSaldoPorMes();
  }, [dataSelecionada]);

  return (
    <View style={styles.container}>
      <View style={styles.menuHeader}>
        <SeletorMesAno
          seletorMes={true}
          seletorAno={true}
          onMonthChange={handleOnChangeMonth}
          onYearChange={handleOnChangeYear}
        />
        <View>
          {isLoading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <Text style={styles.saldoAtual}>
              {mostrarValores ? `R$ ${valuesObject.saldo ? valuesObject.saldo.toFixed(2) : "0.00"}` : "R$ --"}
            </Text>
          )}
        </View>
        <View style={styles.spacer}></View>
        <View style={styles.buttons}>
          <View style={styles.rendas}>
            <TouchableOpacity style={styles.entradaBtn} onPress={handleTipoTransacaoEntrada}>
              <Image
                source={require("../../../assets/setaCima.png")}
                style={{ width: 32, height: 32 }}
              />
            </TouchableOpacity>
            <Text style={styles.saldosText}>Rendas</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <Text style={styles.saldosText}>{mostrarValores ? `R$ ${String(valuesObject?.totalEntradas)}` : "R$ --"}</Text>
            )}
          </View>
          <View>
            <TouchableOpacity onPress={toggleValoresVisiveis}>
              <Image
                source={require("../../../assets/eye.png")}
                style={{ width: 32, height: 32 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.despesas}>
            <TouchableOpacity style={styles.saidaBtn} onPress={handleTipoTransacaoSaida}>
              <Image
                source={require("../../../assets/setaCima.png")}
                style={{
                  width: 32,
                  height: 32,
                  transform: [{ rotate: "180deg" }],
                }}
              />
            </TouchableOpacity>
            <Text style={styles.saldosText}>Despesas</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <Text style={styles.saldosText}>{mostrarValores ? `R$ ${String(valuesObject?.totalSaidas)}` : "R$ --"}</Text>
            )}
          </View>
        </View>
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#FFFFFF"
                value={nome}
                onChangeText={setNome}
              />
              <TextInput
                style={styles.input}
                placeholder="Valor"
                placeholderTextColor="#FFFFFF"
                keyboardType="numeric"
                value={valor}
                onChangeText={setValor}
              />
              <TextInput
                style={styles.input}
                placeholder="Data"
                placeholderTextColor="#FFFFFF"
                onPressIn={() => showMode("date")}
                showSoftInputOnFocus={false}
                caretHidden={true}
                value={dataTextInput}
              />

              <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={handleTransacao} style={styles.btnModalSuccess}>
                  <Text style={styles.labelModal}>Concluir</Text>
                </TouchableOpacity>
                <Text onPress={handleCancelarTransacao} style={styles.labelModal}>
                  Cancelar
                </Text>
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
        <Graficos dataSelecionada={dataSelecionada} novaTransacao={updateGraph} />
      </View>
      <View style={styles.menuFooter}>
        <NavigationBar />
      </View>

      <AwesomeAlert
        show={showSuccessAlert}
        showProgress={false}
        title="Sucesso!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#0FEC32"
        onConfirmPressed={() => {
          setShowSuccessAlert(false);
        }}
        customView={
          <View>
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              Transação adicionada com sucesso!
            </Text>
          </View>
        }
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
        onConfirmPressed={() => {
          setShowErrorAlert(false);
        }}
        customView={
          <View>
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              Tente novamente.
            </Text>
          </View>
        }
      />
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
    width: "80%",
    margin: 20,
    backgroundColor: "#424242",
    borderRadius: 35,
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
    paddingLeft: 20,
    marginVertical: 8,
    backgroundColor: "#616161",
    borderRadius: 25,
    color: "#ffffff",
    fontSize: 16,
    opacity: 0.7,
  },
  buttonGroup: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 20,
    width: "100%",
    marginTop: 15,
  },
  labelModal: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  titleModal: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 15,
    opacity: 0.8,
  },
  btnModalSuccess: {
    borderRadius: 20,
    backgroundColor: "#0fec32",
    width: "90%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
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
    marginTop: 20,
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
  yearHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

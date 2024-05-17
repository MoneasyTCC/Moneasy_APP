import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Animated,
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
  TouchableOpacity,
  Switch,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import NavigationBar from "../menuNavegation";
import { MetasDAL } from "../../../Repo/RepositorioMeta";
import SeletorData from "../../../Components/SeletorData";
import { DividaDAL } from "../../../Repo/RepositorioDivida";
import ListaDeMetas from "../../../Components/ListaMeta";
import ListaDeDividas from "../../../Components/ListaDivida";
import SeletorMesAno from "../../../Components/SeletorMesAno";
import { DataContext } from "../../../Contexts/DataContext";
import AwesomeAlert from "react-native-awesome-alerts"; // Certifique-se de importar AwesomeAlert

type MetasScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Metas"
>;

type Props = {
  navigation: MetasScreenNavigationProp;
};

// Use as props na definição do seu componente
export default function MetasScreen({ navigation }: Props) {
  const { dataSelecionada, setDataSelecionada } = useContext(DataContext) as {
    dataSelecionada: Date;
    setDataSelecionada: (data: Date) => void;
  };
  const [updateLista, setUpdateLista] = useState(false);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tituloMeta, setTituloMeta] = useState("");
  const [valorAtualMeta, setValorAtualMeta] = useState("");
  const [valorObjetivoMeta, setValorObjetivoMeta] = useState("");
  const [tituloDivida, setTituloDivida] = useState("");
  const [valorPagoDivida, setValorPagoDivida] = useState("");
  const [valorTotalDivida, setValorTotalDivida] = useState("");
  const [isDividaPendente, setIsDividaPendente] = useState(false);
  const [isTelaDivida, setIsTelaDivida] = useState(false);
  const colorAnim = useRef(new Animated.Value(0)).current;
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: isTelaDivida ? 1 : 0,
      duration: 300,
      useNativeDriver: false, // Estamos animando propriedades não suportadas pelo driver nativo
    }).start();
  }, [isTelaDivida]);

  // Animação para a cor de fundo

  // Interpolação para cores e borderRadius
  const metaButtonColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#0fec32", "#616161"], // Metas ativo para inativo
  });

  const dividaButtonColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#616161", "#0fec32"], // Dívidas inativo para ativo
  });

  const handleOnChangeDataInicio = (data: Date) => {
    setDataInicio(data);
  };

  const handleOnChangeDataFim = (data: Date) => {
    setDataFim(data);
  };

  const handleMeta = async () => {
    if (
      !tituloMeta ||
      !valorAtualMeta ||
      !valorObjetivoMeta ||
      !dataInicio ||
      !dataFim
    ) {
      setValidationMessage("Todos os campos são obrigatórios.");
      setShowValidationAlert(true);
      return; // Não continuar com a inserção
    }
    try {
      const valorObjetivoFloat = isNaN(parseFloat(valorObjetivoMeta))
        ? 0
        : parseFloat(valorObjetivoMeta);
      const valorAtualFloat = isNaN(parseFloat(valorAtualMeta))
        ? 0
        : parseFloat(valorAtualMeta);
      const novosDados = {
        id: "",
        usuarioId: "",
        titulo: tituloMeta,
        valorObjetivo: valorObjetivoFloat,
        valorAtual: valorAtualFloat,
        dataInicio: dataInicio,
        dataFimPrevista: dataFim,
        status: "Ativo",
      };
      if (valorAtualMeta === valorObjetivoMeta) {
        novosDados.status = "Concluído";
      }
      if (dataFim < new Date()) {
        novosDados.status = "Pausado";
      }
      await MetasDAL.adicionarMeta(novosDados);
      setUpdateLista(!updateLista);
      setIsModalVisible(false);
      setShowSuccessAlert(true);
    } catch (err) {
      setErrorMessage("Erro ao adicionar meta");
      setShowErrorAlert(true);
    }
  };

  const handleDivida = async () => {
    if (
      !tituloDivida ||
      !valorPagoDivida ||
      !valorTotalDivida ||
      !dataInicio ||
      !dataFim
    ) {
      setValidationMessage("Todos os campos são obrigatórios.");
      setShowValidationAlert(true);
      return; // Não continuar com a inserção
    }
    try {
      const valorTotalFloat = isNaN(parseFloat(valorTotalDivida))
        ? 0
        : parseFloat(valorTotalDivida);
      const valorPagoFloat = isNaN(parseFloat(valorPagoDivida))
        ? 0
        : parseFloat(valorPagoDivida);
      const novosDados = {
        id: "",
        usuarioId: "",
        titulo: tituloDivida,
        valorTotal: valorTotalFloat,
        valorPago: valorPagoFloat,
        dataInicio: dataInicio,
        dataVencimento: dataFim,
        status: !isDividaPendente ? "Pendente" : "Pago",
      };
      await DividaDAL.adicionarDivida(novosDados);
      setUpdateLista(!updateLista);
      setIsModalVisible(false);
      setShowSuccessAlert(true);
    } catch (err) {
      setErrorMessage("Erro ao adicionar dívida");
      setShowErrorAlert(true);
    }
  };

  const limparEstados = () => {
    setTituloMeta("");
    setValorAtualMeta("");
    setValorObjetivoMeta("");
    setTituloDivida("");
    setValorPagoDivida("");
    setValorTotalDivida("");
    setIsDividaPendente(false);
    setDataInicio(new Date());
    setDataFim(new Date());
  };

  const handleOnYearChange = (data: Date) => {
    setDataSelecionada(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textMetas}>{isTelaDivida ? "Dívidas" : "Metas"}</Text>
      <View style={styles.menuHeader}>
        <SeletorMesAno seletorAno={true} onYearChange={handleOnYearChange} />
      </View>
      <View style={styles.menuBody}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => setIsTelaDivida(false)}
          >
            <Animated.View
              style={[
                styles.button,
                {
                  backgroundColor: metaButtonColor,
                  borderTopRightRadius: 0, // Sempre zero para "Metas"
                  borderBottomRightRadius: 0, // Sempre zero para "Metas"
                  borderTopLeftRadius: 15,
                  borderBottomLeftRadius: 15,
                },
              ]}
            >
              <Text style={styles.buttonText}>Metas</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => setIsTelaDivida(true)}
          >
            <Animated.View
              style={[
                styles.button,
                {
                  backgroundColor: dividaButtonColor,
                  borderTopLeftRadius: 0, // Sempre zero para "Dívidas"
                  borderBottomLeftRadius: 0, // Sempre zero para "Dívidas"
                  borderTopRightRadius: 15,
                  borderBottomRightRadius: 15,
                },
              ]}
            >
              <Text style={styles.buttonText}>Dívidas</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
        {!isTelaDivida ? (
          <ListaDeMetas
            dataSelecionada={dataSelecionada}
            novaMeta={updateLista}
          />
        ) : (
          <ListaDeDividas
            dataSelecionada={dataSelecionada}
            novaDivida={updateLista}
          />
        )}
        {!isTelaDivida ? (
          <TouchableOpacity
            style={styles.btnCriar}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.labelCriar}>Nova Meta</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btnCriar}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.labelCriar}>Nova Divida</Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {!isTelaDivida ? "Nova Meta" : "Nova Divida"}
            </Text>
            <TextInput
              style={styles.inputTitulo}
              placeholder="Titulo"
              placeholderTextColor={"#ffffff"}
              value={!isTelaDivida ? tituloMeta : tituloDivida}
              onChangeText={
                !isTelaDivida
                  ? (text) => setTituloMeta(text)
                  : (text) => setTituloDivida(text)
              }
            />
            <View style={styles.inputValorDataGroup}>
              <TextInput
                style={styles.inputValores}
                placeholder="Valor Atual"
                placeholderTextColor={"#ffffff"}
                keyboardType="numeric"
                value={!isTelaDivida ? valorAtualMeta : valorPagoDivida}
                onChangeText={
                  !isTelaDivida
                    ? (text) => setValorAtualMeta(text)
                    : (text) => setValorPagoDivida(text)
                }
              />
              <SeletorData
                onDateChange={handleOnChangeDataInicio}
                dataMinima={new Date(new Date().getFullYear(), 0, 1)}
                dataMaxima={new Date(new Date().getFullYear(), 11, 31)}
              />
            </View>
            <View style={styles.inputValorDataGroup}>
              <TextInput
                style={styles.inputValores}
                placeholder="Valor final"
                placeholderTextColor={"#ffffff"}
                keyboardType="numeric"
                value={!isTelaDivida ? valorObjetivoMeta : valorTotalDivida}
                onChangeText={
                  !isTelaDivida
                    ? (text) => setValorObjetivoMeta(text)
                    : (text) => setValorTotalDivida(text)
                }
              />
              <SeletorData
                onDateChange={handleOnChangeDataFim}
                dataMinima={dataInicio}
              />
            </View>
            {isTelaDivida && (
              <>
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}
                >
                  {!isDividaPendente ? "Pendente" : "Pago"}
                </Text>
                <Switch
                  value={isDividaPendente}
                  onValueChange={() =>
                    setIsDividaPendente((prevState) => !prevState)
                  }
                ></Switch>
              </>
            )}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.btn, styles.btnAdicionar]}
                onPress={!isTelaDivida ? handleMeta : handleDivida}
              >
                <Text style={styles.labelModal}>Concluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnCancelar]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.labelModal}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <AwesomeAlert
        show={showSuccessAlert}
        showProgress={false}
        title="Sucesso!"
        message={
          !isTelaDivida
            ? "Meta adicionada com sucesso!"
            : "Dívida adicionada com sucesso!"
        }
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

      <AwesomeAlert
        show={showValidationAlert}
        showProgress={false}
        title="Erro de Validação"
        message={validationMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#EC0F0F"
        onConfirmPressed={() => setShowValidationAlert(false)}
      />

      <View style={styles.menuFooter}>
        <NavigationBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2B2B2B",
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    height: "14%",
  },
  menuBody: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#3A3E3A",
  },
  menuFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "15%",
    backgroundColor: "#3A3E3A",
  },
  textMetas: {
    position: "absolute",
    marginTop: 35,
    marginLeft: 20,
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  textSecondary: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
  },
  /* Select dos meses */

  arrowButton: { marginBottom: 10 },
  arrowText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 30,
  },
  mesLabel: {
    color: "#ffffff",
    width: "35%",
    textAlign: "center",
    fontSize: 26,
    marginBottom: 10,
  },
  /* Fim Select dos meses */
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
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
  inputTitulo: {
    width: 230,
    padding: 10,
    paddingLeft: 20,
    marginVertical: 8,
    backgroundColor: "#616161",
    borderRadius: 25,
    color: "#ffffff",
    fontSize: 16,
    opacity: 0.7,
  },
  inputValores: {
    width: 160,
    padding: 10,
    paddingLeft: 20,
    marginVertical: 8,
    backgroundColor: "#616161",
    borderRadius: 25,
    color: "#ffffff",
    fontSize: 16,
    opacity: 0.7,
  },
  inputValorDataGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 230,
  },
  labelModal: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonGroup: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 20,
    width: "100%",
    marginTop: 15,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  buttonActive: {
    backgroundColor: "#0fec32",
  },
  buttonInactive: {
    backgroundColor: "#616161",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "60%",
    height: 40, // Altura fixa para o container dos botões
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  statusButton: {
    flex: 1,
    /* marginHorizontal: 4, */
    /*  borderRadius: 10, */
    overflow: "hidden", // Important to clip the animated view
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  labelCriar: {
    color: "#0fec32",
    fontSize: 18,
    fontWeight: "bold",
  },
  btnCriar: {
    borderWidth: 2,
    borderColor: "#0fec32",
    borderRadius: 10,
    padding: 6,
    marginBottom: -20,
  },
  btn: {
    padding: 10,
    width: 120, // Largura fixa para uniformidade
    height: 40,
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  btnCancelar: {
    backgroundColor: "#EC0F0F", // Vermelho para botões de 'Excluir'
  },
  btnAdicionar: {
    backgroundColor: "#0FEC32", // Vermelho para botões de 'Excluir'
  },
});

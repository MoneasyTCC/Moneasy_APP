import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import NavigationBar from "../menuNavegation";
import { MetasDAL } from "../../../Repo/RepositorioMeta";
import SeletorData from "../../../Components/SeletorData";

type MetasScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Metas">;

type Props = {
  navigation: MetasScreenNavigationProp;
};

// Use as props na definição do seu componente
export default function MetasScreen({ navigation }: Props) {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [monthIndex, setMonthIndex] = useState(dataSelecionada.getMonth());
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [valorAtual, setValorAtual] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [titulo, setTitulo] = useState("");

  const updateMonth = (newMonthIndex: number) => {
    setMonthIndex(newMonthIndex);
    const newData = new Date(dataSelecionada.getFullYear(), newMonthIndex, 31);
    setDataSelecionada(newData);
    /* updateSaldo(newData); */
  };

  const handlePreviousMonth = () => {
    const newMonthIndex = monthIndex > 0 ? monthIndex - 1 : 11;
    updateMonth(newMonthIndex);
  };

  const handleNextMonth = () => {
    const newMonthIndex = monthIndex < 11 ? monthIndex + 1 : 0;
    updateMonth(newMonthIndex);
  };

  const handleOnChangeDataInicio = (data: Date) => {
    setDataInicio(data);
  };

  const handleOnChangeDataFim = (data: Date) => {
    setDataFim(data);
  };

  const handleMeta = async () => {
    try {
      const valorObjetivoFloat = isNaN(parseFloat(valorObjetivo)) ? 0 : parseFloat(valorObjetivo);
      const valorAtualFloat = isNaN(parseFloat(valorAtual)) ? 0 : parseFloat(valorAtual);
      const novosDados = {
        id: "",
        usuarioId: "",
        titulo: titulo,
        valorObjetivo: valorObjetivoFloat,
        valorAtual: valorAtualFloat,
        dataInicio: dataInicio,
        dataFimPrevista: dataFim,
        status: "Ativo",
      };
      await MetasDAL.adicionarMeta(novosDados);
      alert("Meta adicionada com sucesso!");
    } catch (err) {
      alert("Erro ao adicionar meta");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textOrcamento}>Metas</Text>
      <View style={styles.menuHeader}>
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
      <View style={styles.menuBody}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={{ color: "#0fec32", fontSize: 18 }}>Nova Meta</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.inputTitulo}
              placeholder="Titulo"
              value={titulo}
              onChangeText={(text) => setTitulo(text)}
            />
            <View style={styles.inputValorDataGroup}>
              <TextInput
                style={styles.inputValores}
                placeholder="Valor Atual"
                keyboardType="numeric"
                value={valorAtual}
                onChangeText={(text) => setValorAtual(text)}
              />
              <SeletorData onDateChange={handleOnChangeDataInicio} />
            </View>
            <View style={styles.inputValorDataGroup}>
              <TextInput
                style={styles.inputValores}
                placeholder="Valor final"
                keyboardType="numeric"
                value={valorObjetivo}
                onChangeText={(text) => setValorObjetivo(text)}
              />
              <SeletorData onDateChange={handleOnChangeDataFim} />
            </View>
            <View>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.btnModalSuccess}
                  onPress={() => handleMeta()}
                >
                  <Text style={styles.labelModal}>Concluir</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.labelModal}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    height: "16%",
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
  textOrcamento: {
    position: "absolute",
    marginTop: 35,
    marginLeft: 20,
    fontSize: 26,
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
  btnModalSuccess: {
    borderRadius: 20,
    backgroundColor: "#0fec32",
    width: 230,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  labelModal: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonGroup: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 20,
    width: "100%",
    marginTop: 15,
  },
});

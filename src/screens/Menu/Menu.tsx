import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import NavigationBar from "../menuNavegation";
import { OrcamentoDAL } from "../../../Repo/RepositorioOrcamento";
import DropDownPicker from "react-native-dropdown-picker";
import ListaDeOrcamentos from "../../../Components/ListaOrcamento";
import { obterTotalERestantePorMes } from "../../../Controller/OrcamentoController";
import SeletorMesAno from "../../../Components/SeletorMesAno";
import { DataContext } from "../../../Contexts/DataContext";
import AwesomeAlert from "react-native-awesome-alerts";

type OrcamentoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Orcamento"
>;

type Props = {
  navigation: OrcamentoScreenNavigationProp;
};

interface TotalERestanteMes {
  valorDefinidoTotal: number;
  valorAtualTotal: number;
}

// Use as props na definição do seu componente
export default function MenuScreen({ navigation }: Props) {
  const { dataSelecionada, setDataSelecionada } = useContext(DataContext) as {
    dataSelecionada: Date;
    setDataSelecionada: (data: Date) => void;
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [valorDefinido, setValorDefinido] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [categorias, setCategorias] = useState([
    { label: "Roupas", value: "Roupas" },
    { label: "Educação", value: "Educação" },
    { label: "Eletrodomésticos", value: "Eletrodomésticos" },
    { label: "Saúde", value: "Saúde" },
    { label: "Mercado", value: "Mercado" },
    { label: "Outros", value: "Outros" },
  ]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(
    categorias[5].value
  );
  const [dataOrcamento, setDataOrcamento] = useState(new Date());

  const [openMes, setOpenMes] = useState(false);
  const [openCategoria, setOpenCategoria] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    //month names
    { label: "Janeiro", value: "1" },
    { label: "Fevereiro", value: "2" },
    { label: "Março", value: "3" },
    { label: "Abril", value: "4" },
    { label: "Maio", value: "5" },
    { label: "Junho", value: "6" },
    { label: "Julho", value: "7" },
    { label: "Agosto", value: "8" },
    { label: "Setembro", value: "9" },
    { label: "Outubro", value: "10" },
    { label: "Novembro", value: "11" },
    { label: "Dezembro", value: "12" },
  ]);
  const [updateLista, setUpdateLista] = useState(false);
  const [valuesObject, setValuesObject] = useState<{
    valorDefinidoTotal: number;
    valorAtualTotal: number;
  }>({ valorDefinidoTotal: 0, valorAtualTotal: 0 });

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const setMonthData = () => {
    const newDate = new Date();
    newDate.setMonth(value ? value - 1 : newDate.getMonth());
    setDataOrcamento(newDate);
  };

  const handleOnChangeMonth = (data: Date) => {
    setDataSelecionada(data);
  };

  const handleOnChangeYear = (data: Date) => {
    setDataSelecionada(data);
  };

  const handleOrcamento = async () => {
    if (!valorDefinido || !valorAtual || !categoriaSelecionada) {
      setValidationMessage("Todos os campos são obrigatórios.");
      setShowValidationAlert(true);
      return; // Não continuar com a inserção
    }

    try {
      const valorDefinidoFloat = isNaN(parseFloat(valorDefinido))
        ? 0
        : parseFloat(valorDefinido);
      const valorAtualFloat = isNaN(parseFloat(valorAtual))
        ? 0
        : parseFloat(valorAtual);
      setMonthData();
      const novosDados = {
        id: "",
        usuarioId: "",
        categoria: categoriaSelecionada,
        descricao: "",
        valorDefinido: valorDefinidoFloat,
        valorAtual: valorAtualFloat,
        data: dataOrcamento,
      };
      await OrcamentoDAL.adicionarOrcamento(novosDados);
      setUpdateLista(!updateLista);
      setIsModalVisible(false);
      setSuccessMessage("Orçamento adicionado com sucesso!");
      setShowSuccessAlert(true);
    } catch (err) {
      setErrorMessage("Erro ao adicionar orçamento.");
      setShowErrorAlert(true);
    }
  };

  const handleObterTotalERestantePorMes = async () => {
    try {
      const result: TotalERestanteMes = await obterTotalERestantePorMes(
        dataSelecionada
      );
      setValuesObject(result);
    } catch (err) {
      console.error("Erro ao obter total e restante por mês: ", err);
    }
  };

  const handleInteractionInListaDeOrcamentos = () => {
    attTotalERestanteDepoisDeAlterarOuDeletar(dataSelecionada);
  };

  const attTotalERestanteDepoisDeAlterarOuDeletar = async (date: Date) => {
    try {
      const result = await obterTotalERestantePorMes(date);
      setValuesObject(result);
    } catch (err) {
      console.error("Erro ao obter total e restante por mês: ", err);
    }
  };

  useEffect(() => {
    handleObterTotalERestantePorMes();
  }, [updateLista, dataSelecionada]);

  return (
    <View style={styles.container}>
      <Text style={styles.textOrcamento}>Orçamento</Text>
      <View style={styles.menuHeader}>
        <SeletorMesAno
          seletorMes={true}
          seletorAno={true}
          onMonthChange={handleOnChangeMonth}
          onYearChange={handleOnChangeYear}
        />
      </View>
      <View style={styles.menuBody}>
        <ListaDeOrcamentos
          dataSelecionada={dataSelecionada}
          novoOrcamento={updateLista}
          onInteraction={handleInteractionInListaDeOrcamentos}
        />
        <TouchableOpacity
          style={styles.btnCriar}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.criarOrcamento}>Novo Orçamento</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Valor Definido"
                placeholderTextColor="#FFFFFF"
                value={valorDefinido}
                onChangeText={(text) => setValorDefinido(text)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Valor Atual"
                placeholderTextColor="#FFFFFF"
                value={valorAtual}
                onChangeText={(text) => setValorAtual(text)}
                keyboardType="numeric"
              />
              <View>
                <DropDownPicker
                  open={openCategoria}
                  value={categoriaSelecionada}
                  items={categorias}
                  setOpen={setOpenCategoria}
                  setValue={setCategoriaSelecionada}
                  setItems={setCategorias}
                  onChangeValue={() =>
                    setCategoriaSelecionada(categoriaSelecionada)
                  }
                  style={styles.dropdownStyle}
                  dropDownContainerStyle={{
                    backgroundColor: "#616161",
                    borderColor: "#707070",
                    opacity: 1,
                    width: "90%",
                  }}
                  textStyle={{
                    color: "white",
                    opacity: 1,
                    opacity: 0.7,
                  }}
                  arrowIconStyle={{
                    width: 20,
                    height: 20,
                    tintColor: "white",
                    opacity: 1,
                  }}
                  tickIconStyle={{
                    width: 20,
                    height: 20,
                    tintColor: "white",
                    opacity: 1,
                  }}
                />
                <DropDownPicker
                  open={openMes}
                  value={value}
                  items={items}
                  setOpen={setOpenMes}
                  setValue={setValue}
                  setItems={setItems}
                  onChangeValue={() => setMonthData()}
                  style={[styles.dropdownStyle, styles.dropdownStyle2]}
                  dropDownContainerStyle={{
                    backgroundColor: "#616161",
                    borderColor: "#707070",
                    width: "90%",
                  }}
                  textStyle={{
                    color: "white",
                    opacity: 0.7,
                  }}
                  arrowIconStyle={{
                    width: 20,
                    height: 20,
                    tintColor: "white",
                  }}
                  tickIconStyle={{
                    width: 20,
                    height: 20,
                    tintColor: "white",
                  }}
                />
              </View>
            </View>
            <View style={styles.botoesDivRow}>
              <TouchableOpacity
                onPress={() => handleOrcamento()}
                style={[styles.btn, styles.Adicionar]}
              >
                <Text style={styles.labelModal}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={[styles.btn, styles.Cancelar]}
              >
                <Text style={styles.labelModal}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.menuFooter}>
        <NavigationBar />
      </View>
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
        customView={
          <View>
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              {successMessage}
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
        onConfirmPressed={() => setShowErrorAlert(false)}
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
  container: {
    flex: 1,
    backgroundColor: "#2B2B2B",
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    height: "18%",
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
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
  totalERestanteText: {
    color: "#fff",
    fontSize: 18,
  },
  totalERestanteValor: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  totalERestanteGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 320,
  },
  yearHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    height: 30,
    borderRadius: 15,
    marginVertical: 12,
    marginHorizontal: 5,
  },
  Adicionar: {
    backgroundColor: "#4CAF50",
  },
  Cancelar: {
    backgroundColor: "#B22222",
  },

  botoesDivRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "90%",
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#616161",
    borderRadius: 10,
    color: "white",
    opacity: 0.7,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },

  labelModal: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  dropdownStyle: {
    backgroundColor: "#616161",
    borderWidth: 0,
    opacity: 0.9,
    marginVertical: 8,
    width: "90%",
    borderRadius: 10,
  },
  dropdownStyle2: {
    zIndex: 0,
  },

  criarOrcamento: {
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
});

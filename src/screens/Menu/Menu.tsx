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
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import NavigationBar from "../menuNavegation";
import { OrcamentoDAL } from "../../../Repo/RepositorioOrcamento";
import DropDownPicker from "react-native-dropdown-picker";
import ListaDeOrcamentos from "../../../Components/ListaOrcamento";
import { obterTotalERestantePorMes } from "../../../Controller/OrcamentoController";
import SincronizaData, { useAppContext } from "../../../Components/SincronizaData";


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
  const { dataSelecionada, setDataSelecionada } = useAppContext();
  const [monthIndex, setMonthIndex] = useState(dataSelecionada.getMonth());
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
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(categorias[5].value);
  const [dataOrcamento, setDataOrcamento] = useState(new Date());
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
  const [year, setYear] = useState(dataSelecionada.getFullYear());
  const [valuesObject, setValuesObject] = useState<{
    valorDefinidoTotal: number;
    valorAtualTotal: number;
  }>({ valorDefinidoTotal: 0, valorAtualTotal: 0 });

  const setMonthData = () => {
    const newDate = new Date();
    newDate.setMonth(value ? value - 1 : newDate.getMonth());
    setDataOrcamento(newDate);
  };

const handlePreviousYear = () => {
  const newYear = year - 1;
  setYear(newYear);
  const newData = new Date(newYear, dataSelecionada.getMonth(), 1);
  setDataSelecionada(newData);
  updateYear(newYear);
};

const handleNextYear = () => {
  const newYear = year + 1;
  setYear(newYear);
  const newData = new Date(newYear, dataSelecionada.getMonth(), 1);
  setDataSelecionada(newData);
  updateYear(newYear);
};

const updateYear = (newYear: number) => {
  const newData = new Date(newYear, dataSelecionada.getMonth(), 1);
  setDataSelecionada(newData);
  setYear(newYear);
};


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

  const handleOrcamento = async () => {
    try {
      const valorDefinidoFloat = isNaN(parseFloat(valorDefinido))
        ? 0
        : parseFloat(valorDefinido);
      const valorAtualFloat = isNaN(parseFloat(valorAtual)) ? 0 : parseFloat(valorAtual);
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
      alert("Orçamento adicionado com sucesso");
    } catch (err) {
      Alert.alert("Erro", "Erro ao adicionar orçamento");
    }
  };

  const handleObterTotalERestantePorMes = async () => {
    try {
      const result: TotalERestanteMes = await obterTotalERestantePorMes(dataSelecionada);
      setValuesObject(result);
    } catch (err) {
      console.error("Erro ao obter total e restante por mês: ", err);
    }
  };

  const handleInteractionInListaDeOrcamentos = () => {
    attTotalERestanteDepoisDeAlterarOuDeletar(dataSelecionada);
    //console.log("Interagiu com a lista de orçamentos");
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
                <View style={styles.yearHeader}>
                  <TouchableOpacity
                    onPress={handlePreviousYear}
                    style={[styles.arrowButton, { marginTop: 5 }]}
                  >
                    <Text style={styles.arrowText}>&lt;</Text>
                  </TouchableOpacity>
                  <Text style={styles.mesLabel}>{year}</Text>
                  <TouchableOpacity
                    onPress={handleNextYear}
                    style={[styles.arrowButton, { marginTop: 5 }]}
                  >
                    <Text style={styles.arrowText}>&gt;</Text>
                  </TouchableOpacity>
                </View>
      <View style={styles.menuBody}>
        <View style={styles.totalERestanteGroup}>
          <View>
            <Text style={styles.totalERestanteText}>Total</Text>
            <Text style={styles.totalERestanteValor}>
              R${valuesObject.valorDefinidoTotal},00
            </Text>
          </View>
          <View>
            <Text style={styles.totalERestanteText}>Restante</Text>
            <Text style={styles.totalERestanteValor}>
              R${valuesObject.valorAtualTotal},00
            </Text>
          </View>
        </View>
        <ListaDeOrcamentos
          dataSelecionada={dataSelecionada}
          novoOrcamento={updateLista}
          onInteraction={handleInteractionInListaDeOrcamentos}
        />
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={{ color: "#0fec32", fontSize: 18 }}>Novo Orçamento</Text>
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
              style={styles.input}
              placeholder="Valor Definido"
              value={valorDefinido}
              onChangeText={(text) => setValorDefinido(text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Valor Atual"
              value={valorAtual}
              onChangeText={(text) => setValorAtual(text)}
              keyboardType="numeric"
            />
            <DropDownPicker
              open={openCategoria}
              value={categoriaSelecionada}
              items={categorias}
              setOpen={setOpenCategoria}
              setValue={setCategoriaSelecionada}
              setItems={setCategorias}
              onChangeValue={() => setCategoriaSelecionada(categoriaSelecionada)}
            />
            <DropDownPicker
              open={openMes}
              value={value}
              items={items}
              setOpen={setOpenMes}
              setValue={setValue}
              setItems={setItems}
              onChangeValue={() => setMonthData()}
              style={{ zIndex: 0 }}
            />
            <Button
              title="adicionar"
              onPress={() => handleOrcamento()}
            />
            <Button
              title="cancelar"
              onPress={() => setIsModalVisible(false)}
            />
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
      justifyContent: 'center',
    },
});

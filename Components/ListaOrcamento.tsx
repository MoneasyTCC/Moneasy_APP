import React, { useState, useEffect } from "react";
import { Orcamento } from "../Model/Orcamento";
import { obterOrcamentosPorData } from "../Controller/OrcamentoController";
import {
  Alert,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { OrcamentoDAL } from "../Repo/RepositorioOrcamento";

interface ListaDeOrcamentosProps {
  dataSelecionada: Date;
  novoOrcamento: boolean;
}

const ListaDeOrcamentos: React.FC<ListaDeOrcamentosProps> = ({
  dataSelecionada,
  novoOrcamento,
}) => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItemCategoria, setSelectedItemCategoria] = useState("");
  const [selectedItemValorAtual, setSelectedItemValorAtual] = useState("");
  const [selectedItemValorDefinido, setSelectedItemValorDefinido] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemData, setSelectedItemData] = useState(new Date());
  const [dataOrcamento, setDataOrcamento] = useState(new Date());
  const [updateLista, setUpdateLista] = useState(false);
  const [categorias, setCategorias] = useState([
    { label: "Roupas", value: "Roupas" },
    { label: "Educação", value: "Educação" },
    { label: "Eletrodomésticos", value: "Eletrodomésticos" },
    { label: "Saúde", value: "Saúde" },
    { label: "Mercado", value: "Mercado" },
    { label: "Outros", value: "Outros" },
  ]);
  const [isEditable, setIsEditable] = useState(false);
  const [novoValorAtual, setNovoValorAtual] = useState("");
  const [novoValorDefinido, setNovoValorDefinido] = useState("");

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

  useEffect(() => {
    const buscarOrcamentos = async () => {
      try {
        if (!(dataSelecionada instanceof Date)) {
          throw new Error("Data inválida");
        }
        const orcamentosObtidos = await obterOrcamentosPorData(dataSelecionada);
        setOrcamentos(orcamentosObtidos);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Um erro ocorreu";
        Alert.alert("Erro", errorMessage);
      }
    };
    buscarOrcamentos();
    limparEstados();
    setIsEditable(false);
    setUpdateLista(false);
  }, [dataSelecionada, updateLista, novoOrcamento]);

  const setMonthData = () => {
    const newDate = new Date();
    newDate.setMonth(value ? value - 1 : newDate.getMonth());
    setDataOrcamento(newDate);
  };

  const handleDeletarOrcamento = async (orcamentoId: string) => {
    try {
      await OrcamentoDAL.deletarOrcamento(orcamentoId);
      alert("Orçamento deletado com sucesso!");
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAtualizarValorAtual = async (orcamentoId: string) => {
    const novoValorAtualNumber = isNaN(parseFloat(novoValorAtual))
      ? 0
      : parseFloat(novoValorAtual);
    try {
      const novosDados: Partial<Orcamento> = {
        valorAtual: novoValorAtualNumber,
      };
      await OrcamentoDAL.alterarOrcamento(orcamentoId, novosDados);
      alert("Valor atual atualizado com sucesso!");
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAlterarOrcamento = async (orcamentoId: string) => {
    const novoValorAtualNumber = isNaN(parseFloat(novoValorAtual))
      ? 0
      : parseFloat(novoValorAtual);
    const novoValorDefinidoNumber = isNaN(parseFloat(novoValorDefinido))
      ? 0
      : parseFloat(novoValorDefinido);
    try {
      const novosDados: Partial<Orcamento> = {
        valorAtual: novoValorAtualNumber,
        valorDefinido: novoValorDefinidoNumber,
        categoria: selectedItemCategoria,
        data: dataOrcamento,
      };
      await OrcamentoDAL.alterarOrcamento(orcamentoId, novosDados);
      alert("Orçamento alterado com sucesso!");
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const limparEstados = () => {
    setNovoValorDefinido("");
    setNovoValorAtual("");
  };

  const toggleModal = (
    itemCategoria: string,
    itemId: string,
    itemValorAtual: number,
    itemValorDefinido: number,
    itemData: Date
  ) => {
    setSelectedItemCategoria(itemCategoria);
    setSelectedItemId(itemId);
    setSelectedItemValorAtual(itemValorAtual.toString());
    setSelectedItemValorDefinido(itemValorDefinido.toString());
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
    console.log(itemId);
    console.log(selectedItemData.getMonth());
    setIsModalVisible(!isModalVisible);
  };

  const renderItem = ({ item }: { item: Orcamento }) => (
    <TouchableOpacity
      onPress={() =>
        toggleModal(
          item.categoria,
          item.id,
          item.valorAtual,
          item.valorDefinido,
          item.data
        )
      }
    >
      <View style={styles.container}>
        <Text style={styles.text}>{item.categoria}</Text>
        <View style={styles.valoresContainer}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.text}>Valor Atual</Text>
            <Text style={styles.textValor}>R${item.valorAtual},00</Text>
          </View>
          <View style={styles.separador}></View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.text}>Valor Total</Text>
            <Text style={styles.textValor}>R${item.valorDefinido},00</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <>
      <FlatList
        data={orcamentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{ borderBottomWidth: 1, borderBottomColor: "#fff" }} />
        )}
      />
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {isEditable ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder={`Valor Definido\nR$${selectedItemValorDefinido},00`}
                  value={novoValorDefinido}
                  onChangeText={setNovoValorDefinido}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder={`Valor Atual\nR$${selectedItemValorAtual},00`}
                  value={novoValorAtual}
                  onChangeText={setNovoValorAtual}
                  keyboardType="numeric"
                />
                <DropDownPicker
                  open={openCategoria}
                  value={selectedItemCategoria}
                  items={categorias}
                  setOpen={setOpenCategoria}
                  setValue={setSelectedItemCategoria}
                  setItems={setCategorias}
                  onChangeValue={() => setSelectedItemCategoria(selectedItemCategoria)}
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
                <View style={{ flexDirection: "row", gap: 5, paddingTop: 5 }}>
                  <Button
                    title="Atualizar"
                    onPress={() => handleAlterarOrcamento(selectedItemId)}
                  />
                  <Button
                    title="cancelar"
                    onPress={() => {
                      setIsModalVisible(false);
                      setIsEditable(false);
                    }}
                  />
                </View>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Valor Atual"
                  value={novoValorAtual}
                  onChangeText={setNovoValorAtual}
                  keyboardType="numeric"
                />
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <View style={{ flexDirection: "column", gap: 5 }}>
                    <Button
                      title="Atualizar"
                      onPress={() => handleAtualizarValorAtual(selectedItemId)}
                    />
                    <Button
                      title="editar"
                      onPress={() => setIsEditable(true)}
                    />
                  </View>
                  <View style={{ flexDirection: "column", gap: 5 }}>
                    <Button
                      title="excluir"
                      onPress={() => handleDeletarOrcamento(selectedItemId)}
                    />
                    <Button
                      title="cancelar"
                      onPress={() => setIsModalVisible(false)}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  textValor: {
    color: "#0fec32",
    fontSize: 18,
    fontWeight: "bold",
  },
  valoresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 280,
    paddingTop: 10,
  },
  separador: {
    backgroundColor: "#656865",
    width: 1,
  },
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
});

export default ListaDeOrcamentos;

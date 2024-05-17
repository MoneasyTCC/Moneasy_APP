import React, { useState, useEffect } from "react";
import { Orcamento } from "../Model/Orcamento";
import { obterOrcamentosPorData } from "../Controller/OrcamentoController";
import {
  Image,
  Alert,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { OrcamentoDAL } from "../Repo/RepositorioOrcamento";
import AwesomeAlert from "react-native-awesome-alerts"; // Certifique-se de importar AwesomeAlert

interface ListaDeOrcamentosProps {
  dataSelecionada: Date;
  novoOrcamento: boolean;
  onInteraction: () => void;
}

const ListaDeOrcamentos: React.FC<ListaDeOrcamentosProps> = ({
  dataSelecionada,
  novoOrcamento,
  onInteraction,
}) => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItemCategoria, setSelectedItemCategoria] = useState("");
  const [selectedItemValorAtual, setSelectedItemValorAtual] = useState("");
  const [selectedItemValorDefinido, setSelectedItemValorDefinido] =
    useState("");
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

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [idParaDeletar, setIdParaDeletar] = useState("");
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleInteraction = () => {
    onInteraction();
  };

  useEffect(() => {
    const buscarOrcamentos = async () => {
      try {
        if (!(dataSelecionada instanceof Date)) {
          throw new Error("Data inválida");
        }
        const orcamentosObtidos = await obterOrcamentosPorData(dataSelecionada);
        setOrcamentos(orcamentosObtidos);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Um erro ocorreu";
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
    setIdParaDeletar(orcamentoId);
    setShowConfirmAlert(true);
  };

  const confirmarDelecaoOrcamento = async () => {
    try {
      await OrcamentoDAL.deletarOrcamento(idParaDeletar);
      setShowSuccessAlert(true);
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
      handleInteraction();
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao tentar deletar o orçamento.");
      setShowErrorAlert(true);
    }
    setShowConfirmAlert(false);
  };

  const handleAtualizarValorAtual = async (orcamentoId: string) => {
    if (!novoValorAtual) {
      setValidationMessage("O campo 'Valor Atual' é obrigatório.");
      setShowValidationAlert(true);
      return; // Não continuar com a atualização
    }

    const novoValorAtualNumber = isNaN(parseFloat(novoValorAtual))
      ? 0
      : parseFloat(novoValorAtual);
    try {
      const novosDados: Partial<Orcamento> = {
        valorAtual: novoValorAtualNumber,
      };
      await OrcamentoDAL.alterarOrcamento(orcamentoId, novosDados);
      setShowSuccessAlert(true);
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
      handleInteraction();
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao tentar atualizar o valor atual.");
      setShowErrorAlert(true);
    }
  };

  const handleAlterarOrcamento = async (orcamentoId: string) => {
    if (!novoValorAtual || !novoValorDefinido || !selectedItemCategoria) {
      setValidationMessage("Todos os campos são obrigatórios.");
      setShowValidationAlert(true);
      return; // Não continuar com a inserção
    }

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
      setShowSuccessAlert(true);
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
      handleInteraction();
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao tentar alterar o orçamento.");
      setShowErrorAlert(true);
    }
  };

  const limparEstados = () => {
    setNovoValorDefinido("");
    setNovoValorAtual("");
  };

  const orcamentoPorcentagem = (valorAtual: number, valorDefinido: number) => {
    const porcentagem = (valorAtual / valorDefinido) * 100;
    return porcentagem.toFixed();
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
        {/* Container para imagem e conteúdo */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Container para texto e valores */}
          <View>
            {/* Exibe a categoria do item */}
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                {/* Container para a imagem */}
                <View>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={
                      item.categoria === "Roupas"
                        ? require("../assets/orcamento/roupa.png")
                        : item.categoria === "Educação"
                        ? require("../assets/orcamento/educacao.png")
                        : item.categoria === "Eletrodomésticos"
                        ? require("../assets/orcamento/eletrodomestico.png")
                        : item.categoria === "Saúde"
                        ? require("../assets/orcamento/saude.png")
                        : item.categoria === "Mercado"
                        ? require("../assets/orcamento/mercado.png")
                        : require("../assets/orcamento/other.png")
                    }
                  />
                </View>
                <View>
                  <Text style={styles.text}>{item.categoria}</Text>

                  {/* Calcula e exibe a porcentagem do orçamento concluído */}
                  <Text style={{ color: "#fff", fontSize: 15 }}>
                    Orçamento{" "}
                    {orcamentoPorcentagem(item.valorAtual, item.valorDefinido)}%
                    concluído
                  </Text>
                </View>
              </View>
            </View>

            {/* Container para os valores atual e total */}
            <View style={styles.valoresContainer}>
              {/* Coluna para o valor atual */}
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.text}>Valor Atual</Text>
                {/* Formata o valor atual para duas casas decimais */}
                <Text style={styles.textValor}>
                  R${item.valorAtual.toFixed(2)}
                </Text>
              </View>

              <View style={styles.separador}></View>

              {/* Coluna para o valor total */}
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.text}>Valor Total</Text>
                {/* Formata o valor definido para duas casas decimais */}
                <Text style={styles.textValor}>
                  R${item.valorDefinido.toFixed(2)}
                </Text>
              </View>
            </View>
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
          <View
            style={{ borderBottomWidth: 1, borderBottomColor: "#656865" }}
          />
        )}
      />
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {isEditable ? (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={
                      selectedItemValorDefinido != "0"
                        ? selectedItemValorDefinido
                        : `Valor Definido`
                    }
                    placeholderTextColor="#FFFFFF"
                    value={novoValorDefinido}
                    onChangeText={setNovoValorDefinido}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={
                      selectedItemValorAtual != "0"
                        ? selectedItemValorAtual
                        : `Valor Atual`
                    }
                    placeholderTextColor="#FFFFFF"
                    value={novoValorAtual}
                    onChangeText={setNovoValorAtual}
                    keyboardType="numeric"
                  />
                  <View>
                    <DropDownPicker
                      open={openCategoria}
                      value={selectedItemCategoria}
                      items={categorias}
                      setOpen={setOpenCategoria}
                      setValue={setSelectedItemCategoria}
                      setItems={setCategorias}
                      onChangeValue={() =>
                        setSelectedItemCategoria(selectedItemCategoria)
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
                  <View style={styles.botoesDivRow}>
                    <TouchableOpacity
                      onPress={() => handleAlterarOrcamento(selectedItemId)}
                      style={[styles.btn, styles.btnAdicionar]}
                    >
                      <Text style={styles.labelModal}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setIsModalVisible(false);
                        setIsEditable(false);
                      }}
                      style={[styles.btn, styles.btnCancelar]}
                    >
                      <Text style={styles.labelModal}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder={
                    selectedItemValorAtual !== "0"
                      ? selectedItemValorAtual
                      : "Valor Atual"
                  }
                  placeholderTextColor="#FFFFFF"
                  value={novoValorAtual}
                  onChangeText={setNovoValorAtual}
                  keyboardType="numeric"
                />
                <View style={styles.botoesDiv}>
                  <View style={styles.botoesColuna}>
                    <TouchableOpacity
                      style={[styles.btn, styles.btnAdicionar]}
                      onPress={() => handleAtualizarValorAtual(selectedItemId)}
                    >
                      <Text style={styles.labelModal}>Atualizar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btn, , styles.btnEditar]}
                      onPress={() => setIsEditable(true)}
                    >
                      <Text style={styles.labelModal}>Editar</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.botoesColuna}>
                    <TouchableOpacity
                      style={[styles.btn, styles.btnExcluir]}
                      onPress={() => handleDeletarOrcamento(selectedItemId)}
                    >
                      <Text style={styles.labelModal}>Excluir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => setIsModalVisible(false)}
                    >
                      <Text style={styles.labelModal}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
        show={showConfirmAlert}
        showProgress={false}
        title="Confirmar Exclusão"
        message="Você tem certeza que deseja deletar este orçamento?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Cancelar"
        confirmText="Sim"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => setShowConfirmAlert(false)}
        onConfirmPressed={confirmarDelecaoOrcamento}
      />

      <AwesomeAlert
        show={showConfirmAlert}
        showProgress={false}
        title="Confirmar Exclusão"
        message="Você tem certeza que deseja deletar este orçamento?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Cancelar"
        confirmText="Sim"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => setShowConfirmAlert(false)}
        onConfirmPressed={confirmarDelecaoOrcamento}
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
    color: "white",
    opacity: 0.7,
  },
  botoesDiv: {
    flexDirection: "row",
    justifyContent: "space-around", // Espaça uniformemente os botões na linha
  },
  botoesColuna: {
    flexDirection: "column",
    alignItems: "center", // Centraliza os botões na coluna
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
  btnExcluir: {
    backgroundColor: "#EC0F0F", // Vermelho para botões de 'Excluir'
  },
  btnCancelar: {
    backgroundColor: "#EC0F0F", // Vermelho escuro para botões 'Cancelar'
  },
  btnAdicionar: {
    backgroundColor: "#0FEC32", // Vermelho escuro para botões 'Cancelar'
  },
  btnEditar: {},
  labelModal: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botoesDivRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },

  /* labelModal: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  }, */
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
});

export default ListaDeOrcamentos;

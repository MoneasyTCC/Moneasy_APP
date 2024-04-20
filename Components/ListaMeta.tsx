import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { obterMetasPorData } from "../Controller/MetaController";
import { MetasDAL } from "../Repo/RepositorioMeta";
import { Meta } from "../Model/Meta";
import SeletorData from "./SeletorData";

interface ListaDeMetasProps {
  dataSelecionada: Date;
  novaMeta: boolean;
}

const ListaDeMetas: React.FC<ListaDeMetasProps> = ({ dataSelecionada, novaMeta }) => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [switchMetaStatus, setSwitchMetaStatus] = useState("Ativo");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateLista, setUpdateLista] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isMetaPausada, setIsMetaPausada] = useState(false);
  const [selectedItemTitulo, setSelectedItemTitulo] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemValorAtual, setSelectedItemValorAtual] = useState("");
  const [selectedItemValorObjetivo, setSelectedItemValorObjetivo] = useState("");
  const [selectedItemDataInicio, setSelectedItemDataInicio] = useState(new Date());
  const [selectedItemDataFimPrevista, setSelectedItemDataFimPrevista] = useState(new Date());
  const [selectedItemStatus, setSelectedItemStatus] = useState("");
  const [novaDataInicio, setNovaDataInicio] = useState(new Date());
  const [novaDataFim, setNovaDataFim] = useState(new Date());
  const [novoValorAtual, setNovoValorAtual] = useState("");
  const [novoValorObjetivo, setNovoValorObjetivo] = useState("");
  const [novoTitulo, setNovoTitulo] = useState("");

  useEffect(() => {
    const buscarMetasPorStatus = async () => {
      try {
        const metasObtidas = await MetasDAL.buscarMetasPorStatus(switchMetaStatus);
        setMetas(metasObtidas);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Um erro ocorreu";
        Alert.alert("Erro", errorMessage);
      }
    };
    buscarMetasPorStatus();
    setUpdateLista(false);
  }, [dataSelecionada, updateLista, novaMeta, switchMetaStatus]);

  const handleOnChangeNovaDataInicio = (data: Date) => {
    setNovaDataInicio(data);
  };

  const handleOnChangeNovaDataFim = (data: Date) => {
    setNovaDataFim(data);
  };

  const converterTimestampParaData = (timestamp: string) => {
    let seconds = 0;
    let nanoseconds = 0;
    const matches = timestamp.toString().match(/\d+/g);
    if (matches && matches.length >= 2) {
      seconds = parseInt(matches[0]);
      nanoseconds = parseInt(matches[1]);
    }
    const timestampConvertido = new Date(seconds * 1000 + nanoseconds / 1000000);
    const formattedDate = timestampConvertido;
    return formattedDate;
  };

  const handleATualizarValorAtual = async (metaId: string) => {
    const novoValorAtualNumber = isNaN(parseFloat(novoValorAtual)) ? 0 : parseFloat(novoValorAtual);
    try {
      const novosDados: Partial<Meta> = {
        valorAtual: novoValorAtualNumber,
        status: isMetaPausada ? "Pausado" : "Ativo",
      };
      if (novoValorAtual === selectedItemValorObjetivo) {
        novosDados.status = "Concluído";
      }
      await MetasDAL.alterarMeta(metaId, novosDados);
      alert("Valor atual atualizado com sucesso!");
      setIsModalVisible(false);
      limparEstados();
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAlterarMeta = async (metaId: string) => {
    const novoValorAtualNumber = isNaN(parseFloat(novoValorAtual)) ? 0 : parseFloat(novoValorAtual);
    const novoValorObjetivoNumber = isNaN(parseFloat(novoValorObjetivo))
      ? 0
      : parseFloat(novoValorObjetivo);
    try {
      const novosDados: Partial<Meta> = {
        titulo: novoTitulo,
        valorAtual: novoValorAtualNumber,
        valorObjetivo: novoValorObjetivoNumber,
        dataInicio: novaDataInicio,
        dataFimPrevista: novaDataFim,
        status: isMetaPausada ? "Pausado" : "Ativo",
      };
      if (novoValorAtual === novoValorObjetivo) {
        novosDados.status = "Concluído";
      }
      await MetasDAL.alterarMeta(metaId, novosDados);
      alert("Meta alterada com sucesso!");
      setIsModalVisible(false);
      setIsEditable(false);
      limparEstados();
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletarMeta = async (metaId: string) => {
    try {
      await MetasDAL.deletarMeta(metaId);
      alert("Meta deletada com sucesso!");
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const metaPorcentagem = (valorAtual: number, valorObjetivo: number) => {
    const porcentagem = (valorAtual / valorObjetivo) * 100;
    return porcentagem.toFixed();
  };

  const diasRestantes = (status: string, dataFim: Date) => {
    let dias = 0;
    const dataFimConvertida = converterTimestampParaData(dataFim.toString());
    const dataAtual = new Date();
    if (status === "Ativo") {
      const diferenca = dataFimConvertida.getTime() - dataAtual.getTime();
      dias = Math.ceil(diferenca / (1000 * 3600 * 24));
      if (dataFimConvertida <= dataAtual) {
        return "Concluída";
      }
      return `${dias} ${dias > 1 ? "dias restantes" : "dia restante"}`;
    } else {
      return status;
    }
  };

  const tempoEmDia = (dataInicio: Date) => {
    const dataInicioConvertida = converterTimestampParaData(dataInicio.toString());
    const dataAtual = new Date();
    const diferenca = dataAtual.getTime() - dataInicioConvertida.getTime();
    const dia = Math.ceil(diferenca / (1000 * 3600 * 24));
    if (dia === 1) {
      return "Começou hoje";
    }
    return `Começou faz: ${dia} ${dia > 1 ? "dias" : "dia"}`;
  };

  const limparEstados = () => {
    setNovoTitulo("");
    setNovoValorAtual("");
    setNovoValorObjetivo("");
    setNovaDataInicio(new Date());
    setNovaDataFim(new Date());
    setIsMetaPausada(false);
  };

  const toggleModal = (
    itemTitulo: string,
    itemId: string,
    itemValorAtual: number,
    itemValorObjetivo: number,
    itemDataInicio: Date,
    itemDataFimPrevista: Date,
    itemStatus: string
  ) => {
    setSelectedItemTitulo(itemTitulo);
    setSelectedItemId(itemId);
    setSelectedItemValorAtual(itemValorAtual.toString());
    setSelectedItemValorObjetivo(itemValorObjetivo.toString());
    setSelectedItemDataInicio(converterTimestampParaData(itemDataInicio.toString()));
    setSelectedItemDataFimPrevista(converterTimestampParaData(itemDataFimPrevista.toString()));
    setSelectedItemStatus(itemStatus);
    setIsModalVisible(!isModalVisible);
  };

  const renderItem = ({ item }: { item: Meta }) => (
    <View style={styles.container}>
      <View style={styles.tituloETempoWrapper}>
        <View style={styles.tituloETempo}>
          <Text style={styles.text}>{item.titulo}</Text>
          <TouchableOpacity
            onPress={() =>
              toggleModal(
                item.titulo,
                item.id,
                item.valorAtual,
                item.valorObjetivo,
                item.dataInicio,
                item.dataFimPrevista,
                item.status
              )
            }
          >
            <Image source={require("../assets/hamburguerMenu.png")} />
          </TouchableOpacity>
        </View>
        <View style={styles.tituloETempo}>
          <Text style={styles.textOpaco}>{diasRestantes(item.status, item.dataFimPrevista)}</Text>
          {item.status === "Ativo" ? (
            <Text style={styles.textOpaco}>{tempoEmDia(item.dataInicio)}</Text>
          ) : (
            <></>
          )}
        </View>
      </View>
      {item.status === "Concluído" ? (
        <View style={styles.textoEValorWrapper}>
          <Text style={styles.text}>Valor Alcançado</Text>
          <Text style={styles.textValor}>R${item.valorObjetivo},00</Text>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.porcentagemEData}>
              Finalizada em:{" "}
              {converterTimestampParaData(item.dataFimPrevista?.toString()).toLocaleDateString(
                "pt-br"
              )}
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.valoresContainer}>
            <View style={styles.textoEValorWrapper}>
              <Text style={styles.text}>Valor guardado</Text>
              <Text style={styles.textValor}>R${item.valorAtual},00</Text>
            </View>
            <View style={styles.separador}></View>
            <View style={styles.textoEValorWrapper}>
              <Text style={styles.text}>Valor Objetivo</Text>
              <Text style={styles.textValor}>R${item.valorObjetivo},00</Text>
            </View>
          </View>
          <View style={styles.porcentagemEDataWrapper}>
            <Text style={styles.porcentagemEData}>
              Meta {metaPorcentagem(item.valorAtual, item.valorObjetivo)}% concluída
            </Text>
            <Text style={styles.porcentagemEData}>
              Finaliza em:{" "}
              {converterTimestampParaData(item.dataFimPrevista?.toString()).toLocaleDateString(
                "pt-br"
              )}
            </Text>
          </View>
        </>
      )}
    </View>
  );
  return (
    <>
      <View style={styles.metaStatusSwitch}>
        <TouchableOpacity onPress={() => setSwitchMetaStatus("Ativo")}>
          <Text style={switchMetaStatus === "Ativo" ? { color: "#0fec32" } : { color: "#fff" }}>
            Ativo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSwitchMetaStatus("Pausado")}>
          <Text style={switchMetaStatus === "Pausado" ? { color: "#0fec32" } : { color: "#fff" }}>
            Pausado
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSwitchMetaStatus("Concluído")}>
          <Text style={switchMetaStatus === "Concluído" ? { color: "#0fec32" } : { color: "#fff" }}>
            Concluído
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ width: "90%" }}
        data={metas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ marginBottom: 10 }} />}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedItemStatus === "Concluído" ? (
              <></>
            ) : (
              <Text style={styles.modalTitle}>
                {!isEditable ? "Atualizar Meta" : "Editar Meta"}
              </Text>
            )}
            {!isEditable && (
              <>
                <TouchableOpacity
                  style={{ position: "absolute", top: 20, left: 20 }}
                  onPress={() => handleDeletarMeta(selectedItemId)}
                >
                  <Image
                    source={require("../assets/trashcan.png")}
                    style={{ width: 25, height: 25 }}
                  />
                </TouchableOpacity>
                {selectedItemStatus === "Concluído" ? (
                  <></>
                ) : (
                  <TouchableOpacity
                    style={{ position: "absolute", top: 20, right: 20 }}
                    onPress={() => setIsEditable(!isEditable)}
                  >
                    <Image
                      source={require("../assets/edit.png")}
                      style={{ width: 25, height: 25 }}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
            {selectedItemStatus === "Pausado" ? (
              <>
                {!isEditable && (
                  <>
                    <Text style={styles.text}>{isMetaPausada ? "Pausar" : "Ativar"}</Text>
                    <Switch
                      value={isMetaPausada}
                      onValueChange={() => setIsMetaPausada((prevState) => !prevState)}
                    ></Switch>
                  </>
                )}
              </>
            ) : selectedItemStatus === "Concluído" ? (
              <>
                <Text style={styles.text}>Titulo: {selectedItemTitulo}</Text>
                <Text style={styles.text}>Valor Alcancado: {selectedItemValorObjetivo}</Text>
                <Text style={styles.text}>
                  Comecou em: {selectedItemDataInicio.toLocaleDateString("pt-br")}
                </Text>
                <Text style={styles.text}>
                  Finalizada em: {selectedItemDataFimPrevista.toLocaleDateString("pt-br")}
                </Text>
              </>
            ) : (
              <>
                {!isEditable && (
                  <>
                    <TextInput
                      style={styles.inputAtualizarValorAtual}
                      placeholder={`R$${selectedItemValorAtual},00`}
                      placeholderTextColor={"#ffffff"}
                      keyboardType="numeric"
                      value={novoValorAtual}
                      onChangeText={(text) => setNovoValorAtual(text)}
                    ></TextInput>
                    <Text style={styles.text}>{isMetaPausada ? "Pausar" : "Ativar"}</Text>
                    <Switch
                      value={isMetaPausada}
                      onValueChange={() => setIsMetaPausada((prevState) => !prevState)}
                    ></Switch>
                  </>
                )}
              </>
            )}
            {isEditable && (
              <>
                <TextInput
                  style={styles.inputTitulo}
                  placeholder={selectedItemTitulo}
                  placeholderTextColor={"#fff"}
                  value={novoTitulo}
                  onChangeText={(text) => setNovoTitulo(text)}
                ></TextInput>
                <View style={styles.inputValorDataGroup}>
                  <TextInput
                    style={styles.inputAtualizarValorAtual}
                    placeholder={`R$${selectedItemValorAtual},00`}
                    placeholderTextColor={"#fff"}
                    keyboardType="numeric"
                    value={novoValorAtual}
                    onChangeText={(text) => setNovoValorAtual(text)}
                  ></TextInput>
                  <SeletorData
                    onDateChange={handleOnChangeNovaDataInicio}
                    dataMaxima={new Date()}
                  />
                </View>
                <View style={styles.inputValorDataGroup}>
                  <TextInput
                    style={styles.inputAtualizarValorAtual}
                    placeholder={`R$${selectedItemValorObjetivo},00`}
                    placeholderTextColor={"#fff"}
                    keyboardType="numeric"
                    value={novoValorObjetivo}
                    onChangeText={(text) => setNovoValorObjetivo(text)}
                  ></TextInput>
                  <SeletorData
                    onDateChange={handleOnChangeNovaDataFim}
                    dataMinima={new Date()}
                  />
                </View>
                <Text style={styles.text}>{isMetaPausada ? "Pausar" : "Ativar"}</Text>
                <Switch
                  value={isMetaPausada}
                  onValueChange={() => setIsMetaPausada((prevState) => !prevState)}
                ></Switch>
              </>
            )}
            {selectedItemStatus === "Concluído" ? (
              <></>
            ) : (
              <TouchableOpacity
                style={
                  !isEditable
                    ? [styles.btnModalSuccess, { width: 160 }]
                    : [styles.btnModalSuccess, { width: 230 }]
                }
                onPress={
                  !isEditable
                    ? () => handleATualizarValorAtual(selectedItemId)
                    : () => handleAlterarMeta(selectedItemId)
                }
              >
                <Text style={styles.labelModal}>
                  {!isEditable ? "Atualizar Valor" : "Concluir"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(!isModalVisible), setIsEditable(false), setIsMetaPausada(false);
              }}
            >
              <Text style={styles.labelModal}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3a3e3a",
    //backgroundColor: "#2a2a2a",
    elevation: 5,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    borderRadius: 15,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textOpaco: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    opacity: 0.7,
  },
  textValor: {
    color: "#0fec32",
    fontSize: 18,
    fontWeight: "500",
  },
  separador: {
    backgroundColor: "#656865",
    width: 1,
  },
  valoresContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
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
  inputAtualizarValorAtual: {
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
  btnModalSuccess: {
    borderRadius: 20,
    backgroundColor: "#0fec32",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  labelModal: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
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
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  inputValorDataGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 230,
  },
  tituloETempo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  tituloETempoWrapper: {
    width: "100%",
    justifyContent: "flex-start",
  },
  porcentagemEData: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  porcentagemEDataWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  textoEValorWrapper: {
    flexDirection: "column",
    alignItems: "center",
  },
  metaStatusSwitch: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    backgroundColor: "#2a2a2a",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  editDeletePosition: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});

export default ListaDeMetas;

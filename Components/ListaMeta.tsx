import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
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
import { MetasDAL } from "../Repo/RepositorioMeta";
import { Meta } from "../Model/Meta";
import SeletorData from "./SeletorData";

interface ListaDeMetasProps {
  dataSelecionada: Date;
  novaMeta: boolean;
}

const ListaDeMetas: React.FC<ListaDeMetasProps> = ({
  dataSelecionada,
  novaMeta,
}) => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [switchMetaStatus, setSwitchMetaStatus] = useState<
    "Ativo" | "Pausado" | "Concluído"
  >("Ativo");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateLista, setUpdateLista] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isMetaPausada, setIsMetaPausada] = useState(false);
  const [selectedItemTitulo, setSelectedItemTitulo] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemValorAtual, setSelectedItemValorAtual] = useState("");
  const [selectedItemValorObjetivo, setSelectedItemValorObjetivo] =
    useState("");
  const [selectedItemDataInicio, setSelectedItemDataInicio] = useState(
    new Date()
  );
  const [selectedItemDataFimPrevista, setSelectedItemDataFimPrevista] =
    useState(new Date());
  const [selectedItemStatus, setSelectedItemStatus] = useState("");
  const [novaDataInicio, setNovaDataInicio] = useState(new Date());
  const [novaDataFim, setNovaDataFim] = useState(new Date());
  const [novoValorAtual, setNovoValorAtual] = useState("");
  const [novoValorObjetivo, setNovoValorObjetivo] = useState("");
  const [novoTitulo, setNovoTitulo] = useState("");
  const backgroundColors = {
    Ativo: useRef(new Animated.Value(0)).current,
    Pausado: useRef(new Animated.Value(0)).current,
    Concluído: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    Animated.timing(backgroundColors[switchMetaStatus], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Reset the others
    (
      Object.keys(backgroundColors) as (keyof typeof backgroundColors)[]
    ).forEach((status) => {
      if (status !== switchMetaStatus) {
        Animated.timing(backgroundColors[status], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [switchMetaStatus, backgroundColors]);

  const getStatusStyle = (status: "Ativo" | "Pausado" | "Concluído") => {
    const backgroundColor = backgroundColors[status].interpolate({
      inputRange: [0, 1],
      outputRange: ["#616161", "#0fec32"], // Default color to Active color
    });

    return {
      backgroundColor,
    };
  };

  useEffect(() => {
    const buscarMetasPorStatus = async () => {
      try {
        const metasObtidas = await MetasDAL.buscarMetasPorStatusEAno(
          switchMetaStatus,
          new Date(dataSelecionada.getFullYear(), 11, 31).toString()
        );
        setMetas(metasObtidas);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Um erro ocorreu";
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
    const timestampConvertido = new Date(
      seconds * 1000 + nanoseconds / 1000000
    );
    const formattedDate = timestampConvertido;
    return formattedDate;
  };

  const handleATualizarValorAtual = async (metaId: string) => {
    const oldValorAtualNumber = isNaN(parseFloat(selectedItemValorAtual))
      ? 0
      : parseFloat(selectedItemValorAtual);
    const novoValorAtualNumber = isNaN(parseFloat(novoValorAtual))
      ? 0
      : parseFloat(novoValorAtual);
    try {
      const novosDados: Partial<Meta> = {
        valorAtual: novoValorAtualNumber,
        status: isMetaPausada ? "Pausado" : "Ativo",
      };
      if (novoValorAtual === selectedItemValorObjetivo) {
        novosDados.status = "Concluído";
      }
      if (isMetaPausada && novoValorAtualNumber !== oldValorAtualNumber) {
        novosDados.valorAtual = novoValorAtualNumber;
      }
      if (isMetaPausada && novoValorAtualNumber === 0) {
        novosDados.valorAtual = oldValorAtualNumber;
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

  const handleDespausarMeta = async (metaId: string) => {
    try {
      const novosDados: Partial<Meta> = {
        status: isMetaPausada ? "Pausado" : "Ativo",
      };
      await MetasDAL.alterarMeta(metaId, novosDados);
      isMetaPausada ? null : alert("Meta ativada!");
      setIsModalVisible(false);
      limparEstados();
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAtualizarDataFim = async (metaId: string) => {
    try {
      const novosDados: Partial<Meta> = {
        dataFimPrevista: novaDataFim,
      };
      await MetasDAL.alterarMeta(metaId, novosDados);
      setIsModalVisible(false);
      limparEstados();
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAlterarMeta = async (metaId: string) => {
    const novoValorAtualNumber = isNaN(parseFloat(novoValorAtual))
      ? 0
      : parseFloat(novoValorAtual);
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
      return `${dias} ${dias > 1 ? "dias restantes" : "dia restante"}`;
    } else {
      return status;
    }
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
    setSelectedItemDataInicio(
      converterTimestampParaData(itemDataInicio.toString())
    );
    setSelectedItemDataFimPrevista(
      converterTimestampParaData(itemDataFimPrevista.toString())
    );
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
          <Text style={styles.textOpaco}>
            {diasRestantes(item.status, item.dataFimPrevista)}
          </Text>
          {item.status === "Ativo" ? (
            <Text style={styles.textOpaco}>
              {`Começou em: ${converterTimestampParaData(
                item.dataInicio.toString()
              ).toLocaleDateString("pt-br")}`}
            </Text>
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
              {converterTimestampParaData(
                item.dataFimPrevista?.toString()
              ).toLocaleDateString("pt-br")}
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
              Meta {metaPorcentagem(item.valorAtual, item.valorObjetivo)}%
              concluída
            </Text>
            <Text style={styles.porcentagemEData}>
              {item.status === "Pausado"
                ? "Finaliza em: Pendente"
                : `Finaliza em: ${converterTimestampParaData(
                    item.dataFimPrevista?.toString()
                  ).toLocaleDateString("pt-br")}`}
            </Text>
          </View>
        </>
      )}
    </View>
  );
  //pra evitar o nesting bizarro de operador ternario que eu tava fazendo eu separei em variaveis
  //pra ficar mais legivel
  let dataMenorQueDataAtual = null;
  if (!(selectedItemDataFimPrevista < new Date())) {
    dataMenorQueDataAtual = (
      <>
        {isEditable ? (
          <></>
        ) : (
          <>
            <Text style={styles.text}>
              {isMetaPausada ? "Pausar" : "Ativar"}
            </Text>
            <Switch
              value={isMetaPausada}
              onValueChange={() => setIsMetaPausada((prevState) => !prevState)}
            ></Switch>
          </>
        )}
      </>
    );
  } else {
    dataMenorQueDataAtual = (
      <>
        <Text style={styles.text}>Atualize a data</Text>
        <SeletorData
          onDateChange={handleOnChangeNovaDataFim}
          dataMinima={new Date()}
        />
      </>
    );
  }
  let itemStatusIgualConcluido = null;
  if (selectedItemStatus === "Concluído") {
    itemStatusIgualConcluido = (
      <>
        <Text style={styles.text}>Titulo: {selectedItemTitulo}</Text>
        <Text style={styles.text}>
          Valor Alcancado: {selectedItemValorObjetivo}
        </Text>
        <Text style={styles.text}>
          Comecou em: {selectedItemDataInicio.toLocaleDateString("pt-br")}
        </Text>
        <Text style={styles.text}>
          Finalizada em:{" "}
          {selectedItemDataFimPrevista.toLocaleDateString("pt-br")}
        </Text>
      </>
    );
  } else if (!isEditable) {
    itemStatusIgualConcluido = (
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
    );
  }
  let btnSuccessCase = null;
  if (selectedItemDataFimPrevista < new Date()) {
    btnSuccessCase = (
      <>
        <TouchableOpacity
          style={
            !isEditable
              ? [styles.btnModalSuccess, { width: 160 }]
              : [styles.btnModalSuccess, { width: 230 }]
          }
          onPress={() => handleAtualizarDataFim(selectedItemId)}
        >
          <Text style={styles.labelModal}>Atualizar Data</Text>
        </TouchableOpacity>
      </>
    );
  } else if (!isEditable) {
    btnSuccessCase = (
      <>
        {selectedItemStatus === "Pausado" ? (
          <TouchableOpacity
            style={[styles.btnModalSuccess, { width: 160 }]}
            onPress={() => handleDespausarMeta(selectedItemId)}
          >
            <Text style={styles.labelModal}>Atualizar Estado</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btnModalSuccess, { width: 160 }]}
            onPress={() => handleATualizarValorAtual(selectedItemId)}
          >
            <Text style={styles.labelModal}>Atualizar Valor</Text>
          </TouchableOpacity>
        )}
      </>
    );
  } else {
    btnSuccessCase = (
      <>
        <TouchableOpacity
          style={[styles.btnModalSuccess, { width: 230 }]}
          onPress={() => handleAlterarMeta(selectedItemId)}
        >
          <Text style={styles.labelModal}>Concluir</Text>
        </TouchableOpacity>
      </>
    );
  }
  return (
    <>
      <View style={styles.metaStatusSwitch}>
        {(["Ativo", "Pausado", "Concluído"] as const).map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setSwitchMetaStatus(status)}
            style={[
              styles.statusButton,
              status === "Ativo"
                ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }
                : status === "Pausado"
                ? { borderRadius: 2 }
                : { borderTopRightRadius: 10, borderBottomRightRadius: 10 },
            ]}
          >
            <Animated.View
              style={[styles.animatedButton, getStatusStyle(status)]}
            >
              <Text
                style={{
                  color: switchMetaStatus === status ? "#ffffff" : "#b0b0b0",
                  fontWeight: "bold",
                }}
              >
                {status}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        style={{ width: "90%" }}
        data={metas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ marginBottom: 10 }} />}
      />
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
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
              <>{dataMenorQueDataAtual}</>
            ) : (
              <>{itemStatusIgualConcluido}</>
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
                    dataMinima={new Date(new Date().getFullYear(), 0, 1)}
                    dataMaxima={new Date(new Date().getFullYear(), 11, 31)}
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
                    dataMinima={novaDataInicio}
                  />
                </View>
              </>
            )}
            {selectedItemStatus === "Concluído" ? <></> : <>{btnSuccessCase}</>}
            <TouchableOpacity
              style={[styles.btn, styles.btnCancelar]}
              onPress={() => {
                setIsModalVisible(!isModalVisible),
                  setIsEditable(false),
                  setIsMetaPausada(false);
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
  } /* ,
  metaStatusSwitch: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    backgroundColor: "#2a2a2a",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 20,
  } */,
  editDeletePosition: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  metaStatusSwitch: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    height: "12%",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#3a3e3a",
    borderRadius: 20,
    marginBottom: 20,
  },
  statusButton: {
    flex: 1,
    /* marginHorizontal: 4, */
    /*  borderRadius: 10, */
    overflow: "hidden", // Important to clip the animated view
  },
  animatedButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});

export default ListaDeMetas;

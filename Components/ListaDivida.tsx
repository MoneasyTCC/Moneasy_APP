import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Switch,
  TextInput,
  Image,
  Modal,
} from "react-native";
import { obterDividasPorData } from "../Controller/DividaController";
import { DividaDAL } from "../Repo/RepositorioDivida";
import { Divida } from "../Model/Divida";
import SeletorData from "./SeletorData";
import AwesomeAlert from "react-native-awesome-alerts"; // Import AwesomeAlert

interface ListaDeDividasProps {
  dataSelecionada: Date;
  novaDivida: boolean;
}

const ListaDeDividas: React.FC<ListaDeDividasProps> = ({
  dataSelecionada,
  novaDivida,
}) => {
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [isDividaPaga, setIsDividaPaga] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateLista, setUpdateLista] = useState(false);
  const [switchDividaStatus, setSwitchDividaStatus] = useState<
    "Pendente" | "Pago"
  >("Pendente");

  const [selectedItemTitulo, setSelectedItemTitulo] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemValorTotal, setSelectedItemValorTotal] = useState("");
  const [selectedItemValorPago, setSelectedItemValorPago] = useState("");
  const [selectedItemDataInicio, setSelectedItemDataInicio] = useState(
    new Date()
  );
  const [selectedItemDataVencimento, setSelectedItemDataVencimento] = useState(
    new Date()
  );
  const [selectedItemStatus, setSelectedItemStatus] = useState("Pendente");
  const [novaDataInicio, setNovaDataInicio] = useState(new Date());
  const [novaDataFim, setNovaDataFim] = useState(new Date());
  const [novoValorTotal, setNovoValorTotal] = useState("");
  const [novoValorPago, setNovoValorPago] = useState("");
  const [novoTitulo, setNovoTitulo] = useState("");
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirmAlert, setShowDeleteConfirmAlert] = useState(false);

  // Animação refs
  const backgroundColors = {
    Pendente: useRef(new Animated.Value(0)).current,
    Pago: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    Animated.timing(backgroundColors[switchDividaStatus], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Object.keys(backgroundColors).forEach((status) => {
      if (status !== switchDividaStatus) {
        Animated.timing(backgroundColors[status as "Pendente" | "Pago"], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [switchDividaStatus, backgroundColors]);

  useEffect(() => {
    const buscarDividas = async () => {
      try {
        const dividasObtidas = await DividaDAL.buscarDividasPorStatusEAno(
          switchDividaStatus,
          new Date(dataSelecionada.getFullYear(), 11, 31).toString()
        );
        if (!(dataSelecionada instanceof Date)) {
          throw new Error("Data inválida");
        }
        setDividas(dividasObtidas);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Um erro ocorreu";
        Alert.alert("Erro", errorMessage);
      }
    };
    buscarDividas();
    setUpdateLista(false);
  }, [dataSelecionada, updateLista, novaDivida, switchDividaStatus]);

  const getStatusStyle = (status: "Pendente" | "Pago") => {
    const backgroundColor = backgroundColors[status].interpolate({
      inputRange: [0, 1],
      outputRange: ["#616161", "#0fec32"],
    });

    return {
      backgroundColor,
    };
  };

  const handleOnChangeNovaDataInicio = (data: Date) => {
    setNovaDataInicio(data);
  };

  const handleOnChangeNovaDataFim = (data: Date) => {
    setNovaDataFim(data);
  };

  const calcularValorTotalDividasPendentes = () => {
    let total = 0;
    let restante = 0;
    dividas.forEach((divida) => {
      if (divida.status === "Pendente") {
        total += divida.valorTotal;
        restante += divida.valorTotal - divida.valorPago;
      }
    });
    return total;
  };

  const calcularValorRestanteDividasPendentes = () => {
    let restante = 0;
    dividas.forEach((divida) => {
      if (divida.status === "Pendente") {
        restante += divida.valorTotal - divida.valorPago;
      }
    });
    return restante;
  };

  const calcularValorTotalDasDividasPagas = (dividas: Divida[]) => {
    let valorTotal = 0;
    dividas.forEach((divida) => {
      if (divida.status === "Pago") {
        valorTotal += divida.valorTotal;
      }
    });
    return valorTotal;
  };

  const converterTimestampParaData = (timestamp: string) => {
    if (timestamp) {
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
    } else {
      // Trate o caso em que timestamp é undefined
      console.error("O timestamp é undefined");
      // Aqui você pode retornar um valor padrão, lançar um erro ou tratar de acordo com a lógica do seu aplicativo
      // Neste exemplo, estou retornando null
      return null;
    }
  };

  const handleATualizarValorPago = async (dividaId: string) => {
    if (!novoValorPago) {
      setValidationMessage("O campo Valor Pago é obrigatório.");
      setShowValidationAlert(true);
      return; // Não continuar com a atualização
    }

    const oldValorAtualNumber = isNaN(parseFloat(selectedItemValorPago))
      ? 0
      : parseFloat(selectedItemValorPago);
    const novoValorPagoNumber = isNaN(parseFloat(novoValorPago))
      ? 0
      : parseFloat(novoValorPago);
    try {
      const novosDados: Partial<Divida> = {
        valorPago: novoValorPagoNumber,
        status: isDividaPaga ? "Pago" : "Pendente",
      };
      if (novoValorPago >= selectedItemValorTotal) {
        novosDados.status = "Pago";
      }
      if (novoValorPagoNumber !== oldValorAtualNumber) {
        novosDados.valorPago = novoValorPagoNumber;
      }
      if (novoValorPagoNumber === 0) {
        novosDados.valorPago = oldValorAtualNumber;
      }
      await DividaDAL.alterarDivida(dividaId, novosDados);
      setShowSuccessAlert(true); // Mostrar alerta de sucesso
      setIsModalVisible(false);
      limparEstados();
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao tentar atualizar o valor pago.");
      setShowErrorAlert(true);
    }
  };

  const handleDividaPendente = async (dividaId: string) => {
    try {
      const novosDados: Partial<Divida> = {
        status: isDividaPaga ? "Pendente" : "Paga",
      };
      await DividaDAL.alterarDivida(dividaId, novosDados);
      setShowSuccessAlert(true); // Mostrar alerta de sucesso
      setIsModalVisible(false);
      limparEstados();
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao tentar alterar o status da dívida.");
      setShowErrorAlert(true);
    }
  };

  const handleAtualizarDataFim = async (dividaId: string) => {
    try {
      const novosDados: Partial<Divida> = {
        dataVencimento: novaDataFim,
      };
      await DividaDAL.alterarDivida(dividaId, novosDados);
      setIsModalVisible(false);
      limparEstados();
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };
  const handleAlterarDivida = async (dividaId: string) => {
    if (!novoTitulo || !novoValorPago || !novoValorTotal) {
      setValidationMessage("Todos os campos são obrigatórios.");
      setShowValidationAlert(true);
      return; // Não continuar com a atualização
    }

    const novoValorPagoNumber = isNaN(parseFloat(novoValorPago))
      ? 0
      : parseFloat(novoValorPago);
    const novoValorTotalNumber = isNaN(parseFloat(novoValorTotal))
      ? 0
      : parseFloat(novoValorTotal);
    try {
      const novosDados: Partial<Divida> = {
        titulo: novoTitulo,
        valorPago: novoValorPagoNumber,
        valorTotal: novoValorTotalNumber,
        dataInicio: novaDataInicio,
        dataVencimento: novaDataFim,
        status: isDividaPaga ? "Pago" : "Pendente",
      };
      if (novoValorPago >= novoValorTotal) {
        novosDados.status = "Pago";
      }
      await DividaDAL.alterarDivida(dividaId, novosDados);
      setShowSuccessAlert(true); // Mostrar alerta de sucesso
      setIsModalVisible(false);
      setIsEditable(false);
      limparEstados();
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao tentar alterar a dívida.");
      setShowErrorAlert(true);
    }
  };

  const handleDeletarDivida = async (dividaId: string) => {
    setShowDeleteConfirmAlert(true);
  };

  const confirmDeleteDivida = async () => {
    try {
      await DividaDAL.deletarDivida(selectedItemId); // Use `selectedItemId` para deletar a dívida selecionada
      setShowSuccessAlert(true); // Mostrar alerta de sucesso
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao tentar deletar a dívida.");
      setShowErrorAlert(true);
    } finally {
      setShowDeleteConfirmAlert(false); // Fechar o alerta de confirmação
    }
  };

  const dividaPorcentagem = (valorTotal: number, valorPago: number) => {
    if (valorPago <= 0) {
      return 0; // Retorna 0 se o valor pago for menor ou igual a 0
    }
    if (valorPago >= valorTotal) {
      return 100; // Retorna 100 se o valor pago for maior ou igual ao total
    }
    const porcentagem = (valorPago / valorTotal) * 100;
    return porcentagem.toFixed();
  };

  const diasRestantes = (status: string, dataFim: Date) => {
    let dias = 0;
    if (!dataFim) {
      return status;
    }
    const dataFimConvertida = converterTimestampParaData(dataFim.toString());
    const dataAtual = new Date();
    if (status === "Pendente") {
      const diferenca = dataFimConvertida.getTime() - dataAtual.getTime();
      dias = Math.ceil(diferenca / (1000 * 3600 * 24));
      return `${dias} ${dias > 1 ? "dias restantes" : "dia restante"}`;
    } else {
      return status;
    }
  };

  const limparEstados = () => {
    setNovoTitulo("");
    setNovoValorTotal("");
    setNovoValorPago("");
    setNovaDataInicio(new Date());
    setNovaDataFim(new Date());
    setIsDividaPaga(false);
  };

  const toggleModal = (
    itemTitulo: string,
    itemId: string,
    itemValorTotal: number,
    itemValorPago: number,
    itemDataInicio: Date,
    itemDataVencimento: Date
  ) => {
    setSelectedItemTitulo(itemTitulo);
    setSelectedItemId(itemId);
    setSelectedItemValorTotal(itemValorTotal.toString());
    setSelectedItemValorPago(itemValorPago.toString());
    setSelectedItemDataInicio(
      converterTimestampParaData(itemDataInicio.toString())
    );
    setSelectedItemDataVencimento(
      converterTimestampParaData(itemDataVencimento.toString())
    );
    setIsModalVisible(!isModalVisible);
  };

  const renderItem = ({ item }: { item: Divida }) => (
    <View style={styles.container}>
      <View style={styles.tituloETempoWrapper}>
        <View style={styles.tituloETempo}>
          <Text style={styles.text}>{item.titulo}</Text>
          <TouchableOpacity
            onPress={() =>
              toggleModal(
                item.titulo,
                item.id,
                item.valorTotal,
                item.valorPago,
                item.dataInicio,
                item.dataVencimento
              )
            }
          >
            <Image source={require("../assets/hamburguerMenu.png")} />
          </TouchableOpacity>
        </View>
        <View style={styles.tituloETempo}>
          <Text style={styles.textOpaco}>
            {diasRestantes(item.status, item.dataVencimento)}
          </Text>
          {item.status === "Pendente" ? (
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
      {item.status === "Pago" ? (
        <View style={styles.textoEValorWrapper}>
          <Text style={styles.text}>Valor Total</Text>
          <Text style={styles.textValor}>R${item.valorTotal},00</Text>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.porcentagemEData}>
              Finalizada em:{" "}
              {converterTimestampParaData(
                item.dataVencimento?.toString()
              ).toLocaleDateString("pt-br")}
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.valoresContainer}>
            <View style={styles.textoEValorWrapper}>
              <Text style={styles.text}>Valor Pago</Text>
              <Text style={styles.textValor}>R${item.valorPago},00</Text>
            </View>
            <View style={styles.separador}></View>
            <View style={styles.textoEValorWrapper}>
              <Text style={styles.text}>Valor Total</Text>
              <Text style={styles.textValor}>R${item.valorTotal},00</Text>
            </View>
          </View>
          <View style={styles.porcentagemEDataWrapper}>
            <Text style={styles.porcentagemEData}>
              Divida {dividaPorcentagem(item.valorTotal, item.valorPago)}%
              concluída
            </Text>
            <Text style={styles.porcentagemEData}>
              {`Finaliza em: ${converterTimestampParaData(
                item.dataVencimento?.toString()
              ).toLocaleDateString("pt-br")}`}
            </Text>
          </View>
        </>
      )}
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
        show={showDeleteConfirmAlert}
        showProgress={false}
        title="Confirmar Deleção"
        message="Tem certeza de que deseja deletar esta dívida?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Cancelar"
        confirmText="Deletar"
        confirmButtonColor="#EC0F0F"
        onCancelPressed={() => setShowDeleteConfirmAlert(false)}
        onConfirmPressed={confirmDeleteDivida}
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
        show={showSuccessAlert}
        showProgress={false}
        title="Sucesso"
        message="Dívida deletada com sucesso!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#0FEC32"
        onConfirmPressed={() => setShowSuccessAlert(false)}
      />
    </View>
  );
  let dataMenorQueDataAtual = null;
  if (!(selectedItemDataVencimento >= new Date())) {
    dataMenorQueDataAtual = (
      <>
        <Text style={styles.text}>Altere a data final: </Text>
        <SeletorData
          onDateChange={handleOnChangeNovaDataFim}
          dataMinima={new Date()}
        />
      </>
    );
  }
  let itemStatusIgualPago = null;
  if (switchDividaStatus === "Pago") {
    itemStatusIgualPago = (
      <>
        <Text style={styles.text}>Titulo: {selectedItemTitulo}</Text>
        <Text style={styles.text}>
          Valor Alcancado: R${selectedItemValorTotal},00
        </Text>
        <Text style={styles.text}>
          Comecou em: {selectedItemDataInicio.toLocaleDateString("pt-br")}
        </Text>
        <Text style={styles.text}>
          Finalizada em:{" "}
          {selectedItemDataVencimento.toLocaleDateString("pt-br")}
        </Text>
      </>
    );
  } else if (!isEditable) {
    itemStatusIgualPago = (
      <>
        <TextInput
          style={styles.inputAtualizarValorPago}
          placeholder={`R$${selectedItemValorPago},00`}
          placeholderTextColor={"#ffffff"}
          keyboardType="numeric"
          value={novoValorPago}
          onChangeText={(text) => setNovoValorPago(text)}
        ></TextInput>
        <Text style={styles.text}>{isDividaPaga ? "Pago" : "Pendente"}</Text>
        <Switch
          value={isDividaPaga}
          onValueChange={() => setIsDividaPaga((prevState) => !prevState)}
        ></Switch>
      </>
    );
  }
  let btnSuccessCase = null;
  if (selectedItemDataVencimento < new Date()) {
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
        {switchDividaStatus === "Pendente" ? (
          <TouchableOpacity
            style={[styles.btnModalSuccess, { width: 160 }]}
            onPress={() => handleDividaPendente(selectedItemId)}
          >
            <Text style={styles.labelModal}>Atualizar Estado</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btnModalSuccess, { width: 160 }]}
            onPress={() => handleATualizarValorPago(selectedItemId)}
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
          onPress={() => handleAlterarDivida(selectedItemId)}
        >
          <Text style={styles.labelModal}>Concluir</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <>
      <View style={styles.dividaStatusSwitch}>
        {(["Pendente", "Pago"] as const).map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setSwitchDividaStatus(status)}
            style={[
              styles.statusButton,
              status === "Pendente"
                ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }
                : { borderTopRightRadius: 10, borderBottomRightRadius: 10 },
            ]}
          >
            <Animated.View
              style={[styles.animatedButton, getStatusStyle(status)]}
            >
              <Text
                style={{
                  color: switchDividaStatus === status ? "#ffffff" : "#b0b0b0",
                  fontWeight: "bold",
                }}
              >
                {status}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
      {switchDividaStatus === "Pendente" && (
        <View style={styles.totalERestanteGroup}>
          <View>
            <Text style={styles.totalERestanteText}>Total em Dívidas</Text>
            <Text style={styles.totalERestanteValor}>
              R${calcularValorTotalDividasPendentes()},00
            </Text>
          </View>
          <View>
            <Text style={styles.totalERestanteText}>Restante</Text>
            <Text style={styles.totalERestanteValor}>
              R${calcularValorRestanteDividasPendentes()},00
            </Text>
          </View>
        </View>
      )}
      {switchDividaStatus === "Pago" && (
        <View style={styles.TotalGroup}>
          <View>
            <Text style={styles.TotalText}>Total</Text>
            <Text style={styles.TotalValor}>
              R${calcularValorTotalDasDividasPagas(dividas)},00
            </Text>
          </View>
        </View>
      )}
      <FlatList
        style={{ width: "90%" }}
        data={dividas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ marginBottom: 10 }} />}
      />
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {switchDividaStatus === "Pago" ? (
              <></>
            ) : (
              <Text style={styles.modalTitle}>
                {!isEditable ? "Atualizar Divida" : "Editar Divida"}
              </Text>
            )}
            {!isEditable && (
              <>
                <TouchableOpacity
                  style={{ position: "absolute", top: 20, left: 20 }}
                  onPress={() => handleDeletarDivida(selectedItemId)}
                >
                  <Image
                    source={require("../assets/trashcan.png")}
                    style={{ width: 25, height: 25 }}
                  />
                </TouchableOpacity>
                {switchDividaStatus === "Pago" ? (
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
            {selectedItemDataVencimento < new Date() ? (
              <>{dataMenorQueDataAtual}</>
            ) : (
              <>{itemStatusIgualPago}</>
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
                    style={styles.inputAtualizarValorPago}
                    placeholder={`R$${selectedItemValorPago},00`}
                    placeholderTextColor={"#fff"}
                    keyboardType="numeric"
                    value={novoValorPago}
                    onChangeText={(text) => setNovoValorPago(text)}
                  ></TextInput>
                  <SeletorData
                    onDateChange={handleOnChangeNovaDataInicio}
                    dataMinima={new Date(new Date().getFullYear(), 0, 1)}
                    dataMaxima={new Date(new Date().getFullYear(), 11, 31)}
                  />
                </View>
                <View style={styles.inputValorDataGroup}>
                  <TextInput
                    style={styles.inputAtualizarValorPago}
                    placeholder={`R$${selectedItemValorTotal},00`}
                    placeholderTextColor={"#fff"}
                    keyboardType="numeric"
                    value={novoValorTotal}
                    onChangeText={(text) => setNovoValorTotal(text)}
                  ></TextInput>
                  <SeletorData
                    onDateChange={handleOnChangeNovaDataFim}
                    dataMinima={novaDataInicio}
                  />
                </View>
              </>
            )}
            {switchDividaStatus === "Pago" ? <></> : <>{btnSuccessCase}</>}
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(!isModalVisible),
                  setIsEditable(false),
                  setIsDividaPaga(false);
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
    alignItems: "center",
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
  inputAtualizarValorPago: {
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
  tituloETempo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  textoEValorWrapper: {
    flexDirection: "column",
    alignItems: "center",
  },
  /* dividaStatusSwitch: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    backgroundColor: "#2a2a2a",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 20,
  }, */
  editDeletePosition: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  totalERestanteGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 320,
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

  TotalGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Alterado para "space-evenly" para centralizar
    width: 320,
  },
  TotalText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center", // Adicionado para centralizar o texto
  },
  TotalValor: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center", // Adicionado para centralizar o valor
  },
  dividaStatusSwitch: {
    flexDirection: "row",
    justifyContent: "center",
    width: "60%",
    height: "12%",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#3a3e3a",
    borderRadius: 20,
    marginBottom: 20,
  },
  statusButton: {
    flex: 1,
    /* marginHorizontal: 5, */
    /*  borderRadius: 10, */
    overflow: "hidden",
  },
  animatedButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ListaDeDividas;

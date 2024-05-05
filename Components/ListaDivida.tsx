import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Switch, TextInput, Image, Modal } from "react-native";
import { obterDividasPorData } from "../Controller/DividaController";
import { DividaDAL } from "../Repo/RepositorioDivida";
import { Divida } from "../Model/Divida";
import SeletorData from "./SeletorData";


interface ListaDeDividasProps {
  dataSelecionada: Date;
  novaDivida: boolean;
}

const ListaDeDividas: React.FC<ListaDeDividasProps> = ({ dataSelecionada, novaDivida }) => {
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [isDividaPaga, setIsDividaPaga] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateLista, setUpdateLista] = useState(false);
  const [switchDividaStatus, setSwitchDividaStatus] = useState("Pendente");
  const [selectedItemTitulo, setSelectedItemTitulo] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemValorTotal, setSelectedItemValorTotal] = useState("");
  const [selectedItemValorPago, setSelectedItemValorPago] = useState("");
  const [selectedItemDataInicio, setSelectedItemDataInicio] = useState(new Date());
  const [selectedItemDataVencimento, setSelectedItemDataVencimento] = useState(new Date());
  const [selectedItemStatus, setSelectedItemStatus] = useState("");
  const [novaDataInicio, setNovaDataInicio] = useState(new Date());
  const [novaDataFim, setNovaDataFim] = useState(new Date());
  const [novoValorTotal, setNovoValorTotal] = useState("");
  const [novoValorPago, setNovoValorPago] = useState("");
  const [novoTitulo, setNovoTitulo] = useState("");

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
        const errorMessage = error instanceof Error ? error.message : "Um erro ocorreu";
        Alert.alert("Erro", errorMessage);
      }
    };
    buscarDividas();
    setUpdateLista(false);
  }, [dataSelecionada, updateLista, novaDivida, switchDividaStatus]);

  const handleOnChangeNovaDataInicio = (data: Date) => {
    setNovaDataInicio(data);
  };

  const handleOnChangeNovaDataFim = (data: Date) => {
    setNovaDataFim(data);
  };

  const calcularValorTotalDividasPendentes = () => {
    let total = 0;
    let restante = 0;
    dividas.forEach(divida => {
      if (divida.status === "Pendente") {
        total += divida.valorTotal;
        restante += divida.valorTotal - divida.valorPago;
      }
    });
    return total;
  };

  const calcularValorRestanteDividasPendentes = () => {
    let restante = 0;
    dividas.forEach(divida => {
      if (divida.status === "Pendente") {
        restante += divida.valorTotal - divida.valorPago;
      }
    });
    return restante;
  };

  const calcularValorTotalDasDividasPagas = (dividas: Divida[]) => {
    let valorTotal = 0;
    dividas.forEach(divida => {
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
      const timestampConvertido = new Date(seconds * 1000 + nanoseconds / 1000000);
      const formattedDate = timestampConvertido;
      return formattedDate;
    } else {
      console.error("O timestamp é undefined");
      return null;
    }
  };


  const handleATualizarValorPago = async (dividaId: string) => {
    const oldValorAtualNumber = isNaN(parseFloat(selectedItemValorPago))
      ? 0
      : parseFloat(selectedItemValorPago);
    const novoValorPagoNumber = isNaN(parseFloat(novoValorPago)) ? 0 : parseFloat(novoValorPago);
    const novoValorTotalNumber = isNaN(parseFloat(novoValorTotal))
      ? 0
      : parseFloat(novoValorTotal);
    const novaDataInicioTimestamp = novaDataInicio.getTime().toString();
    const novaDataFimTimestamp = novaDataFim.getTime().toString();
    const objetoDivida = new Divida(
      dividaId,
      novoTitulo,
      novoValorTotalNumber,
      novoValorPagoNumber,
      novaDataInicioTimestamp,
      novaDataFimTimestamp,
      switchDividaStatus
    );
    await DividaDAL.atualizarDivida(dividaId, objetoDivida);
    setSelectedItemId("");
    setSelectedItemTitulo("");
    setSelectedItemValorTotal("");
    setSelectedItemValorPago("");
    setSelectedItemDataInicio(new Date());
    setSelectedItemDataVencimento(new Date());
    setIsEditable(false);
    setIsDividaPaga(false);
    setUpdateLista(true);
    setIsModalVisible(false);
    setNovoValorPago("");
    setNovoValorTotal("");
    setNovoTitulo("");
    setNovaDataInicio(new Date());
    setNovaDataFim(new Date());
  };

  const handleDeletarDivida = async (dividaId: string) => {
    await DividaDAL.deletarDivida(dividaId);
    setSelectedItemId("");
    setSelectedItemTitulo("");
    setSelectedItemValorTotal("");
    setSelectedItemValorPago("");
    setSelectedItemDataInicio(new Date());
    setSelectedItemDataVencimento(new Date());
    setIsEditable(false);
    setIsDividaPaga(false);
    setUpdateLista(true);
    setIsModalVisible(false);
  };

  const renderItem = ({ item }: { item: Divida }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          setSelectedItemTitulo(item.titulo);
          setSelectedItemValorTotal(item.valorTotal.toString());
          setSelectedItemValorPago(item.valorPago.toString());
          setSelectedItemDataInicio(
            converterTimestampParaData(item.dataInicio.toString()) || new Date()
          );
          setSelectedItemDataVencimento(
            converterTimestampParaData(item.dataVencimento.toString()) || new Date()
          );
          setSelectedItemStatus(item.status);
          setSelectedItemId(item.id);
          setIsModalVisible(true);
          setNovoTitulo(item.titulo);
          setNovoValorTotal(item.valorTotal.toString());
          setNovoValorPago(item.valorPago.toString());
          setNovaDataInicio(
            converterTimestampParaData(item.dataInicio.toString()) || new Date()
          );
          setNovaDataFim(converterTimestampParaData(item.dataVencimento.toString()) || new Date());
        }}
      >
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.valorTotal}>R${item.valorTotal},00</Text>
        <Text style={styles.dataInicio}>
          Inicio: {converterTimestampParaData(item.dataInicio.toString())?.toLocaleDateString()}
        </Text>
        <Text style={styles.dataVencimento}>
          Fim: {converterTimestampParaData(item.dataVencimento.toString())?.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dividas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={updateLista}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedItemStatus === "Pago" ? (
              <>
                <Text style={styles.text}>Titulo: {selectedItemTitulo}</Text>
                <Text style={styles.text}>Valor Alcancado: {selectedItemValorTotal}</Text>
                <Text style={styles.text}>
                  Comecou em: {selectedItemDataInicio.toLocaleDateString("pt-br")}
                </Text>
                <Text style={styles.text}>
                  Finalizada em: {selectedItemDataVencimento.toLocaleDateString("pt-br")}
                </Text>
              </>
            ) : (
              <>
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
                    <TouchableOpacity
                      style={{ position: "absolute", top: 20, right: 20 }}
                      onPress={() => setIsEditable(!isEditable)}
                    >
                      <Image
                        source={require("../assets/edit.png")}
                        style={{ width: 25, height: 25 }}
                      />
                    </TouchableOpacity>
                  </>
                )}
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
                  onValueChange={() => setisDividaPaga((prevState) => !prevState)}
                ></Switch>
                <TouchableOpacity
                  style={[styles.btnModalSuccess, { width: 160 }]}
                  onPress={() => handleATualizarValorPago(selectedItemId)}
                >
                  <Text style={styles.labelModal}>Atualizar Valor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(!isModalVisible), setIsEditable(false), setIsDividaPaga(false);
                  }}
                >
                  <Text style={styles.labelModal}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 22,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
  },
  valorTotal: {
    fontSize: 15,
    fontWeight: "bold",
  },
  dataInicio: {
    fontSize: 10,
  },
  dataVencimento: {
    fontSize: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    marginBottom: 15,
    textAlign: "center",
  },
  inputAtualizarValorPago: {
    marginBottom: 15,
    width: 160,
    textAlign: "center",
    backgroundColor: "#03DAC6",
    color: "#ffffff",
    borderRadius: 10,
  },
  btnModalSuccess: {
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  labelModal: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default ListaDeDividas;

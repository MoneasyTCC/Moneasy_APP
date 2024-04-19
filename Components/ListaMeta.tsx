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
} from "react-native";
import { obterMetasPorData } from "../Controller/MetaController";
import { MetasDAL } from "../Repo/RepositorioMeta";
import { Meta } from "../Model/Meta";
import SeletorData from "./SeletorData";

interface ListaDeMetasProps {
  dataSelecionada: Date;
}

const ListaDeMetas: React.FC<ListaDeMetasProps> = ({ dataSelecionada }) => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateLista, setUpdateLista] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [novaDataInicio, setNovaDataInicio] = useState(new Date());
  const [novaDataFim, setNovaDataFim] = useState(new Date());
  const [selectedItemTitulo, setSelectedItemTitulo] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemValorAtual, setSelectedItemValorAtual] = useState("");
  const [selectedItemValorObjetivo, setSelectedItemValorObjetivo] = useState("");
  const [selectedItemDataInicio, setSelectedItemDataInicio] = useState(new Date());
  const [selectedItemDataFimPrevista, setSelectedItemDataFimPrevista] = useState(new Date());

  useEffect(() => {
    const buscarMetas = async () => {
      try {
        if (!(dataSelecionada instanceof Date)) {
          throw new Error("Data inválida");
        }
        const metasObtidas = await obterMetasPorData(dataSelecionada);
        setMetas(metasObtidas);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Um erro ocorreu";
        Alert.alert("Erro", errorMessage);
      }
    };
    buscarMetas();
    setUpdateLista(false);
  }, [dataSelecionada, updateLista]);

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

  const toggleModal = (
    itemTitulo: string,
    itemId: string,
    itemValorAtual: number,
    itemValorObjetivo: number,
    itemDataInicio: Date,
    itemDataFimPrevista: Date
  ) => {
    setSelectedItemTitulo(itemTitulo);
    setSelectedItemId(itemId);
    setSelectedItemValorAtual(itemValorAtual.toString());
    setSelectedItemValorObjetivo(itemValorObjetivo.toString());
    setSelectedItemDataInicio(converterTimestampParaData(itemDataInicio.toString()));
    setSelectedItemDataFimPrevista(converterTimestampParaData(itemDataFimPrevista.toString()));
    setIsModalVisible(!isModalVisible);
  };

  const renderItem = ({ item }: { item: Meta }) => (
    <View style={styles.container}>
      <View style={{ width: "100%", justifyContent: "flex-start" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
          <Text style={styles.text}>{item.titulo}</Text>
          <TouchableOpacity
            onPress={() =>
              toggleModal(
                item.titulo,
                item.id,
                item.valorAtual,
                item.valorObjetivo,
                item.dataInicio,
                item.dataFimPrevista
              )
            }
          >
            <Image source={require("../assets/hamburguerMenu.png")} />
          </TouchableOpacity>
        </View>
        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.textOpaco}>{item.status}</Text>
          <Text style={styles.textOpaco}>tempo em: dia</Text>
        </View>
      </View>
      <View style={styles.valoresContainer}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text style={styles.text}>Valor guardado</Text>
          <Text style={styles.textValor}>R${item.valorAtual},00</Text>
        </View>
        <View style={styles.separador}></View>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text style={styles.text}>Valor Objetivo</Text>
          <Text style={styles.textValor}>R${item.valorObjetivo},00</Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 12, color: "#fff", fontWeight: "bold" }}>Meta 50% concluida</Text>
        <Text style={{ fontSize: 12, color: "#fff", fontWeight: "bold" }}>
          Finaliza em:{" "}
          {converterTimestampParaData(item.dataFimPrevista?.toString()).toLocaleDateString("pt-br")}
        </Text>
      </View>
    </View>
  );
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          width: "90%",
          height: 50,
          backgroundColor: "#2a2a2a",
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "space-evenly",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity>
          <Text style={{ color: "#0fec32" }}>Ativo</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Pausado</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Concluido</Text>
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
            <Text style={styles.modalTitle}>{!isEditable ? "Atualizar Meta" : "Editar Meta"}</Text>
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
            {!isEditable && (
              <TextInput
                style={styles.inputAtualizarValorAtual}
                placeholder={`R$${selectedItemValorAtual},00`}
                placeholderTextColor={"#ffffff"}
              ></TextInput>
            )}
            {isEditable && (
              <>
                <TextInput
                  style={styles.inputTitulo}
                  placeholder={selectedItemTitulo}
                  placeholderTextColor={"#fff"}
                ></TextInput>
                <View style={styles.inputValorDataGroup}>
                  <TextInput
                    style={styles.inputAtualizarValorAtual}
                    placeholder={`R$${selectedItemValorAtual},00`}
                    placeholderTextColor={"#fff"}
                    keyboardType="numeric"
                  ></TextInput>
                  <SeletorData onDateChange={handleOnChangeNovaDataInicio} />
                </View>
                <View style={styles.inputValorDataGroup}>
                  <TextInput
                    style={styles.inputAtualizarValorAtual}
                    placeholder={`R$${selectedItemValorObjetivo},00`}
                    placeholderTextColor={"#fff"}
                  ></TextInput>
                  <SeletorData onDateChange={handleOnChangeNovaDataFim} />
                </View>
              </>
            )}
            <TouchableOpacity
              style={
                !isEditable
                  ? [styles.btnModalSuccess, { width: 160 }]
                  : [styles.btnModalSuccess, { width: 230 }]
              }
            >
              <Text style={styles.labelModal}>{!isEditable ? "Atualizar Valor" : "Concluir"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(!isModalVisible), setIsEditable(false);
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
});

export default ListaDeMetas;

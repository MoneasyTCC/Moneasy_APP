import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { obterMetasPorData } from "../Controller/MetaController";
import { MetasDAL } from "../Repo/RepositorioMeta";
import { Meta } from "../Model/Meta";

interface ListaDeMetasProps {
  dataSelecionada: Date;
}

const ListaDeMetas: React.FC<ListaDeMetasProps> = ({ dataSelecionada }) => {
  const [metas, setMetas] = useState<Meta[]>([]);
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
  }, []);

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
  };

  const renderItem = ({ item }: { item: Meta }) => (
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
      <View style={styles.container}>
        <View style={{ width: "100%", justifyContent: "flex-start" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
            <Text style={styles.text}>{item.titulo}</Text>
            <TouchableOpacity>
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
          <Text style={{ fontSize: 12, color: "#fff", fontWeight: "bold" }}>
            Meta 50% concluida
          </Text>
          <Text style={{ fontSize: 12, color: "#fff", fontWeight: "bold" }}>
            Finaliza em:{" "}
            {converterTimestampParaData(item.dataFimPrevista?.toString()).toLocaleDateString(
              "pt-br"
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
});

export default ListaDeMetas;

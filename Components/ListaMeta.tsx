import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
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
        <Text>{item.titulo}</Text>
        <Text>{item.valorAtual}</Text>
        <Text>{item.valorObjetivo}</Text>
        <Text>
          Começa em:{" "}
          {converterTimestampParaData(item.dataInicio?.toString()).toLocaleDateString("pt-br")}
        </Text>
        <Text>
          Finaliza em:{" "}
          {converterTimestampParaData(item.dataFimPrevista?.toString()).toLocaleDateString("pt-br")}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <FlatList
      data={metas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ListaDeMetas;

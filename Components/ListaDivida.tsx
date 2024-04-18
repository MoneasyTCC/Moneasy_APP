import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { obterDividasPorData } from "../Controller/DividaController";
import { DividaDAL } from "../Repo/RepositorioDivida";
import { Divida } from "../Model/Divida";

interface ListaDeDividasProps {
  dataSelecionada: Date;
}

const ListaDeDividas: React.FC<ListaDeDividasProps> = ({ dataSelecionada }) => {
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [selectedItemTitulo, setSelectedItemTitulo] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemValorTotal, setSelectedItemValorTotal] = useState("");
  const [selectedItemValorPago, setSelectedItemValorPago] = useState("");
  const [selectedItemDataInicio, setSelectedItemDataInicio] = useState(new Date());
  const [selectedItemDataVencimento, setSelectedItemDataVencimento] = useState(new Date());

  useEffect(() => {
    const buscarDividas = async () => {
      try {
        if (!(dataSelecionada instanceof Date)) {
          throw new Error("Data inválida");
        }
        const dividasObtidas = await obterDividasPorData(dataSelecionada);
        setDividas(dividasObtidas);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Um erro ocorreu";
        Alert.alert("Erro", errorMessage);
      }
    };
    buscarDividas();
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
    itemValorTotal: number,
    itemValorPago: number,
    itemDataInicio: Date,
    itemDataVencimento: Date
  ) => {
    setSelectedItemTitulo(itemTitulo);
    setSelectedItemId(itemId);
    setSelectedItemValorTotal(itemValorTotal.toString());
    setSelectedItemValorPago(itemValorPago.toString());
    setSelectedItemDataInicio(converterTimestampParaData(itemDataInicio.toString()));
    setSelectedItemDataVencimento(converterTimestampParaData(itemDataVencimento.toString()));
  };

  const renderItem = ({ item }: { item: Divida }) => (
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
      <View style={styles.container}>
        <Text>{item.titulo}</Text>
        <Text>{item.id}</Text>
        <Text>{item.valorPago}</Text>
        <Text>{item.valorTotal}</Text>
        <Text>
          Começa em:{" "}
          {converterTimestampParaData(item.dataInicio?.toString()).toLocaleDateString("pt-br")}
        </Text>
        <Text>
          Finaliza em:{" "}
          {converterTimestampParaData(item.dataVencimento?.toString()).toLocaleDateString("pt-br")}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <FlatList
      data={dividas}
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

export default ListaDeDividas;

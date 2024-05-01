import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Switch, TextInput, Image } from "react-native";
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
    // Trate o caso em que timestamp é undefined
    console.error("O timestamp é undefined");
    // Aqui você pode retornar um valor padrão, lançar um erro ou tratar de acordo com a lógica do seu aplicativo
    // Neste exemplo, estou retornando null
    return null;
  }
  };


  const handleATualizarValorAtual = async (dividaId: string) => {
    const oldValorAtualNumber = isNaN(parseFloat(selectedItemValorAtual))
      ? 0
      : parseFloat(selectedItemValorAtual);
    const novoValorAtualNumber = isNaN(parseFloat(novoValorAtual)) ? 0 : parseFloat(novoValorAtual);
    try {
      const novosDados: Partial<Divida> = {
        valorAtual: novoValorAtualNumber,
        status: isDividaPaga ? "Pendente" : "Paga",
      };
      if (novoValorAtual === selectedItemValorObjetivo) {
        novosDados.status = "Pago";
      }
      if (isDividaPaga && novoValorAtualNumber !== oldValorAtualNumber) {
        novosDados.valorAtual = novoValorAtualNumber;
      }
      if (isDigidaPaga && novoValorAtualNumber === 0) {
        novosDados.valorAtual = oldValorAtualNumber;
      }
      await DividaDAL.alterarDivida(dividaId, novosDados);
      alert("Valor atual atualizado com sucesso!");
      setIsModalVisible(false);
      limparEstados();
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAtualizarDataFim = async (dividaId: string) => {
    try {
      const novosDados: Partial<Divida> = {
        dataFimPrevista: novaDataFim,
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
    const novoValorAtualNumber = isNaN(parseFloat(novoValorAtual)) ? 0 : parseFloat(novoValorAtual);
    const novoValorObjetivoNumber = isNaN(parseFloat(novoValorObjetivo))
      ? 0
      : parseFloat(novoValorObjetivo);
    try {
      const novosDados: Partial<Divida> = {
        titulo: novoTitulo,
        valorAtual: novoValorAtualNumber,
        valorObjetivo: novoValorObjetivoNumber,
        dataInicio: novaDataInicio,
        dataFimPrevista: novaDataFim,
        status: isDividaPaga ? "Pendente" : "Pago",
      };
      if (novoValorAtual === novoValorObjetivo) {
        novosDados.status = "Pago";
      }
      await DividaDAL.alterarDivida(dividaId, novosDados);
      alert("Divida alterada com sucesso!");
      setIsModalVisible(false);
      setIsEditable(false);
      limparEstados();
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletarDivida = async (dividaId: string) => {
    try {
      await Divida.deletarDivida(dividaId);
      alert("Divida deletada com sucesso!");
      setIsModalVisible(false);
      setUpdateLista(!updateLista);
    } catch (err) {
      console.error(err);
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
    setSelectedItemDataInicio(converterTimestampParaData(itemDataInicio.toString()));
    setSelectedItemDataVencimento(converterTimestampParaData(itemDataVencimento.toString()));
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
         <Text style={styles.textOpaco}>{diasRestantes(item.status, item.dataVencimento)}</Text>
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
     {item.status === "Pago" ? (
       <View style={styles.textoEValorWrapper}>
         <Text style={styles.text}>Divida Concluída</Text>
         <Text style={styles.text}>Valor Total: R${item.valorTotal},00</Text>
         <View style={{ marginTop: 10 }}>
           <Text style={styles.porcentagemEData}>
             Finalizada em:{" "}
             {converterTimestampParaData(item.dataVencimento?.toString()).toLocaleDateString(
               "pt-br"
             )}
           </Text>
         </View>
       </View>
     ) : (
       <>
         <View style={styles.valoresContainer}>
           <View style={styles.textoEValorWrapper}>
             <Text style={styles.text}>Valor Total</Text>
             <Text style={styles.textValor}>R${item.valorTotal},00</Text>
           </View>
           <View style={styles.separador}></View>
           <View style={styles.textoEValorWrapper}>
             <Text style={styles.text}>Valor Pago</Text>
             <Text style={styles.textValor}>R${item.valorPago},00</Text>
           </View>
         </View>
         <View style={styles.porcentagemEDataWrapper}>
           <Text style={styles.porcentagemEData}>
             Divida {dividaPorcentagem(item.valorTotal, item.valorPago)}% concluída
           </Text>
           <Text style={styles.porcentagemEData}>
             {`Finaliza em: ${converterTimestampParaData(
               item.dataVencimento?.toString()
             ).toLocaleDateString("pt-br")}`}
           </Text>
         </View>
       </>
     )}
   </View>
 );
  return (
  <>
    <View style={styles.dividaStatusSwitch}>
      <TouchableOpacity onPress={() => setSwitchDividaStatus("Pendente")}>
        <Text style={switchDividaStatus === "Pendente" ? { color: "#0fec32" } : { color: "#fff" }}>
          Pendente
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSwitchDividaStatus("Pago")}>
        <Text style={switchDividaStatus === "Pago" ? { color: "#0fec32" } : { color: "#fff" }}>
          Pago
        </Text>
      </TouchableOpacity>
    </View>
{switchDividaStatus === "Pendente" && (
  <View style={styles.totalERestanteGroup}>
    <View>
      <Text style={styles.totalERestanteText}>Total em Dívidas</Text>
      <Text style={styles.totalERestanteValor}>R${calcularValorTotalDividasPendentes()},00</Text>
    </View>
    <View>
      <Text style={styles.totalERestanteText}>Restante</Text>
      <Text style={styles.totalERestanteValor}>R${calcularValorRestanteDividasPendentes()},00</Text>
    </View>
  </View>
)}
{switchDividaStatus === "Pago" && (
  <View style={styles.TotalGroup}>
    <View>
      <Text style={styles.TotalText}>Total</Text>
      <Text style={styles.TotalValor}>R${calcularValorTotalDasDividasPagas(dividas)},00</Text>
    </View>
  </View>
)}

    <FlatList
      data={dividas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
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

    dividaStatusSwitch: {
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
     totalERestanteGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 320,
      },
       totalERestanteText: {
          color: "#fff",
          fontSize: 18  ,
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

});



export default ListaDeDividas;

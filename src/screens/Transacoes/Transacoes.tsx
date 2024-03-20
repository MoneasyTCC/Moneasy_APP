import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import ListaDeTransacoes from "../../../Components/listaTransacao";
import { Transacao } from "../../../Model/Transacao";
import { obterSaldoPorMes } from "../../../Controller/TransacaoController";
import NavigationBar from "../menuNavegation";

type TransacaoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Transacao"
>;

type Props = {
  navigation: TransacaoScreenNavigationProp;
};

export default function TransacaoScreen({ navigation }: Props) {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [saldo, setSaldo] = useState<number | null>(null);

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const [monthIndex, setMonthIndex] = useState(dataSelecionada.getMonth());

  const updateMonth = (newMonthIndex: number) => {
    setMonthIndex(newMonthIndex);
    const newData = new Date(dataSelecionada.getFullYear(), newMonthIndex, 1);
    setDataSelecionada(newData);
    updateSaldo(newData);
  };

  const handlePreviousMonth = () => {
    const newMonthIndex = monthIndex > 0 ? monthIndex - 1 : 11;
    updateMonth(newMonthIndex);
  };

  const handleNextMonth = () => {
    const newMonthIndex = monthIndex < 11 ? monthIndex + 1 : 0;
    updateMonth(newMonthIndex);
  };

  const updateSaldo = async (date: Date) => {
    try {
      const resultadoSaldo = await obterSaldoPorMes(date);
      if (resultadoSaldo && typeof resultadoSaldo.saldo === "number") {
        setSaldo(resultadoSaldo.saldo);
      } else {
        setSaldo(null); // ou um valor padrão que você desejar
        console.warn("Saldo não encontrado ou o valor não é um número.");
      }
    } catch (error) {
      console.error("Erro ao obter saldo:", error);
    }
  };

  useEffect(() => {
    updateSaldo(dataSelecionada);
  }, [dataSelecionada]);

  return (
    <View style={styles.container}>
      <View style={styles.menuHeader}>
        <TouchableOpacity
          onPress={handlePreviousMonth}
          style={styles.arrowButton}
        >
          <Text style={styles.arrowText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.mesLabel}>{monthNames[monthIndex]}</Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>&gt;</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuBody}>
        <View style={styles.content}>
          <View style={styles.saldoBody}>
            <Text style={styles.saldoText}>Saldo Atual</Text>
            <Text style={styles.saldoAtual}>
              R$ {saldo ? saldo.toFixed(2) : "0.00"}
            </Text>
          </View>
          <Text></Text>
          <ListaDeTransacoes dataSelecionada={dataSelecionada} />
        </View>
      </View>
      <View style={styles.menuFooter}>
        <NavigationBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2B2B2B",
  },
  menuHeader: {
    overflow: "scroll",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "20%",
    backgroundColor: "#3A3E3A",
  },
  menuBody: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  content: {
    borderRadius: 40,
    width: "90%",
    flex: 1,
    backgroundColor: "#3A3E3A",
    padding: 20,
  },
  menuFooter: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "15%",
    backgroundColor: "#3A3E3A",
  },
  arrowButton: { padding: 10 },
  arrowText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 30,
  },
  saldoBody:{    
    alignItems: "center",
  },
  mesLabel: {
    color: "#ffffff",
    width: "35%",
    textAlign: "center",
    fontSize: 26,
  },
  saldoText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#ffffff",
  },
  saldoAtual: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#ffffff",
  },
});

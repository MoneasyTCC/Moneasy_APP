import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import NavigationBar from "../menuNavegation";
import { Orcamento } from "../../../Model/Orcamento";
import { obterSaldoPorMes, obterOrcamentosPorData } from "../../../Controller/OrcamentoController";

type OrcamentoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Orcamento">;

type Props = {
  navigation: OrcamentoScreenNavigationProp;
};

export default function MenuScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [saldo, setSaldo] = useState<number | null>(null);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [monthIndex, setMonthIndex] = useState(dataSelecionada.getMonth());
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dataSelecionada;
    setDataSelecionada(currentDate);
    setIsLoading(true);
    obterDados(currentDate);
  };

  const obterDados = async (date: Date) => {
    try {
      const saldoPorMes = await obterSaldoPorMes(date);
      setSaldo(saldoPorMes.saldo);
      const orcamentosPorData = await obterOrcamentosPorData(date);
      console.log(JSON.stringify(orcamentosPorData));
      setOrcamentos(orcamentosPorData);
    } catch (error) {
      console.error("Erro ao buscar saldo por mês:", error);
    } finally {
      setIsLoading(false);
    }
  };
    useEffect(() => {
      obterDados(dataSelecionada);
    }, [dataSelecionada]);

  const updateMonth = (newMonthIndex: number) => {
    setMonthIndex(newMonthIndex);
    const newData = new Date(dataSelecionada.getFullYear(), newMonthIndex, 1);
    setDataSelecionada(newData);
  };

  const handlePreviousMonth = () => {
    const newMonthIndex = monthIndex > 0 ? monthIndex - 1 : 11;
    updateMonth(newMonthIndex);
    obterDados(new Date(dataSelecionada.getFullYear(), newMonthIndex, 1));
  };

  const handleNextMonth = () => {
    const newMonthIndex = monthIndex < 11 ? monthIndex + 1 : 0;
    updateMonth(newMonthIndex);
    obterDados(new Date(dataSelecionada.getFullYear(), newMonthIndex, 1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuHeader}>
        <TouchableOpacity onPress={handlePreviousMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.mesLabel}>{monthNames[monthIndex]}</Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>&gt;</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuBody}>
        <View style={styles.content}>
          <View style={styles.listaContainer}>
            {orcamentos.map((orcamento, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{/* Exibir os detalhes do orçamento aqui */}</Text>
                 <Text style={styles.itemText}>Categoria: {orcamento.categoria}</Text>
                      <Text style={styles.itemText}>Descrição: {orcamento.descricao || "Sem descrição"}</Text>
                      <Text style={styles.itemText}>Valor Atual: R$ {orcamento.valorAtual.toFixed(2)}</Text>
                      <Text style={styles.itemText}>Valor Definido: R$ {orcamento.valorDefinido.toFixed(2)}</Text>
              </View>
            ))}
          </View>
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
  arrowButton: {
    /* padding: 10 */
  },
  arrowText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 30,
  },
  saldoBody: {
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
  listaContainer: {
    flex: 1,
    marginTop: 20,
  },
  itemContainer: {
    backgroundColor: "#3A3E3A",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  itemText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

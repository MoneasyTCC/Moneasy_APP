import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import ListaDeTransacoes from "../../../Components/listaTransacao";
import { DataContext } from "../../../Contexts/DataContext";
import { Transacao } from "../../../Model/Transacao";
import { obterSaldoPorMes } from "../../../Controller/TransacaoController";
import NavigationBar from "../menuNavegation";
import { useEffect, useRef, useState, useContext } from "react";
import SeletorMesAno from "../../../Components/SeletorMesAno";

type TransacaoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Transacao">;

type Props = {
  navigation: TransacaoScreenNavigationProp;
};

export default function TransacaoScreen({ navigation }: Props) {
  const { dataSelecionada, setDataSelecionada } = useContext(DataContext) as {
    dataSelecionada: Date;
    setDataSelecionada: (data: Date) => void;
  };
  const [saldo, setSaldo] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const saldoCache = useRef<Map<string, number>>(new Map());

  const handleOnChangeMonth = (data: Date) => {
    setDataSelecionada(data);
  };

  const handleOnChangeYear = (data: Date) => {
    setDataSelecionada(data);
  };

  const onTransacaoAlterada = () => {
    attSaldoDepoisDeAlterarOuDeletar(dataSelecionada); // Atualiza o saldo
  };

  const attSaldoDepoisDeAlterarOuDeletar = async (date: Date) => {
    setIsLoading(true);
    try {
      const resultadoSaldo = await obterSaldoPorMes(date);
      if (resultadoSaldo && typeof resultadoSaldo.saldo === "number") {
        setSaldo(resultadoSaldo.saldo);
      } else {
        setSaldo(0); // Se não encontrar um saldo válido, defina como 0
      }
    } catch (error) {
      console.error("Erro ao obter saldo:", error);
      setSaldo(0); // Em caso de erro, defina o saldo como 0
    } finally {
      setIsLoading(false); // Finaliza o loading
    }
  };

  const updateSaldo = async (date: Date) => {
    setIsLoading(true); // Inicia o loading
    const chaveCache = date.toISOString().slice(0, 7);
    try {
      let saldoDoCache = saldoCache.current.get(chaveCache);
      if (saldoDoCache === undefined) {
        const resultadoSaldo = await obterSaldoPorMes(date);
        if (resultadoSaldo && typeof resultadoSaldo.saldo === "number") {
          saldoCache.current.set(chaveCache, resultadoSaldo.saldo);
          setSaldo(resultadoSaldo.saldo);
        } else {
          setSaldo(null);
          console.warn("Saldo não encontrado ou o valor não é um número.");
        }
      } else {
        setSaldo(saldoDoCache);
      }
    } catch (error) {
      console.error("Erro ao obter saldo:", error);
    } finally {
      setIsLoading(false); // Finaliza o loading
    }
  };

  useEffect(() => {
    updateSaldo(dataSelecionada);
  }, [dataSelecionada]);

  return (
    <View style={styles.container}>
    <Text style={styles.textTransacoes}>Transações</Text>
      <View style={styles.menuHeader}>
        <View style={{ marginTop: "20%" }}>
          <SeletorMesAno
            seletorMes={true}
            seletorAno={true}
            onMonthChange={handleOnChangeMonth}
            onYearChange={handleOnChangeYear}
          />
        </View>
      </View>
      <View style={styles.menuBody}>
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#ffffff"
            />
          ) : (
            <View style={styles.saldoBody}>
              <Text style={styles.saldoText}>Saldo Atual</Text>
              <Text style={styles.saldoAtual}>R$ {saldo ? saldo.toFixed(2) : "0.00"}</Text>
            </View>
          )}
          <ListaDeTransacoes
            dataSelecionada={dataSelecionada}
            onTransacaoAlterada={onTransacaoAlterada}
          />
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
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    height: "18%",
  },
  menuBody: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#3A3E3A",
  },
  menuFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "15%",
    backgroundColor: "#3A3E3A",
  },
  textTransacoes: {
    position: "absolute",
    marginTop: 35,
    marginLeft: 20,
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  content: {
    borderRadius: 40,
    width: "90%",
    flex: 1,
    backgroundColor: "#3A3E3A",
    padding: 20,
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
  yearHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

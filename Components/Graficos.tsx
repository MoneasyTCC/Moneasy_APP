import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { obterEntradasESaidasPorAno } from "../Controller/TransacaoController";

interface GraficosProps {
  dataSelecionada: Date;
  novaTransacao: boolean;
}

const Graficos: React.FC<GraficosProps> = ({ dataSelecionada, novaTransacao }) => {
  const [valuesObject, setValuesObject] = useState<{
    entradasESaidasPorMes: { mes: string; entradas: number; saidas: number }[];
    saldoPorMes: number[];
  }>({
    entradasESaidasPorMes: [],
    saldoPorMes: [],
  });
  const [show, setShow] = useState(false);
  const [isSaldoPorMes, setIsSaldoPorMes] = useState(true);
  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundGradientFrom: "#2b2b2b",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#2b2b2b",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
  };

  const filterZeroSaldo = () => {
    const filteredData = valuesObject.entradasESaidasPorMes.filter(
      (_, index) => valuesObject.saldoPorMes[index] !== 0
    );
    const filteredSaldoPorMes = valuesObject.saldoPorMes.filter((saldo) => saldo !== 0);
    const filteredMeses = filteredData.map(({ mes }) => mes);

    return {
      meses: filteredMeses,
      entradasESaidasPorMes: filteredData,
      saldoPorMes: filteredSaldoPorMes,
    };
  };

  const filterZeroSaldoDetalhado = () => {
    const filteredData = valuesObject.entradasESaidasPorMes.filter(
      (_, index) => valuesObject.saldoPorMes[index] !== 0
    );

    const filteredMeses = filteredData.map(({ mes }) => mes);
    const filteredEntradas = filteredData.map(({ entradas }) => entradas);
    const filteredSaidas = filteredData.map(({ saidas }) => saidas);

    return {
      meses: filteredMeses,
      entradas: filteredEntradas,
      saidas: filteredSaidas,
    };
  };

  const filteredData = filterZeroSaldo();
  const filteredDataDetalhado = filterZeroSaldoDetalhado();

  const data = {
    labels: filteredData.meses,
    datasets: [
      {
        data: filteredData.saldoPorMes.map((saldo) => saldo),
        color: (opacity = 1) => `rgba(255,255,255, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Saldo Por Mes"], // optional
  };

  const data2 = {
    labels: filteredDataDetalhado.meses,
    datasets: [
      {
        data: filteredDataDetalhado.entradas.map((entrada) => entrada),
        color: (opacity = 1) => `rgba(20,252,61, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
      {
        data: filteredDataDetalhado.saidas.map((saida) => saida),
        color: (opacity = 1) => `rgba(255,0,0, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Entradas", "Saidas"], // optional
  };

  const handleObterEntradasESaidasPorAno = async () => {
    try {
      const { entradasESaidasPorMes, saldoPorMes } = await obterEntradasESaidasPorAno(
        dataSelecionada
      );

      const formattedData = {
        entradasESaidasPorMes: entradasESaidasPorMes.map(({ mes, totalEntradas, totalSaidas }) => ({
          mes,
          entradas: totalEntradas,
          saidas: totalSaidas,
        })),
        saldoPorMes: saldoPorMes,
      };

      setValuesObject(formattedData);
      //console.log(formattedData);
    } catch (error) {
      console.error("Erro ao obter entradas e saídas por ano: ", error);
    }
  };

  useEffect(() => {
    handleObterEntradasESaidasPorAno();
  }, [dataSelecionada, novaTransacao]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setShow(true);
            setIsSaldoPorMes(true);
          }}
        >
          <Text
            style={[styles.buttonText, isSaldoPorMes ? { color: "#14fc3d" } : { color: "#fff" }]}
          >
            Saldo Por Mes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setShow(true);
            setIsSaldoPorMes(false);
          }}
        >
          <Text
            style={[styles.buttonText, !isSaldoPorMes ? { color: "#14fc3d" } : { color: "#fff" }]}
          >
            Entradas e Saidas
          </Text>
        </TouchableOpacity>
      </View>
      {show && (
        <LineChart
          data={isSaldoPorMes ? data : data2}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          withShadow={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: "#3a3d3a",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Graficos;

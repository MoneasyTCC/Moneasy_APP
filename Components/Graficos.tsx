import React, { useEffect, useState } from "react";
import { LineChart, StackedBarChart } from "react-native-chart-kit";
import { Dimensions, TouchableOpacity, View, Text, StyleSheet, ScrollView } from "react-native";
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
  const [selectedChart, setSelectedChart] = useState<string>("");
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

  const saldoData = {
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

  const entradasSaidaData = {
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

  const orcamentoData = {
    labels: ["Roupa", "Saude"],
    legend: ["Atual", "Restante", "Estourado"],
    data: [
      [60, 60, 60],
      [30, 30, 60],
    ],
    barColors: ["#14fc3d", "#3a3d3a", "#ff0000"],
  };

  let stackedBarChart = null;
  stackedBarChart = (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <View style={styles.bolinhaGroup}>
          <View style={[styles.bolinha, { backgroundColor: "#14fc3d" }]}></View>
          <Text style={styles.legendaText}>Atual</Text>
        </View>
        <View style={styles.bolinhaGroup}>
          <View style={[styles.bolinha, { backgroundColor: "#3a3d3a" }]}></View>
          <Text style={styles.legendaText}>Restante</Text>
        </View>
        <View style={styles.bolinhaGroup}>
          <View style={[styles.bolinha, { backgroundColor: "#ff0000" }]}></View>
          <Text style={styles.legendaText}>Estourado</Text>
        </View>
      </View>
      <StackedBarChart
        data={orcamentoData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        hideLegend={true}
      />
    </View>
  );
  let lineChartSaldo = null;
  lineChartSaldo = (
    <LineChart
      data={saldoData}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      withShadow={false}
    />
  );
  let lineChartEntradasSaidas = null;
  lineChartEntradasSaidas = (
    <LineChart
      data={entradasSaidaData}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      withShadow={false}
    />
  );

  const handleChartSelection = () => {
    if (selectedChart === "saldo") {
      return lineChartSaldo;
    }
    if (selectedChart === "entradasSaidas") {
      return lineChartEntradasSaidas;
    }
    if (selectedChart === "orcamento") {
      return stackedBarChart;
    }
  };

  useEffect(() => {
    handleObterEntradasESaidasPorAno();
  }, [dataSelecionada, novaTransacao]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        <ScrollView
          horizontal
          style={{ marginHorizontal: 15 }}
        >
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSelectedChart("saldo");
                setShow(true);
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: selectedChart === "saldo" ? "#14fc3d" : "#fff" },
                ]}
              >
                Saldo Por Mes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSelectedChart("entradasSaidas");
                setShow(true);
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: selectedChart === "entradasSaidas" ? "#14fc3d" : "#fff" },
                ]}
              >
                Entradas e Saidas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSelectedChart("orcamento");
                setShow(true);
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: selectedChart === "orcamento" ? "#14fc3d" : "#fff" },
                ]}
              >
                Orcamento
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {show && handleChartSelection()}
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
    gap: 5,
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
  bolinha: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  bolinhaGroup: {
    alignItems: "center",
    flexDirection: "row",
  },
  legendaText: {
    color: "white",
    fontSize: 14,
  },
});

export default Graficos;

import React, { useEffect, useState } from "react";
import { LineChart, PieChart, ProgressChart } from "react-native-chart-kit";
import { Dimensions, TouchableOpacity, View, Text, StyleSheet, ScrollView } from "react-native";
import { obterEntradasESaidasPorAno } from "../Controller/TransacaoController";
import { obterMetasPorAno } from "../Controller/MetaController";

interface GraficosProps {
  dataSelecionada: Date;
  novaTransacao: boolean;
}

const Graficos: React.FC<GraficosProps> = ({ dataSelecionada, novaTransacao }) => {
  const [transacaoObject, settransacaoObject] = useState<{
    entradasESaidasPorMes: { mes: string; entradas: number; saidas: number }[];
    saldoPorMes: number[];
  }>({
    entradasESaidasPorMes: [],
    saldoPorMes: [],
  });
  const [metaObject, setMetaObject] = useState<{
    metas: { titulo: string; valorAtual: number; valorObjetivo: number }[];
  }>({
    metas: [],
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

  const handleObterMetasPorAno = async () => {
    try {
      const metas = await obterMetasPorAno("Ativo", dataSelecionada);

      const formattedData = {
        metas: metas.map(({ titulo, valorAtual, valorObjetivo }) => ({
          titulo,
          valorAtual,
          valorObjetivo,
        })),
      };

      setMetaObject(formattedData);
    } catch (error) {
      console.error("Erro ao obter metas por ano: ", error);
    }
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

      settransacaoObject(formattedData);
      //console.log(formattedData);
    } catch (error) {
      console.error("Erro ao obter entradas e saídas por ano: ", error);
    }
  };

  const todasEntradasESaidas = () => {
    return transacaoObject.entradasESaidasPorMes.map(({ entradas, saidas }) => ({
      entradas,
      saidas,
    }));
  };

  const filterZeroSaldo = () => {
    const filteredData = transacaoObject.entradasESaidasPorMes.filter(
      (_, index) => transacaoObject.saldoPorMes[index] !== 0
    );
    const filteredSaldoPorMes = transacaoObject.saldoPorMes.filter((saldo) => saldo !== 0);
    const filteredMeses = filteredData.map(({ mes }) => mes);

    return {
      meses: filteredMeses,
      entradasESaidasPorMes: filteredData,
      saldoPorMes: filteredSaldoPorMes,
    };
  };

  const filterZeroSaldoDetalhado = () => {
    const filteredData = transacaoObject.entradasESaidasPorMes.filter(
      (_, index) => transacaoObject.saldoPorMes[index] !== 0
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

  const filterZeroMeta = () => {
    const filteredMetas = metaObject.metas.filter((meta) => meta.valorAtual !== 0);

    const sortedMetas = filteredMetas.sort(
      (a, b) =>
        Math.abs(a.valorAtual / a.valorObjetivo - 1) - Math.abs(b.valorAtual / b.valorObjetivo - 1)
    );

    const closestToCompletion = sortedMetas.slice(0, 5).map((meta) => ({
      titulo: meta.titulo,
      porcentagemConclusao: meta.valorAtual / meta.valorObjetivo,
    }));

    return {
      titulos: closestToCompletion.map((meta) => meta.titulo),
      porcentagensConclusao: closestToCompletion.map((meta) => meta.porcentagemConclusao),
    };
  };

  const filteredData = filterZeroSaldo();
  const filteredDataDetalhado = filterZeroSaldoDetalhado();
  const filteredPieData = todasEntradasESaidas();
  const filteredRingData = filterZeroMeta();

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

  const pieData = [
    {
      name: "Entradas",
      population: filteredPieData.map(({ entradas }) => entradas).reduce((a, b) => a + b, 0),
      color: "#14fc3d",
      legendFontColor: "#fff",
      legendFontSize: 15,
    },
    {
      name: "Saidas",
      population: filteredPieData.map(({ saidas }) => saidas).reduce((a, b) => a + b, 0),
      color: "#ff0000",
      legendFontColor: "#fff",
      legendFontSize: 15,
    },
  ];

  const ringData = {
    labels: filteredRingData.titulos,
    data: filteredRingData.porcentagensConclusao,
    colors: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF"],
  };

  let pieChart = null;
  pieChart = (
    <PieChart
      data={pieData}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      accessor={"population"}
      backgroundColor={"transparent"}
      paddingLeft="15"
    />
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
  let progressRing = null;
  progressRing = (
    <ProgressChart
      data={ringData}
      width={screenWidth}
      height={220}
      strokeWidth={10}
      radius={32}
      chartConfig={chartConfig}
      hideLegend={false}
      withCustomBarColorFromData={true}
    />
  );

  const handleChartSelection = () => {
    if (selectedChart === "saldo") {
      return lineChartSaldo;
    }
    if (selectedChart === "entradasSaidas") {
      return lineChartEntradasSaidas;
    }
    if (selectedChart === "pie") {
      return pieChart;
    }
    if (selectedChart === "ring") {
      return progressRing;
    }
  };

  useEffect(() => {
    handleObterEntradasESaidasPorAno();
    handleObterMetasPorAno();
  }, [dataSelecionada, novaTransacao, selectedChart]);

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
                setSelectedChart("pie");
                setShow(true);
              }}
            >
              <Text
                style={[styles.buttonText, { color: selectedChart === "pie" ? "#14fc3d" : "#fff" }]}
              >
                PieChart
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSelectedChart("ring");
                setShow(true);
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: selectedChart === "ring" ? "#14fc3d" : "#fff" },
                ]}
              >
                Metas
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

import React, { useEffect, useState } from "react";
import { LineChart, PieChart, ProgressChart } from "react-native-chart-kit";
import {
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { obterEntradasESaidasPorAno } from "../Controller/TransacaoController";
import { obterMetasPorAno } from "../Controller/MetaController";
import { BarChart } from "react-native-gifted-charts";

interface GraficosProps {
  dataSelecionada: Date;
  novaTransacao: boolean;
}

const Graficos: React.FC<GraficosProps> = ({
  dataSelecionada,
  novaTransacao,
}) => {
  const [transacaoObject, setTransacaoObject] = useState<{
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
  const [selectedChart, setSelectedChart] = useState<string>("lineSaldo");
  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundGradientFrom: "#3A3E3A",
    backgroundGradientTo: "#3A3E3A",
    color: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
    strokeWidth: 2,
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
      const { entradasESaidasPorMes, saldoPorMes } =
        await obterEntradasESaidasPorAno(dataSelecionada);

      const formattedData = {
        entradasESaidasPorMes: entradasESaidasPorMes.map(
          ({ mes, totalEntradas, totalSaidas }) => ({
            mes,
            entradas: totalEntradas,
            saidas: totalSaidas,
          })
        ),
        saldoPorMes: saldoPorMes,
      };

      setTransacaoObject(formattedData);
    } catch (error) {
      console.error("Erro ao obter entradas e saídas por ano: ", error);
    }
  };

  const todasEntradasESaidas = () => {
    return transacaoObject.entradasESaidasPorMes.map(
      ({ entradas, saidas }) => ({
        entradas,
        saidas,
      })
    );
  };

  const filterZeroSaldo = () => {
    const filteredData = transacaoObject.entradasESaidasPorMes.filter(
      (_, index) => transacaoObject.saldoPorMes[index] !== 0
    );
    const filteredSaldoPorMes = transacaoObject.saldoPorMes.filter(
      (saldo) => saldo !== 0
    );
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
    const filteredMetas = metaObject.metas.filter(
      (meta) => meta.valorAtual !== 0
    );

    const sortedMetas = filteredMetas.sort(
      (a, b) =>
        Math.abs(a.valorAtual / a.valorObjetivo - 1) -
        Math.abs(b.valorAtual / b.valorObjetivo - 1)
    );

    const closestToCompletion = sortedMetas.slice(0, 5).map((meta) => ({
      titulo: meta.titulo,
      porcentagemConclusao: meta.valorAtual / meta.valorObjetivo,
    }));

    return {
      titulos: closestToCompletion.map((meta) => meta.titulo),
      porcentagensConclusao: closestToCompletion.map(
        (meta) => meta.porcentagemConclusao
      ),
    };
  };

  function criarArrayDeObjetos(
    entradas: number[],
    saidas: number[],
    meses: string[]
  ) {
    const objeto1 = {
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "#FFFFFF" },
      frontColor: "#0FEC32",
    };
    const objeto2 = {
      frontColor: "#FF0000",
    };
    const arrayDeObjetos = [];
    for (let i = 0; i < Math.max(entradas.length, saidas.length); i++) {
      if (entradas[i] !== undefined) {
        arrayDeObjetos.push({
          value: entradas[i],
          label: meses[i],
          ...objeto1,
        });
      }
      if (saidas[i] !== undefined) {
        arrayDeObjetos.push({ value: saidas[i], ...objeto2 });
      }
    }
    return arrayDeObjetos;
  }

  const filteredData = filterZeroSaldo();
  const filteredDataDetalhado = filterZeroSaldoDetalhado();
  const filteredPieData = todasEntradasESaidas();
  const filteredRingData = filterZeroMeta();
  const filteredBarData = criarArrayDeObjetos(
    filteredDataDetalhado.entradas,
    filteredDataDetalhado.saidas,
    filteredDataDetalhado.meses
  );

  const saldoData = {
    labels: filteredData.meses,
    datasets: [
      {
        data: filteredData.saldoPorMes.map((saldo) => saldo),
        color: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Saldo Por Mes"],
  };

  const entradasSaidaData = {
    labels: filteredDataDetalhado.meses,
    datasets: [
      {
        data: filteredDataDetalhado.entradas.map((entrada) => entrada),
        color: (opacity = 1) => `rgba(20,252,61, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: filteredDataDetalhado.saidas.map((saida) => saida),
        color: (opacity = 1) => `rgba(255,0,0, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Entradas", "Saidas"],
  };

  const pieData = [
    {
      name: "Entradas",
      population: filteredPieData
        .map(({ entradas }) => entradas)
        .reduce((a, b) => a + b, 0),
      color: "#14fc3d",
      legendFontColor: "#fff",
      legendFontSize: 15,
    },
    {
      name: "Saidas",
      population: filteredPieData
        .map(({ saidas }) => saidas)
        .reduce((a, b) => a + b, 0),
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

  const pieChart = (
    <View style={styles.chartContainer}>
      <PieChart
        data={pieData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft="15"
      />
    </View>
  );

  const lineChartSaldo = (
    <View style={styles.chartContainer}>
      <LineChart
        data={saldoData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        withShadow={false}
        bezier
      />
    </View>
  );

  const lineChartEntradasSaidas = (
    <View style={styles.chartContainer}>
      <LineChart
        data={entradasSaidaData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        withShadow={false}
        bezier
      />
    </View>
  );

  const progressRing = (
    <View style={styles.chartContainer}>
      <ProgressChart
        data={ringData}
        width={screenWidth - 40}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={chartConfig}
        hideLegend={false}
      />
    </View>
  );

  const barChart = (
    <View style={styles.chartContainer}>
      <BarChart
        data={filteredBarData}
        width={screenWidth - 40}
        height={220}
        barWidth={15}
        spacing={2}
        barBorderRadius={4}
        noOfSections={3}
        yAxisThickness={0}
        xAxisThickness={0}
        initialSpacing={10}
        hideRules={true}
        isAnimated={true}
        yAxisTextStyle={{ color: "#FFFFFF" }} // Cor branca para valores do eixo Y
        /* chartConfig={chartConfig} */
      />
    </View>
  );

  useEffect(() => {
    handleObterEntradasESaidasPorAno();
    handleObterMetasPorAno();
  }, [dataSelecionada, novaTransacao]);

  return (
    <View style={styles.graficos}>
      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedChart === "pie" && { backgroundColor: "#0FEC32" },
            ]}
            onPress={() => setSelectedChart("pie")}
          >
            <Text style={styles.buttonText}>Pie</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedChart === "lineSaldo" && { backgroundColor: "#0FEC32" },
            ]}
            onPress={() => setSelectedChart("lineSaldo")}
          >
            <Text style={styles.buttonText}>Saldo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedChart === "ring" && { backgroundColor: "#0FEC32" },
            ]}
            onPress={() => setSelectedChart("ring")}
          >
            <Text style={styles.buttonText}>Metas</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedChart === "lineEntradasSaidas" && {
                backgroundColor: "#0FEC32",
              },
            ]}
            onPress={() => setSelectedChart("lineEntradasSaidas")}
          >
            <Text style={styles.buttonText}>Entradas/Saidas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedChart === "bar" && { backgroundColor: "#0FEC32" },
            ]}
            onPress={() => setSelectedChart("bar")}
          >
            <Text style={styles.buttonText}>Bar</Text>
          </TouchableOpacity>
        </View>
      </View>
      {selectedChart === "pie" && pieChart}
      {selectedChart === "lineSaldo" && lineChartSaldo}
      {selectedChart === "lineEntradasSaidas" && lineChartEntradasSaidas}
      {selectedChart === "ring" && progressRing}
      {selectedChart === "bar" && barChart}
    </View>
  );
};

const styles = StyleSheet.create({
  graficos: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2B2B2B",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#3A3E3A",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  chartContainer: {
    backgroundColor: "#3A3E3A",
    borderRadius: 15,
    marginVertical: 10,
    padding: 10,
    alignItems: "center",
  },
});

export default Graficos;

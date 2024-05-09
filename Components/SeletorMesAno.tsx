import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { DataContext } from "../Contexts/DataContext";

interface SeletorMesAnoProps {
  seletorMes?: boolean;
  seletorAno?: boolean;
  onMonthChange?: (data: Date) => void;
  onYearChange?: (data: Date) => void;
}

const SeletorMesAno: React.FC<SeletorMesAnoProps> = ({
  seletorMes,
  seletorAno,
  onMonthChange,
  onYearChange,
}) => {
  const { dataSelecionada, setDataSelecionada } = useContext(DataContext) as {
    dataSelecionada: Date;
    setDataSelecionada: (data: Date) => void;
  };
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
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const [year, setYear] = useState(dataSelecionada.getFullYear());

  const updateMonth = (newMonthIndex: number) => {
    setMonthIndex(newMonthIndex);
    const newData = new Date(year, newMonthIndex, dataSelecionada.getDate());
    onMonthChange && onMonthChange(newData);
    setDataSelecionada(newData);
  };

  const updateYear = (newYear: number) => {
    setYear(newYear);
    const newData = new Date(newYear, monthIndex, dataSelecionada.getDate());
    onYearChange && onYearChange(newData);
    setDataSelecionada(newData);
  };

  let mes = null;
  if (seletorMes) {
    mes = (
      <View style={styles.mesHeader}>
        <TouchableOpacity
          style={styles.arrowLeftButton}
          onPress={updateMonth.bind(null, monthIndex - 1)}
        >
          <Image
            source={require("../assets/seta.png")}
            style={styles.iconLeft}
          />
        </TouchableOpacity>
        <Text style={styles.mesLabel}>{monthNames[monthIndex]}</Text>
        <TouchableOpacity
          style={styles.arrowRightButton}
          onPress={updateMonth.bind(null, monthIndex + 1)}
        >
          <Image
            source={require("../assets/seta.png")}
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>
    );
  }

  let ano = null;
  if (seletorAno) {
    ano = (
      <View style={styles.yearHeader}>
        <TouchableOpacity
          style={styles.arrowLeftButton}
          onPress={updateYear.bind(null, year - 1)}
        >
          <Image
            source={require("../assets/seta.png")}
            style={styles.iconLeft}
          />
        </TouchableOpacity>
        <Text style={styles.anoLabel}>{year}</Text>
        <TouchableOpacity
          style={styles.arrowRightButton}
          onPress={updateYear.bind(null, year + 1)}
        >
          <Image
            source={require("../assets/seta.png")}
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      {ano}
      {mes}
    </View>
  );
};

const styles = StyleSheet.create({
  mesHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  yearHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowButton: {
    padding: 5,
  },
  arrowLeftButton: {
    transform: [{ rotate: "180deg" }],
  },
  arrowRightButton: {},
  mesLabel: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 26,
    marginHorizontal: 5, 
    width: 130, // Largura fixa para o rótulo do mês ou ano
  },
  anoLabel: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 26,
    marginHorizontal: 5, 
    width: 70, // Largura fixa para o rótulo do mês ou ano
  },
  iconLeft: {
    width: 18,
    height: 12,
    transform: [{ rotate: "-90deg" }], // Rotação para a seta esquerda
  },
  iconRight: {
    width: 18,
    height: 12, // Sem rotação para a seta direita
    transform: [{ rotate: "-90deg" }],
  },
});

export default SeletorMesAno;

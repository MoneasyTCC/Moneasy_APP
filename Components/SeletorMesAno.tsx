import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface SeletorMesAnoProps {
  seletorMes: boolean;
  seletorAno: boolean;
}

const SeletorMesAno: React.FC<SeletorMesAnoProps> = ({ seletorMes, seletorAno }) => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
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
    const newData = new Date(dataSelecionada.getFullYear(), newMonthIndex, 31);
    setDataSelecionada(newData);
  };

  const updateYear = (newYear: number) => {
    const newData = new Date(newYear, dataSelecionada.getMonth(), 31);
    setDataSelecionada(newData);
    setYear(newYear);
  };

  const handlePreviousMonth = () => {
    const newMonthIndex = monthIndex > 0 ? monthIndex - 1 : 11;
    updateMonth(newMonthIndex);
  };

  const handleNextMonth = () => {
    const newMonthIndex = monthIndex < 11 ? monthIndex + 1 : 0;
    updateMonth(newMonthIndex);
  };

  const handlePreviousYear = () => {
    const newYear = year - 1;
    setYear(newYear);
    const newData = new Date(newYear, dataSelecionada.getMonth(), 31);
    setDataSelecionada(newData);
    updateYear(newYear);
  };

  const handleNextYear = () => {
    const newYear = year + 1;
    setYear(newYear);
    const newData = new Date(newYear, dataSelecionada.getMonth(), 31);
    setDataSelecionada(newData);
    updateYear(newYear);
  };

  let mes = null;
  if (seletorMes) {
    mes = (
      <View style={styles.mesHeader}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => handlePreviousMonth()}
        >
          <Text style={styles.arrowText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.mesLabel}>{monthNames[monthIndex]}</Text>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => handleNextMonth()}
        >
          <Text style={styles.arrowText}>&gt;</Text>
        </TouchableOpacity>
      </View>
    );
  }
  let ano = null;
  if (seletorAno) {
    ano = (
      <View style={styles.yearHeader}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => handlePreviousYear()}
        >
          <Text style={styles.arrowText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.mesLabel}>{year}</Text>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => handleNextYear()}
        >
          <Text style={styles.arrowText}>&gt;</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ marginTop: "10%" }}>
      {mes}
      {ano}
    </View>
  );
};

const styles = StyleSheet.create({
  mesHeader: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  yearHeader: {
    flexDirection: "row",
    justifyContent: "center",
  },
  arrowButton: {
    padding: 5,
    paddingBottom: 15,
  },
  arrowText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 30,
  },
  mesLabel: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 26,
  },
});

export default SeletorMesAno;

import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
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
    const newData = new Date(dataSelecionada.getFullYear(), newMonthIndex + 1, 0);
    onMonthChange && onMonthChange(newData);
    setDataSelecionada(newData);
  };

  const updateYear = (newYear: number) => {
    const newData = new Date(newYear, dataSelecionada.getMonth() + 1, 0);
    setYear(newYear);
    onYearChange && onYearChange(newData);
    setDataSelecionada(newData);
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
    updateYear(newYear);
  };

  const handleNextYear = () => {
    const newYear = year + 1;
    setYear(newYear);
    updateYear(newYear);
  };

  useEffect(() => {
    setMonthIndex(dataSelecionada.getMonth());
    setYear(dataSelecionada.getFullYear());
  }, [dataSelecionada]);

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

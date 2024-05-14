import React, { useState, useEffect } from "react";
import { Touchable, TouchableOpacity } from "react-native";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

interface Estado {
  taxa: number | null;
  dataCotacao: string;
  valorEmBRL: string;
  valorEmUSD: string;
  convertidoParaUSD: string;
  convertidoParaBRL: string;
}

const ConversorMoeda: React.FC = () => {
  const [taxa, setTaxa] = useState<number | null>(null);
  const [dataCotacao, setDataCotacao] = useState<string>("");
  const [valorEmBRL, setValorEmBRL] = useState<string>("");
  const [valorEmUSD, setValorEmUSD] = useState<string>("");
  const [convertidoParaUSD, setConvertidoParaUSD] = useState<string>("");
  const [convertidoParaBRL, setConvertidoParaBRL] = useState<string>("");

  const buscarTaxas = async () => {
    const chaveApi = "f527e073e8652f8c0bbf733cd12e861f";
    const url = `http://api.currencylayer.com/live?access_key=${chaveApi}&currencies=BRL&format=1`;
    try {
      const resposta = await fetch(url);
      const json = await resposta.json();
      if (json.success) {
        const dataAtualizada = new Date(json.timestamp * 1000);
        setDataCotacao(
          dataAtualizada.toLocaleDateString("pt-BR") +
            " " +
            dataAtualizada.toLocaleTimeString("pt-BR")
        );
        setTaxa(json.quotes["USDBRL"]);
      } else {
        console.error("Erro ao buscar taxas", json.error);
      }
    } catch (erro) {
      console.error("Erro ao buscar taxas:", erro);
    }
  };

  useEffect(() => {
    buscarTaxas();
  }, []);

  const converterBRLParaUSD = () => {
    const valorReais = parseFloat(valorEmBRL);
    if (taxa !== null) {
      const valorConvertido = (valorReais / taxa).toFixed(2);
      setConvertidoParaUSD(valorConvertido);
    }
  };

  const converterUSDParaBRL = () => {
    const valorDolares = parseFloat(valorEmUSD);
    if (taxa !== null) {
      const valorConvertido = (valorDolares * taxa).toFixed(2);
      setConvertidoParaBRL(valorConvertido);
    }
  };

  const limparTudo = () => {
    setValorEmBRL("");
    setValorEmUSD("");
    setConvertidoParaUSD("");
    setConvertidoParaBRL("");
    setDataCotacao("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>Conversor de Moeda</Text>
      <Text style={[styles.titulo, styles.centered]}>
        Taxa Atual (USD para BRL):{" "}
        {taxa
          ? `${taxa.toFixed(2)}`
          : "Carregando..."}
      </Text>

      <View style={styles.linha}>
        <TextInput
          style={styles.entrada}
          placeholder="Valor em BRL"
          placeholderTextColor={"#FFFFFF"}
          value={valorEmBRL}
          onChangeText={setValorEmBRL}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.btn, styles.btnCalcular]}
          onPress={converterBRLParaUSD}
        >
          <Text style={styles.textBtn}>Para USD</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.resultado}>
        Valor em USD:{" "}
        <Text style={styles.resultadoText}>{convertidoParaUSD}</Text>
      </Text>

      <View style={styles.linha}>
        <TextInput
          style={styles.entrada}
          placeholder="Valor em USD"
          placeholderTextColor={"#FFFFFF"}
          value={valorEmUSD}
          onChangeText={setValorEmUSD}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.btn, styles.btnCalcular]}
          onPress={converterUSDParaBRL}
        >
          <Text style={styles.textBtn}>Para BRL</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.resultado}>
        Valor em BRL:{" "}
        <Text style={styles.resultadoText}>{convertidoParaBRL}</Text>
      </Text>
      <TouchableOpacity
        style={[styles.btn, styles.btnLimpar]}
        onPress={limparTudo}
      >
        <Text style={styles.textBtn}>Limpar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
  },
  entrada: {
    fontSize: 16,
    padding: 10,
    width: "60%",
    borderRadius: 10,
    backgroundColor: "#3A3E3A",
    marginRight: 10,
    color: "#FFFFFF",
  },
  resultado: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  resultadoText: {
    color: "#0FEC32",
    fontWeight: "bold",
    fontSize: 20,
  },
  centered: {
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  btn: {
    padding: 8,
    width: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnLimpar: {
    backgroundColor: "#EC0F0F",
  },
  btnCalcular: {
    backgroundColor: "#0FEC32",
  },
  textBtn: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalTitle: {
    marginBottom: 10,
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default ConversorMoeda;

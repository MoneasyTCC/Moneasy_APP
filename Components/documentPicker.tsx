import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import {
  View,
  TouchableOpacity,
  Alert,
  Button,
  Text,
  StyleSheet,
} from "react-native";
import Papa from "papaparse";
import { TransacaoDAL } from "../Repo/RepositorioTransacao";
import { Transacao } from "../Model/Transacao";

const ImportarCsvComponente = () => {
  const importarCSV = async () => {
    try {
      // Abre o seletor de documentos para arquivos CSV
      const resultado = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
      });

      if (resultado.canceled) {
        Alert.alert(
          "Importação cancelada",
          "A seleção de arquivo foi cancelada."
        );
        return;
      }

      const uri = resultado.assets[0].uri;

      // Lê o texto do arquivo CSV diretamente
      const csvText = await FileSystem.readAsStringAsync(uri);

      // Analisa a string CSV
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: async (parseResult) => {
          if (parseResult.errors.length) {
            console.error("Erros ao parsear CSV:", parseResult.errors);
            Alert.alert(
              "Erro de Análise",
              "Ocorreram erros ao analisar o arquivo CSV."
            );
            return;
          }

          // Processa cada transação
          const transacoes = parseResult.data
            .map((linha: any) => {
              // Certifique-se de que todos os campos necessários existem e não são undefined
              if (!linha["Valor"] || !linha["Data"] || !linha["Descrição"]) {
                console.error("Dados incompletos:", linha);
                return null; // ignora linhas incompletas
              }

              try {
                // Supondo que a data esteja no formato DD/MM/YYYY
                // Você precisa ajustar isso se o formato for diferente
                const partesDaData = linha["Data"].split("/");
                // Ajuste o índice do mês ao criar o objeto Date
                // Note que partesDaData[1] - 1 ajusta o mês para base 0
                const dataTransacao = new Date(
                  partesDaData[2],
                  partesDaData[1] - 1,
                  partesDaData[0]
                );

                // Verifica se a data é válida
                if (isNaN(dataTransacao.getTime())) {
                  throw new Error(`Data inválida: ${linha["Data"]}`);
                }

                // Parse e ajuste do valor
                const valorString = linha["Valor"].replace(",", ".");
                const valor = parseFloat(valorString);
                if (isNaN(valor)) {
                  throw new Error(`Valor inválido: ${linha["Valor"]}`);
                }

                // Determina o tipo com base no valor
                const tipo = valor < 0 ? "saída" : "entrada";

                // Cria a transação
                return new Transacao(
                  "", // O ID é gerado no DAL ou no banco de dados
                  "", // O usuarioId será buscado dentro do DAL
                  tipo,
                  Math.abs(valor),
                  dataTransacao,
                  linha["Descrição"],
                  "BRL" // Supondo que a moeda é sempre BRL
                );
              } catch (error) {
                return null;
              }
            })
            .filter(Boolean); // Remove as entradas que retornaram null

          if (transacoes.length === 0) {
            Alert.alert(
              "Erro de Importação",
              "Nenhuma transação válida para importar."
            );
            return;
          }

          // Adiciona transações no banco de dados
          for (const transacao of transacoes) {
            if (transacao) {
              // Check if transacao is not null
              await TransacaoDAL.adicionarTransacao(transacao);
            }
          }

          Alert.alert("Sucesso", "Todas as transações foram importadas.");
        },
      });
    } catch (erro) {
      console.error("Ocorreu um erro ao importar o arquivo CSV:", erro);
      Alert.alert("Erro", "Ocorreu um erro ao importar o arquivo CSV.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={importarCSV}>
        <Text style={styles.btnText}>Importar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    padding: 8,
    width: 250,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0FEC32",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 20,
  },
});
export default ImportarCsvComponente;

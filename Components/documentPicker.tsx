import React from 'react';
import { Button, View, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { TransacaoDAL } from '../Repo/RepositorioTransacao';
// import { adicionarTransacao } from '../Repo/RepositorioTransacao';	

export default function ImportarTransacoes() {
    const handlePickFile = async () => {
        console.log("Iniciando a seleção do arquivo...");
        try {
          const result: any = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
          console.log("DocumentPicker terminou com: ", result.type);
          if (result.type === 'cancel') {
            console.log('Seleção de arquivo foi cancelada.');
            return;
          }
      
          if (result.type === 'success') {
            console.log("Arquivo selecionado, iniciando a leitura...");
            const content = await FileSystem.readAsStringAsync(result.uri);
            parseCSV(content);
          }
        } catch (err: any) {
          console.error("Erro ao ler o arquivo: ", err);
          Alert.alert('Erro ao ler o arquivo', err.message);
        }
      };
    
      interface CsvRowData {
        Valor: string;
        Data: string;
        Descricao: string;
      }
      
      const parseCSV = (data: string) => {
        console.log("Iniciando o processamento do CSV...");
        Papa.parse<CsvRowData>(data, { 
          header: true,
          complete: async (result) => {
            console.log("Parseamento do CSV completo, processando as linhas...");
            for (const row of result.data) {
              if (!row.Valor || !row.Data || !row.Descricao) {
                console.log("Linha ignorada, dados incompletos.");
                continue; 
              }
      
              const transacaoTipo = parseFloat(row.Valor) >= 0 ? 'entrada' : 'saida';
              try {
                const novaTransacao = {
                  id: '',
                  usuarioId: '', 
                  tipo: transacaoTipo,
                  valor: parseFloat(row.Valor),
                  data: new Date(row.Data),
                  nome: row.Descricao,
                  moeda: 'BRL',
                };
                console.log("Adicionando transação: ", novaTransacao);
                await TransacaoDAL.adicionarTransacao(novaTransacao);
                console.log("Transação adicionada com sucesso!");
              } catch (error: unknown) {
                console.error("Erro ao adicionar transação: ", error);
                if (error instanceof Error) {
                  Alert.alert('Erro ao adicionar transação', error.message);
                }
              }
            }
          },
          skipEmptyLines: true,
        });
      };
    
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Importar Transações CSV" onPress={handlePickFile} />
    </View>
  );
}

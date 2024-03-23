import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// DOCUMENTACAO EM ========>   https://currencylayer.com/quickstart
// DOCUMENTACAO EM ========>   https://currencylayer.com/quickstart
// DOCUMENTACAO EM ========>   https://currencylayer.com/quickstart
const Cotacao = () => {
    const [cotacao, setCotacao] = useState('');
  const [data, setData] = useState('');
  const [error, setError] = useState('');

 function converterTimestamp(timestamp: any) {
const date = new Date(timestamp * 1000); 

const day = `0${date.getDate()}`.slice(-2); 
const month = `0${date.getMonth() + 1}`.slice(-2); 
const year = date.getFullYear(); 
const hours = `0${date.getHours()}`.slice(-2); 
const minutes = `0${date.getMinutes()}`.slice(-2); 
// const seconds = `0${date.getSeconds()}`.slice(-2);

const data_formatada = `${day}/${month}/${year} ${hours}:${minutes}`;
console.log(data_formatada);
return data_formatada
 }

  const chave = "access_key=f527e073e8652f8c0bbf733cd12e861f";
  const cotacoes = "currencies=EUR,BRL&source=USD"
  async function CotacaoDolar() {
    try {
      let response = await fetch(
        `http://apilayer.net/api/live?${chave}&${cotacoes}&format=1`

      );
      let data = await response.json();
      if (data.success) {
        setCotacao(data.quotes.USDBRL);
        const dataC = converterTimestamp(data.timestamp);
        setData(dataC);
        setError('');
      } else {
        setError('Erro ao buscar dados: ' + data.error.info);
      }
    } 
    catch (error) {
        setError('Erro ao buscar dados: ' + (error as Error).message);
    }
}
  useEffect(() => {
    CotacaoDolar();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cotação do Dólar</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Text style={styles.cotacao}>{cotacao ? `USD/BRL: ${cotacao}` : 'Carregando...'}</Text>
        
      )}
          <Text style={styles.data}>{data ? `Data: ${data}` : 'Carregando...'}</Text>

      <TouchableOpacity style={styles.button} onPress={CotacaoDolar}>
        <Text style={styles.buttonText}>Atualizar Cotação</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#FFFFFF',
  },
  data: {
    fontSize: 15,
    color: '#FFFFFF',
    paddingBottom: 5,
  },
  cotacao: {
    color: '#FFFFFF',
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Cotacao;

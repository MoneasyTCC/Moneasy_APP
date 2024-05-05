import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import  PickerSelect  from 'react-native-picker-select'; // Importe corretamente conforme o nome do seu import

const cotacoes_variasMoedas = () => {
  const [cotacao, setCotacao] = useState('');
  const [data, setData] = useState('');
  const [error, setError] = useState('');
  const [currency, setCurrency] = useState('USDBRL');

  const converterTimestamp = (timestamp:any) => {
    const date = new Date(timestamp * 1000);
    return `${(`0${date.getDate()}`).slice(-2)}/${(`0${date.getMonth() + 1}`).slice(-2)}/${date.getFullYear()} ${(`0${date.getHours()}`).slice(-2)}:${(`0${date.getMinutes()}`).slice(-2)}`;
  };

  const chave = "f527e073e8652f8c0bbf733cd12e861f";
  const fetchCotacao = async () => {
    try {
      let response = await fetch(
        `http://apilayer.net/api/live?access_key=${chave}&currencies=USD,EUR,GBP&source=BRL&format=1`
      );
      let json = await response.json();
      if (json.success) {
        setCotacao(json.quotes[currency]);
        setData(converterTimestamp(json.timestamp));
        setError('');
      } else {
        setError('Erro ao buscar dados: ' + json.error.info);
      }
    } catch (error) {
      setError('Erro ao buscar dados: ' + (error as Error).message);
    }
  };

  useEffect(() => {
    fetchCotacao();
  }, [currency]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cotação</Text>
      <PickerSelect
        onValueChange={(value:any) => setCurrency(value)}
        items={[
          { label: ' Dólar para Real', value: 'USDBRL' },
          { label: ' Euro para Real', value: 'EURBRL' },
          { label: ' Libra para Real', value: 'GBPBRL' },
        ]}
        style={{
            inputIOS: pickerSelectStyles.inputIOS,
            inputAndroid: pickerSelectStyles.inputAndroid,
            placeholder: pickerSelectStyles.placeholder, // Se você está usando placeholders
          }}
        value={currency}
        
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Text style={styles.cotacao}>{cotacao ? `${currency.slice(0, 3)} para BRL: ${cotacao}` : 'Carregando...'}</Text>
      )}
      <Text style={styles.data}>{data ? `Data: ${data}` : 'Carregando...'}</Text>
      <TouchableOpacity style={styles.button} onPress={fetchCotacao}>
        <Text style={styles.buttonText}>Atualizar Cotação</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#FFF',
  },
  data: {
    fontSize: 15,
    color: '#000',
    paddingBottom: 5,
  },
  cotacao: {
    color: '#000',
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  placeholder: {
    color: 'gray', // Defina uma cor para o placeholder se necessário
  },
});

export default cotacoes_variasMoedas;

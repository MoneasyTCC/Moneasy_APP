import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import  PickerSelect  from 'react-native-picker-select'; // Ajuste a importação conforme seu ambiente

const ConversorMoedas = () => {
  const [valorReal, setValorReal] = useState('');
  const [moeda, setMoeda] = useState('USDBRL');
  const [resultado, setResultado] = useState('');

  const converterMoeda = async () => {
    const chave = "access_key=f527e073e8652f8c0bbf733cd12e861f";
    try {
      let response = await fetch(
        `http://apilayer.net/api/live?access_key=${chave}&currencies=${moeda.slice(3)}&source=BRL&format=1`
      );
      let json = await response.json();
      if (json.success) {
        const taxaConversao = json.quotes[moeda];
        const valorConvertido = (parseFloat(valorReal) * taxaConversao).toFixed(2);
        setResultado(`${valorReal} BRL é igual a ${valorConvertido} ${moeda.slice(3)}`);
      } else {
        setResultado('Erro ao buscar dados: ' + json.error.info);
      }
    } catch (error) {
      setResultado('Erro ao buscar dados: ' + (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversor de Moedas</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o valor em Reais"
        keyboardType="numeric"
        value={valorReal}
        onChangeText={setValorReal}
      />
      <PickerSelect
        onValueChange={(value : any) => setMoeda(value)}
        items={[
          { label: 'Dólar', value: 'USDBRL' },
          { label: 'Euro', value: 'EURBRL' },
          { label: 'Libra', value: 'GBPBRL' },
        ]}
        style={pickerSelectStyles}
        value={moeda}
      />
      <TouchableOpacity style={styles.button} onPress={converterMoeda}>
        <Text style={styles.buttonText}>Converter</Text>
      </TouchableOpacity>
      <Text style={styles.result}>{resultado}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
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
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

export default ConversorMoedas;

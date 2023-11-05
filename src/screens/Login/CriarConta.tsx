import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createAccountWithEmail } from '../../../services/firebase-auth'; 
import { RootStackParamList } from '../../../shared/config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type CriarContaScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CriarConta'
>;

type Props = {
  navigation: CriarContaScreenNavigationProp;
};


export default function CriarContaScreen({ navigation }:Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    try {
      await createAccountWithEmail(email, password);
      // Se a conta for criada com sucesso, você pode querer navegar para a tela Home ou qualquer outra que preferir
      Alert.alert('Conta criada com sucesso. Faça o Login.', '', [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              navigation.replace('Login');
            }, 1500); // Aguarda 1,5 segundo antes de executar a navegação
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Erro ao criar conta');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
      />
      <Button title="Criar Conta" onPress={handleCreateAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 10,
  },
});

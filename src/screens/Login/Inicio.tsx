import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../../shared/config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type InicioScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Inicio'
>;

type Props = {
  navigation: InicioScreenNavigationProp;
};


export default function InicioScreen({ navigation }:Props) {
  return (
    <View style={styles.container}>
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')} 
      />
      <View style={styles.spacer} />
      <Button
        title="Criar Conta"
        onPress={() => navigation.navigate('CriarConta')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  spacer: {
    height: 20, 
  },
});



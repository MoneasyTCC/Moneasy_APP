import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

// Componente de Logout
const LogoutComponent = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      await AsyncStorage.removeItem('@login_token');
      Alert.alert('Logout', 'Você saiu com sucesso.', [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              );
            }, 500);
          },
        }
      ]);
    } catch (error) {
      Alert.alert('Erro de Logout');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} color="#FF6347" />
    </View>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    padding: 20
  }
});

export default LogoutComponent;

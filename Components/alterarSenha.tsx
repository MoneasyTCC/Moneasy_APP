import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getAuth, updatePassword } from 'firebase/auth';
import { reauthenticate } from '../services/firebase-auth';
const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Erro', 'As novas senhas não coincidem.');
      return;
    }

    const isReauthenticated = await reauthenticate(currentPassword);
    if (isReauthenticated) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          await updatePassword(user, newPassword);
          Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
        } catch (error) {
          Alert.alert('Erro ao atualizar senha');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Senha atual"
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Nova senha"
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirme a nova senha"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />
      <Button title="Alterar Senha" onPress={handleChangePassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#616161",
    borderRadius: 10,
    color: "white",
    opacity: 0.7,
  },
 
});

export default ChangePasswordForm;

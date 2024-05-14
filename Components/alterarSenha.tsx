import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
} from "react-native";
import { getAuth, updatePassword } from "firebase/auth";
import { reauthenticate } from "../services/firebase-auth";
const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Erro", "As novas senhas não coincidem.");
      return;
    }

    const isReauthenticated = await reauthenticate(currentPassword);
    if (isReauthenticated) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          await updatePassword(user, newPassword);
          Alert.alert("Sucesso", "Senha atualizada com sucesso!");
        } catch (error) {
          Alert.alert("Erro ao atualizar senha");
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
        placeholderTextColor={"#FFFFFF"}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Nova senha"
        placeholderTextColor={"#FFFFFF"}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirme a nova senha"
        placeholderTextColor={"#FFFFFF"}
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />
      <TouchableOpacity style={styles.btn} onPress={handleChangePassword}>
        <Text style={styles.textBtn}>Alterar Senha</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: 220,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#616161",
    borderRadius: 25,
    color: "#FFFFFF",
    opacity: 0.7,
  },
  btn: {
    padding: 10,
    width: 220, 
    borderRadius: 20,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0FEC32",
  },
  textBtn: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChangePasswordForm;

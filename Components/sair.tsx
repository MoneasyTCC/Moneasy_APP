import React from "react";
import {
  TouchableOpacity,
  Image,
  View,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

// Componente de Logout
const LogoutComponent = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      await AsyncStorage.removeItem("@login_token");
      Alert.alert("Logout", "Você saiu com sucesso.", [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                })
              );
            }, 500);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Erro ao Sair");
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Image
        source={require("../assets/more/logout.png")}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  icon: {
    marginBottom: 30,
    marginRight: 30,
  },
});

export default LogoutComponent;

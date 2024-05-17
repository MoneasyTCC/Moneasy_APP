import React, { useState } from "react";
import {
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import AwesomeAlert from 'react-native-awesome-alerts';

// Componente de Logout
const LogoutComponent = () => {
  const navigation = useNavigation();
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      await AsyncStorage.removeItem("@login_token");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      setShowAlert(false);
      setShowErrorAlert(true);
    }
  };

  const confirmLogout = () => {
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

  const hideErrorAlert = () => {
    setShowErrorAlert(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={confirmLogout}>
        <Image
          source={require("../assets/more/logout.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Confirmar Logout"
        message="Você tem certeza que deseja sair?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Cancelar"
        confirmText="Sim"
        confirmButtonColor="#DD6B55"
        onCancelPressed={hideAlert}
        onConfirmPressed={handleLogout}
      />

      <AwesomeAlert
        show={showErrorAlert}
        showProgress={false}
        title="Erro"
        message="Erro ao Sair"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={hideErrorAlert}
      />
    </View>
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

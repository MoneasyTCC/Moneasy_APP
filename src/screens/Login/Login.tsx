import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { resetPasswordWithEmail } from "../../../services/firebase-auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import { loginWithEmail } from "../../../services/firebase-auth";
import { SvgXml } from "react-native-svg";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const xmlImg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M160 0c17.7 0 32 14.3 32 32V67.7c1.6 .2 3.1 .4 4.7 .7c.4 .1 .7 .1 1.1 .2l48 8.8c17.4 3.2 28.9 19.9 25.7 37.2s-19.9 28.9-37.2 25.7l-47.5-8.7c-31.3-4.6-58.9-1.5-78.3 6.2s-27.2 18.3-29 28.1c-2 10.7-.5 16.7 1.2 20.4c1.8 3.9 5.5 8.3 12.8 13.2c16.3 10.7 41.3 17.7 73.7 26.3l2.9 .8c28.6 7.6 63.6 16.8 89.6 33.8c14.2 9.3 27.6 21.9 35.9 39.5c8.5 17.9 10.3 37.9 6.4 59.2c-6.9 38-33.1 63.4-65.6 76.7c-13.7 5.6-28.6 9.2-44.4 11V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.1c-.4-.1-.9-.1-1.3-.2l-.2 0 0 0c-24.4-3.8-64.5-14.3-91.5-26.3c-16.1-7.2-23.4-26.1-16.2-42.2s26.1-23.4 42.2-16.2c20.9 9.3 55.3 18.5 75.2 21.6c31.9 4.7 58.2 2 76-5.3c16.9-6.9 24.6-16.9 26.8-28.9c1.9-10.6 .4-16.7-1.3-20.4c-1.9-4-5.6-8.4-13-13.3c-16.4-10.7-41.5-17.7-74-26.3l-2.8-.7 0 0C119.4 279.3 84.4 270 58.4 253c-14.2-9.3-27.5-22-35.8-39.6c-8.4-17.9-10.1-37.9-6.1-59.2C23.7 116 52.3 91.2 84.8 78.3c13.3-5.3 27.9-8.9 43.2-11V32c0-17.7 14.3-32 32-32z"/></svg>';

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await loginWithEmail(email, password);
      // navigation.replace('Home');
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      //replace deixa que o usuario volte na tela
      //reset não permite voltar, então quando o usuario fizer o login não poderá sair sem querer.
    } catch (error) {
      Alert.alert("Usuario não autenticado");
    }
  };

   const handleForgotPassword = async () => {

        Alert.alert(
           "Insira o Email",
           "Um e-mail de redefinição de senha foi enviado. Verifique sua caixa de entrada."
         );

     };


  return (
    <View style={styles.container}>
      <SvgXml
        xml={xmlImg}
        style={styles.icon}
        onPress={() => navigation.navigate("Inicio")}
      ></SvgXml>
      <View style={styles.menu}>
        <TextInput
          placeholderTextColor={"#000000"}
          style={styles.input}
          placeholder="E-mail"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.spacer} />
        <TextInput
          placeholderTextColor={"#000000"}
          style={styles.input}
          placeholder="Senha"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
          <Text style={styles.txtLogin}>Entrar</Text>
        </TouchableOpacity>
        <View style={styles.spacer2} />

        <Text
           style={styles.textRedirect}
           onPress={() => navigation.navigate("RedefineSenha")}
         >
           Esqueci minha senha!
         </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Roboto",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0FEC32",
  },
  menu: {
    borderTopLeftRadius: 100,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "50%",
    backgroundColor: "#2B2B2B",
  },
  spacer: {
    height: 25,
  },
  spacer2: {
    height: 10,
  },
  icon: {
    width: 120,
    height: "50%",
    fill: "#FFFFFF",
    justifyContent: "center",
  },
  input: {
    width: "70%",
    height: 50,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  buttonLogin: {
    backgroundColor: "#0FEC32",
    padding: 10,
    width: 280,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "#52006A",
  },
  txtLogin: {
    textAlign: "center",
    color: "#000000",
    fontSize: 24,
    fontWeight: "bold",
  },
  textRedirect: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
});

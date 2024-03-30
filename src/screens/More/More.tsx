import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import ImportTransactions from "../../../Components/documentPicker";
import NavigationBar from "../menuNavegation";

type MoreScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "More"
>;

type Props = {
  navigation: MoreScreenNavigationProp;
};

// Use as props na definição do seu componente
export default function MoreScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.menuHeader}>
        <Button title="Sair" onPress={() => navigation.replace("Inicio")} />
      </View>
      <View style={styles.menuBody}>
        <View style={styles.content}></View>
        <ImportTransactions />
      </View>
      <View style={styles.menuFooter}>
        <NavigationBar></NavigationBar>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2B2B2B",
  },
  menuHeader: {
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "35%",
    backgroundColor: "#3A3E3A",
  },
  menuBody: {
    width: "80%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    borderRadius: 50,
    width: "100%",
    height: "80%",
    backgroundColor: "#3A3E3A",
  },
  menuFooter: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "15%",
    backgroundColor: "#3A3E3A",
  },
  text: {
    fontSize: 60,
    marginBottom: 20,
  },
  menuNavegation: {
    borderRadius: 50,
    backgroundColor: "#2B2B2B",
    width: "80%",
    height: "50%",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  img: {},
});

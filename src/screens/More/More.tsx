import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import NavigationBar from "../menuNavegation";

type MoreScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "More"
>;

type Props = {
  navigation: MoreScreenNavigationProp;
};

export default function MoreScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.menuHeader}>
        <Text style={styles.headerText}>Mais opções</Text>
      </View>
      <View style={styles.menuBody}>
        {/* A implementar */}
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Image
            source={require("../../../assets/settings.png")}
            style={styles.icon}
          />
          <Text style={styles.menuItemText}>Configurações</Text>
        </TouchableOpacity>
        {/* Abrir Modal que está no Figma que tem botão, depois de clicar neste botão "Importar", abrir o Componente abaixo */
        /* <ImportarCsvComponente /> */}
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Image
            source={require("../../../assets/csv.png")}
            style={styles.icon}
          />
          <Text style={styles.menuItemText}>Importar CSV</Text>
        </TouchableOpacity>
        {/* <ConversorMoeda></ConversorMoeda> */}
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Image
            source={require("../../../assets/coinConf.png")}
            style={styles.icon}
          />
          <Text style={styles.menuItemText}>Conversor de Moeda</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuFooter}>
        <NavigationBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2B2B2B",
    alignItems: "center",
    justifyContent: "center",
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginLeft: 20,
    width: "100%",
    height: "12%",
  },
  menuBody: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: "100%",
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#3A3E3A",
  },
  menuFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "15%",
    backgroundColor: "#3A3E3A",
  },
  headerText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 30,
    marginLeft: 10
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2B2B2B",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 22,
    width: "80%",
    marginVertical: 10,
  },
  menuItemText: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    width: 25,
    height: 25,
  },
});

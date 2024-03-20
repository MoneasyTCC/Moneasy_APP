import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared/config";

type MenuNavScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

const NavigationBar = () => {
  const navigation = useNavigation<MenuNavScreenNavigationProp>();
  const route = useRoute();

  const handlePress = (destino: any) => {
    switch (destino) {
      case "Home":
        navigation.navigate("Home");
        break;
      case "Orcamento":
        navigation.navigate("Orcamento");
        break;
      case "Transacao":
        navigation.navigate("Transacao");
        break;
      case "Metas":
        navigation.navigate("Metas");
        break;
      case "More":
        navigation.navigate("More");
        break;
    }
  };

  return (
    <View style={styles.menuNavegation}>
      <Text></Text>
      <TouchableOpacity onPress={() => handlePress("Home")}>
        <Image
          source={
            route.name == "Home"
              ? require("../../assets/menu/homeActive.png")
              : require("../../assets/menu/home.png")
          }
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress("Transacao")}>
        <Image
          source={
            route.name == "Transacao"
              ? require("../../assets/menu/menuActive.png")
              : require("../../assets/menu/menu.png")
          }
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress("Orcamento")}>
        <Image
          source={
            route.name == "Orcamento"
              ? require("../../assets/menu/transactionsActive.png")
              : require("../../assets/menu/transactions.png")
          }
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress("Metas")}>
        <Image
          source={
            route.name == "Metas"
              ? require("../../assets/menu/metaActive.png")
              : require("../../assets/menu/meta.png")
          }
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress("More")}>
        <Image
          source={
            route.name == "More"
              ? require("../../assets/menu/moreActive.png")
              : require("../../assets/menu/more.png")
          }
        />
      </TouchableOpacity>
      <Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  menuNavegation: {
    borderRadius: 50,
    backgroundColor: "#2B2B2B",
    width: "90%",
    height: "55%",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default NavigationBar;

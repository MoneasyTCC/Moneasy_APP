import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const NavigationBar = () => {
  const route = useRoute();
  return (
    <View style={styles.menuNavegation}>
      <Text></Text>
      <Image
        source={
          route.name == "Home"
            ? require("../../assets/menu/homeActive.png")
            : require("../../assets/menu/home.png")
        }
      />
      <Image
        source={
          route.name == "Menu"
            ? require("../../assets/menu/menuActive.png")
            : require("../../assets/menu/menu.png")
        }
      />
      <Image
        source={
          route.name == "Transacoes"
            ? require("../../assets/menu/transactionsActive.png")
            : require("../../assets/menu/transactions.png")
        }
      />
      <Image
        source={
          route.name == "Metas"
            ? require("../../assets/menu/metaActive.png")
            : require("../../assets/menu/meta.png")
        }
      />
      <Image
        source={
          route.name == "More"
            ? require("../../assets/menu/moreActive.png")
            : require("../../assets/menu/more.png")
        }
      />
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
  }
});

export default NavigationBar;

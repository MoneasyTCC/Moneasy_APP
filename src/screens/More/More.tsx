import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import NavigationBar from "../menuNavegation";
import ImportarCsvComponente from "../../../Components/documentPicker";
import ConversorMoeda from "../../../Components/ConverterMoedas";
import ChangePassword from "../../../Components/alterarSenha";

type MoreScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "More"
>;

type Props = {
  navigation: MoreScreenNavigationProp;
};

export default function MoreScreen({ navigation }: Props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);

  const toggleCurrencyModal = () => {
    setCurrencyModalVisible(!isCurrencyModalVisible);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
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
        <TouchableOpacity style={styles.menuItem} onPress={toggleModal}>
        <Image
          source={require("../../../assets/csv.png")}
          style={styles.icon}
        />
        <Text style={styles.menuItemText}>Importar CSV</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
     

          <Text style={styles.menuItemText}>Importe o extrato do seu banco do dia a dia para que as transações sejam preenchidas automaticamente!</Text>
          <Text style={styles.menuItemText}>- O arquivo precisa ser do formato CSV</Text>
          <Text style={styles.menuItemText}>- Atualmente suportamos o extrato da Nubank</Text>
          <Text style={styles.menuItemText}>- Nós não armazenamos o seu arquivo!</Text>  
            <ImportarCsvComponente />
            <TouchableOpacity style={styles.btnCriar} onPress={toggleModal}>
              <Text style={styles.criarOrcamento}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      


      <TouchableOpacity style={styles.menuItem} onPress={toggleCurrencyModal}>
        <Image
          source={require("../../../assets/coinConf.png")}
          style={styles.icon}
        />
        <Text style={styles.menuItemText}>Conversor de Moeda</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCurrencyModalVisible}
        onRequestClose={toggleCurrencyModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ConversorMoeda />
            <TouchableOpacity style={styles.buttonClose} onPress={toggleCurrencyModal}>
              <Text style={styles.textStyle}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ChangePassword/>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "gray",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  criarOrcamento: {
    color: "#0fec32",
    fontSize: 18,
    fontWeight: "bold",
  },
  btnCriar: {
    borderWidth: 2,
    borderColor: "#0fec32",
    borderRadius: 10,
    padding: 6,
    marginBottom: -20,
  },
});

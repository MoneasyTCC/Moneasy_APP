import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import NavigationBar from "../menuNavegation";
import ImportarCsvComponente from "../../../Components/documentPicker";
import ConversorMoeda from "../../../Components/ConverterMoedas";
import ChangePassword from "../../../Components/alterarSenha";
import LogoutComponent from "../../../Components/sair";

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
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);

  const toggleCurrencyModal = () => {
    setCurrencyModalVisible(!isCurrencyModalVisible);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleChangePasswordModal = () => {
    setChangePasswordModalVisible(!isChangePasswordModalVisible);
  };
  return (
    <View style={styles.container}>
      <View style={styles.menuHeader}>
        <Text style={styles.headerText}>Mais opções</Text>
        <LogoutComponent />
      </View>
      <View style={styles.menuBody}>
        {/* A implementar */}
      
        <TouchableOpacity style={styles.menuItem} onPress={toggleModal}>
          <Image
            source={require("../../../assets/more/csv.png")}
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
              <Text style={styles.modalTitle}>Importar extrato</Text>
              <Text style={[styles.modalText, styles.centered]}>
                Importe o extrato do seu banco do dia a dia para que as
                transações sejam preenchidas automaticamente!
              </Text>
              <View>
                <Text style={styles.modalText}>
                  - O arquivo precisa estar no formato CSV
                </Text>
                <Text style={styles.modalText}>
                  - Atualmente suportamos o extrato da Nubank.
                </Text>
                <Text style={styles.modalText}>
                  - Nós não armazenamos o seu arquivo!
                </Text>
              </View>
              <View>
                <ImportarCsvComponente />
                <TouchableOpacity style={styles.btnClose}>
                  <Text onPress={toggleModal} style={styles.textBtnClose}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.menuItem} onPress={toggleCurrencyModal}>
          <Image
            source={require("../../../assets/more/coinConf.png")}
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
              {/* <TouchableOpacity
                style={styles.btnClose}
                onPress={toggleCurrencyModal}
              >
                <Text style={styles.textBtnClose}>Cancelar</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={toggleChangePasswordModal}
        >
          <Text style={styles.menuItemText}>Alterar Senha</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isChangePasswordModalVisible}
          onRequestClose={toggleChangePasswordModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}> 
              <View></View>
              <Text style={styles.modalTitle}>Alterar a senha</Text>
              <ChangePassword />
              {/* <TouchableOpacity
                style={styles.btnClose}
                onPress={toggleChangePasswordModal}
              >
                <Text style={styles.textBtnClose}>Cancelar</Text>
              </TouchableOpacity>   */}
            </View>
          </View>
        </Modal>
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
    justifyContent: "space-between",
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
    marginLeft: 10,
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
  //*Modal
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    justifyContent: "space-around",
    margin: 20,
    backgroundColor: "#2B2B2B",
    height: "60%",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  centered: {
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  btnCriar: {
    borderWidth: 2,
    borderColor: "#0fec32",
    borderRadius: 10,
    padding: 6,
    marginBottom: -20,
  },
  btnClose: {
    marginTop: -10,
    alignItems: "center",
  },
  textBtnClose: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
  criarOrcamento: {
    color: "#0fec32",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  //*Modal
});

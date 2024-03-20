import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Image, Modal, TextInput, Alert, SafeAreaView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import { Shadow } from "react-native-shadow-2";
import { adicionarNovaMeta } from '../../../services/testeBanco';
import { adicionarNovaTransacao } from '../../../services/testeBanco';
import DatePicker from "react-native-datepicker";
import { Transacao } from "../../../Model/Transacao";
import { TransacaoDAL } from "../../../Repo/RepositorioTransacao";
import NavigationBar from "../menuNavegation";
import ListaDeTransacoes from "../../../Components/listaTransacao";
import DropDownPicker from "react-native-dropdown-picker";

type TransacaoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Transacao"
>;

type Props = {
  navigation: TransacaoScreenNavigationProp;
};


// Use as props na definição do seu componente
export default function TransacaoScreen({ navigation }: Props) {

  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [openDropdown, setOpenDropdown] = useState(false);
  const [items, setItems] = useState([
    { label: "Janeiro", value: "1" },
    { label: "Fevereiro", value: "2" },
    { label: "Março", value: "3" },
    { label: "Abril", value: "4" },
    { label: "Maio", value: "5" },
    { label: "Junho", value: "6" },
    { label: "Julio", value: "7" },
    { label: "Agosto", value: "8" },
    { label: "Setembro", value: "9" },
    { label: "Outubro", value: "10" },
    { label: "Novembro", value: "11" },
    { label: "Dezembro", value: "12" },
  ]);
  const getCurrentMonth = () => {
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    const currentDate = new Date();
    return monthNames[currentDate.getMonth()];
  };
  const [dropdownValue, setdropdownValue] = useState(getCurrentMonth());
  const converterDataParaFirebase = () => {
    let mes = dropdownValue;
    const dataFirebase = new Date(
      `2024-${mes}-${new Date().getDate()}T${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}Z`
    );
    console.log(dataFirebase);
    setDataSelecionada(dataFirebase);
    return dataFirebase;
  };
  return (
    <View style={styles.container}>
   
    <View style={styles.container}>
    <View style={styles.menuHeader}>
        <DropDownPicker
          open={openDropdown}
          value={dropdownValue}
          placeholder={getCurrentMonth()}
          items={items}
          setOpen={setOpenDropdown}
          setValue={setdropdownValue}
          setItems={setItems}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={{ color: "#ffffff" }}
          onChangeValue={converterDataParaFirebase}
        />
    </View>
    <View style={styles.menuBody}>
      
      <View style={styles.content}>
      <ListaDeTransacoes dataSelecionada={dataSelecionada} />

      </View>

    </View>
    <View style={styles.menuFooter}>      
      <NavigationBar></NavigationBar>
    </View>
  </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2B2B2B",
  },
  menuHeader: {
    overflow: "scroll",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    flexDirection: "column",
    alignItems:"center",
    justifyContent: 'center',
    width: "100%",
    height: "20%",
    backgroundColor: "#3A3E3A",
  },
  menuBody: {
    width: "100%",
    flex: 1, // Use o restante do espaço
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20, // Adiciona um espaçamento interno vertical
  },
  content: {
    borderRadius: 20, // Ajuste o raio da borda conforme necessário
    width: "90%", // Ajuste a largura conforme necessário
    flex: 1, // Use o restante do espaço
    backgroundColor: "#3A3E3A",
    padding: 20, // Adiciona um espaçamento interno
  },
  menuFooter: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: "row", // Altera para row para disposição horizontal dos ícones
    alignItems: "center",
    justifyContent: "space-around", // Espaço entre os ícones
    width: "100%",
    height: "15%", // Ajuste a altura conforme necessário
    backgroundColor: "#3A3E3A",
  },
  dropdown: {
    backgroundColor:"transparent",
    alignSelf:"center",
    borderWidth: 0,
    width: "30%",
  },
  dropdownContainer: {
    backgroundColor:"transparent",
    borderWidth: 0,
    alignSelf:"center",
    width: "30%", 
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  }, 
});


/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2B2B2B",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#2B2B2B", 
  },
  menuHeader: {
    flex: 0.35,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "20%",
    backgroundColor: "#2B2B2B",
  },
  menuBody: {
    flex: 0.5,
    width: "100%",
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
    flex: 0.15,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "15%",
    backgroundColor: "#3A3E3A",
  },
}); */



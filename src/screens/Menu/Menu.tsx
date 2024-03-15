import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Image, Modal, TextInput, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import { Shadow } from "react-native-shadow-2";
import { adicionarNovaMeta } from '../../../services/testeBanco';
import { adicionarNovaTransacao } from '../../../services/testeBanco';
import DatePicker from "react-native-datepicker";
import { Transacao } from "../../../Model/Transacao";
import { TransacaoDAL } from "../../../Repo/RepositorioTransacao";
import NavigationBar from "../menuNavegation";

type MenuScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Menu"
>;

type Props = {
  navigation: MenuScreenNavigationProp;
};


// Use as props na definição do seu componente
export default function MenuScreen({ navigation }: Props) {

  var [isModalVisible, setModalVisible] = useState(false);
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date());
  const [descricao, setDescricao] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const novosDados: Transacao = {
    id:"",
    usuarioId: "",
    tipo:"entrada",
    valor: parseFloat(valor),
    data:(data),
    descricao:(descricao),
    moeda:"BRL"
  };
  const handleTransacao = async () => {
    try{
      TransacaoDAL.adicionarTransacao(novosDados)
      Alert.alert("Transação adicionada com Sucesso!");

    }
    catch(err){
    Alert.alert("Erro ao adicionar transação");
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.menuHeader}>
      <Button title="Sair" onPress={() => navigation.replace("Inicio")} />
      <Button title="Adicionar Transação" onPress={toggleModal} />

<Modal visible={isModalVisible}>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <TextInput
      placeholder="Valor"
      keyboardType="numeric"
      value={valor}
      onChangeText={setValor}
    />
    <DatePicker
      style={{ width: 200 }}
      date={data}
      mode="date"
      placeholder="Selecione a data"
      format="YYYY-MM-DD"
      confirmBtnText="Confirmar"
      cancelBtnText="Cancelar"
      customStyles={{
        dateIcon: {
          position: 'absolute',
          left: 0,
          top: 4,
          marginLeft: 0,
        },
        dateInput: {
          marginLeft: 36,
        },
      }}
      onDateChange={(dateStr, date) => setData(new Date(dateStr))}
    />
    <TextInput
      placeholder="Descrição"
      value={descricao}
      onChangeText={setDescricao}
    />
    <Button title="Adicionar" onPress={handleTransacao} />
    <Button title="Cancelar" onPress={toggleModal} />
  </View>
</Modal>
    </View>
    <View style={styles.menuBody}>
      <View style={styles.content}></View>
    </View>
    <View style={styles.menuFooter}>      
      <NavigationBar/>
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
  }
});



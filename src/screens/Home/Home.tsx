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
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import { Shadow } from "react-native-shadow-2";
import { adicionarNovaMeta } from "../../../services/testeBanco";
import { adicionarNovaTransacao } from "../../../services/testeBanco";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Transacao } from "../../../Model/Transacao";
import { TransacaoDAL } from "../../../Repo/RepositorioTransacao";
import RNDateTimePicker from "@react-native-community/datetimepicker";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

type DateTimePickerMode = "date" | "time" | "datetime";

// Use as props na definição do seu componente
export default function HomeScreen({ navigation }: Props) {
  var [isModalVisible, setModalVisible] = useState(false);
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date());
  const [modo, setModo] = useState<DateTimePickerMode | undefined>(undefined);
  const [show, setShow] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const novosDados: Transacao = {
    id: "",
    usuarioId: "",
    tipo: "entrada",
    valor: parseFloat(valor),
    data: data,
    descricao: descricao,
    moeda: "BRL",
  };
  const handleTransacao = async () => {
    try {
      TransacaoDAL.adicionarTransacao(novosDados);
      Alert.alert("Transação adicionada com Sucesso!");
    } catch (err) {
      Alert.alert("Erro ao adicionar transação");
    }
  };

  const onChange = (
    evento: DateTimePickerEvent,
    dataSelecionada?: Date | undefined
  ) => {
    if (evento.type === "set" && dataSelecionada) {
      const dataAtual = dataSelecionada || data;
      setShow(Platform.OS === "ios");
      setData(dataAtual);

      let tempData = new Date(dataAtual);
      let fData =
        tempData.getDate() +
        "/" +
        (tempData.getMonth() + 1) +
        "/" +
        tempData.getFullYear();
      console.log(fData);
    }
  };

  const showMode = (modoAtual: DateTimePickerMode) => {
    setShow(true);
    setModo(modoAtual);
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuHeader}>
        <Button title="Sair" onPress={() => navigation.replace("Inicio")} />
        <Button title="Adicionar Transação" onPress={toggleModal} />

        <Modal visible={isModalVisible}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TextInput
              placeholder="Valor"
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
            />
            <Button
              title="datepicker"
              onPress={() => showMode("date")}
            ></Button>
            <TextInput
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
            />
            <Button title="Adicionar" onPress={handleTransacao} />
            <Button title="Cancelar" onPress={toggleModal} />

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={data}
                mode={modo}
                is24Hour={true}
                display="default"
                onChange={onChange}
                {...(Platform.OS === "android" && { is24Hour: true })}
              />
            )}
          </View>
        </Modal>
      </View>
      <View style={styles.menuBody}>
        <View style={styles.content}></View>
      </View>
      <View style={styles.menuFooter}>
        <View style={styles.menuNavegation}>
          <Text></Text>
          <Image
            style={styles.img}
            source={require("../../../assets/menu/homeActive.png")}
          />
          <Image
            style={styles.img}
            source={require("../../../assets/menu/menu.png")}
          />
          <Image
            style={styles.img}
            source={require("../../../assets/menu/transactions.png")}
          />
          <Image
            style={styles.img}
            source={require("../../../assets/menu/more.png")}
          />
          <Text></Text>
        </View>
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

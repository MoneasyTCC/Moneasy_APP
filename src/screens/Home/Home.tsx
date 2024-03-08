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
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Transacao } from "../../../Model/Transacao";
import { TransacaoDAL } from "../../../Repo/RepositorioTransacao";
import { calcularSaldo } from "../../../Controller/TransacaoController";
import RNPickerSelect from 'react-native-picker-select';
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
  const [tipoTransacao, setTipoTransacao] = useState("");

  //felipe
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth().toString());
  const [saldo, setSaldo] = useState({ totalEntradas: 0, totalSaidas: 0, saldo: 0 });
  const [showPicker, setShowPicker] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const novosDados: Transacao = {
    id: "",
    usuarioId: "",
    tipo: tipoTransacao,
    valor: parseFloat(valor),
    data: data,
    descricao: descricao,
    moeda: "BRL",
  };
  const handleTransacao = async () => {
    try {
      TransacaoDAL.adicionarTransacao(novosDados);
      setTipoTransacao("");
      Alert.alert("Transação adicionada com Sucesso!");
    } catch (err) {
      Alert.alert("Erro ao adicionar transação");
    }
  };
  const atualizarSaldoComMesSelecionado = async (mes: any) => {
    const anoAtual = new Date().getFullYear();
    const dataSelecionada = new Date(anoAtual, parseInt(mes+1), 1);
  
    try {
      const resultadoSaldo = await calcularSaldo(dataSelecionada);
      setSaldo(resultadoSaldo);
    } catch (error) {
      console.error("Não foi possível atualizar o saldo: ", error);
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

  const handleTipoTransacaoEntrada = () => {
    setTipoTransacao("entrada");
    toggleModal();
  };

  const handleTipoTransacaoSaida = () => {
    setTipoTransacao("saida");
    toggleModal();
  };

  const handleCancelarTransacao = () => {
    setTipoTransacao("");
    toggleModal();
  };

  return (
    
    <View style={styles.container}>
      
      <View style={styles.menuHeader}>
      <View >
      <Text>R$ {saldo.saldo.toFixed(2)}</Text> 
    </View>
 
        <Button title="Sair" onPress={() => navigation.replace("Inicio")} />
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.entradaBtn}
            onPress={handleTipoTransacaoEntrada}
          >
            <Text style={{ fontSize: 50, textAlign: "center", lineHeight: 55 }}>
              +
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saidaBtn}
            onPress={handleTipoTransacaoSaida}
          >
            <Text style={{ fontSize: 50, textAlign: "center", lineHeight: 55 }}>
              -
            </Text>
          </TouchableOpacity>
        </View>

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
            <Button title="Cancelar" onPress={handleCancelarTransacao} />

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

        <RNPickerSelect
      onValueChange={(mes) => {
        setMesSelecionado(mes);
        console.log(mes);
        atualizarSaldoComMesSelecionado(mes);
      }}
      items={[
        { label: 'Janeiro', value: '0' },
        { label: 'Fevereiro', value: '1' },
        { label: 'Março', value: '2' },
        { label: 'Abril', value: '3' },
        { label: 'Maio', value: '4' },
        { label: 'Junho', value: '5' },
        { label: 'Julho', value: '6' },
        { label: 'Agosto', value: '7' },
        { label: 'Setembro', value: '8' },
        { label: 'Outubro', value: '9' },
        { label: 'Novembro', value: '10' },
        { label: 'Dezembro', value: '11' },
      ]}
      placeholder={{ label: "Selecione o mês...", value: null }}
    />

    <Text >Saldo: R$ {saldo.saldo.toFixed(2)}</Text>
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
  entradaBtn: {
    width: 50,
    height: 50,
    backgroundColor: "#17fc3d",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  saidaBtn: {
    width: 50,
    height: 50,
    backgroundColor: "#ff0f00",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    gap: 30,
  },
});

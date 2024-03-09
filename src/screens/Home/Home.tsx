import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, Modal, TextInput, Alert, FlatList, FlatListProps, useRef } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../shared/config";
import { Shadow } from "react-native-shadow-2";
import { adicionarNovaMeta } from '../../../services/testeBanco';
import { adicionarNovaTransacao } from '../../../services/testeBanco';
import DatePicker from "react-native-datepicker";
import { Transacao } from "../../../Model/Transacao";
import { TransacaoDAL } from "../../../Repo/RepositorioTransacao";
import { exibirTransacoesNaTela } from "../../../Controller/TransacaoController";


type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};


// Use as props na definição do seu componente
export default function HomeScreen({ navigation }: Props) {

  var [isModalVisible, setModalVisible] = useState(false);
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date());
  const [descricao, setDescricao] = useState('');
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);


    useEffect(() => {
            async function fetchTransacoes() {
              try {
                const transacoesData = await TransacaoDAL.buscarTransacoes();
                setTransacoes(transacoesData);
              } catch (error) {
                console.error("Erro ao buscar transações:", error.message);
              }
            }
            fetchTransacoes();
            }, []);

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
    try {
      const valorFloat = isNaN(parseFloat(valor)) ? 0 : parseFloat(valor); // Validação adicionada aqui
      const novosDados: Transacao = {
        id: "",
        usuarioId: "",
        tipo: "entrada",
        valor: valorFloat,
        data: data,
        descricao: descricao,
        moeda: "BRL"
      };
      await TransacaoDAL.adicionarTransacao(novosDados);
      Alert.alert("Transação adicionada com Sucesso!");
    } catch (err) {
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
    <FlatList
            data={transacoes}
            renderItem={({ item }) => (
              <View>
                <Text>{item.descricao}</Text>
                <Text>{item.valor}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
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



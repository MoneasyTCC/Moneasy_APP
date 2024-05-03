import { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "./src/screens/Login/Login";
import HomeScreen from "./src/screens/Home/Home";
import OrcamentoScreen from "./src/screens/Menu/Menu";
import TransacaoScreen from "./src/screens/Transacoes/Transacoes";
import MetasScreen from "./src/screens/Metas/Metas";
import MoreScreen from "./src/screens/More/More";
import CriarConta from "./src/screens/Login/CriarConta";
import InicioScreen from "./src/screens/Login/Inicio";
import RedefineSenhaScreen from "./src/screens/Login/RedefineSenha";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Stack = createNativeStackNavigator();

function AppRoutes() {
  // const [initialRoute, setInitialRoute] = useState('Inicio'); // Estado inicial definido para 'Inicio'

  // useEffect(() => {
  //   const checkUserStatus = async () => {
  //     const auth = getAuth();
  //     onAuthStateChanged(auth, async (user:any) => {
  //       if (user) {
  //         // Usuário está logado
  //         setInitialRoute('Home');
  //       } else {
  //         // Usuário não está logado ou a sessão expirou
  //         const token = await AsyncStorage.getItem('@login_token');
  //         if (token) {
  //           // Aqui você pode tentar reautenticar o usuário com o refreshToken
  //           // Esta parte depende de como você gerencia a autenticação com tokens no Firebase
  //         }
  //         setInitialRoute('Inicio');
  //       }
  //     });
  //   };

  //   checkUserStatus();
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen
          name="Inicio"
          component={InicioScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CriarConta"
          component={CriarConta}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RedefineSenha"
          component={RedefineSenhaScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Orcamento"
          component={OrcamentoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Transacao"
          component={TransacaoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Metas"
          component={MetasScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="More"
          component={MoreScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "./src/screens/Login/Login";
import HomeScreen from "./src/screens/Home/Home";
import MenuScreen from "./src/screens/Menu/Menu";
import TransacaoScreen from "./src/screens/Menu/Menu";
import MetasScreen from "./src/screens/Menu/Menu";
import MoreScreen from "./src/screens/Menu/Menu";
import CriarConta from "./src/screens/Login/CriarConta";
import InicioScreen from "./src/screens/Login/Inicio";
import RedefineSenhaScreen from "./src/screens/Login/RedefineSenha";

const Stack = createNativeStackNavigator();

function AppRoutes() {
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
          name="Menu"
          component={MenuScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={TransacaoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={MetasScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={MoreScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;

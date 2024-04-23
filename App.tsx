import React from "react";
import AppRoutes from "./AppRoutes";
import { SincronizaData } from "./Components/SincronizaData"; // Importe o componente SincronizaData
import { AppRegistry } from "react-native";

AppRegistry.registerComponent('APP_Financeiro', () => App);

export default function App() {
  return (
    <SincronizaData>
      <AppRoutes />
    </SincronizaData>
  );
}
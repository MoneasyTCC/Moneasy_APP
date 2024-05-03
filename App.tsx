import React from "react";
import AppRoutes from "./AppRoutes";
import DataProvider from "./Contexts/DataContext";
import { AppRegistry } from "react-native";

AppRegistry.registerComponent("APP_Financeiro", () => App);

export default function App() {
  return (
    <DataProvider>
      <AppRoutes />
    </DataProvider>
  );
}


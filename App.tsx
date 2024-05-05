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

// const initializeApp = async () => {
//   try {
//     const isAuthenticated = await checkAndReauthenticate();
//     if (isAuthenticated) {
//       // O usuário foi reautenticado com sucesso
//       // Navegue para a tela principal do aplicativo
//     } else {
//       // O usuário não está autenticado ou o token de atualização expirou
//       // Navegue para a tela de login
//     }
//   } catch (error) {
//     console.error('Erro ao inicializar o aplicativo:', error);
//   }
// };

// initializeApp();
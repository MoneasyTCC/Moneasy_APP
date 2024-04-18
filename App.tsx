import React from "react";
import AppRoutes from "./AppRoutes";
import { SincronizaData } from "./Components/SincronizaData"; // Importe o componente SincronizaData


export default function App() {
  return (
    <SincronizaData>
      <AppRoutes />
    </SincronizaData>
  );
}
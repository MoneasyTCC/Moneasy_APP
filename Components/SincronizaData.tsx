import React, { useState } from 'react';

const AppContext = React.createContext();

export const useAppContext = () => {
  const context = React.useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }

  // Verifica se dataSelecionada está definida, caso contrário, retorna a data atual
  const dataAtual = new Date();
  const dataSelecionada = context.dataSelecionada || dataAtual;

  return {
    ...context,
    dataSelecionada,
  };
};

export const SincronizaData = ({ children }) => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const contextValue = {
    dataSelecionada,
    setDataSelecionada,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppContext;

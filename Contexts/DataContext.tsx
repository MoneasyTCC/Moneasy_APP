import React, { createContext, useState } from "react";

export const DataContext = createContext({});

interface DataContextProps {
  children: React.ReactNode;
}

export const DataProvider = ({ children }: DataContextProps) => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const contextValue = {
    dataSelecionada,
    setDataSelecionada,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

export default DataProvider;

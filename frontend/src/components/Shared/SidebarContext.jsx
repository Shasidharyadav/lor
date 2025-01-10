import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false); // Default state

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;

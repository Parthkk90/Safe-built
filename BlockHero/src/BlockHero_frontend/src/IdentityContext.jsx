import React, { createContext, useContext, useState } from 'react';

// Context 생성
const IdentityContext = createContext();

// Provider 컴포넌트
export function IdentityProvider({ children }) {
  const [identity, setIdentity] = useState('');
  const [isIdentityLogin, setIsIdentityLogin] = useState(false);

  const updateIdentity = (newIdentity) => {
    setIdentity(newIdentity);
    setIsIdentityLogin(!!newIdentity);
  };

  return (
    <IdentityContext.Provider value={{ identity, isIdentityLogin, updateIdentity }}>
      {children}
    </IdentityContext.Provider>
  );
}

// Custom Hook
export function useIdentity() {
  const context = useContext(IdentityContext);
  if (!context) {
    throw new Error('useIdentity must be used within an IdentityProvider');
  }
  return context;
}

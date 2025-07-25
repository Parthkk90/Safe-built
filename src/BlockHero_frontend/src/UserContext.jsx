import React, { createContext, useContext, useState } from 'react';

// Context 생성
const UserContext = createContext();

// Provider 컴포넌트
export function UserProvider({ children }) {
  const [userId, setUserId] = useState('');
  const [isUserLogin, setIsUserLogin] = useState(false);

  const updateUserId = (newUserId) => {
    setUserId(newUserId);
    setIsUserLogin(!!newUserId);
  };

  return (
    <UserContext.Provider value={{ userId, isUserLogin, updateUserId }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom Hook
export function useUserId() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserId must be used within an UserContextProvider');
  }
  return context;
}

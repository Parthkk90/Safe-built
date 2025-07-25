import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home'; // 메인 페이지 컴포넌트
import Page from './Page'; // 로그 확인 페이지
import { useUserId } from './UserContext';


function App() {
    // const [users, setUsers] = useState({});
    // const [currentUser, setCurrentUser] = useState(null);
    const [logs, setLogs] = useState([]); // 로그 기록 상태 추가
    const {userId, isUserLogin, updateUserId} = useUserId();

    // const handleRegister = (id, pw) => {
    //     setUsers((prevUsers) => ({ ...prevUsers, [id]: pw }));
    // };

    // const handleLogin = (id, pw) => {
    //     if (users[id] === pw) {
    //         setCurrentUser(id);
    //         return true;
    //     }
    //     return false;
    // };

    const handleLogout = () => {
        updateUserId('');
    };

    const addLog = (fileName, action) => {
        const newLog = {
            user: userId,
            fileName,
            action,
            timestamp: new Date().toLocaleString(),
        };
        setLogs((prevLogs) => [...prevLogs, newLog]);
    };

    return (
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route
            path="/"
            element={!!userId ? <Home onLogout={handleLogout} addLog={addLog} /> : <Navigate to="/login" />}
        />
        <Route
            path="/page"
            element={!!userId ? <Page logs={logs} /> : <Navigate to="/login" />}
        />
      </Routes>
    );
}

export default App;

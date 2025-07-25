import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (onLogin(id, pw)) {
            navigate('/');
        } else {
            alert("잘못된 ID 또는 PW입니다.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h2 style={styles.title}>Login</h2>
                <input
                    type="text"
                    placeholder="ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleLogin} style={styles.button}>
                    Login
                </button>
                <button onClick={() => navigate('/register')} style={{ ...styles.button, backgroundColor: '#6c757d' }}>
                    Register
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
    },
    loginBox: {
        width: '300px',
        padding: '40px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
    },
    title: {
        marginBottom: '24px',
        fontSize: '24px',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '16px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        fontSize: '16px',
    },
    button: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '8px',
    },
};

export default Login;

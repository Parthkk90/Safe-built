import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from './IdentityContext';
import { useUserId } from './UserContext';
import { AuthClient } from '@dfinity/auth-client';
import { login } from './api';
import { Principal } from "@dfinity/principal";
import { motion } from 'framer-motion';
import {
  Briefcase, Calendar, ClipboardList, User, FileText,
  Building2, Laptop2, NotebookPen, Folder, Contact2, Coffee
} from 'lucide-react';

function Login() {
  const { identity, isIdentityLogin, updateIdentity } = useIdentity();
  const { userId, isUserLogin, updateUserId } = useUserId();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  async function authenticate() {
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        updateIdentity(identity.getPrincipal().toString());
      },
    });
  }

  const handleLogin = async () => {
    const identityPrincipal = typeof identity === "string" ? Principal.fromText(identity) : identity;
    if (await login(identityPrincipal, id, pw)) {
      updateUserId(id);
      navigate('/');
    } else {
      alert("Incorrect ID or Password.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 overflow-hidden">
      <IconGrid />

      <motion.div
        className="relative z-10 w-full max-w-4xl p-10 rounded-2xl bg-white/70 backdrop-blur-md border border-white/30 shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-8">
          <motion.h1
            className="text-3xl font-extrabold text-center text-blue-800 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            BlockHero: Decentralized File Management System
          </motion.h1>
          <motion.p
            className="text-sm text-center text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Built on the Internet Computer, BlockHero provides secure, trustless file storage with identity-based authentication and role-based access control.
          </motion.p>
        </div>

        {isIdentityLogin ? (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <motion.div
                  className="mb-6 text-sm text-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p>Identity: <span className="font-medium">{identity}</span></p>
                  <p>User ID: <span className="font-medium">{userId}</span></p>
                  <p>Logged In: <span className="font-medium">{isUserLogin.toString()}</span></p>
                </motion.div>
                <motion.h2 className="text-xl font-bold mb-4 text-gray-800">Welcome Back</motion.h2>
                <motion.input
                  type="text"
                  placeholder="Enter ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  variants={fadeIn}
                />
                <motion.input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  variants={fadeIn}
                />
                <motion.button
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
                  onClick={handleLogin}
                  variants={fadeIn}
                >
                  Login
                </motion.button>
                <motion.button
                  className="w-full py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition"
                  onClick={() => navigate('/register')}
                  variants={fadeIn}
                >
                  Register
                </motion.button>
              </div>

              <motion.div
                className="text-sm text-gray-800 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Why BlockHero?</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Trustless Storage:</strong> Files stored on-chain with cryptographic security</li>
                  <li><strong>Role-Based Access:</strong> Authority levels from 0–255 for fine-grained control</li>
                  <li><strong>Immutable Logs:</strong> Blockchain-based audit trail of file activity</li>
                  <li><strong>IC Identity:</strong> Secure login using Internet Computer’s identity layer</li>
                </ul>
              </motion.div>
            </div>
          </>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img src="/logo2.svg" alt="DFINITY Logo" className="h-20" />
            <motion.button
              onClick={authenticate}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Login with Internet Identity
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function IconGrid() {
  const icons = [
    Briefcase, Calendar, ClipboardList, User, FileText, Building2,
    Laptop2, NotebookPen, Folder, Contact2, Coffee
  ];
  const positions = Array.from({ length: 60 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5
  }));
  return (
    <>
      {positions.map(({ top, left, delay }, i) => {
        const Icon = icons[i % icons.length];
        return (
          <motion.div
            key={i}
            className="absolute text-blue-400 opacity-30"
            style={{ top, left }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.3, y: [10, -10, 10] }}
            transition={{ repeat: Infinity, duration: 8 + (i % 5), ease: 'easeInOut', delay }}
          >
            <Icon size={32} />
          </motion.div>
        );
      })}
    </>
  );
}

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from './IdentityContext';
import { registerUser } from './api';
import { Principal } from "@dfinity/principal";
import { motion } from 'framer-motion';
import {
  Briefcase, Calendar, ClipboardList, User, FileText,
  Building2, Laptop2, NotebookPen, Folder, Contact2, Coffee
} from 'lucide-react';

function Register() {
  const { identity, isIdentityLogin } = useIdentity();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [authority, setAuthority] = useState(0);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (id && pw) {
      const identityPrincipal = typeof identity === "string" ? Principal.fromText(identity) : identity;
      const authorityNat8 = Number(authority);
      if (authorityNat8 < 0 || authorityNat8 > 255) {
        alert("Authority must be between 0 and 255.");
        return;
      }
      await registerUser(identityPrincipal, id, pw, authorityNat8);
      alert("Registration successful!");
      navigate('/login');
    } else {
      alert("Please enter both ID and Password.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 overflow-hidden">
      <IconGrid />
      <motion.div
        className="relative z-10 w-full max-w-md p-10 rounded-2xl bg-white/70 backdrop-blur-md border border-white/30 shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Register</h2>
        {isIdentityLogin ? (
          <>
            <p className="text-sm text-gray-700 mb-4">Identity: <span className="font-medium">{identity}</span></p>
            <input
              type="text"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Authority (0-255)"
              value={authority}
              onChange={(e) => setAuthority(e.target.value)}
              min={0}
              max={255}
              step={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRegister}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
            >
              Register
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Back to Login
            </button>
          </>
        ) : (
          <p className="text-center text-gray-700">Please log in with Internet Identity to register.</p>
        )}
      </motion.div>
    </div>
  );
}

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

export default Register;
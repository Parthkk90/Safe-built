import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from './IdentityContext';
import { registerUser } from './api';
import { Principal } from "@dfinity/principal";
import { motion } from 'framer-motion';

function Register() {
    const { identity, isIdentityLogin } = useIdentity();
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [authority, setAuthority] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!id || !pw) {
            alert("Please fill in all fields");
            return;
        }

        if (pw !== confirmPw) {
            alert("Passwords do not match");
            return;
        }

        if (authority < 0 || authority > 255) {
            alert("Authority level must be between 0 and 255");
            return;
        }

        setIsLoading(true);
        try {
            const identityPrincipal = typeof identity === "string" ? Principal.fromText(identity) : identity;
            await registerUser(identityPrincipal, id, pw, authority);
            alert("Account created successfully!");
            navigate('/login');
        } catch (error) {
            alert("Registration failed: " + error.message);
        }
        setIsLoading(false);
    };

    if (!isIdentityLogin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl text-center"
                >
                    <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Identity Required</h2>
                    <p className="text-slate-400 mb-6">Please connect your identity first to register</p>
                    <motion.button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Go to Login
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <motion.div 
                    className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-slate-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-slate-400 text-sm mb-1">Identity Connected</p>
                        <p className="text-xs text-slate-500 font-mono bg-slate-900/50 p-2 rounded-lg break-all">
                            {identity?.toString().substring(0, 30)}...
                        </p>
                    </div>

                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="block text-slate-300 text-sm font-medium mb-2">User ID</label>
                            <input
                                type="text"
                                placeholder="Choose a unique ID"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="Create a strong password"
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-slate-300 text-sm font-medium mb-2">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPw}
                                onChange={(e) => setConfirmPw(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Authority Level 
                                <span className="text-slate-500 text-xs ml-2">(0 = Highest, 255 = Lowest)</span>
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={authority}
                                onChange={(e) => setAuthority(Number(e.target.value))}
                                className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                min="0"
                                max="255"
                            />
                        </motion.div>

                        <motion.div 
                            className="space-y-3 pt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.button
                                onClick={handleRegister}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </motion.button>

                            <motion.button
                                onClick={() => navigate('/login')}
                                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-3 px-6 rounded-xl transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Back to Login
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Register;
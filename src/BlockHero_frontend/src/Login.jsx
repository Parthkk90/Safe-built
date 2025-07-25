import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from './IdentityContext';
import { useUserId } from './UserContext';
import { AuthClient } from '@dfinity/auth-client';
import { login } from './api';
import { Principal } from "@dfinity/principal";
import { motion } from 'framer-motion';

function Login() {
    const { identity, isIdentityLogin, updateIdentity } = useIdentity();
    const {userId, isUserLogin, updateUserId} = useUserId();
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  
    async function authenticate() {
        setIsLoading(true);
        const authClient = await AuthClient.create();
        await authClient.login({
            identityProvider: "https://identity.ic0.app/#authorize",
            onSuccess: async () => {
                const identity = authClient.getIdentity();
                updateIdentity(identity.getPrincipal().toString());
                setIsLoading(false);
            },
        });
    }

    const handleLogin = async () => {
        setIsLoading(true);
        const identityPrincipal = typeof identity === "string" ? Principal.fromText(identity) : identity;

        if (await login(identityPrincipal, id, pw)) {
            updateUserId(id);
            navigate('/');
        } else {
            alert("Invalid ID or Password");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {!isIdentityLogin ? (
                    <motion.div 
                        className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <motion.div 
                            className="text-center mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-slate-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">BlockHero</h1>
                            <p className="text-slate-400">Secure File Management</p>
                        </motion.div>
                        
                        <motion.button
                            onClick={authenticate}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Connecting...
                                </div>
                            ) : (
                                'Connect Identity'
                            )}
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div 
                        className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
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
                                    placeholder="Enter your ID"
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
                                    placeholder="Enter your password"
                                    value={pw}
                                    onChange={(e) => setPw(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                            </motion.div>

                            <motion.div 
                                className="space-y-3 pt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </motion.button>

                                <motion.button
                                    onClick={() => navigate('/register')}
                                    className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-3 px-6 rounded-xl transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Create Account
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default Login;
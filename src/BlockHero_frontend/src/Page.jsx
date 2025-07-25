import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { readLogs } from './api';

function Page({ logs }) {
    const navigate = useNavigate();
    const [backendLogs, setBackendLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('local');

    const fetchBackendLogs = async () => {
        setIsLoading(true);
        try {
            const logs = await readLogs(50, 'recent');
            setBackendLogs(logs);
        } catch (error) {
            console.error('Error fetching backend logs:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'backend') {
            fetchBackendLogs();
        }
    }, [activeTab]);

    const formatBackendLog = (log) => {
        const [timestamp, identity, userHash, fileName, action] = log;
        return {
            user: identity.toString().substring(0, 8) + '...',
            fileName,
            action: action.toLowerCase(),
            timestamp: new Date(parseInt(timestamp) * 1000).toLocaleString()
        };
    };

    const getActionIcon = (action) => {
        if (action === 'uploaded' || action === 'upload') {
            return (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            );
        } else {
            return (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            );
        }
    };

    const getActionColor = (action) => {
        if (action === 'uploaded' || action === 'upload') {
            return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        } else {
            return 'bg-green-500/20 text-green-300 border-green-500/30';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Header */}
            <motion.header 
                className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Activity Logs</h1>
                            <p className="text-slate-400 text-sm">Track all file operations</p>
                        </div>
                    </div>
                    
                    <motion.button
                        onClick={() => navigate('/')}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Home</span>
                    </motion.button>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Tab Navigation */}
                <motion.div 
                    className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        onClick={() => setActiveTab('local')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                            activeTab === 'local' 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                    >
                        Local Logs ({logs.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('backend')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                            activeTab === 'backend' 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                    >
                        Backend Logs ({backendLogs.length})
                    </button>
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'local' && (
                        <motion.div
                            key="local"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8"
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Local Session Logs</h2>
                            </div>

                            {logs.length > 0 ? (
                                <div className="space-y-4">
                                    {logs.map((log, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 hover:bg-slate-900/70 transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded-lg border ${getActionColor(log.action)}`}>
                                                        {getActionIcon(log.action)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">
                                                            <span className="text-blue-400">{log.user}</span> {log.action} 
                                                            <span className="text-slate-300"> "{log.fileName}"</span>
                                                        </p>
                                                        <p className="text-slate-400 text-sm">{log.timestamp}</p>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div 
                                    className="text-center py-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-400 text-lg mb-2">No local activity yet</p>
                                    <p className="text-slate-500 text-sm">Upload or read files to see activity logs here</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'backend' && (
                        <motion.div
                            key="backend"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Backend Logs</h2>
                                </div>
                                
                                <motion.button
                                    onClick={fetchBackendLogs}
                                    disabled={isLoading}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Loading...
                                        </div>
                                    ) : (
                                        'Refresh'
                                    )}
                                </motion.button>
                            </div>

                            {backendLogs.length > 0 ? (
                                <div className="space-y-4">
                                    {backendLogs.map((log, index) => {
                                        const formattedLog = formatBackendLog(log);
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 hover:bg-slate-900/70 transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-2 rounded-lg border ${getActionColor(formattedLog.action)}`}>
                                                            {getActionIcon(formattedLog.action)}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">
                                                                <span className="text-green-400">{formattedLog.user}</span> {formattedLog.action} 
                                                                <span className="text-slate-300"> "{formattedLog.fileName}"</span>
                                                            </p>
                                                            <p className="text-slate-400 text-sm">{formattedLog.timestamp}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(formattedLog.action)}`}>
                                                        {formattedLog.action}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <motion.div 
                                    className="text-center py-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-400 text-lg mb-2">No backend logs found</p>
                                    <p className="text-slate-500 text-sm">Backend logs will appear here when the canister is deployed</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Page;
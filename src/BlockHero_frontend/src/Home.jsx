import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from './IdentityContext';
import { useUserId } from './UserContext';
import { uploadFile, readFile } from './api';
import { Principal } from "@dfinity/principal";
import { motion, AnimatePresence } from 'framer-motion';

function Home({ onLogout, addLog }) {
    const { identity } = useIdentity();
    const { userId } = useUserId();
    const [fileTitle, setFileTitle] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [displayContent, setDisplayContent] = useState('');
    const [readTitle, setReadTitle] = useState('');
    const [fileAuthority, setFileAuthority] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const [activeTab, setActiveTab] = useState('upload');

    const navigate = useNavigate();

    const handleUpload = async () => {
        if (!fileTitle || !fileContent) {
            alert('Please enter both file title and content');
            return;
        }

        setIsUploading(true);
        try {
            await uploadFile(fileTitle, fileContent, fileAuthority);
            addLog(fileTitle, 'uploaded');
            setFileTitle('');
            setFileContent('');
            setFileAuthority(0);
            
            // Success animation feedback
            const successDiv = document.createElement('div');
            successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            successDiv.textContent = 'File uploaded successfully!';
            document.body.appendChild(successDiv);
            setTimeout(() => document.body.removeChild(successDiv), 3000);
        } catch (error) {
            alert('Error uploading file: ' + error.message);
        }
        setIsUploading(false);
    };

    const handleRead = async () => {
        if (!readTitle) {
            alert('Please enter a file title to read');
            return;
        }

        setIsReading(true);
        try {
            const identityPrincipal = typeof identity === "string" ? Principal.fromText(identity) : identity;
            const content = await readFile(readTitle, identityPrincipal);
            if (content) {
                setDisplayContent(content);
                addLog(readTitle, 'read');
            } else {
                setDisplayContent("No file found with that title or insufficient permissions.");
            }
        } catch (error) {
            setDisplayContent("Error reading file: " + error.message);
        }
        setIsReading(false);
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
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-slate-400 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">BlockHero</h1>
                            <p className="text-slate-400 text-sm">Welcome, {userId}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <motion.button
                            onClick={() => navigate('/page')}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span>Logs</span>
                        </motion.button>
                        
                        <motion.button
                            onClick={onLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Logout
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Identity Info */}
                <motion.div 
                    className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-medium">Identity Connected</p>
                            <p className="text-slate-400 text-sm font-mono">{identity?.toString().substring(0, 40)}...</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div 
                    className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                            activeTab === 'upload' 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                    >
                        Upload File
                    </button>
                    <button
                        onClick={() => setActiveTab('read')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                            activeTab === 'read' 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                    >
                        Read File
                    </button>
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8"
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Upload File</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">File Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter file title"
                                        value={fileTitle}
                                        onChange={(e) => setFileTitle(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">File Content</label>
                                    <textarea
                                        placeholder="Enter file content"
                                        value={fileContent}
                                        onChange={(e) => setFileContent(e.target.value)}
                                        rows={6}
                                        className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Authority Level 
                                        <span className="text-slate-500 text-xs ml-2">(0 = Highest access, 255 = Lowest access)</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={fileAuthority}
                                        onChange={(e) => setFileAuthority(Number(e.target.value))}
                                        className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        min="0"
                                        max="255"
                                    />
                                </div>

                                <motion.button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isUploading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Uploading...
                                        </div>
                                    ) : (
                                        'Upload File'
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'read' && (
                        <motion.div
                            key="read"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8"
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Read File</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">File Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter file title to read"
                                        value={readTitle}
                                        onChange={(e) => setReadTitle(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                <motion.button
                                    onClick={handleRead}
                                    disabled={isReading}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isReading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Reading...
                                        </div>
                                    ) : (
                                        'Read File'
                                    )}
                                </motion.button>

                                {displayContent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-slate-900/50 border border-slate-600 rounded-xl p-4"
                                    >
                                        <h3 className="text-slate-300 text-sm font-medium mb-2">File Content:</h3>
                                        <div className="bg-black/30 rounded-lg p-4 text-slate-200 whitespace-pre-wrap font-mono text-sm max-h-64 overflow-y-auto">
                                            {displayContent}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Home;
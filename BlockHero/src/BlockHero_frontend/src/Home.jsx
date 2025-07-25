// Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, Calendar, ClipboardList, User, FileText,
  Building2, Laptop2, NotebookPen, Folder, Contact2, Coffee
} from 'lucide-react';

function Home({ onLogout, addLog }) {
  const [fileTitle, setFileTitle] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [displayContent, setDisplayContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [readTitle, setReadTitle] = useState('');

  const navigate = useNavigate();

  const handleUpload = () => {
    if (fileTitle && fileContent) {
      setUploadedFiles((prevFiles) => ({
        ...prevFiles,
        [fileTitle]: fileContent,
      }));
      addLog('uploaded', fileTitle);
      alert('File has been uploaded.');
      setFileTitle('');
      setFileContent('');
    } else {
      alert('Please enter a file title and content.');
    }
  };

  const handleRead = () => {
    if (uploadedFiles[readTitle]) {
      setDisplayContent(uploadedFiles[readTitle]);
      addLog('read', readTitle);
    } else {
      setDisplayContent("No file found with that title.");
    }
  };

  const goToPage = () => {
    navigate('/page');
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
        <h1 className="text-3xl font-extrabold text-blue-800 text-center mb-6">BlockHero Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold mb-3 text-gray-800">Upload File</h2>
            <input
              type="text"
              placeholder="Enter file title"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
            />
            <input
              type="text"
              placeholder="Enter file content"
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
            />
            <button
              onClick={handleUpload}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Upload File
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-gray-800">Read File</h2>
            <input
              type="text"
              placeholder="Enter file title"
              value={readTitle}
              onChange={(e) => setReadTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
            />
            <button
              onClick={handleRead}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-3"
            >
              Read File
            </button>
            <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded h-20 overflow-y-auto">
              {displayContent || 'Please check the file content.'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={goToPage}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            View Logs
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
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

export default Home;

import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Calendar, ClipboardList, User, FileText,
  Building2, Laptop2, NotebookPen, Folder, Contact2, Coffee
} from 'lucide-react';

function Page({ logs }) {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 overflow-hidden">
      <IconGrid />
      <motion.div
        className="relative z-10 w-full max-w-4xl p-10 rounded-2xl bg-white/70 backdrop-blur-md border border-white/30 shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Log History</h2>
        {logs.length > 0 ? (
          <ul className="space-y-4">
            {logs.map((log, index) => (
              <li
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm text-gray-700"
              >
                <p><strong>{log.user}</strong> has {log.action === 'uploaded' ? 'uploaded' : 'read'} the file <strong>{log.fileName}</strong>.</p>
                <p className="text-gray-500 text-xs mt-1">{log.timestamp}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No logs available.</p>
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

export default Page;

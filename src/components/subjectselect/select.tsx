'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Brain, Book } from 'lucide-react';

interface SubjectPickerProps {
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
}

const subjects = [
  { id: 'science', name: 'Science', icon: <Atom className="w-5 h-5" /> },
  { id: 'math', name: 'Mathematics', icon: <Brain className="w-5 h-5" /> },
  { id: 'literature', name: 'Literature', icon: <Book className="w-5 h-5" /> }
];

export const SubjectPicker: React.FC<SubjectPickerProps> = ({
  selectedSubject,
  setSelectedSubject
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      {/* Use flex for small screens */}
      <div className="flex sm:hidden space-x-4 overflow-x-scroll">
        {subjects.map((subject, index) => (
          <motion.button
            key={subject.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedSubject(subject.id)}
            className={`p-6 min-w-[150px] rounded-xl transition-all duration-300 flex flex-col items-center justify-center space-y-3 border-2 ${
              selectedSubject === subject.id
                ? 'border-blue-500 bg-gray-800'
                : 'border-gray-700 bg-gray-800/50 hover:border-blue-400'
            }`}
          >
            {subject.icon}
            <span>{subject.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Use grid for larger screens */}
      <div className="hidden sm:grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
        {subjects.map((subject, index) => (
          <motion.button
            key={subject.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedSubject(subject.id)}
            className={`p-6 rounded-xl transition-all duration-300 flex flex-col items-center justify-center space-y-3 border-2 ${
              selectedSubject === subject.id
                ? 'border-blue-500 bg-gray-800'
                : 'border-gray-700 bg-gray-800/50 hover:border-blue-400'
            }`}
          >
            {subject.icon}
            <span>{subject.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SubjectPicker;

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { darcula as syntaxTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { res, esp, ard } from '../../code';

const CodeBox = ({ code, language, num, exNam }) => {
  const [buttonText, setButtonText] = useState('Copy');
  const codeRef = useRef(null);
  const timeoutRef = useRef(null);

  if (exNam === 'Raspberry') {
    code = res[num - 1];
  } else if (exNam === 'esp') {
    code = esp[num - 1];
  } else if (exNam === 'ard') {
    code = ard[num - 1];
  }

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(code).then(() => {
        setButtonText('Copied!');
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setButtonText('Copy'), 2000);
      }).catch((err) => {
        console.error('Failed to copy: ', err);
      });
    }
  };

  // Clean timeout on unmount
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="relative w-full max-w-full">
      <button
        onClick={handleCopy}
        className="absolute right-4 top-4 z-10 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white text-sm font-medium px-3 py-1.5 rounded shadow-md transition duration-200"
        aria-label="Copy code to clipboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8M8 12h8m-6-8h6a2 2 0 012 2v12a2 2 0 01-2 2h-6a2 2 0 01-2-2V6a2 2 0 012-2z" />
        </svg>
        <span>{buttonText}</span>
      </button>

      <div
        ref={codeRef}
        className="mt-12 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-lg overflow-auto max-h-[480px] sm:max-h-[380px] md:max-h-[500px]"
        style={{ fontFamily: "'Fira Code', monospace", fontSize: '1rem' }}
      >
        <SyntaxHighlighter
          language={language}
          style={syntaxTheme}
          showLineNumbers={true}
          wrapLongLines={true}
          customStyle={{ margin: 0, padding: '1rem', minHeight: '100%' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBox;

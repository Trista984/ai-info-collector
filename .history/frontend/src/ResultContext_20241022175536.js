// ResultContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ResultContext = createContext();

export const ResultProvider = ({ children }) => {
  const [result, setResult] = useState(() => {
    // 从 localStorage 中初始化数据（如果有的话）
    const storedResult = localStorage.getItem('result');
    return storedResult ? JSON.parse(storedResult) : null;
  });

  // 监听 result 的变化，并同步到 localStorage
  useEffect(() => {
    if (result) {
      localStorage.setItem('result', JSON.stringify(result));
    } else {
      localStorage.removeItem('result');
    }
  }, [result]);

  return (
    <ResultContext.Provider value={{ result, setResult }}>
      {children}
    </ResultContext.Provider>
  );
};

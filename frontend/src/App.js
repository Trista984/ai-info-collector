// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import DetailPage from './DetailPage';
import { ResultProvider } from './ResultContext';

function App() {
  return (
    <ResultProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/detail/:index" element={<DetailPage />} />
        </Routes>
      </Router>
    </ResultProvider>
  );
}

export default App;

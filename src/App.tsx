import React from 'react';
import { BizTutorProvider } from './contexts/BizTutorContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <ThemeProvider>
      <BizTutorProvider>
        <Layout />
      </BizTutorProvider>
    </ThemeProvider>
  );
}

export default App;
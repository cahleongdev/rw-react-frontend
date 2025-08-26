import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import AppRoutes from './routes';
import { Toaster } from '@/components/base/Sonner';

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
      <Toaster />
    </Router>
  );
};

export default App;

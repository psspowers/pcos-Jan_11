import React from 'react';
import AppLayout from '@/ui/AppLayout';
import { AppProvider } from '@/context/AppContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default Index;

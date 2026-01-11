import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

interface PlantData {
  name: string;
  species: 'seedling' | 'herb' | 'flowering' | 'tree';
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  plantData: PlantData;
  setPlantName: (name: string) => void;
}

const defaultPlantData: PlantData = {
  name: 'Your companion',
  species: 'seedling',
};

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  plantData: defaultPlantData,
  setPlantName: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

const PLANT_DATA_KEY = 'pcos_plant_data';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plantData, setPlantData] = useState<PlantData>(() => {
    try {
      const stored = localStorage.getItem(PLANT_DATA_KEY);
      return stored ? JSON.parse(stored) : defaultPlantData;
    } catch {
      return defaultPlantData;
    }
  });

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const setPlantName = (name: string) => {
    const newPlantData = { ...plantData, name };
    setPlantData(newPlantData);
    localStorage.setItem(PLANT_DATA_KEY, JSON.stringify(newPlantData));
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        plantData,
        setPlantName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

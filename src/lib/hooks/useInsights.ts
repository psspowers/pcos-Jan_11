import { useState, useEffect } from 'react';
import { calculatePlantHealth, PlantState } from '../logic/plant';
import { determineInterfaceMode, ThemeState } from '../logic/mode';
import { getAllVelocities, VelocityResult } from '../logic/velocity';

export function usePlantState() {
  const [plantState, setPlantState] = useState<PlantState>({
    phase: 'seed',
    health: 0,
    pulseSpeed: 2.5,
    streak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlantState = async () => {
      const state = await calculatePlantHealth();
      setPlantState(state);
      setLoading(false);
    };

    loadPlantState();
  }, []);

  const refresh = async () => {
    const state = await calculatePlantHealth();
    setPlantState(state);
  };

  return { plantState, loading, refresh };
}

export function useInterfaceMode() {
  const [themeState, setThemeState] = useState<ThemeState>({
    mode: 'steady',
    primaryColor: '#2dd4bf',
    glowColor: 'rgba(45, 212, 191, 0.4)',
    message: 'Begin your wellness journey'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMode = async () => {
      const state = await determineInterfaceMode();
      setThemeState(state);
      setLoading(false);
    };

    loadMode();
  }, []);

  const refresh = async () => {
    const state = await determineInterfaceMode();
    setThemeState(state);
  };

  return { themeState, loading, refresh };
}

export function useVelocities() {
  const [velocities, setVelocities] = useState<Record<string, VelocityResult | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVelocities = async () => {
      const results = await getAllVelocities();
      setVelocities(results);
      setLoading(false);
    };

    loadVelocities();
  }, []);

  const refresh = async () => {
    const results = await getAllVelocities();
    setVelocities(results);
  };

  return { velocities, loading, refresh };
}

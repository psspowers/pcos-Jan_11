export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection';

const HAPTIC_PATTERNS = {
  light: [5],
  medium: [10],
  heavy: [15],
  success: [10, 50, 10],
  error: [10, 50, 10, 50, 10],
  selection: [3],
};

export const triggerHaptic = (pattern: HapticPattern = 'light') => {
  if (!navigator.vibrate) return;

  try {
    const vibrationPattern = HAPTIC_PATTERNS[pattern];
    navigator.vibrate(vibrationPattern);
  } catch (error) {
    console.warn('Haptic feedback not supported');
  }
};

export const useHaptic = () => {
  return {
    light: () => triggerHaptic('light'),
    medium: () => triggerHaptic('medium'),
    heavy: () => triggerHaptic('heavy'),
    success: () => triggerHaptic('success'),
    error: () => triggerHaptic('error'),
    selection: () => triggerHaptic('selection'),
  };
};

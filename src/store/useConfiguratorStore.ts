import { create } from 'zustand';

export type SwitchType = 'red' | 'blue' | 'brown' | 'black';
export type KeycapTheme = 'candykeys' | 'cherrynavy' | 'dreamboard' | 'goodwell' | 'kick' | 'oldschool';

interface ConfiguratorState {
  activeSwitch: SwitchType;
  activeKeycapTheme: KeycapTheme;
  setActiveSwitch: (switchType: SwitchType) => void;
  setActiveKeycapTheme: (theme: KeycapTheme) => void;
  playKeySound: () => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  activeSwitch: 'red',
  activeKeycapTheme: 'kick',
  setActiveSwitch: (switchType) => set({ activeSwitch: switchType }),
  setActiveKeycapTheme: (theme) => set({ activeKeycapTheme: theme }),
  playKeySound: () => {
    const { activeSwitch } = get();
    // Randomize between 1 and 3 for the sound variations (e.g. red-1.mp3, red-2.mp3, red-3.mp3)
    const variation = Math.floor(Math.random() * 3) + 1;
    const soundPath = `/sounds/${activeSwitch}-${variation}.mp3`;
    const audio = new Audio(soundPath);
    audio.play().catch((e) => console.error("Audio play failed:", e));
  }
}));

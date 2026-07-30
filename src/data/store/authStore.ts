import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PIN = 'mobileid.pin';
const KEY_ONBOARDED = 'mobileid.onboarded';
const KEY_BIOMETRIC = 'mobileid.biometric';

interface AuthState {
  hydrated: boolean;
  onboarded: boolean;
  hasPin: boolean;
  biometricEnabled: boolean;
  unlocked: boolean;

  hydrate: () => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  setOnboarded: () => Promise<void>;
  setBiometric: (enabled: boolean) => Promise<void>;
  unlock: () => void;
  lock: () => void;
  reset: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  hydrated: false,
  onboarded: false,
  hasPin: false,
  biometricEnabled: false,
  unlocked: false,

  async hydrate() {
    const [onboarded, biometric] = await Promise.all([
      AsyncStorage.getItem(KEY_ONBOARDED),
      AsyncStorage.getItem(KEY_BIOMETRIC),
    ]);
    let pin: string | null = null;
    try {
      pin = await SecureStore.getItemAsync(KEY_PIN);
    } catch {
      pin = null;
    }
    set({
      hydrated: true,
      onboarded: onboarded === 'true',
      hasPin: !!pin,
      biometricEnabled: biometric === 'true',
    });
  },

  async setPin(pin: string) {
    await SecureStore.setItemAsync(KEY_PIN, pin);
    set({ hasPin: true });
  },

  async verifyPin(pin: string) {
    let saved: string | null = null;
    try {
      saved = await SecureStore.getItemAsync(KEY_PIN);
    } catch {
      saved = null;
    }
    return saved === pin;
  },

  async setOnboarded() {
    await AsyncStorage.setItem(KEY_ONBOARDED, 'true');
    set({ onboarded: true });
  },

  async setBiometric(enabled: boolean) {
    await AsyncStorage.setItem(KEY_BIOMETRIC, enabled ? 'true' : 'false');
    set({ biometricEnabled: enabled });
  },

  unlock() {
    set({ unlocked: true });
  },

  lock() {
    set({ unlocked: false });
  },

  async reset() {
    try {
      await SecureStore.deleteItemAsync(KEY_PIN);
    } catch {

    }
    await AsyncStorage.multiRemove([KEY_ONBOARDED, KEY_BIOMETRIC]);
    set({ onboarded: false, hasPin: false, biometricEnabled: false, unlocked: false });
  },
}));

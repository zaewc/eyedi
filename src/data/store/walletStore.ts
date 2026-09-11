import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MobileId, UsageHistory, vcTypeName } from '@/types';
import { mockUsageHistory, issuedSampleByType } from '@/data/mock/mockData';

const KEY_WALLET = 'mobileid.wallet';
const KEY_HISTORY = 'mobileid.history';

interface WalletState {
  hydrated: boolean;
  ids: MobileId[];
  history: UsageHistory[];

  hydrate: () => Promise<void>;
  addId: (id: MobileId) => Promise<void>;
  removeId: (vcId: string) => Promise<void>;
  getId: (vcId: string) => MobileId | undefined;
  addHistory: (verifier: string, privacy: string) => Promise<void>;
  clear: () => Promise<void>;
}

// 저장된 신분증은 발급 시점의 값으로 굳어 있어, mock 템플릿을 고쳐도 반영되지 않는다.
// 데모 앱이므로 hydrate 시 같은 vcType의 최신 mock 내용으로 갱신하고 vcId만 유지한다.
function refreshFromMock(ids: MobileId[]): MobileId[] {
  return ids.map((id) => {
    const sample = issuedSampleByType[id.vcType];
    if (!sample) return id;
    return { ...sample, vcId: id.vcId, isSelected: id.isSelected } as MobileId;
  });
}

async function persistIds(ids: MobileId[]) {
  await AsyncStorage.setItem(KEY_WALLET, JSON.stringify(ids));
}
async function persistHistory(history: UsageHistory[]) {
  await AsyncStorage.setItem(KEY_HISTORY, JSON.stringify(history));
}

export const useWalletStore = create<WalletState>((set, get) => ({
  hydrated: false,
  ids: [],
  history: [],

  async hydrate() {
    const [rawIds, rawHistory] = await Promise.all([
      AsyncStorage.getItem(KEY_WALLET),
      AsyncStorage.getItem(KEY_HISTORY),
    ]);
    const ids = rawIds ? refreshFromMock(JSON.parse(rawIds) as MobileId[]) : [];
    set({
      hydrated: true,
      ids,
      history: rawHistory ? (JSON.parse(rawHistory) as UsageHistory[]) : mockUsageHistory,
    });
    if (rawIds) await persistIds(ids);
  },

  async addId(id: MobileId) {
    const ids = [...get().ids, id];
    set({ ids });
    await persistIds(ids);
  },

  async removeId(vcId: string) {
    const ids = get().ids.filter((i) => i.vcId !== vcId);
    set({ ids });
    await persistIds(ids);
  },

  getId(vcId: string) {
    return get().ids.find((i) => i.vcId === vcId);
  },

  async addHistory(verifier: string, privacy: string) {
    const history = get().history;
    const next: UsageHistory = {
      no: (history[0]?.no ?? 0) + 1,
      verifier,
      privacy,
      verifyDate: formatNow(),
    };
    const updated = [next, ...history];
    set({ history: updated });
    await persistHistory(updated);
  },

  async clear() {
    set({ ids: [], history: [] });
    await AsyncStorage.multiRemove([KEY_WALLET, KEY_HISTORY]);
  },
}));

export { vcTypeName };

function formatNow(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

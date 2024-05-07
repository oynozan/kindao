import { create } from "zustand";
import { KinDAO } from '@/lib/kindao'
import type * as TronType from '@/lib/tron/browser/index'
import type { WalletInterface } from "@multiplechain/types";

// Tron Store + Wallet
interface TronStore {
    kinDao: KinDAO;
    // @ts-expect-error everything is fine
    tron: TronType | null;
    provider: TronType.Provider | null;
    wallet: WalletInterface | null;
    setKinDao: (i: KinDAO) => void;
    setWallet: (i: WalletInterface | null) => void;
    setTron: (
        // @ts-expect-error everything is fine
        i: TronType,
        j: TronType.Provider,
    ) => void;
}

export const useTronStore = create<TronStore>((set) => ({
    tron: null,
    wallet: null,
    provider: null,
    kinDao: {} as KinDAO,
    setKinDao: (kinDao) => set(() => ({ kinDao })),
    setWallet: (wallet) => set(() => ({ wallet })),
    setTron: (tron, provider) => set(() => ({ tron, provider })),
}));

interface ProfileStore {
    profile: { username: string, avatarUrl: string | null } | null,
    setProfile: (i: { username: string, avatarUrl: string | null } | null) => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null,
    setProfile: (profile) => set(() => ({ profile })),
}));

/* Content States */
interface EditorStore {
    content: string;
    setContent: (i: string) => void;
}

export const useContentStore = create<EditorStore>((set) => ({
    content: "",
    setContent: (content) => set(() => ({ content })),
}));

export const useAnswerStore = create<EditorStore>((set) => ({
    content: "",
    setContent: (content) => set(() => ({ content })),
}));

/* Modal States */
// Wallet Modal
interface ModalStore {
    modal: string;
    options: any;
    loading: boolean;
    setModal: (type: string, options: any) => void;
    setLoading: (loading: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    modal: "", // Modal Key
    options: {},
    loading: false,
    setModal: (type, options = {}) => set(() => ({
        modal: type,
        options: options,
    })),
    setLoading: (loading) => set(() => ({ loading }))
}));
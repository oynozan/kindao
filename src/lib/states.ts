import { create } from "zustand";
import { KinDAO } from '@/lib/kindao'
import type * as TronType from '@/lib/tron/browser/index'
import type { WalletInterface } from "@multiplechain/types";

// Tron Store + Wallet
interface TronStore {
    // @ts-expect-error everything is fine
    tron: TronType | null;
    kindao: KinDAO | null;
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
    kindao: null,
    provider: null,
    setKinDao: (kindao) => set(() => ({ kindao })),
    setWallet: (wallet) => set(() => ({ wallet })),
    setTron: (tron, provider) => set(() => ({ tron, provider })),
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
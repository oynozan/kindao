import { create } from "zustand";

// Wallet Store
interface WalletStore {
	wallet: Array<any>,
    chain: Array<number>,
    setWallet: (i: Array<any>) => void,
}

export const useWalletStore = create<WalletStore>((set) => ({
    wallet: [],
    chain: [],
    setWallet: wallet => set(() => ({ wallet })),
}))

/* Modal States */
// Wallet Modal
interface ModalStore {
    modal: string,
    options: any,
    setModal: (type: string, options: any) => void
}

export const useModalStore = create<ModalStore>(set => ({
    modal: "", // Modal Key
    options: {},
    setModal: (type, options = {}) => set(() => ({
        modal: type,
        options: options
    })),
}))
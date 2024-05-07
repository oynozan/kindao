import { create } from "zustand";
import * as TronDefault from '@/lib/tron/index.es.js'
import type * as TronType from '@/lib/tron/browser/index'
import type { WalletInterface } from '@multiplechain/types'
// @ts-expect-error everything is fine
const Tron = TronDefault as typeof TronType

const tronProvider = new Tron.Provider({
    testnet: true,
})

// Tron Store
interface TronStore {
	tron: typeof Tron,
    provider: typeof tronProvider,
    wallet: WalletInterface | null,
    setWallet: (i: WalletInterface) => void,
}

export const useTronStore = create<TronStore>((set) => ({
    tron: Tron,
    wallet: null,
    provider: tronProvider,
    setWallet: wallet => set(() => ({ wallet })),
}))

/* Content States */
interface EditorStore {
    content: string,
    setContent: (i: string) => void
}

export const useContentStore = create<EditorStore>((set) => ({
    content: "",
    setContent: content => set(() => ({ content }))
}))

export const useAnswerStore = create<EditorStore>((set) => ({
    content: "",
    setContent: content => set(() => ({ content }))
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
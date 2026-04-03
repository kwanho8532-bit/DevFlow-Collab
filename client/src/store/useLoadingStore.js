import { create } from 'zustand'

export const useLoadingStore = create((set) => ({
    isLoading: false,
    loadingCount: 0,
    startLoading: () => set((state) => ({
        isLoading: true,
        loadingCount: state.loadingCount + 1
    })),
    stopLoading: () => set((state) => {
        const nextCount = Math.max(0, state.loadingCount - 1)
        return {
            isLoading: nextCount > 0,
            loadingCount: nextCount
        }
    })
}))

import { create } from "zustand";
import hangul, { search } from 'hangul-js'

export const useSearchStore = create((set, get) => ({
    searchQuery: null,
    searchedItem: [],
    setSearchQuery: (value) => set({ searchQuery: value }),
    getFilteredItem: (items) => {
        const query = get().searchQuery
        if (!query) return items
        set({ searchedItem: items.filter(item => hangul.search(item.project.projectName, query) >= 0) })
    }
}))
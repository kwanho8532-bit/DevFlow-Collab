import { create } from "zustand";
import api from "../component/api/axios.js";
import { useSnackbarStore } from "./useSnackbarStore.js";

export const useInviteStore = create((set, get) => ({
    invites: [],
    getPendingInvites: async () => {
        try {
            const { data } = await api.get('/invites')
            set({ invites: [...data] })
        } catch (err) {
            console.log(err)
        }
    },
    createInvite: async (inviteeId, workspaceId) => {
        try {
            const { data } = await api.post('/invites', { inviteeId, workspaceId })
            set(state => ({ invites: [...state.invites, data] }))
        } catch (err) {
            useSnackbarStore.getState().snackbarOpen(err.response.data.message, 'error')
        }
    },
    excludeFromInvites: (inviteId) => {
        set(state => ({
            invites: state.invites.filter(i => i._id !== inviteId)
        }))
    }
}))
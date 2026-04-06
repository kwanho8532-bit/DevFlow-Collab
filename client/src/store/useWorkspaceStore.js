import { create } from "zustand";
import api from "../component/api/axios.js";
import { useInviteStore } from "./useInviteStore.js";

export const useWorkspaceStore = create((set, get) => ({
    workspaces: [],
    myWorkspaces: [],
    selectedWorkspaceMember: [],
    selectedWorkspace: null,
    getAllWorkspaces: async () => {
        try {
            const { data } = await api.get('/workspace')
            set({ workspaces: data })
        } catch (err) {
            throw new Error('workspace를 가져오는 도중 에러가 발생하였습니다.')
        }
    },
    getMyWorkspaces: async () => {
        try {
            const { data } = await api.get('/workspace/mine')
            set({ myWorkspaces: data })
        } catch (err) {
            console.log(err)
        }
    },
    getSelectedWorkspace: async (id) => {
        try {
            const { data } = await api.get(`/workspace/${id}`)
            set({ selectedWorkspace: data })
        } catch (err) {
            console.log(err)
        }
    },
    clearSelectedWorkspace: () => set({ selectedWorkspace: null }),
    getWorkspaceMember: async (workspaceId) => {
        try {
            const { data } = await api.get(`/workspace/${workspaceId}/workspace-member`)
            set({ selectedWorkspaceMember: data })
        } catch (err) {
            console.log(err)
        }
    },
    createWorkspace: async (formData) => {
        try {
            const { data } = await api.post('/workspace', formData)

            set(state => ({
                workspaces: [...state.workspaces, data]
            }))
        } catch (err) {
            console.log(err)
        }
    },
    acceptAndJoin: async (inviteId) => {
        try {
            const { data } = await api.patch(`/invite/${inviteId}`)
            set(state => ({
                // selectedWorkspaceMember는 user 객체 배열임
                selectedWorkspaceMember: [...state.selectedWorkspaceMember, data.newWorkspaceMember],
            }))
            useInviteStore.getState().excludeFromInvites(data.invite._id)
            return { success: true, message: '초대를 수락하였습니다.' }
        } catch (err) {
            console.log(err)
            return { success: false, message: '수락 도중 에러가 발생하였습니다.' }
        }
    }
}))
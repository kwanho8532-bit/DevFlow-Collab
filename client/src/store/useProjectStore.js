import { create } from 'zustand'
import api from '../component/api/axios'

export const useProjectStore = create((set, get) => ({
    selectedProject: null,
    selectedProjectInWorkspace: null,
    projects: [],
    archivedProjects: [],
    archivedProjectsInWorkspace: [],
    projectsInSelectedWorkspace: [],
    error: null,
    getProjects: async () => {
        try {
            const { data } = await api.get('/me/currProject')
            set({ projects: data })
        } catch (err) {
            console.log(err)
        }
    },
    setSelectedProjectInWorkspace: (value = null) => {
        set({ selectedProjectInWorkspace: value })
    },
    getSelectedProject: async (projectId) => {
        // 현재 선택된 프로젝트 가져오는 로직 구현
        const { data } = await api.get(`/project/${projectId}`)
        set({ selectedProject: data })

    },
    getSelectedProjectInWorkspace: async (projectId) => {
        try {
            const { data } = await api.get(`/project/${projectId}`)
            set({ selectedProjectInWorkspace: data })
        } catch (err) {
            console.log(err)
        }
    },
    getArchivedProjects: async () => {
        try {
            const { data } = await api.get('/project/archived')
            const archived = data.filter(project => !project.workspace)
            set({ archivedProjects: archived })
        } catch (err) {
            console.log(err.response)
        }
    },
    getArchivedProjectsInWorkspace: async (workspaceId) => {
        try {
            const { data } = await api.get('/project/archived')
            const finData = data.filter(project => project.workspace === workspaceId)
            set({ archivedProjectsInWorkspace: finData })
        } catch (err) {
            console.log(err.response)
        }
    },
    addProject: async (formData) => {
        try {
            const submitData = {
                ...formData,
                deadline: formData.deadline.toISOString()
            }
            const { data } = await api.post('/project', submitData)
            set(state => ({
                projects: [...state.projects, data]
            }));
        } catch (err) {
            console.log(err)
        }
    },
    addProjectInWorkspace: async (formData, workspaceId) => {
        try {
            const submitData = {
                ...formData,
                deadline: formData.deadline.toISOString()
            }
            const { data } = await api.post(`/project/workspace/${workspaceId}`, submitData)
            set(state => ({
                projectsInSelectedWorkspace: [...state.projectsInSelectedWorkspace, data],
                selectedProjectInWorkspace: data
            }))
        } catch (err) {
            console.log(err)
        }
    },
    // patch하고 나면 body에 avatar가 없어지게 됨
    // 아마 서버 로직에서 새 project를 넘겨주고 이를 set()하기 때문에
    // 생기는 문제 같음. 내일 와서 이거 해결하고, 404문제도 해결하고, 
    // 새로고침하면 patchProject한 게 원래대로 돌아가는 것도 해결하기
    patchProject: async (nextStatus) => {
        const projectId = get().selectedProject._id
        const { data } = await api.patch(`/project/${projectId}/status`, { status: nextStatus })
        set({ selectedProject: data })
    },
    statusTransition: async (nextStatus) => {
        try {
            const projectId = get().selectedProjectInWorkspace._id
            const { data } = await api.patch(`/project/${projectId}/status`, { status: nextStatus })
            if (data.archivedAt) {
                set(state => ({
                    archivedProjectsInWorkspace: [...state.archivedProjectsInWorkspace, data]
                }))
            }
            set({ selectedProjectInWorkspace: data })
        } catch (err) {
            console.log(err.response, 'error!!!!!!!!!!!!!!!!!')
            // useErrorStore.getState().setErrorMsg(err.response.data.message || '에러 발생!')
        }
    },
    editProject: async (editData, projectId) => {
        try {
            const { data } = await api.put(`/project/${projectId}`, editData)
            set(state => ({
                projects: state.projects.map(project =>
                    project._id === projectId ? data : project
                ),
                selectedProject: data
            }))
        } catch (err) {
            console.log(err)
        }
    },
    editProjectInWorkspace: async (editData, projectId) => {
        try {
            const submitData = {
                ...editData,
                deadline: editData.deadline.toISOString()
            }
            const { data } = await api.put(`/project/${projectId}`, submitData)
            set(state => ({
                projectsInSelectedWorkspace: state.projectsInSelectedWorkspace.map(project =>
                    project._id === projectId ? data : project
                ),
                selectedProjectInWorkspace: data
            }))
        } catch (err) {
            // useErrorStore.getState().setErrorMsg(err.response.data.message || '에러발생!')
        }
    },
    deleteProject: async (projectId) => {
        try {
            const { data } = await api.delete(`/project/${projectId}`)
            set(state => ({
                selectedProject: null,
                projects: state.projects.filter(project => project._id !== data._id)
            }))
        } catch (err) {
            console.log(err.response)
        }
    },
    deleteProjectInWorkspace: async (projectId) => {
        try {
            const { data } = await api.delete(`/project/${projectId}`)
            set(state => ({
                selectedProjectInWorkspace: null,
                projectsInSelectedWorkspace: state.projectsInSelectedWorkspace.filter(project => project._id !== data._id)
            }))
        } catch (err) {
            // useErrorStore.getState().setErrorMsg(err.response.data.message || '에러발생!')
        }
    },
    archiveProject: async (projectId) => {
        try {
            const { data } = await api.patch(`/project/${projectId}/archive`)
            set(state => ({
                archivedProjects: state.archivedProjects.map(project => ({ ...project, data })),
                selectedProject: null
            }))
        } catch (err) {
            console.log(err.response)
        }
    },
    archiveProjectInWorkspace: async (projectId) => {
        try {
            const { data } = await api.patch(`/project/${projectId}/archive`)
            set(state => ({
                // 왜 kim's Project가 archivedAt이 되었는데 archive에 랜더링되지 않는가?
                archivedProjectsInWorkspace: state.archivedProjectsInWorkspace.map(project => ({ ...project, data })),
                selectedProjectInWorkspace: null,
                projectsInSelectedWorkspace: state.projectsInSelectedWorkspace.filter(project => project._id !== data._id)
            }))
        } catch (err) {
            // useErrorStore.getState().setErrorMsg(err.response.data.message || '에러 발생!')
        }
    },
    unarchiveProject: async (projectId) => {
        try {
            const { data } = await api.patch(`/project/${projectId}/unarchive`)
            set(state => ({
                archivedProjects: state.archivedProjects.filter(project => project._id !== data._id)
            }))
        } catch (err) {
            // useErrorStore.getState().setErrorMsg(err.response.data.message || '에러발생!')
        }
    },
    unarchiveProjectInWorkspace: async (projectId) => {
        try {
            const { data } = await api.patch(`/project/${projectId}/unarchive`)
            set(state => ({
                archivedProjectsInWorkspace: state.archivedProjectsInWorkspace.filter(project => project._id !== data._id),
                projectsInSelectedWorkspace: [...state.projectsInSelectedWorkspace, data]
            }))
        } catch (err) {
            // useErrorStore.getState().setErrorMsg(err.response.data.message || '에러발생!')
        }
    },
    getProjectsInWorkspace: async (workspaceId) => {
        try {
            const { data } = await api.get(`/project/workspace/${workspaceId}`)
            set({ projectsInSelectedWorkspace: data })
        } catch (err) {
            console.log(err)
        }
    }
}))


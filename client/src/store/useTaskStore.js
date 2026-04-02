import { create } from "zustand";
import api from "../component/api/axios";

export const useTaskStore = create((set, get) => ({
    tasks: [],
    tasksInWorkspaceProject: [],
    getTasks: async (projectId) => {
        if (!projectId) {
            return; // 프로젝트가 없으면 아래 로직을 실행하지 않음
        }

        try {
            const { data } = await api.get(`/project/${projectId}/task`);
            set({ tasks: data.tasks });
        } catch (error) {
            console.error("Task 로드 실패:", error);
        }
    },
    addTask: async (selectedProjectId, formData) => {
        try {
            // addTask 만들고, workspace용으로 또 만들기
            // addTask컴포넌트에서 사용한 api.post()는 정리하고
            // store에 action으로 정리하기
            const { data } = await api.post(`/project/${selectedProjectId}/task`, formData)
            set(state => ({
                tasks: [...state.tasks, data]
            }))
        } catch (err) {
            console.log(err)
        }
    },
    addTaskInWorkspaceProject: async (selectedProjectId, formData) => {
        try {
            // addTask 만들고, workspace용으로 또 만들기
            // addTask컴포넌트에서 사용한 api.post()는 정리하고
            // store에 action으로 정리하기
            const { data } = await api.post(`/project/${selectedProjectId}/task`, formData)
            set(state => ({
                tasksInWorkspaceProject: [...state.tasksInWorkspaceProject, data]
            }))
        } catch (err) {
            console.log(err)
        }
    },
    getTasksInWorkspaceProject: async (projectId) => {
        try {
            const { data } = await api.get(`/project/${projectId}/tasks`)
            set({ tasksInWorkspaceProject: data })
        } catch (err) {
            console.log(err)
        }
    },
    getProgress: () => {
        const tasks = get().tasks;
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(task => task.done).length;
        return Math.round((completed / tasks.length) * 100);
    },
    getProgressInWorkspaceProject: () => {
        const tasks = get().tasksInWorkspaceProject;
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(task => task.done).length;
        return Math.round((completed / tasks.length) * 100);
    },
    toggleTask: async (taskId) => {
        try {
            const { data } = await api.patch(`/task/${taskId}/status`)
            set(state => ({
                tasks: state.tasks.map(task => (
                    task._id === taskId ?
                        data
                        :
                        task
                ))
            }))
        } catch (err) {
            console.log(err)
        }
    },
    toggleTaskInWorkspaceProject: async (taskId) => {
        try {
            const { data } = await api.patch(`/task/${taskId}/status`)
            set(state => ({
                tasksInWorkspaceProject: state.tasksInWorkspaceProject.map(task => (
                    task._id === taskId ?
                        data
                        :
                        task
                ))
            }))
        } catch (err) {
            console.log(err)
        }
    },
    editTask: async (formData, taskId) => {
        try {
            const { data } = await api.put(`/task/${taskId}`, formData)
            // 여기 로직 채우고 send 전에 확인하는 dialog 띄우기
            set(state => ({
                tasks: state.tasks.map(task => (
                    task._id === data._id ?
                        data
                        :
                        task
                ))
            }))
        } catch (err) {
            console.log(err.response)
        }
    },
    editTaskInWorkspace: async (formData, taskId) => {
        try {
            const { data } = await api.put(`/task/${taskId}`, formData)
            set(state => ({
                tasksInWorkspaceProject: state.tasksInWorkspaceProject.map(task => (
                    task._id === data._id ?
                        data
                        :
                        task
                ))
            }))
        } catch (err) {
            console.log(err.response)
        }
    },
    deleteTask: async (taskId) => {
        try {
            const { data } = await api.delete(`/task/${taskId}`)
            set(state => ({
                tasks: state.tasks.filter(task => task._id !== data._id)
            }))
        } catch (err) {
            console.log(err.response)
        }
    },
    deleteTaskInWorkspace: async (taskId) => {
        try {
            const { data } = await api.delete(`/task/${taskId}`)
            set(state => ({
                tasksInWorkspaceProject: state.tasksInWorkspaceProject.filter(task => task._id !== data._id)
            }))
        } catch (err) {
            console.log(err.response)
        }
    },
})) 
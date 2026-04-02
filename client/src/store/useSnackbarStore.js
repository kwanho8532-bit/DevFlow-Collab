import { create } from "zustand";

export const useSnackbarStore = create((set, get) => ({
    open: false,
    message: null,
    severity: 'error',
    snackbarOpen: (message, severity = 'error') => set({
        open: true,
        message,
        severity,
    }),
    clearSnackbar: () => set({ open: false, message: null, })

    // 제미나이에게 질문한 것처럼 snackbarStore를 만들어서(errorStore를 snackbarStore로 전환)
    // snackbar를 전역에서 사용할 수 있도록 만들고, accept도중 에러가 나게 되면 snackbar 띄우기

})) 
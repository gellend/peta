import { create } from "zustand";

const useAppStore = create((set) => ({
  // User state
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  // Snackbar state
  snackbarData: {
    open: false,
    message: "",
    type: "",
  },
  handleOpenSnackBar: (message, type) =>
    set({ snackbarData: { open: true, message, type } }),
  handleCloseSnackBar: () =>
    set({ snackbarData: { open: false, message: "", type: "" } }),

  // Loading state
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useAppStore;

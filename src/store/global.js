import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getUserDataByEmail } from "../lib/store";

const useAppStore = create(
  subscribeWithSelector((set, get) => ({
    // User state
    currentUser: null,
    isCurrentUserExist: () => !!get().currentUser,
    fetchCurrentUser: async (email) => {
      const user = await getUserDataByEmail(email);
      set({ currentUser: user });
    },

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
  }))
);

export default useAppStore;

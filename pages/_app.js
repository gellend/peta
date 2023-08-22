import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import createEmotionCache from "../src/createEmotionCache";
import theme from "../src/theme";
import CustomSnackbar from "../src/components/CustomSnackbar";
import useAppStore from "../src/store/global";
import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect } from "react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { snackbarData, handleCloseSnackBar, isLoading } = useAppStore(
    (state) => state
  );

  useEffect(() => {
    const registerServiceWorker = async () => {
      try {
        if ("serviceWorker" in navigator) {
          // check if already registered
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) return;

          await navigator.serviceWorker.register("/sw.js");
          console.info("Service worker successfully registered!");
        }
      } catch (err) {
        console.error("Service worker registration failed:", err);
      }
    };

    const requestNotificationPermission = async () => {
      try {
        if ("PushManager" in window) {
          // check if already granted
          if (window.Notification.permission === "granted") return;

          await window.Notification.requestPermission();
        }
      } catch (err) {
        console.error("push notification err", err);
      }
    };

    registerServiceWorker();
    requestNotificationPermission();
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
        <CustomSnackbar
          data-cy="custom-snackbar"
          open={snackbarData.open}
          message={snackbarData.message}
          type={snackbarData.type}
          onClose={handleCloseSnackBar}
        />
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </ThemeProvider>
    </CacheProvider>
  );
}

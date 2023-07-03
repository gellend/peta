import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/material/styles";
import UserProvider from "../context/userContext";
import createEmotionCache from "../src/createEmotionCache";
import theme from "../src/theme";
import CustomSnackbar from "../src/components/CustomSnackbar";
import useAppStore from "../src/store/global";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { snackbarData, handleCloseSnackBar } = useAppStore((state) => state);

  return (
    <UserProvider>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
          <CustomSnackbar
            open={snackbarData.open}
            message={snackbarData.message}
            type={snackbarData.type}
            onClose={handleCloseSnackBar}
          />
        </ThemeProvider>
      </CacheProvider>
    </UserProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

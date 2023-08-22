import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";

import Copyright from "../src/components/Copyright";
import { useRouter } from "next/router";
import { useEffect } from "react";
import isValidEmail from "../src/helper/validateEmail";
import useForm from "../src/helper/useForm";
import useAppStore from "../src/store/global";
import { getCurrentLoginUser, auth } from "../src/lib/auth";
import config from "../src/const/config.json";
import { getPushSubscription, storePushSubscription } from "../src/lib/store";
import { urlBase64ToUint8Array } from "../src/lib/converter";

export default function LogIn() {
  const router = useRouter();

  const initialState = {
    email: "",
    password: "",
  };

  const validationRules = {
    email: (value) =>
      !value
        ? "Alamat Email is required"
        : !isValidEmail(value)
        ? "Invalid email format"
        : "",
    password: (value) => (!value ? "Kata Sandi is required" : ""),
  };

  const { values, errors, handleChange, validateForm } = useForm(
    initialState,
    validationRules
  );

  const { currentUser, fetchCurrentUser, handleOpenSnackBar, setIsLoading } =
    useAppStore((state) => state);

  // Handle push notification subscription
  const handlePushSubscription = async (uid) => {
    const pushSubscription = await getPushSubscription(uid);

    if (pushSubscription) {
      localStorage.setItem("pushSubscription", pushSubscription.subscription);
      return;
    }

    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BOh_S4oYQixcLVaX_7bAT5XJvblY5-hPCCz_T0fiQTp1gsi8nJ7rnrcEjZta_ZzzS8rySimDtuuSttdRe6fMKic"
          ),
        });

        // save to firebase
        const res = await storePushSubscription(
          uid,
          JSON.stringify(subscription)
        );

        if (res) {
          // save to local storage
          localStorage.setItem(
            "pushSubscription",
            JSON.stringify(subscription)
          );

          console.info("Push subscription successful!");
        }
      }
    } catch (err) {
      console.error("push subscription err", err);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    getCurrentLoginUser(false);
  }, []);

  // Redirect user to dashboard if they are already logged in
  const redirectUser = (role) => {
    const redirectPath = config.redirectRules[role];
    if (redirectPath) router.push(redirectPath);
  };

  useEffect(() => {
    if (currentUser) {
      redirectUser(currentUser.role);
      handlePushSubscription(currentUser.uid);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      try {
        setIsLoading(true);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        if (userCredential) fetchCurrentUser(userCredential.user.email);
      } catch (error) {
        handleOpenSnackBar(error.message, "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Masuk
        </Typography>
        <Typography component="h1" variant="h5">
          PETA - Pengajuan Judul TA
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            data-cy="login-email"
            inputProps={{ "data-cy": "login-email-input" }}
            FormHelperTextProps={{ "data-cy": "login-email-helper-text" }}
            margin="normal"
            fullWidth
            label="Alamat Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            data-cy="login-password"
            inputProps={{ "data-cy": "login-password-input" }}
            FormHelperTextProps={{
              "data-cy": "login-password-helper-text",
            }}
            margin="normal"
            fullWidth
            label="Kata Sandi"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            data-cy="login-submit"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Masuk
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Lupa kata sandi?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                Buat akun
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}

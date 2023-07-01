import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import Copyright from "../src/components/Copyright";
import CustomSnackbar from "../src/components/CustomSnackbar";
import { createFirebaseApp } from "../firebase/clientApp";
import { useRouter } from "next/router";
import { useUser } from "../context/userContext";
import { useState, useEffect } from "react";
import { getUserDataByEmail } from "../src/lib/store";
import isValidEmail from "../src/helper/validateEmail";
import useForm from "../src/helper/useForm";

export default function LogIn() {
  const app = createFirebaseApp();
  const router = useRouter();
  const auth = getAuth(app);

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

  const { user, setUser, loadingUser, setLoadingUser } = useUser();

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    type: "",
  });

  // Check if user is already logged in
  useEffect(() => {
    setLoadingUser(true);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await getUserDataByEmail(user.email);
        setUser(userData);
      }

      setLoadingUser(false);
    });

    return unsubscribe;
  }, []);

  // Redirect user to dashboard if they are already logged in
  useEffect(() => {
    if (user && user.role === "Mahasiswa") {
      router.push("/pengajuan");
    } else if (
      user &&
      ["Dosen", "Kepala Prodi", "Koordinator Lab", "Admin"].includes(user.role)
    ) {
      router.push("/dashboard");
    }
  }, [user, loadingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      try {
        setLoadingUser(true);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const userData = await getUserDataByEmail(userCredential.user.email);
        setUser(userData);
      } catch (error) {
        handleOpenSnackBar(error.message, "error");
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }
  };

  // Handle snackbar
  const handleOpenSnackBar = (message, type) => {
    setSnackbarData({ open: true, message, type });
  };

  const handleCloseSnackBar = () => {
    setSnackbarData({ ...snackbarData, open: false });
  };

  return (
    <Container component="main" maxWidth="xs">
      {loadingUser ? (
        <div>Loading...</div>
      ) : (
        <>
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
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
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
                disabled={loadingUser}
              >
                {loadingUser ? "Loading..." : "Masuk"}
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
        </>
      )}

      <CustomSnackbar
        open={snackbarData.open}
        message={snackbarData.message}
        type={snackbarData.type}
        onClose={handleCloseSnackBar}
      />
    </Container>
  );
}

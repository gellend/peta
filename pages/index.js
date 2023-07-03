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

  // Check if user is already logged in
  useEffect(() => {
    getCurrentLoginUser(false);
  }, []);

  // Redirect user to dashboard if they are already logged in
  useEffect(() => {
    if (currentUser && currentUser.role === "Mahasiswa") {
      router.push("/pengajuan");
    } else if (
      currentUser &&
      ["Dosen", "Kepala Prodi", "Koordinator Lab", "Admin"].includes(
        currentUser.role
      )
    ) {
      router.push("/dashboard");
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

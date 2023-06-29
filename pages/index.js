import {
  Box,
  Button,
  Container,
  CssBaseline,
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

export default function LogIn() {
  const app = createFirebaseApp();
  const router = useRouter();
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    setLoadingUser(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = await getUserDataByEmail(userCredential.user.email);
      setUser(userData);
    } catch (error) {
      console.log(error.code, error.message);
      handleOpenSnackBar(error.message, "error");
      setUser(null);
    } finally {
      setLoadingUser(false);
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
          <CssBaseline />
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
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Alamat Email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Kata Sandi"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
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

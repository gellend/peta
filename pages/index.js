import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import { doc, getDoc, getFirestore, collection, query, where } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import Copyright from "../src/components/Copyright";
import { createFirebaseApp } from "../firebase/clientApp";
import { useRouter } from "next/router";
import { useUser } from "../context/userContext";
import { useState } from "react";
import { useEffect } from "react";
import { useAuthState } from '../src/lib/user';

export default function LogIn() {
  const app = createFirebaseApp();
  const router = useRouter();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const { user, setUser, loadingUser, setLoadingUser } = useUser();

  // Snackbar
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageSnackBar, setMessageSnackBar] = useState("");
  const [typeSnackBar, setTypeSnackBar] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    setIsLoggingIn(true);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await getDoc(doc(db, "users", user.uid));
        setUser(userData.data());
      }

      setIsLoggingIn(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingUser(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const userData = await getDoc(
          doc(db, "users", userCredential.user.uid)
        );
        setUser(userData.data());
      })
      .catch((error) => {
        console.log(error.code, error.message);
        handleOpenSnackBar(error.message, "error")
        setUser(null);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  };

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  const handleOpenSnackBar = (message, type) => {
    setMessageSnackBar(message);
    setTypeSnackBar(type);
    setOpenSnackBar(true);
  }

  return (
    <Container component="main" maxWidth="xs">
      {isLoggingIn ? (
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
      <Snackbar open={openSnackBar} autoHideDuration={2000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity={typeSnackBar} sx={{ width: '100%' }}>
          {messageSnackBar}
        </Alert>
      </Snackbar>
    </Container>
  );
}

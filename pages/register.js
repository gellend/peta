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
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";

import Copyright from "../src/components/Copyright";
import CustomSnackbar from "../src/components/CustomSnackbar";
import { createFirebaseApp } from "../firebase/clientApp";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const app = createFirebaseApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  // State
  const [id, setId] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Snackbar
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    type: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        await setDoc(doc(db, "users", res.user.uid), {
          id: id,
          nama: nama,
          email: email,
          role: "Mahasiswa",
          created_at: serverTimestamp(),
        });

        router.push("/dashboard");
      })
      .catch((error) => {
        handleOpenSnackBar(error.message, "error");
      });
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
          Registrasi Akun
        </Typography>
        <Typography component="h1" variant="h5">
          PETA - Pengajuan Judul TA
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            data-cy="register-id"
            margin="normal"
            required
            fullWidth
            label="NRP"
            name="nrp"
            autoFocus
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            data-cy="register-nama"
            margin="normal"
            required
            fullWidth
            label="Nama Lengkap"
            name="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <TextField
            data-cy="register-email"
            margin="normal"
            required
            fullWidth
            label="Alamat Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            data-cy="register-password"
            margin="normal"
            required
            fullWidth
            label="Kata Sandi"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            data-cy="register-submit"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Lupa kata sandi?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/" variant="body2">
                Sudah punya akun
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />

      <CustomSnackbar
        open={snackbarData.open}
        message={snackbarData.message}
        type={snackbarData.type}
        onClose={handleCloseSnackBar}
      />
    </Container>
  );
}

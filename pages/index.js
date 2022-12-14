import * as React from 'react';

import { Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import Copyright from '../src/components/Copyright';
import { createFirebaseApp } from '../firebase/clientApp'
import { useRouter } from 'next/router';
import { useUser } from '../context/userContext';

export default function LogIn() {
  const app = createFirebaseApp()
  const router = useRouter()
  const db = getFirestore(app)
  const auth = getAuth(app)

  const { user, setUser, loadingUser } = useUser();

  const getUserData = async (uid) => {
    const user = await getDoc(doc(db, "users", uid));
    return user.data();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    signInWithEmailAndPassword(auth, data.get('email'), data.get('password'))
      .then(async (userCredential) => {
        try {
          setUser(await getUserData(userCredential.user.uid))
        } catch (e) {
          console.error(e)
        } finally {
          if (user && user.role === "Mahasiswa") router.push('/pengajuan')
          else router.push('/dashboard')
        }

      })
      .catch((error) => {
        console.log(error.code);
      });

  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
            margin="normal"
            required
            fullWidth
            id="email"
            label="Alamat Email"
            name="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Kata Sandi"
            type="password"
            id="password"
          />
          <Button
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
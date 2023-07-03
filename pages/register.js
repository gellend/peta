import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

import Copyright from "../src/components/Copyright";
import { createFirebaseApp } from "../firebase/clientApp";
import { useRouter } from "next/router";
import useForm from "../src/helper/useForm";
import isValidEmail from "../src/helper/validateEmail";
import useAppStore from "../src/store/global";

export default function Register() {
  const router = useRouter();
  const app = createFirebaseApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  // State
  const initialState = {
    id: "",
    nama: "",
    email: "",
    password: "",
  };

  const validationRules = {
    id: (value) => (!value ? "NRP is required" : ""),
    nama: (value) => (!value ? "Nama Lengkap is required" : ""),
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

  const { handleOpenSnackBar } = useAppStore((state) => state);

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(async (res) => {
          await setDoc(doc(db, "users", res.user.uid), {
            id: values.id,
            nama: values.nama,
            email: values.email,
            role: "Mahasiswa",
            created_at: serverTimestamp(),
          });

          router.push("/dashboard");
        })
        .catch((error) => {
          handleOpenSnackBar(error.message, "error");
        });
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
          Registrasi Akun
        </Typography>
        <Typography component="h1" variant="h5">
          PETA - Pengajuan Judul TA
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            data-cy="register-id"
            inputProps={{ "data-cy": "register-id-input" }}
            FormHelperTextProps={{ "data-cy": "register-id-helper-text" }}
            margin="normal"
            fullWidth
            label="NRP"
            name="id"
            value={values.id}
            onChange={handleChange}
            error={!!errors.id}
            helperText={errors.id}
          />
          <TextField
            data-cy="register-nama"
            inputProps={{ "data-cy": "register-nama-input" }}
            FormHelperTextProps={{ "data-cy": "register-nama-helper-text" }}
            margin="normal"
            fullWidth
            label="Nama Lengkap"
            name="nama"
            value={values.nama}
            onChange={handleChange}
            error={!!errors.nama}
            helperText={errors.nama}
          />
          <TextField
            data-cy="register-email"
            inputProps={{ "data-cy": "register-email-input" }}
            FormHelperTextProps={{ "data-cy": "register-email-helper-text" }}
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
            data-cy="register-password"
            inputProps={{ "data-cy": "register-password-input" }}
            FormHelperTextProps={{ "data-cy": "register-password-helper-text" }}
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
    </Container>
  );
}

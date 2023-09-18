import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";

import Copyright from "../src/components/Copyright";
import { useRouter } from "next/router";
import useForm from "../src/helper/useForm";
import isValidEmail from "../src/helper/validateEmail";
import useAppStore from "../src/store/global";
import { postData } from "../src/lib/store";
import { auth, getCurrentLoginUser } from "../src/lib/auth";
import { useEffect } from "react";
import config from "../src/const/config.json";

export default function Register() {
  const router = useRouter();

  const initialState = {
    id: "",
    prodi: "",
    nama: "",
    email: "",
    password: "",
  };

  const validationRules = {
    id: (value) => (!value ? "NRP tidak boleh kosong" : ""),
    prodi: (value) => (!value ? "Program Studi tidak boleh kosong" : ""),
    nama: (value) => (!value ? "Nama Lengkap tidak boleh kosong" : ""),
    email: (value) =>
      !value
        ? "Alamat email tidak boleh kosong"
        : !isValidEmail(value)
        ? "Alamat email tidak valid"
        : "",
    password: (value) => (!value ? "Kata Sandi tidak boleh kosong" : ""),
  };

  const { values, errors, handleChange, validateForm } = useForm(
    initialState,
    validationRules
  );

  const { handleOpenSnackBar } = useAppStore((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      try {
        const res = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        const dataToStore = {
          id: values.id,
          prodi: values.prodi,
          nama: values.nama,
          email: values.email,
          role: "Mahasiswa",
          created_at: serverTimestamp(),
        };

        const success = await postData("users", dataToStore, res.user.uid);

        if (success) {
          handleOpenSnackBar("Registrasi berhasil", "success");
          router.push("/");
        }
      } catch (error) {
        handleOpenSnackBar(error.message, "error");
      }
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    getCurrentLoginUser(false);
  }, []);

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
            data-cy="register-prodi"
            inputProps={{ "data-cy": "register-prodi-input" }}
            FormHelperTextProps={{ "data-cy": "register-prodi-helper-text" }}
            select
            margin="normal"
            fullWidth
            label="Program Studi"
            name="prodi"
            value={values.prodi}
            onChange={handleChange}
            error={!!errors.prodi}
            helperText={errors.prodi}
          >
            {config.prodi &&
              config.prodi.map((option, i) => (
                <MenuItem
                  key={option}
                  value={option}
                  data-cy={`register-prodi-option-${i}`}
                >
                  {option}
                </MenuItem>
              ))}
          </TextField>
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

import {
  Box,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  Button,
  Stack,
  IconButton,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import Navbar from "../../src/components/Navbar";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import useAppStore from "../../src/store/global";
import config from "../../src/const/config.json";
import useForm from "../../src/helper/useForm";
import { auth, getCurrentLoginUser } from "../../src/lib/auth";
import { postData } from "../../src/lib/store";
import isValidEmail from "../../src/helper/validateEmail";

export default function CreateUser() {
  const router = useRouter();

  const initialState = {
    id: "",
    prodi: "",
    lab: "",
    nama: "",
    email: "",
    role: "Mahasiswa",
    password: "",
  };

  const validationRules = {
    id: (value) => (!value ? "NRP tidak boleh kosong" : ""),
    prodi: (value) =>
      (values.role === "Mahasiswa" || values.role === "Kepala Prodi") && !value
        ? "Program Studi tidak boleh kosong"
        : "",
    nama: (value) => (!value ? "Nama Lengkap tidak boleh kosong" : ""),
    lab: (value) =>
      values.role === "Koordinator Lab" && !value
        ? "Lab tidak boleh kosong"
        : "",
    email: (value) =>
      !value
        ? "Alamat email tidak boleh kosong"
        : !isValidEmail(value)
        ? "Alamat email tidak valid"
        : "",
    role: (value) => (!value ? "Role tidak boleh kosong" : ""),
    password: (value) => (!value ? "Kata Sandi tidak boleh kosong" : ""),
  };

  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    initialState,
    validationRules
  );

  const { handleOpenSnackBar, setIsLoading } = useAppStore((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      try {
        setIsLoading(true);

        const res = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        const dataToStore = {
          id: values.id,
          prodi: values.prodi,
          lab: values.lab,
          nama: values.nama,
          email: values.email,
          role: values.role,
          created_at: serverTimestamp(),
        };

        const success = await postData("users", dataToStore, res.user.uid);

        if (success) {
          handleOpenSnackBar(`${values.id} berhasil di daftarkan!`, "success");
          router.push("/verifikasi");
        }
      } catch (error) {
        handleOpenSnackBar(error.message, "error");
      } finally {
        resetForm();
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getCurrentLoginUser();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={() => router.back()}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h5">Tambah Pengguna</Typography>
            </Stack>
          </Stack>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} lg={5}>
                <Table aria-label="Tambah-Pengguna">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="verifikasi-create-role"
                          inputProps={{
                            "data-cy": "verifikasi-create-role-input",
                          }}
                          FormHelperTextProps={{
                            "data-cy": "verifikasi-create-role-helper-text",
                          }}
                          select
                          margin="normal"
                          fullWidth
                          label="Role"
                          name="role"
                          value={values.role}
                          onChange={handleChange}
                          error={!!errors.role}
                          helperText={errors.role}
                        >
                          {config.roles &&
                            config.roles.map((option, i) => (
                              <MenuItem
                                key={option}
                                value={option}
                                data-cy={`verifikasi-create-role-option-${i}`}
                              >
                                {option}
                              </MenuItem>
                            ))}
                        </TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="verifikasi-create-id"
                          inputProps={{
                            "data-cy": "verifikasi-create-id-input",
                          }}
                          FormHelperTextProps={{
                            "data-cy": "verifikasi-create-id-helper-text",
                          }}
                          margin="normal"
                          fullWidth
                          label={values.role === "Mahasiswa" ? "NRP" : "NIDN"}
                          name="id"
                          value={values.id}
                          onChange={handleChange}
                          error={!!errors.id}
                          helperText={errors.id}
                        />
                      </TableCell>
                    </TableRow>
                    {(values.role === "Mahasiswa" ||
                      values.role === "Kepala Prodi") && (
                      <TableRow>
                        <TableCell>
                          <TextField
                            data-cy="verifikasi-create-prodi"
                            inputProps={{
                              "data-cy": "verifikasi-create-prodi-input",
                            }}
                            FormHelperTextProps={{
                              "data-cy": "verifikasi-create-prodi-helper-text",
                            }}
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
                                  data-cy={`verifikasi-create-prodi-option-${i}`}
                                >
                                  {option}
                                </MenuItem>
                              ))}
                          </TextField>
                        </TableCell>
                      </TableRow>
                    )}
                    {values.role === "Koordinator Lab" && (
                      <TableRow>
                        <TableCell>
                          <TextField
                            data-cy="verifikasi-create-lab"
                            inputProps={{
                              "data-cy": "verifikasi-create-lab-input",
                            }}
                            FormHelperTextProps={{
                              "data-cy": "verifikasi-create-lab-helper-text",
                            }}
                            select
                            margin="normal"
                            fullWidth
                            label="Lab"
                            name="lab"
                            value={values.lab}
                            onChange={handleChange}
                            error={!!errors.lab}
                            helperText={errors.lab}
                          >
                            {config.lab &&
                              config.lab.map((option, i) => (
                                <MenuItem
                                  key={option}
                                  value={option}
                                  data-cy={`verifikasi-create-lab-option-${i}`}
                                >
                                  {option}
                                </MenuItem>
                              ))}
                          </TextField>
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="verifikasi-create-nama"
                          inputProps={{
                            "data-cy": "verifikasi-create-nama-input",
                          }}
                          FormHelperTextProps={{
                            "data-cy": "verifikasi-create-nama-helper-text",
                          }}
                          margin="normal"
                          fullWidth
                          label="Nama Lengkap"
                          name="nama"
                          value={values.nama}
                          onChange={handleChange}
                          error={!!errors.nama}
                          helperText={errors.nama}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="verifikasi-create-email"
                          inputProps={{
                            "data-cy": "verifikasi-create-email-input",
                          }}
                          FormHelperTextProps={{
                            "data-cy": "verifikasi-create-email-helper-text",
                          }}
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
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="verifikasi-create-password"
                          inputProps={{
                            "data-cy": "verifikasi-create-password-input",
                          }}
                          FormHelperTextProps={{
                            "data-cy": "verifikasi-create-password-helper-text",
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
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Box display="flex" justifyContent="center">
                          <Button
                            data-cy="verifikasi-create-submit"
                            sx={{ minWidth: 200 }}
                            variant="contained"
                            color="success"
                            type="submit"
                            onClick={handleSubmit}
                          >
                            Submit
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

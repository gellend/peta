import {
  Box,
  Container,
  CssBaseline,
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
  MenuItem
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ArrowBack } from "@mui/icons-material";

import Navbar from "../../src/components/Navbar";
import CustomSnackbar from "../../src/components/CustomSnackbar";
import { createFirebaseApp } from "../../firebase/clientApp";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { useRouter } from "next/router";

const mdTheme = createTheme();

export default function CreateUser() {
  const app = createFirebaseApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  // Global
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  // Form
  const [id, setId] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Mahasiswa");

  // Snackbar
  const [snackbarData, setSnackbarData] = useState({ open: false, message: "", type: "" });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await getDoc(doc(db, "users", user.uid));
        setUser(userData.data());
        setIsLoggingIn(false);
      } else {
        router.push("/");
      }
    });

    return unsubscribe;
  }, []);

  const resetForm = () => {
    setId("")
    setNama("")
    setEmail("")
    setPassword("")
    setRole("")
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        await setDoc(doc(db, "users", id), {
          id: id,
          nama: nama,
          email: email,
          role: role,
          created_at: serverTimestamp(),
        });

        handleOpenSnackBar(`${id} berhasil di daftarkan!`, "success")

        router.push("/verifikasi")
      })
      .catch((error) => {
        handleOpenSnackBar(error.message, "error")
      })
      .finally(() => {
        resetForm()
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
    <ThemeProvider theme={mdTheme}>
      {isLoggingIn ? (
        <div>Loading...</div>
      ) : (
        <>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
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
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  // justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
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
                                label={role === "Mahasiswa" ? "NRP" : "NIDN"}
                                variant="outlined"
                                fullWidth
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <TextField
                                label="Nama Lengkap"
                                variant="outlined"
                                fullWidth
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <TextField
                                label="Alamat Email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <TextField
                                select
                                label="Role"
                                fullWidth
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                              >
                                <MenuItem value="Mahasiswa">Mahasiswa</MenuItem>
                                <MenuItem value="Dosen">Dosen</MenuItem>
                              </TextField>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <TextField
                                label="Kata Sandi"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ borderBottom: "none" }}>
                              <Box display="flex" justifyContent="center">
                                <Button
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

          <CustomSnackbar
            open={snackbarData.open}
            message={snackbarData.message}
            type={snackbarData.type}
            onClose={handleCloseSnackBar}
          />
        </>
      )}
    </ThemeProvider>
  );
}

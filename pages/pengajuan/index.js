import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Link from "next/link";
import Navbar from "../../src/components/Navbar";
import { useEffect, useState } from "react";
import { observeAuthState } from "../../src/lib/auth";
import { getData, getUserDataByUid } from "../../src/lib/store";

const mdTheme = createTheme();

function createData(no, judul, nama, nrp, status, aksi) {
  return { no, judul, nama, nrp, status, aksi };
}

const rows = [
  createData(
    1,
    "Implementasi ABC",
    "Bimo",
    "1811110465",
    "Menunggu",
    "Lihat Detail"
  ),
  createData(
    2,
    "Implementasi ABC",
    "Bimo",
    "1811110465",
    "Menunggu",
    "Lihat Detail"
  ),
  createData(
    3,
    "Implementasi ABC",
    "Bimo",
    "1811110465",
    "Menunggu",
    "Lihat Detail"
  ),
];

export default function Pengajuan() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLoginUser = async () => {
    setIsLoading(true);
    const user = await observeAuthState();

    if (user) {
      setUser(user);
      setIsLoading(false);
    }
  };

  const getPengajuan = async (uid) => {
    const pengajuan = await getData("pengajuan", "userId", "==", uid);
    console.log(71, pengajuan);
  };

  useEffect(() => {
    getCurrentLoginUser();
  }, []);

  useEffect(() => {
    if (user) getPengajuan(user.uid);
  }, [user]);

  return (
    <ThemeProvider theme={mdTheme}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
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
              <Link href="/pengajuan/create">
                <Button variant="contained" sx={{ mb: 3 }}>
                  Ajukan Judul
                </Button>
              </Link>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>No</TableCell>
                          <TableCell>Judul</TableCell>
                          <TableCell>Nama</TableCell>
                          <TableCell>NRP</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Aksi</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.no}>
                            <TableCell>{row.no}</TableCell>
                            <TableCell>{row.judul}</TableCell>
                            <TableCell>{row.nama}</TableCell>
                            <TableCell>{row.nrp}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.aksi}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}

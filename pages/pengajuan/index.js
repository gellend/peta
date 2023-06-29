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
import { getPengajuanByCurrentUser } from "../../src/lib/store";

const mdTheme = createTheme();

export default function Pengajuan() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // List pengajuan
  const [listPengajuan, setListPengajuan] = useState([]);

  const getCurrentLoginUser = async () => {
    setIsLoading(true);
    const user = await observeAuthState();

    if (user) {
      setUser(user);
      setIsLoading(false);
    }
  };

  const getPengajuan = async (uid) => {
    const rows = await getPengajuanByCurrentUser(uid);
    console.log(rows);
    setListPengajuan(rows);
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
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listPengajuan && listPengajuan.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6}>
                              Tidak ada pengajuan judul
                            </TableCell>
                          </TableRow>
                        ) : (
                          listPengajuan.map((row, index) => (
                            <TableRow key={row.docId}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{row.judul}</TableCell>
                              <TableCell>{row.nama}</TableCell>
                              <TableCell>{row.id}</TableCell>
                              <TableCell>{row.status}</TableCell>
                              <TableCell>Aksi</TableCell>
                            </TableRow>
                          ))
                        )}
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

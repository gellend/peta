import { ArrowBack, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Input,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Link from "next/link";
import Navbar from "../../src/components/Navbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import { useState } from "react";

const mdTheme = createTheme();

function createData(no, judul, nama, nrp, status, aksi) {
  return { no, judul, nama, nrp, status, aksi };
}

const currencies = [
  {
    value: "USD",
    label: "$",
  },
  {
    value: "EUR",
    label: "€",
  },
  {
    value: "BTC",
    label: "฿",
  },
  {
    value: "JPY",
    label: "¥",
  },
];

export default function CreatePengajuan() {
  const router = useRouter();

  const [judul, setJudul] = useState("");
  const [totalSksLulus, setTotalSksLulus] = useState("");
  const [sksAmbilSemesterIni, setSksAmbilSemesterIni] = useState("");
  const [sksMengulang, setSksMengulang] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [dosenPembimbing1, setDosenPembimbing1] = useState("");
  const [dosenPembimbing2, setDosenPembimbing2] = useState("");
  const [dosenPembimbing3, setDosenPembimbing3] = useState("");

  return (
    <ThemeProvider theme={mdTheme}>
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
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton onClick={() => router.back()}>
                  <ArrowBack />
                </IconButton>
                <Typography variant="h5">Ajukan Judul Tugas Akhir</Typography>
              </Stack>
              <Button variant="contained" color="success">
                Submit
              </Button>
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
                  <Table aria-label="Pengajuan-Left">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <TextField
                            label="Judul"
                            variant="outlined"
                            fullWidth
                            value={judul}
                            onChange={(e) => setJudul(e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            label="Total SKS Lulus"
                            variant="outlined"
                            fullWidth
                            value={totalSksLulus}
                            onChange={(e) => setTotalSksLulus(e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            label="SKS Ambil Smt. Ini"
                            variant="outlined"
                            fullWidth
                            value={sksAmbilSemesterIni}
                            onChange={(e) =>
                              setSksAmbilSemesterIni(e.target.value)
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            label="SKS Nilai D & E"
                            variant="outlined"
                            fullWidth
                            value={sksMengulang}
                            onChange={(e) => setSksMengulang(e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            label="Deskripsi Singkat"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            select
                            label="Usulan Dosen Pembimbing 1"
                            helperText="Pilih Setidaknya 1 Dosen Pembimbing"
                            fullWidth
                            value={dosenPembimbing1}
                            onChange={(e) =>
                              setDosenPembimbing1(e.target.value)
                            }
                          >
                            {currencies.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            select
                            label="Usulan Dosen Pembimbing 2"
                            fullWidth
                            value={dosenPembimbing2}
                            onChange={(e) =>
                              setDosenPembimbing2(e.target.value)
                            }
                          >
                            {currencies.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            select
                            label="Usulan Dosen Pembimbing 3"
                            fullWidth
                            value={dosenPembimbing3}
                            onChange={(e) =>
                              setDosenPembimbing3(e.target.value)
                            }
                          >
                            {currencies.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={12} lg={5}>
                  <Table aria-label="Pengajuan-Right">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Button
                              fullWidth={false}
                              variant="contained"
                              component="label"
                            >
                              Upload KHS Total Terakhir
                              <input
                                hidden
                                accept=".pdf"
                                type="file"
                                onChange={(e) => console.log(e.target.files)}
                              />
                            </Button>
                            <Chip label="Chip Outlined" variant="outlined" />
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Button
                              fullWidth={false}
                              variant="contained"
                              component="label"
                            >
                              Upload FRS Terakhir
                              <input
                                hidden
                                accept=".pdf"
                                type="file"
                                onChange={(e) => console.log(e.target.files)}
                              />
                            </Button>
                            <Chip label="Chip Outlined" variant="outlined" />
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Button
                              fullWidth={false}
                              variant="contained"
                              component="label"
                            >
                              Upload Jalur Pra & Co
                              <input
                                hidden
                                accept=".pdf"
                                type="file"
                                onChange={(e) => console.log(e.target.files)}
                              />
                            </Button>
                            <Chip label="Chip Outlined" variant="outlined" />
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Button
                              fullWidth={false}
                              variant="contained"
                              component="label"
                            >
                              Upload Sertifikat TOEFL (Jika Ada)
                              <input
                                hidden
                                accept=".pdf"
                                type="file"
                                onChange={(e) => console.log(e.target.files)}
                              />
                            </Button>
                            <Chip label="Chip Outlined" variant="outlined" />
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Button
                              fullWidth={false}
                              variant="contained"
                              component="label"
                            >
                              Upload Sertifikat Kompetensi (Jika Ada)
                              <input
                                hidden
                                accept=".pdf"
                                type="file"
                                onChange={(e) => console.log(e.target.files)}
                              />
                            </Button>
                            <Chip label="Chip Outlined" variant="outlined" />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center">
                    <Button
                      sx={{ minWidth: 200 }}
                      variant="contained"
                      color="success"
                    >
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

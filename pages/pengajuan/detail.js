import * as React from "react";

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

export default function DetailPengajuan() {
  const router = useRouter();
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
                <Grid item xs={12} md={5}>
                  <Table aria-label="Pengajuan-Left">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <TextField
                            label="Judul"
                            variant="outlined"
                            value={""}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            label="Total SKS Lulus"
                            variant="outlined"
                            value={""}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            label="SKS Ambil Smt. Ini"
                            variant="outlined"
                            value={""}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            label="SKS Nilai D & E"
                            variant="outlined"
                            value={""}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            label="Deskripsi Singkat"
                            variant="outlined"
                            value={""}
                            fullWidth
                            multiline
                            rows={4}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            select
                            label="Usulan Dosen Pembimbing 1"
                            defaultValue="EUR"
                            helperText="Pilih Setidaknya 1 Dosen Pembimbing"
                            fullWidth
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
                            defaultValue="EUR"
                            fullWidth
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
                            defaultValue="EUR"
                            fullWidth
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
                <Grid item xs={12} md={5}>
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
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

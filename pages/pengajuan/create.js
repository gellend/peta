import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Navbar from "../../src/components/Navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getUsersByRoles } from "../../src/lib/user";
import { observeAuthState } from "../../src/lib/authUtils";
import { uploadFile } from "../../src/lib/upload";

const mdTheme = createTheme();

export default function CreatePengajuan() {
  const router = useRouter();

  // User
  const [userData, setUserData] = useState({});

  // Dosen dropdown
  const [dosenDropdown, setDosenDropdown] = useState([]);

  // Form states
  const [formValues, setFormValues] = useState({
    judul: "",
    totalSksLulus: "",
    sksAmbil: "",
    sksMengulang: "",
    deskripsi: "",
    dosenPembimbing1: "",
    dosenPembimbing2: "",
    dosenPembimbing3: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Destructure form values for easier access
  const {
    judul,
    totalSksLulus,
    sksAmbil,
    sksMengulang,
    deskripsi,
    dosenPembimbing1,
    dosenPembimbing2,
    dosenPembimbing3,
  } = formValues;

  // File map
  const FILE_MAP = {
    khsFile: "khs.pdf",
    frsFile: "frs.pdf",
    jalurPraCoFile: "jalur-pra-co.pdf",
    toeflFile: "toefl.pdf",
    kompetensiFile: "kompetensi.pdf",
  };

  // File states
  const [fileInputs, setFileInputs] = useState({
    khsFile: { file: null, chipLabel: "" },
    frsFile: { file: null, chipLabel: "" },
    jalurPraCoFile: { file: null, chipLabel: "" },
    toeflFile: { file: null, chipLabel: "" },
    kompetensiFile: { file: null, chipLabel: "" },
  });

  const handleFileInputChange = (inputName, file) => {
    setFileInputs((prevInputs) => ({
      ...prevInputs,
      [inputName]: { file, chipLabel: file ? file.name : "" },
    }));
  };

  const getCurrentLoginUser = async () => {
    const user = await observeAuthState();

    if (user) setUserData(user);
  };

  const fetchDataDosen = async () => {
    try {
      const data = await getUsersByRoles(["Dosen"]);
      setDosenDropdown(data);
    } catch (error) {
      console.error("fetchDataDosen:", error);
    }
  };

  useEffect(() => {
    getCurrentLoginUser();
    fetchDataDosen();
  }, []);

  const handleFormSubmit = () => {
    console.log("formValues", formValues);
    Object.entries(fileInputs).forEach(([inputName, input]) => {
      const { file } = input;
      if (file) {
        const fileName = FILE_MAP[inputName];
        if (fileName) {
          uploadFile(file, `user/${userData.uid}/raw/${fileName}`);
        }
      }
    });

    // Reset the file inputs and chip labels
    setFileInputs((prevInputs) =>
      Object.keys(prevInputs).reduce((acc, inputName) => {
        acc[inputName] = { file: null, chipLabel: "" };
        return acc;
      }, {})
    );
  };

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
                            name="judul"
                            onChange={handleInputChange}
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
                            name="totalSksLulus"
                            onChange={handleInputChange}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TextField
                            label="SKS Ambil Smt. Ini"
                            variant="outlined"
                            fullWidth
                            value={sksAmbil}
                            name="sksAmbil"
                            onChange={handleInputChange}
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
                            name="sksMengulang"
                            onChange={handleInputChange}
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
                            name="deskripsi"
                            onChange={handleInputChange}
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
                            name="dosenPembimbing1"
                            onChange={handleInputChange}
                          >
                            {dosenDropdown &&
                              dosenDropdown.map((dosen) => (
                                <MenuItem key={dosen.id} value={dosen.id}>
                                  {dosen.nama}
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
                            name="dosenPembimbing2"
                            onChange={handleInputChange}
                          >
                            {dosenDropdown &&
                              dosenDropdown.map((dosen) => (
                                <MenuItem key={dosen.id} value={dosen.id}>
                                  {dosen.nama}
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
                            name="dosenPembimbing3"
                            onChange={handleInputChange}
                          >
                            {dosenDropdown &&
                              dosenDropdown.map((dosen) => (
                                <MenuItem key={dosen.id} value={dosen.id}>
                                  {dosen.nama}
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
                                onChange={(e) =>
                                  handleFileInputChange(
                                    "khsFile",
                                    e.target.files[0]
                                  )
                                }
                              />
                            </Button>
                            {fileInputs.khsFile.chipLabel && (
                              <Chip
                                label={fileInputs.khsFile.chipLabel}
                                variant="outlined"
                              />
                            )}
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
                                onChange={(e) =>
                                  handleFileInputChange(
                                    "frsFile",
                                    e.target.files[0]
                                  )
                                }
                              />
                            </Button>
                            {fileInputs.frsFile.chipLabel && (
                              <Chip
                                label={fileInputs.frsFile.chipLabel}
                                variant="outlined"
                              />
                            )}
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
                                onChange={(e) =>
                                  handleFileInputChange(
                                    "jalurPraCoFile",
                                    e.target.files[0]
                                  )
                                }
                              />
                            </Button>
                            {fileInputs.jalurPraCoFile.chipLabel && (
                              <Chip
                                label={fileInputs.jalurPraCoFile.chipLabel}
                                variant="outlined"
                              />
                            )}
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
                                onChange={(e) =>
                                  handleFileInputChange(
                                    "toeflFile",
                                    e.target.files[0]
                                  )
                                }
                              />
                            </Button>
                            {fileInputs.toeflFile.chipLabel && (
                              <Chip
                                label={fileInputs.toeflFile.chipLabel}
                                variant="outlined"
                              />
                            )}
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
                                onChange={(e) =>
                                  handleFileInputChange(
                                    "kompetensiFile",
                                    e.target.files[0]
                                  )
                                }
                              />
                            </Button>
                            {fileInputs.kompetensiFile.chipLabel && (
                              <Chip
                                label={fileInputs.kompetensiFile.chipLabel}
                                variant="outlined"
                              />
                            )}
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
                      onClick={handleFormSubmit}
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

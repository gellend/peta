import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
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

import Navbar from "../../src/components/Navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getUsersByRoles, postData } from "../../src/lib/store";
import { getCurrentLoginUser } from "../../src/lib/auth";
import { uploadFile } from "../../src/lib/upload";
import { serverTimestamp } from "firebase/firestore";
import useAppStore from "../../src/store/global";
import useForm from "../../src/helper/useForm";

export default function CreatePengajuan() {
  const router = useRouter();

  // Dosen dropdown
  const [dosenDropdown, setDosenDropdown] = useState([]);

  // Form states
  const initialState = {
    judul: "",
    totalSksLulus: "",
    sksAmbil: "",
    sksMengulang: "",
    deskripsi: "",
    dosenPembimbing1: "",
    dosenPembimbing2: "",
    dosenPembimbing3: "",
  };

  const validationRules = {
    judul: (value) => (!value ? "Judul harus diisi" : ""),
    totalSksLulus: (value) => (!value ? "Total SKS lulus harus diisi" : ""),
    sksAmbil: (value) => (!value ? "SKS ambil harus diisi" : ""),
    sksMengulang: (value) => (!value ? "SKS mengulang harus diisi" : ""),
    deskripsi: (value) => (!value ? "Deskripsi harus diisi" : ""),
    dosenPembimbing1: (value) =>
      !value ? "Minimal harus memiliki 1 dosen pembimbing" : "",
  };

  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    initialState,
    validationRules
  );

  const { currentUser, handleOpenSnackBar } = useAppStore((state) => state);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      try {
        // Upload files
        const fileData = {};
        for (const [inputName, input] of Object.entries(fileInputs)) {
          const { file } = input;
          if (file) {
            const fileName = FILE_MAP[inputName];
            if (fileName) {
              try {
                let path = `user/${currentUser.uid}/raw/${fileName}`;
                await uploadFile(file, path);
                fileData[inputName] = path; // Store filepath
              } catch (error) {
                console.error(`Failed to upload file '${fileName}', ${error}`);
                // Handle the error here (e.g., show an error message to the user)
              }
            }
          }
        }

        // Merge formValues with fileData
        const dataToStore = {
          ...values,
          ...fileData,
          ...currentUser,
          status: "Pending",
          timestamp: serverTimestamp(),
        };

        // Store merged data to Firestore
        const success = await postData("pengajuan", dataToStore);
        if (success) {
          // Reset form
          resetForm();

          // Reset the file inputs and chip labels
          setFileInputs((prevInputs) =>
            Object.keys(prevInputs).reduce((acc, inputName) => {
              acc[inputName] = { file: null, chipLabel: "" };
              return acc;
            }, {})
          );

          // Display snackbar
          handleOpenSnackBar("Pengajuan berhasil dibuat!", "success");

          // Redirect to pengajuan page
          router.push("/pengajuan");
        } else {
          console.log("Failed to store data to Firestore");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

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
                          data-cy="pengajuan-judul"
                          inputProps={{ "data-cy": "pengajuan-judul-input" }}
                          FormHelperTextProps={{
                            "data-cy": "pengajuan-judul-helper-text",
                          }}
                          label="Judul"
                          variant="outlined"
                          fullWidth
                          value={values.judul}
                          name="judul"
                          onChange={handleChange}
                          error={!!errors.judul}
                          helperText={errors.judul}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="sks-lulus"
                          inputProps={{ "data-cy": "sks-lulus-input" }}
                          FormHelperTextProps={{
                            "data-cy": "sks-lulus-helper-text",
                          }}
                          label="Total SKS Lulus"
                          variant="outlined"
                          fullWidth
                          value={values.totalSksLulus}
                          name="totalSksLulus"
                          onChange={handleChange}
                          error={!!errors.totalSksLulus}
                          helperText={errors.totalSksLulus}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="sks-ambil"
                          inputProps={{ "data-cy": "sks-ambil-input" }}
                          FormHelperTextProps={{
                            "data-cy": "sks-ambil-helper-text",
                          }}
                          label="SKS Ambil Smt. Ini"
                          variant="outlined"
                          fullWidth
                          value={values.sksAmbil}
                          name="sksAmbil"
                          onChange={handleChange}
                          error={!!errors.sksAmbil}
                          helperText={errors.sksAmbil}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="sks-mengulang"
                          inputProps={{ "data-cy": "sks-mengulang-input" }}
                          FormHelperTextProps={{
                            "data-cy": "sks-mengulang-helper-text",
                          }}
                          label="SKS Nilai D & E"
                          variant="outlined"
                          fullWidth
                          value={values.sksMengulang}
                          name="sksMengulang"
                          onChange={handleChange}
                          error={!!errors.sksMengulang}
                          helperText={errors.sksMengulang}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="deskripsi"
                          inputProps={{ "data-cy": "deskripsi-input" }}
                          FormHelperTextProps={{
                            "data-cy": "deskripsi-helper-text",
                          }}
                          label="Deskripsi Singkat"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={4}
                          value={values.deskripsi}
                          name="deskripsi"
                          onChange={handleChange}
                          error={!!errors.deskripsi}
                          helperText={errors.deskripsi}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="input-dospem-1"
                          select
                          label="Usulan Dosen Pembimbing 1"
                          fullWidth
                          value={values.dosenPembimbing1}
                          name="dosenPembimbing1"
                          onChange={handleChange}
                          error={!!errors.dosenPembimbing1}
                          helperText={errors.dosenPembimbing1}
                        >
                          {dosenDropdown &&
                            dosenDropdown.map((dosen) => (
                              <MenuItem
                                data-cy={`select-dospem-1-${dosen.id}`}
                                key={dosen.id}
                                value={dosen.id}
                              >
                                {dosen.nama}
                              </MenuItem>
                            ))}
                        </TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="input-dospem-2"
                          select
                          label="Usulan Dosen Pembimbing 2"
                          fullWidth
                          value={values.dosenPembimbing2}
                          name="dosenPembimbing2"
                          onChange={handleChange}
                        >
                          {dosenDropdown &&
                            dosenDropdown.map((dosen) => (
                              <MenuItem
                                data-cy={`select-dospem-2-${dosen.id}`}
                                key={dosen.id}
                                value={dosen.id}
                              >
                                {dosen.nama}
                              </MenuItem>
                            ))}
                        </TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          data-cy="input-dospem-3"
                          select
                          label="Usulan Dosen Pembimbing 3"
                          fullWidth
                          value={values.dosenPembimbing3}
                          name="dosenPembimbing3"
                          onChange={handleChange}
                        >
                          {dosenDropdown &&
                            dosenDropdown.map((dosen) => (
                              <MenuItem
                                data-cy={`select-dospem-3-${dosen.id}`}
                                key={dosen.id}
                                value={dosen.id}
                              >
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
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Button
                            data-cy="button-upload-khs"
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
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Button
                            data-cy="button-upload-frs"
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
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Button
                            data-cy="button-upload-jalurPraCo"
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
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Button
                            data-cy="button-upload-toefl"
                            fullWidth={false}
                            variant="contained"
                            component="label"
                          >
                            Upload Sertifikat TOEFL
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
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Button
                            data-cy="button-upload-kompetensi"
                            fullWidth={false}
                            variant="contained"
                            component="label"
                          >
                            Upload Sertifikat Kompetensi
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
                    data-cy="button-submit"
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
  );
}

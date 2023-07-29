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
import { PDFDocument } from "pdf-lib";

import Navbar from "../../src/components/Navbar";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
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

  const { currentUser, setIsLoading, handleOpenSnackBar } = useAppStore(
    (state) => state
  );

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

  // Function to generate the PDF
  const generatePdf = async (formData, signature) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const { width, height } = page.getSize();
    const margin = 50;
    const textHeight = 20;

    const drawText = (x, y, text, options = {}) => {
      page.drawText(text, {
        x: x + margin,
        y: height - y - margin,
        ...options,
      });
    };

    // Draw the form data and signature on the PDF
    drawText(0, 0, "Judul Tugas Akhir:");
    drawText(0, textHeight, formData.judul);

    drawText(0, textHeight * 3, "Total SKS Lulus:");
    drawText(0, textHeight * 4, formData.totalSksLulus);

    drawText(0, textHeight * 6, "SKS Ambil:");
    drawText(0, textHeight * 7, formData.sksAmbil);

    drawText(0, textHeight * 9, "SKS Mengulang:");
    drawText(0, textHeight * 10, formData.sksMengulang);

    drawText(0, textHeight * 12, "Deskripsi:");
    drawText(0, textHeight * 13, formData.deskripsi);

    drawText(0, textHeight * 15, "Dosen Pembimbing 1:");
    drawText(0, textHeight * 16, getDosenName(formData.dosenPembimbing1));

    drawText(0, textHeight * 18, "Dosen Pembimbing 2:");
    drawText(0, textHeight * 19, getDosenName(formData.dosenPembimbing2));

    drawText(0, textHeight * 21, "Dosen Pembimbing 3:");
    drawText(0, textHeight * 22, getDosenName(formData.dosenPembimbing3));

    // Draw the signature image
    if (signature) {
      const signatureImage = await pdfDoc.embedPng(signature);
      const imageSize = { width: 100, height: 50 };
      page.drawImage(signatureImage, {
        x: width - imageSize.width - margin,
        y: margin,
        width: imageSize.width,
        height: imageSize.height,
      });
    }

    // Save the PDF to a blob
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
  };

  // Helper function to get Dosen name from the dropdown data
  const getDosenName = (dosenId) => {
    const dosen = dosenDropdown.find((dosen) => dosen.id === dosenId);
    return dosen ? dosen.nama : "";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      try {
        setIsLoading(true);
        const pdfPath = await uploadPdfToStorage(signature);
        const fileData = await uploadFilesToStorage();
        const mergedData = mergeFormAndFileData(pdfPath, fileData);

        const success = await storeDataToFirestore(mergedData);

        if (success) {
          // Reset form and file inputs
          resetForm();
          setFileInputs((prevInputs) => ({
            ...Object.fromEntries(
              Object.keys(prevInputs).map((name) => [
                name,
                { file: null, chipLabel: "" },
              ])
            ),
          }));

          handleOpenSnackBar("Pengajuan berhasil dibuat!", "success");
          router.push("/pengajuan");
        } else {
          console.log("Failed to store data to Firestore");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Helper function to upload the generated PDF to Firebase Storage
  const uploadPdfToStorage = async (signature) => {
    const formPdfBlob = await generatePdf(values, signature);
    const pdfPath = `user/${currentUser.uid}/raw/pengajuan.pdf`;

    try {
      await uploadFile(formPdfBlob, pdfPath);
      return pdfPath;
    } catch (error) {
      console.error(`Failed to upload file 'pengajuan.pdf', ${error}`);
      throw error; // Rethrow the error to handle it in the main function
    }
  };

  // Helper function to upload each file to Firebase Storage
  const uploadFilesToStorage = async () => {
    const fileData = {};

    for (const [inputName, input] of Object.entries(fileInputs)) {
      const { file } = input;
      if (file) {
        const fileName = FILE_MAP[inputName];
        if (fileName) {
          try {
            const path = `user/${currentUser.uid}/raw/${fileName}`;
            await uploadFile(file, path);
            fileData[inputName] = path;
          } catch (error) {
            console.error(`Failed to upload file '${fileName}', ${error}`);
            // Handle the error here (e.g., show an error message to the user)
          }
        }
      }
    }

    return fileData;
  };

  // Helper function to merge form data with file data and other necessary data
  const mergeFormAndFileData = (pdfPath, fileData) => {
    return {
      ...values,
      ...fileData,
      pengajuanFile: pdfPath,
      ...currentUser,
      status: "Pending",
      timestamp: serverTimestamp(),
    };
  };

  // Helper function to store merged data to Firestore
  const storeDataToFirestore = async (dataToStore) => {
    try {
      const success = await postData("pengajuan", dataToStore);
      return success;
    } catch (error) {
      console.error("Failed to store data to Firestore", error);
      return false;
    }
  };

  // Signature states
  const [signature, setSignature] = useState(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  // Function to clear the signature
  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  // Function to save the signature as an image (you can also use toDataURL)
  const saveSignature = () => {
    const canvas = canvasRef.current;
    const signatureImage = canvas.toDataURL(); // This will give you the signature as a base64 data URI
    setSignature(signatureImage);
  };

  // Function to handle mouse down event on the canvas
  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Function to handle mouse move event on the canvas
  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Function to handle mouse up event on the canvas
  const handleMouseUp = () => {
    isDrawing.current = false;
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
                    <TableRow>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {/* Signature Canvas */}
                          <canvas
                            ref={canvasRef}
                            width={400}
                            height={200}
                            style={{ border: "1px solid black" }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                          />
                          {/* Buttons for signature */}
                          <Button
                            data-cy="button-clear-signature"
                            variant="contained"
                            onClick={clearSignature}
                          >
                            Clear
                          </Button>
                          <Button
                            data-cy="button-save-signature"
                            variant="contained"
                            onClick={saveSignature}
                          >
                            Save
                          </Button>
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

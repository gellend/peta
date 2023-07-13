import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Icon,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { useRouter } from "next/router";
import Navbar from "../../../src/components/Navbar";
import { useEffect, useState } from "react";
import { getCurrentLoginUser } from "../../../src/lib/auth";
import { getDetailPengajuan } from "../../../src/lib/store";
import { downloadFile } from "../../../src/lib/upload";

export default function DetailPengajuan() {
  const router = useRouter();
  const docId = router.query.id;

  const [pengajuan, setPengajuan] = useState(null);

  const getPengajuan = async (docId) => {
    const rows = await getDetailPengajuan(docId);
    setPengajuan(rows);
  };

  const getStatus = (status) => {
    if (status === "Pending") {
      return <Chip label="Pending" color="warning" sx={{ maxWidth: 100 }} />;
    }
  };

  useEffect(() => {
    getCurrentLoginUser();
    if (docId) getPengajuan(docId);
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
              <Typography variant="h5">Detail Pengajuan</Typography>
            </Stack>
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Typography variant="h5">
                    {pengajuan ? pengajuan.judul : ""}
                  </Typography>
                  <Typography variant="subtitle1">
                    Oleh {pengajuan ? pengajuan.nama : ""}
                  </Typography>
                  <Divider />
                  <Typography variant="body2">
                    Status{"  "}
                    {pengajuan ? getStatus(pengajuan.status) : ""}
                  </Typography>
                </Stack>
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Typography variant="body1">
                    {pengajuan ? pengajuan.deskripsi : ""}
                  </Typography>
                  <Divider />
                  <Typography variant="body2">Berkas</Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<Icon>download</Icon>}
                      label="Berkas Pengajuan"
                      variant="outlined"
                      color="primary"
                      onClick={() => console.log("ok")}
                    />
                    <Chip
                      icon={<Icon>download</Icon>}
                      label="KHS"
                      variant="outlined"
                      color="primary"
                      onClick={() => downloadFile(pengajuan.khsFile, "khs.pdf")}
                    />
                    <Chip
                      icon={<Icon>download</Icon>}
                      label="FRS"
                      variant="outlined"
                      color="primary"
                      onClick={() => downloadFile(pengajuan.frsFile, "frs.pdf")}
                    />
                    <Chip
                      icon={<Icon>download</Icon>}
                      label="Jalur Pra & Co"
                      variant="outlined"
                      color="primary"
                      onClick={() => downloadFile(pengajuan.jalurPraCoFile, "jalurpraco.pdf")}
                    />
                    <Chip
                      icon={<Icon>download</Icon>}
                      label="TOEFL"
                      variant="outlined"
                      color="primary"
                      onClick={() => downloadFile(pengajuan.toeflFile, "toefl.pdf")}
                    />
                    <Chip
                      icon={<Icon>download</Icon>}
                      label="Kompetensi"
                      variant="outlined"
                      color="primary"
                      onClick={() => downloadFile(pengajuan.kompetensiFile, "kompetensi.pdf")}
                    />
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" color="success">
                    Setujui
                  </Button>
                  <Button variant="contained" color="error">
                    Tolak
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

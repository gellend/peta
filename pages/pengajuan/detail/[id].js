import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
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
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Typography variant="h5">
                    {pengajuan ? pengajuan.judul : ""}
                  </Typography>
                  <Typography variant="subtitle1">
                    Oleh {pengajuan ? pengajuan.nama : ""}
                  </Typography>
                  {pengajuan ? getStatus(pengajuan.status) : ""}
                  <Button variant="contained" sx={{ maxWidth: 200 }}>
                    Unduh Berkas
                  </Button>
                </Stack>
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Typography variant="body1">
                    {pengajuan ? pengajuan.deskripsi : ""}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" color="success">
                    Setujui
                  </Button>
                  <Button variant="contained" color="error">
                    Tolak
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
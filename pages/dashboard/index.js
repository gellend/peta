import {
  Box,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";

import Navbar from "../../src/components/Navbar";

export default function Dashboard() {
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 140,
                }}
              >
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Total Pengajuan Judul TA
                </Typography>
                <Typography variant="h5">18</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 140,
                }}
              >
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Pengajuan Judul TA Disetujui
                </Typography>
                <Typography variant="h5">9</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 140,
                }}
              >
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Pengajuan Judul TA Ditolak
                </Typography>
                <Typography variant="h5">9</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

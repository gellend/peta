import * as React from 'react';

import { Box, Container, CssBaseline, Grid, Paper, Toolbar } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Navbar from '../../src/components/Navbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const mdTheme = createTheme();

function createData(no, judul, nama, nrp, status, aksi) {
  return { no, judul, nama, nrp, status, aksi };
}

const rows = [
  createData(
    1,
    'Implementasi ABC',
    'Bimo',
    '1811110465',
    'Menunggu',
    'Lihat Detail',
  ),
  createData(
    2,
    'Implementasi ABC',
    'Bimo',
    '1811110465',
    'Menunggu',
    'Lihat Detail',
  ),
  createData(
    3,
    'Implementasi ABC',
    'Bimo',
    '1811110465',
    'Menunggu',
    'Lihat Detail',
  ),

];

export default function Pengajuan() {
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Table size="small">
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
    </ThemeProvider>
  );
}
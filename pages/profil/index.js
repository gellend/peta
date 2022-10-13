import * as React from 'react';

import { Avatar, Box, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableRow, Toolbar, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Navbar from '../../src/components/Navbar';

const mdTheme = createTheme();

export default function Dashboard() {
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
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 3 }}>Profil Bimo Satriyo</Typography>
                  <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 128, height: 128, mb: 3 }}
                  />
                  <Table aria-label="Data Diri">
                    <TableBody>
                      <TableRow>
                        <TableCell>NRP</TableCell>
                        <TableCell>181111030</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Nama</TableCell>
                        <TableCell>Bimo Satriyo</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>bimo@mhs.stiki.ac.id</TableCell>
                      </TableRow>
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
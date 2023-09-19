import {
  Box,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  Button,
  TableHead,
} from "@mui/material";

import Link from "next/link";
import Navbar from "../../src/components/Navbar";
import { useEffect, useState } from "react";
import { getCurrentLoginUser } from "../../src/lib/auth";
import { getDataFromCollection } from "../../src/lib/store";

export default function Verifikasi() {
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const userData = await getDataFromCollection("users");
      setListUsers(userData);
    };
    getUsers();
  }, []);

  useEffect(() => {
    getCurrentLoginUser();
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
          <Link href="/verifikasi/create">
            <Button
              data-cy="btn-tambah-pengguna"
              variant="contained"
              sx={{ mb: 3 }}
            >
              Tambah Pengguna
            </Button>
          </Link>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Nama</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listUsers &&
                      listUsers.map((user, index) => (
                        <TableRow key={user.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.nama}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Button>Test</Button>
                          </TableCell>
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
  );
}

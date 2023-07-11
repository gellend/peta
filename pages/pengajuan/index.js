import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";
import Navbar from "../../src/components/Navbar";
import { useEffect, useState } from "react";
import { getCurrentLoginUser } from "../../src/lib/auth";
import { getPengajuanByCurrentUser } from "../../src/lib/store";
import useAppStore from "../../src/store/global";
import { useRouter } from "next/router";

export default function Pengajuan() {
  const router = useRouter();
  const { currentUser } = useAppStore((state) => state);

  // List pengajuan
  const [listPengajuan, setListPengajuan] = useState([]);

  const getPengajuan = async (email) => {
    const rows = await getPengajuanByCurrentUser(email);
    setListPengajuan(rows);
  };

  useEffect(() => {
    getCurrentLoginUser();
  }, []);

  useEffect(() => {
    if (currentUser) getPengajuan(currentUser.email);
  }, [currentUser]);

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
          <Button
            data-cy="btn-ajukan-judul"
            variant="contained"
            onClick={() => router.push("/pengajuan/create")}
            sx={{ mb: 3 }}
          >
            Ajukan Judul
          </Button>
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
                      <TableCell>Judul</TableCell>
                      <TableCell>Nama</TableCell>
                      <TableCell>NRP</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listPengajuan && listPengajuan.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          Tidak ada pengajuan judul
                        </TableCell>
                      </TableRow>
                    ) : (
                      listPengajuan.map((row, index) => (
                        <TableRow key={row.docId}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.judul}</TableCell>
                          <TableCell>{row.nama}</TableCell>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() =>
                                router.push(`/pengajuan/detail/${row.docId}`)
                              }
                            >
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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

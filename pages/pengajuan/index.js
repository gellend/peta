import { Box, Button, Container, Grid, Paper, Toolbar } from "@mui/material";
import Navbar from "../../src/components/Navbar";
import { useEffect, useState } from "react";
import { getCurrentLoginUser } from "../../src/lib/auth";
import {
  getPengajuanByAdmin,
  getPengajuanByDosen,
  getPengajuanByKepalaProdi,
  getPengajuanByKoordinator,
  getPengajuanByMahasiswa,
} from "../../src/lib/store";
import useAppStore from "../../src/store/global";
import { useRouter } from "next/router";
import DataTable from "../../src/components/DataTable";
import SignatureAlert from "../../src/components/SignatureAlert";

export default function Pengajuan() {
  const router = useRouter();
  const { currentUser } = useAppStore((state) => state);

  // List pengajuan
  const [listPengajuan, setListPengajuan] = useState([]);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "nrp", headerName: "NRP", width: 150 },
    { field: "nama", headerName: "Nama", width: 200 },
    { field: "judul", headerName: "Judul", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => router.push(`/pengajuan/detail/${params.row.id}`)}
        >
          Detail
        </Button>
      ),
    },
  ];

  const getPengajuan = async () => {
    let rows = [];
    const role = currentUser.role;

    if (role === "Mahasiswa") {
      rows = await getPengajuanByMahasiswa(currentUser.email);
    } else if (role === "Dosen") {
      rows = await getPengajuanByDosen(currentUser.id);
    } else if (role === "Kepala Prodi") {
      rows = await getPengajuanByKepalaProdi(currentUser.prodi);
    } else if (role === "Koordinator Lab") {
      rows = await getPengajuanByKoordinator(currentUser.lab);
    } else if (role === "Admin") {
      rows = await getPengajuanByAdmin();
    }

    const mappedRows = rows.map((row) => ({
      id: row.docId,
      judul: row.judul,
      nama: row.nama,
      nrp: row.id,
      status: row.status,
      action: (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => router.push(`/pengajuan/detail/${row.id}`)}
        >
          Detail
        </Button>
      ),
    }));

    setListPengajuan(mappedRows);
  };

  useEffect(() => {
    getCurrentLoginUser();
  }, []);

  useEffect(() => {
    if (currentUser) getPengajuan();
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
          {/* check if signature is exist */}
          <SignatureAlert />

          {/* scope: only Mahasiswa can see this button */}
          {currentUser && currentUser.role === "Mahasiswa" && (
            <Button
              data-cy="btn-ajukan-judul"
              variant="contained"
              onClick={() => router.push("/pengajuan/create")}
              sx={{ mb: 3 }}
              disabled={currentUser?.signature ? false : true}
            >
              Ajukan Judul
            </Button>
          )}
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                {listPengajuan.length > 0 ? (
                  <DataTable columns={columns} rows={listPengajuan} />
                ) : (
                  <div>Tidak ada pengajuan judul</div>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

import { Box, Container, Grid, Paper, Toolbar, Button } from "@mui/material";
import Link from "next/link";
import Navbar from "../../src/components/Navbar";
import { useEffect, useState } from "react";
import { getCurrentLoginUser } from "../../src/lib/auth";
import { getDataFromCollection } from "../../src/lib/store";
import { useRouter } from "next/router";
import DataTable from "../../src/components/DataTable";

export default function Verifikasi() {
  const router = useRouter();

  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "nama", headerName: "Nama", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => router.push(`/verifikasi/edit/${params.row.docId}`)}
        >
          Edit
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const getUsers = async () => {
      const userData = await getDataFromCollection("users");

      const mappedRows = userData.map((user) => ({
        id: user.id,
        nama: user.nama || "",
        email: user.email || "",
        role: user.role || "",
        docId: user.docId,
        action: user.docId ? (
          <Button
            color="primary"
            size="small"
            onClick={() => router.push(`/verifikasi/edit/${user.docId}`)}
          >
            Edit
          </Button>
        ) : (
          ""
        ),
      }));

      setRows(mappedRows);
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
                {rows.length > 0 ? (
                  <DataTable columns={columns} rows={rows} />
                ) : (
                  <div>Tidak ada user terdaftar</div>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

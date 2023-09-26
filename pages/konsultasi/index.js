import {
  Avatar,
  Box,
  Container,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import Navbar from "../../src/components/Navbar";
import { findOrGenerateRoomId, getUsersByRoles } from "../../src/lib/store";
import { getCurrentLoginUser } from "../../src/lib/auth";
import { useEffect, useState } from "react";
import useAppStore from "../../src/store/global";
import { useRouter } from "next/router";

export default function Konsultasi() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [users, setUsers] = useState([]);
  const { currentUser, handleOpenDialog, handleOpenSnackBar, setIsLoading } =
    useAppStore((state) => state);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);

    const filtered = users.filter((row) =>
      Object.values(row).some((field) =>
        field.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredRows(filtered);
  };

  const getUsers = async () => {
    try {
      setIsLoading(true);
      let data;
      if (currentUser.role === "Mahasiswa") {
        data = await getUsersByRoles([
          "Dosen",
          "Kepala Prodi",
          "Koordinator Lab",
        ]);
      } else {
        data = await getUsersByRoles(["Mahasiswa"]);
      }

      const userPromises = data.map(async (row) => {
        const room = await findOrGenerateRoomId(currentUser.uid, row.docId);
        return {
          ...row,
          room,
        };
      });

      const res = await Promise.all(userPromises);
      setUsers(res);
    } catch (error) {
      console.error("getUsers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLoginUser();
  }, []);

  useEffect(() => {
    if (currentUser) getUsers();
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
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100%",
                }}
              >
                <TextField
                  label="Cari Dosen untuk Konsultasi"
                  variant="outlined"
                  fullWidth
                  value={search}
                  onChange={handleSearchChange}
                  sx={{ mb: 3 }}
                />
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    gap: 1,
                  }}
                >
                  {filteredRows && filteredRows.length > 0
                    ? filteredRows.map((row) => (
                        <ListItemButton
                          key={row.id}
                          alignItems="flex-start"
                          onClick={() =>
                            router.push(`/konsultasi/room/${row.room}`)
                          }
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={row.nama}
                              src={
                                row.photo
                                  ? row.photo
                                  : "/static/images/avatar/1.jpg"
                              }
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={row.nama}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  {row.role}
                                </Typography>
                              </>
                            }
                          />
                        </ListItemButton>
                      ))
                    : users.map((row) => (
                        <ListItemButton
                          key={row.id}
                          alignItems="flex-start"
                          onClick={() =>
                            router.push(`/konsultasi/room/${row.room}`)
                          }
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={row.nama}
                              src={
                                row.photo
                                  ? row.photo
                                  : "/static/images/avatar/1.jpg"
                              }
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={row.nama}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  {row.role}
                                </Typography>
                              </>
                            }
                          />
                        </ListItemButton>
                      ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

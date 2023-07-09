import {
  Avatar,
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";

import { Edit } from "@mui/icons-material";
import Link from "next/link";
import Navbar from "../../src/components/Navbar";
import { useEffect } from "react";
import { getCurrentLoginUser } from "../../src/lib/auth";
import useAppStore from "../../src/store/global";

export default function Profil() {
  const { currentUser } = useAppStore((state) => state);

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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h5">
                    Profil {currentUser ? currentUser.nama : ""}
                  </Typography>
                  <Link href="/profil/update">
                    <IconButton>
                      <Edit />
                    </IconButton>
                  </Link>
                </Stack>
                <Avatar
                  alt={currentUser ? currentUser.nama : ""}
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 128, height: 128, mb: 3 }}
                />
                <Table aria-label="Data Diri">
                  <TableBody>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>{currentUser ? currentUser.id : ""}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Nama</TableCell>
                      <TableCell>
                        {currentUser ? currentUser.nama : ""}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>
                        {currentUser ? currentUser.email : ""}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Role</TableCell>
                      <TableCell>
                        {currentUser ? currentUser.role : ""}
                      </TableCell>
                    </TableRow>
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

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
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import Navbar from "../../src/components/Navbar";
import useAppStore from "../../src/store/global";

export default function UpdateProfile() {
  const { currentUser } = useAppStore((state) => state);

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
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 3 }}
                >
                  <Link href="/profile">
                    <IconButton>
                      <ArrowBack />
                    </IconButton>
                  </Link>
                  <Typography variant="h5">Update profile</Typography>
                </Stack>
                <Avatar
                  alt={currentUser ? currentUser.nama : ""}
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 128, height: 128, mb: 3 }}
                />
                <Table aria-label="Data Diri">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <TextField
                          label="Nama"
                          variant="outlined"
                          value={currentUser ? currentUser.nama : ""}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          label="Email"
                          variant="outlined"
                          value={currentUser ? currentUser.email : ""}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          label="Role"
                          variant="outlined"
                          value={currentUser ? currentUser.role : ""}
                        />
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

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
import { createFirebaseApp } from "../../firebase/clientApp";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useRouter } from "next/router";

export default function Verifikasi() {
  const app = createFirebaseApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await getDoc(doc(db, "users", user.uid));
        setUser(userData.data());
        setIsLoggingIn(false);
      } else {
        router.push("/");
      }
    });

    return unsubscribe;
  }, []);

  // Retrive data users from firebase
  const [listUsers, setListUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      const userData = await getDocs(collection(db, "users"));
      setListUsers(userData.docs.map((doc) => ({ ...doc.data() })));
    };
    getUsers();
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
            <Button variant="contained" sx={{ mb: 3 }}>
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
                      <TableCell>Status</TableCell>
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
                          <TableCell>{user.isVerified}</TableCell>
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

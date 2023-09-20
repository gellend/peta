import {
  Avatar,
  Box,
  Button,
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

import { ArrowBack, Delete } from "@mui/icons-material";
import Link from "next/link";
import Navbar from "../../src/components/Navbar";
import useAppStore from "../../src/store/global";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { getCurrentLoginUser } from "../../src/lib/auth";
import { postData } from "../../src/lib/store";

export default function UpdateProfile() {
  const { currentUser, handleOpenSnackBar, setIsLoading } = useAppStore(
    (state) => state
  );

  // Signature states
  const [signature, setSignature] = useState(null);
  const signatureCanvasRef = useRef();

  // Function to clear the signature
  const clearSignature = () => {
    signatureCanvasRef.current.clear();
    setSignature(null);
  };

  // Function to save the signature as an image
  const saveSignature = () => {
    const signatureImage = signatureCanvasRef.current.toDataURL();
    setSignature(signatureImage);
  };

  const handleUpdateProfile = async () => {
    let dataToStore = { ...currentUser, signature: signature };
    delete dataToStore.uid;

    try {
      setIsLoading(true);
      const isUpdated = await postData("users", dataToStore, currentUser.uid);

      if (isUpdated) {
        handleOpenSnackBar("Update profile berhasil", "success");
      } else {
        handleOpenSnackBar("Update profile gagal", "error");
      }
    } catch (error) {
      console.error("handleUpdateProfile:", error);
      handleOpenSnackBar("Update profile gagal", "error");
    } finally {
      getCurrentLoginUser();
    }
  };

  useEffect(() => {
    if (currentUser) {
      setSignature(currentUser.signature);
      signatureCanvasRef.current.fromDataURL(currentUser.signature);
    }
  }, [currentUser]);

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
                  alt={currentUser?.nama}
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
                          value={currentUser?.nama}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          label="Email"
                          variant="outlined"
                          value={currentUser?.email}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          label="Role"
                          variant="outlined"
                          value={currentUser?.role}
                          disabled
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          label="Program Studi"
                          variant="outlined"
                          value={currentUser?.prodi}
                          disabled
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Stack direction="column" spacing={2} alignItems="left">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Typography variant="subtitle2">
                              Tanda tangan
                            </Typography>
                            <IconButton
                              size="small"
                              variant="contained"
                              onClick={clearSignature}
                              color="error"
                              disabled={!signature}
                            >
                              <Delete />
                            </IconButton>
                          </Stack>
                          <div style={{ border: "1px solid black" }}>
                            <SignatureCanvas
                              ref={signatureCanvasRef}
                              penColor="black"
                              onEnd={() => {
                                saveSignature();
                              }}
                              canvasProps={{
                                width: 450,
                                height: 200,
                              }}
                            />
                          </div>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={handleUpdateProfile}
                        >
                          Update
                        </Button>
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

import { ArrowBack, OpenInNew } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { useRouter } from "next/router";
import Navbar from "../../../src/components/Navbar";
import { useEffect, useState } from "react";
import { getCurrentLoginUser } from "../../../src/lib/auth";
import {
  getDetailPengajuan,
  getPushSubscription,
  getUserDataById,
  getUsersByRoles,
  postData,
  storeNotification,
} from "../../../src/lib/store";
import { generateDownloadUrl } from "../../../src/lib/upload";
import useAppStore from "../../../src/store/global";
import useSocket, { emitNotification } from "../../../src/lib/socket";
import SignatureAlert from "../../../src/components/SignatureAlert";
import { generateAndUploadPdf } from "../../../src/lib/pdf";

export default function DetailPengajuan() {
  const router = useRouter();
  const docId = router.query.id;
  const { currentUser, handleOpenDialog, handleOpenSnackBar, setIsLoading } =
    useAppStore((state) => state);
  const socket = useSocket();
  const [pengajuan, setPengajuan] = useState(null);
  const [currentDosenKey, setCurrentDosenKey] = useState("");

  const getPengajuan = async (docId) => {
    const rows = await getDetailPengajuan(docId);
    setPengajuan(rows);
  };

  const statusLabels = new Map([
    [
      "0",
      { label: "Menunggu Verifikasi Dosen Pembimbing 1", color: "warning" },
    ],
    [
      "1",
      { label: "Menunggu Verifikasi Dosen Pembimbing 2", color: "warning" },
    ],
    [
      "2",
      { label: "Menunggu Verifikasi Dosen Pembimbing 3", color: "warning" },
    ],
    [
      "3",
      { label: "Menunggu Verifikasi Dosen Koordinator Lab", color: "warning" },
    ],
    ["4", { label: "Menunggu Verifikasi Kepala Prodi", color: "warning" }],
    ["5", { label: "Ditolak Dosen Pembimbing 1", color: "error" }],
    ["6", { label: "Ditolak Dosen Pembimbing 2", color: "error" }],
    ["7", { label: "Ditolak Dosen Pembimbing 3", color: "error" }],
    ["8", { label: "Ditolak Dosen Koordinator Lab", color: "error" }],
    ["9", { label: "Ditolak Kepala Prodi", color: "error" }],
    ["10", { label: "Disetujui", color: "success" }],
  ]);

  const getStatusChip = (status) => {
    const statusInfo = statusLabels.get(status);

    if (statusInfo) {
      return <Chip label={statusInfo.label} color={statusInfo.color} />;
    }

    return "";
  };

  const openUrlInNewTab = (path) => {
    generateDownloadUrl(path, (url) => {
      window.open(url, "_blank");
    });
  };

  const shouldDisableApproveButton = () => {
    if (!pengajuan || !currentUser?.signature) return true;

    if (pengajuan.status === "0" && currentDosenKey === "dosenPembimbing1")
      return false;
    if (pengajuan.status === "1" && currentDosenKey === "dosenPembimbing2")
      return false;
    if (pengajuan.status === "2" && currentDosenKey === "dosenPembimbing3")
      return false;
    if (pengajuan.status === "3" && currentDosenKey === "dosenLab")
      return false;
    if (pengajuan.status === "4" && currentDosenKey === "kepalaProdi")
      return false;

    return true;
  };

  const getUrutanDosen = (dosenId) => {
    const dosenPembimbingKeys = [
      "",
      pengajuan?.dosenPembimbing1.id,
      pengajuan?.dosenPembimbing2.id,
      pengajuan?.dosenPembimbing3.id,
    ];
    return dosenPembimbingKeys.indexOf(dosenId);
  };

  const getNextReceiver = async () => {
    let data;
    let keyNextDosen = `dosenPembimbing${getUrutanDosen(currentUser.id) + 1}`;
    let nextReceiverId = pengajuan[keyNextDosen]?.id;

    if (!nextReceiverId) {
      if (!pengajuan.dosenLab.signature) {
        console.log("get dosen lab");
        nextReceiverId = pengajuan.dosenLab.id;
      } else if (currentDosenKey === "dosenLab") {
        console.log("get kaprodi");
        const data = await getUsersByRoles(["Kepala Prodi"]);
        return data.filter((u) => u.prodi === pengajuan.prodi)[0] || null;
      }
    }

    if (nextReceiverId) {
      data = await getUserDataById(nextReceiverId);
    }

    return data || null;
  };

  const getNextStatusPengajuan = (approve) => {
    if (approve) {
      if (pengajuan.status === "4") return "10";

      let keyNextDosen = `dosenPembimbing${getUrutanDosen(currentUser.id) + 1}`;
      let isNextDosenExist = pengajuan[keyNextDosen]?.id;

      if (keyNextDosen === "dosenPembimbing2") {
        return "1";
      }

      if (keyNextDosen === "dosenPembimbing3") {
        return "2";
      }

      if (!isNextDosenExist) {
        if (!pengajuan.dosenLab.signature) {
          return "3";
        } else if (currentDosenKey === "dosenLab") {
          return "4";
        }
      }

      return pengajuan.status;
    } else {
      if (pengajuan.status === "0") return "5";
      if (pengajuan.status === "1") return "6";
      if (pengajuan.status === "2") return "7";
      if (pengajuan.status === "3") return "8";
      if (pengajuan.status === "4") return "9";
    }
  };

  const approvePengajuan = async (v) => {
    let dataToStore = {
      ...pengajuan,
      status: getNextStatusPengajuan(true),
      [currentDosenKey]: {
        id: currentUser.id,
        signature: currentUser.signature,
        keterangan: v,
        nama: currentUser.nama,
        lab: currentUser.lab || "",
      },
    };

    const pengajuanFile = await generateAndUploadPdf(dataToStore);

    dataToStore = {
      ...dataToStore,
      pengajuanFile,
    };

    try {
      setIsLoading(true);
      // const success = false;
      const success = await postData("pengajuan", dataToStore, pengajuan.docId);

      if (success) {
        handleOpenSnackBar("Pengajuan berhasil disetujui!", "success");
        const nextReceiver = await getNextReceiver();
        const data = await getPushSubscription(nextReceiver.docId);

        // Store notification in Firestore
        await storeNotification({
          title: "Pengajuan",
          body: `Hi, ${nextReceiver.nama}! Pengajuan baru menunggu approval dari Anda`,
          sender_uid: currentUser.uid,
          sender_name: currentUser.nama,
          receiver_uid: nextReceiver.docId,
        });

        if (socket) {
          emitNotification(
            socket,
            "Pengajuan",
            `Hi, ${nextReceiver.nama}! Pengajuan baru menunggu approval dari Anda`,
            data?.subscription
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      getPengajuan(docId);
      setIsLoading(false);
    }
  };

  const rejectPengajuan = async (v) => {
    let dataToStore = {
      ...pengajuan,
      status: getNextStatusPengajuan(false),
      [currentDosenKey]: {
        id: currentUser.id,
        keterangan: v,
        nama: currentUser.nama,
        lab: currentUser.lab || "",
      },
    };

    try {
      setIsLoading(true);
      const success = await postData("pengajuan", dataToStore, pengajuan.docId);

      if (success) {
        handleOpenSnackBar("Pengajuan ditolak!", "error");
        const nextReceiver = pengajuan;
        const data = await getPushSubscription(nextReceiver.uid);

        // Store notification in Firestore
        await storeNotification({
          title: "Pengajuan",
          body: `Hi, ${nextReceiver.nama}! Pengajuan Anda ditolak oleh ${currentUser.nama}`,
          sender_uid: currentUser.uid,
          sender_name: currentUser.nama,
          receiver_uid: nextReceiver.uid,
        });

        if (socket) {
          emitNotification(
            socket,
            "Pengajuan",
            `Hi, ${nextReceiver.nama}! Pengajuan Anda ditolak oleh ${currentUser.nama}`,
            data?.subscription
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      getPengajuan(docId);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLoginUser();
  }, []);

  useEffect(() => {
    if (docId) getPengajuan(docId);
  }, [docId]);

  useEffect(() => {
    if (currentUser?.role === "Dosen") {
      setCurrentDosenKey(`dosenPembimbing${getUrutanDosen(currentUser.id)}`);
    } else if (currentUser?.role === "Koordinator Lab") {
      setCurrentDosenKey("dosenLab");
    } else if (currentUser?.role === "Kepala Prodi") {
      setCurrentDosenKey("kepalaProdi");
    }
  }, [pengajuan]);

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
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={() => router.back()}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h5">Detail Pengajuan</Typography>
            </Stack>
          </Stack>
          {/* check if signature is exist */}
          <SignatureAlert />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Typography variant="h5">{pengajuan?.judul}</Typography>
                  <Typography variant="subtitle1">
                    Oleh {pengajuan?.nama}
                  </Typography>
                  <Divider />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2">Status</Typography>
                    {pengajuan ? getStatusChip(pengajuan.status) : ""}
                  </Stack>
                </Stack>
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Typography variant="body1">
                    {pengajuan?.deskripsi}
                  </Typography>
                  <Divider />
                  <Typography variant="body2">Berkas</Typography>
                  <Stack direction="row" spacing={1}>
                    {[
                      { label: "Pengajuan", file: pengajuan?.pengajuanFile },
                      { label: "KHS", file: pengajuan?.khsFile },
                      { label: "FRS", file: pengajuan?.frsFile },
                      {
                        label: "Jalur Pra & Co",
                        file: pengajuan?.jalurPraCoFile,
                      },
                      { label: "TOEFL", file: pengajuan?.toeflFile },
                      { label: "Kompetensi", file: pengajuan?.kompetensiFile },
                    ].map((item, index) => (
                      <Chip
                        key={index}
                        icon={<OpenInNew />}
                        label={item.label}
                        variant="outlined"
                        color="primary"
                        onClick={() => openUrlInNewTab(item.file)}
                      />
                    ))}
                  </Stack>
                </Stack>
                {(currentUser?.role === "Dosen" ||
                  currentUser?.role === "Koordinator Lab" ||
                  currentUser?.role === "Kepala Prodi") && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        handleOpenDialog("Setujui pengajuan?", approvePengajuan)
                      }
                      disabled={shouldDisableApproveButton()}
                    >
                      Setujui
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        handleOpenDialog("Tolak pengajuan?", rejectPengajuan)
                      }
                      disabled={shouldDisableApproveButton()}
                    >
                      Tolak
                    </Button>
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

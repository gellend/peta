import { ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import { useRouter } from "next/router";
import Navbar from "../../../src/components/Navbar";
import { useEffect, useState } from "react";
import { getCurrentLoginUser } from "../../../src/lib/auth";
import {
  streamChatMessages,
  getUserDataByUid,
  postData,
} from "../../../src/lib/store";
import useAppStore from "../../../src/store/global";
import useSocket from "../../../src/lib/socket";

export default function RoomKonsultasi() {
  const router = useRouter();
  const roomId = router.query.id;
  const { currentUser, handleOpenDialog, handleOpenSnackBar, setIsLoading } =
    useAppStore((state) => state);
  const socket = useSocket();
  const [chatMessages, setChatMessages] = useState([]);
  const [anotherUser, setAnotherUser] = useState({});
  const [textMessage, setTextMessage] = useState("");

  const getMessages = async (docId) => {
    await streamChatMessages(docId, (chats) => {
      setChatMessages(chats[0]);
    });
  };

  const getAnotherUser = async (uid) => {
    const row = await getUserDataByUid(uid);
    setAnotherUser(row);
  };

  const handleSubmit = async () => {
    let dataToStore = {
      ...chatMessages,
      ...{
        chats: [
          ...chatMessages.chats,
          {
            message: textMessage,
            sender_uid: currentUser.uid,
            timestamp: new Date().toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
            }),
          },
        ],
      },
    };

    try {
      setIsLoading(true);
      const success = await postData("rooms", dataToStore, roomId);

      if (success) {
        setTextMessage("");
      }
    } catch (error) {
      console.error("error", error);
      handleOpenSnackBar("Gagal mengirim pesan", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLoginUser();
  }, []);

  useEffect(() => {
    if (roomId) getMessages(roomId);
  }, [roomId]);

  useEffect(() => {
    if (chatMessages.users && chatMessages.users.length > 0) {
      if (chatMessages.users[0] === currentUser.uid) {
        getAnotherUser(chatMessages.users[1]);
      } else {
        getAnotherUser(chatMessages.users[0]);
      }
    }
  }, [chatMessages]);

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
              <Typography variant="h5">Konsultasi</Typography>
            </Stack>
          </Stack>

          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  sizes="small"
                  alt={anotherUser.nama}
                  src={
                    anotherUser.photo
                      ? anotherUser.photo
                      : "/static/images/avatar/1.jpg"
                  }
                />
                <Typography variant="h5" component="div">
                  {anotherUser.nama}
                </Typography>
              </Stack>
              {/* Chats */}
              <Box
                component="div"
                sx={{
                  width: "100%",
                  minHeight: 330,
                  maxHeight: 330,
                  overflowY: "scroll",
                  mt: 2,
                  mb: 2,
                }}
              >
                {chatMessages.chats && chatMessages.chats.length > 0
                  ? chatMessages.chats.map((message, index) => (
                      <List
                        sx={{
                          width: "100%",
                        }}
                      >
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={message.message}
                            secondary={
                              <>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {message.sender_uid === currentUser.uid ? (
                                    <span>Anda</span>
                                  ) : (
                                    <span>{anotherUser.nama}</span>
                                  )}
                                </Typography>
                                {` — ${message.timestamp}`}
                              </>
                            }
                          />
                        </ListItem>
                        <Divider component="li" />
                      </List>
                    ))
                  : "Belum ada pesan"}
              </Box>
              {/* Chats */}
            </CardContent>
            <CardActions>
              <TextField
                sx={{ mr: 1 }}
                fullWidth
                label="Ketik pesan disini"
                size="small"
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
              />
              <Button variant="contained" onClick={() => handleSubmit()}>
                Kirim
              </Button>
            </CardActions>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}

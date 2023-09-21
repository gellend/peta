import {
  Avatar,
  Badge,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { signOut } from "firebase/auth";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useAppStore from "../store/global";
import config from "../const/config.json";
import { auth } from "../lib/auth";
import { streamNotifications } from "../lib/store";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function Navbar() {
  // AppBar
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  // AppBar

  // User Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);

  const handleOpenUserMenu = (e) => setAnchorEl(e.currentTarget);

  const handleCloseUserMenu = () => setAnchorEl(null);
  // User Menu

  // Notif
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const openNotif = Boolean(notifAnchorEl);
  const idNotif = openNotif ? "notif-popover" : undefined;

  const handleOpenNotif = (e) => setNotifAnchorEl(e.currentTarget);
  const handleCloseNotif = () => setNotifAnchorEl(null);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      await streamNotifications(currentUser?.uid, (notifications) => {
        setNotifications(notifications);
      });
    };

    getNotifications();
  }, []);

  // Notif

  const router = useRouter();
  const { currentUser, clearCurrentUser, setIsLoading } = useAppStore(
    (state) => state
  );

  let currentPage = router.pathname;

  return (
    <>
      {/* Topbar */}
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {currentPage.replaceAll("/", " ").toUpperCase()}
          </Typography>
          <Tooltip title="Notifikasi">
            <IconButton onClick={handleOpenNotif} color="inherit">
              <Badge badgeContent={notifications?.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Popover
            id={idNotif}
            open={openNotif}
            anchorEl={notifAnchorEl}
            onClose={handleCloseNotif}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            {notifications && notifications.length === 0 && (
              <Typography
                sx={{
                  py: 2,
                  px: 3,
                  width: 360,
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                Tidak ada notifikasi
              </Typography>
            )}

            {notifications && notifications.length > 0 && (
              <List
                sx={{ width: 360, maxWidth: 360, bgcolor: "background.paper" }}
              >
                {notifications.map((notif) => (
                  <>
                    <ListItem key={notif.docId} alignItems="flex-start">
                      <ListItemText
                        primary={notif.title}
                        secondary={notif.body}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </>
                ))}
              </List>
            )}
          </Popover>
          <Tooltip title="Pengaturan Akun">
            <IconButton
              onClick={handleOpenUserMenu}
              color="inherit"
              sx={{ ml: 2 }}
            >
              <Avatar sx={{ width: 28, height: 28 }}>
                {currentUser?.nama?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={openUserMenu}
            onClose={handleCloseUserMenu}
            onClick={handleCloseUserMenu}
          >
            <Link href="/profile">
              <MenuItem>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
            </Link>
            <Divider />
            <MenuItem
              onClick={() => {
                setIsLoading(true);
                signOut(auth)
                  .then(() => {
                    clearCurrentUser();
                    router.push("/");
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {/* Topbar */}

      {/* Sidebar */}
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {config.navbarItems.map((item, index) => {
            const { role, label, icon, path } = item;

            // Check if the current user has the required role to display the navigation item
            const shouldDisplay =
              role.length === 0 ||
              (currentUser && role.includes(currentUser.role));

            if (!shouldDisplay) {
              return null;
            }

            return (
              <Link href={path} key={index}>
                <ListItemButton data-cy={`btn-nav-sidebar-${index}`}>
                  <ListItemIcon>
                    <Icon>{icon}</Icon>
                  </ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              </Link>
            );
          })}

          <Divider sx={{ my: 1 }} />

          {/* Keluar */}
          <ListItemButton
            data-cy="btn-logout"
            onClick={() => {
              setIsLoading(true);
              signOut(auth)
                .then(() => {
                  clearCurrentUser();
                  router.push("/");
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Keluar" />
          </ListItemButton>
        </List>
      </Drawer>
      {/* Sidebar */}
    </>
  );
}

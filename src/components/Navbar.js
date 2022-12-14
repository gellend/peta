import * as React from 'react';

import { ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Popover } from '@mui/material';
import { createTheme, styled } from '@mui/material/styles';
import { getAuth, signOut } from 'firebase/auth';

import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { createFirebaseApp } from '../../firebase/clientApp';
import { mainListItems } from '../listItems';
import { useRouter } from 'next/router';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();
const app = createFirebaseApp();
const auth = getAuth(app);

export default function Navbar() {
  // AppBar
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  // AppBar

  // User Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openUserMenu = Boolean(anchorEl);

  const handleOpenUserMenu = (e) => setAnchorEl(e.currentTarget);

  const handleCloseUserMenu = () => setAnchorEl(null);
  // User Menu

  // Notif
  const [notifAnchorEl, setNotifAnchorEl] = React.useState(null);
  const openNotif = Boolean(notifAnchorEl);
  const idNotif = openNotif ? 'notif-popover' : undefined;

  const handleOpenNotif = (e) => setNotifAnchorEl(e.currentTarget);
  const handleCloseNotif = () => setNotifAnchorEl(null);
  // Notif

  const router = useRouter();

  return (
    <React.Fragment>
      {/* Topbar */}
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
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
            Dashboard
          </Typography>
          <Tooltip title="Notifikasi">
            <IconButton onClick={handleOpenNotif} color="inherit">
              <Badge badgeContent={4} color="secondary">
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
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary="Brunch this weekend?"
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Ali Connors
                      </Typography>
                      {" — I'll be in your neighborhood doing errands this…"}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary="Summer BBQ"
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        to Scott, Alex, Jennifer
                      </Typography>
                      {" — Wish I could come, but I'm out of town this…"}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary="Oui Oui"
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Sandra Adams
                      </Typography>
                      {' — Do you have Paris recommendations? Have you ever…'}
                    </React.Fragment>
                  }
                />
              </ListItem>
            </List>
          </Popover>
          <Tooltip title="Pengaturan Akun">
            <IconButton
              onClick={handleOpenUserMenu}
              color="inherit"
              sx={{ ml: 2 }}
            >
              <Avatar sx={{ width: 28, height: 28 }}>G</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={openUserMenu}
            onClose={handleCloseUserMenu}
            onClick={handleCloseUserMenu}
          >
            <Link href="/profil">
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
                signOut(auth);
                router.push('/');
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems}
        </List>
      </Drawer>
      {/* Sidebar */}
    </React.Fragment>
  )
}
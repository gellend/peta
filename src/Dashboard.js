import * as React from 'react';

import { Menu, MenuItem } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { getAuth, signOut } from 'firebase/auth';
import { mainListItems, secondaryListItems } from './listItems';

import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Chart from './Chart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Container from '@mui/material/Container';
import Copyright from './components/Copyright';
import CssBaseline from '@mui/material/CssBaseline';
import Deposits from './Deposits';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Orders from './Orders';
import Paper from '@mui/material/Paper';
import PersonIcon from '@mui/icons-material/Person';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { createFirebaseApp } from '../firebase/clientApp';
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

function DashboardContent() {
  // AppBar
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  // AppBar

  // User Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openUserMenu = Boolean(anchorEl);

  const handleOpenUserMenu = (e) => {
    setAnchorEl(e.currentTarget)
  };

  const handleCloseUserMenu = () => setAnchorEl(null);
  // User Menu

  const router = useRouter();

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

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
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
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
              <MenuItem>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  signOut(auth);
                  router.push('/login');
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

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2 }}>Total Pengajuan Judul TA</Typography>
                  <Typography variant="h5">18</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2 }}>Pengajuan Judul TA Disetujui</Typography>
                  <Typography variant="h5">9</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2 }}>Pengajuan Judul TA Ditolak</Typography>
                  <Typography variant="h5">9</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NAV_LINKS } from '../../data/data';
import { navbarStyles as s } from './Navbar.styles';
import { C } from '../../theme/theme';
import { useRsvpStore } from '../../store/rsvpStore';
import { useRegistrationOpen } from '../../hooks/useRegistrationOpen';

export default function Navbar() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const openModal = useRsvpStore((s) => s.openModal);
  const registrationOpen = useRegistrationOpen();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname === href;

  const goTo = (href: string) => {
    navigate(href);
    setDrawerOpen(false);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      className={scrolled ? 'scrolled' : ''}
      sx={s.appBar}
    >
      <Toolbar sx={s.toolbar} disableGutters>
        {/* ── Brand ── */}
        <Box
          sx={s.brandBox}
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          aria-label="Go to home page"
        >
          <Box
            component="img"
            src="/images/lotus-mark.png"
            alt=""
            aria-hidden="true"
            sx={s.brandMark}
          />
          <Typography sx={s.brandText}>
            HariPrabodham
            <Typography
              component="small"
              sx={{ ...s.brandSub, color: C.saffronDeep }}
            >
              Annakut
            </Typography>
          </Typography>
        </Box>

        {isMobile ? (
          /* ── Mobile ── */
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => setDrawerOpen(true)} sx={s.iconColor}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              slotProps={{ paper: { sx: s.drawerBox } }}
            >
              <Box sx={{ p: 2 }}>
                <List>
                  {NAV_LINKS.map((link) => (
                    <ListItem key={link.href} disablePadding>
                      <ListItemButton
                        onClick={() => goTo(link.href)}
                        sx={
                          [
                            s.drawerLink,
                            isActive(link.href) && {
                              background: C.saffron,
                              color: '#ffffff',
                            },
                          ] as SxProps<Theme>
                        }
                      >
                        <ListItemText primary={link.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  <ListItem disablePadding sx={{ mt: 1.5 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => {
                        if (registrationOpen) {
                          openModal();
                        } else {
                          navigate('/venue');
                        }
                        setDrawerOpen(false);
                      }}
                    >
                      {registrationOpen ? 'Register Now' : 'Learn More'}
                    </Button>
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          /* ── Desktop ── */
          <Box sx={s.desktopNav}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.href}
                onClick={() => goTo(link.href)}
                disableRipple
                sx={
                  [
                    s.navButton,
                    isActive(link.href) && {
                      color: C.saffron,
                      '&::after': { transform: 'scaleX(1)' },
                    },
                  ] as SxProps<Theme>
                }
              >
                {link.label}
              </Button>
            ))}

            <Button
              variant="contained"
              size="large"
              onClick={registrationOpen ? openModal : () => navigate('/venue')}
              sx={{
                ...s.registerButton,
                fontFamily: '"Blue Mirage", serif',
                fontSize: 17,
              }}
            >
              {registrationOpen ? 'Register Now' : 'Learn More'}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

import { useState, useEffect } from 'react';
import { AppShell, Group, Button, Anchor, Container } from '@mantine/core';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

// Define your navigation links
const links = [
  { link: '/', label: 'Home' },
  { link: '/about', label: 'About' },
  { link: '/courses', label: 'Courses' },
  { link: '/bookings', label: 'Bookings' },
];

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]); // Update login state on route change

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Generate navigation items from array
  const navLinks = links.map(({ link, label }) => (
    <Anchor
      component={Link}
      to={link}
      key={link}
      style={{ textDecoration: 'none', marginRight: '12px' }}
    >
      {label}
    </Anchor>
  ));

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Container fluid style={{ height: '100%' }}>
          <Group justify="space-between" align="center" style={{ height: '100%' }} >
            <Group>{navLinks}</Group>
            <Group>
              {isLoggedIn ? (
                <Button size="xs" align="center" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <>
                  <Anchor component={Link} to="/login" style={{ textDecoration: 'none'}}>
                    Login
                  </Anchor>
                  <Anchor component={Link} to="/register" style={{ textDecoration: 'none' }}>
                    Register
                  </Anchor>
                </>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;

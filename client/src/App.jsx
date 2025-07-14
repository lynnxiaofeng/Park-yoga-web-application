import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Booking from "./pages/Bookings";
import About from "./pages/About";
import Login from './pages/Login';
import Register from './pages/Register';
import NoPage from "./pages/NoPage";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';


function App() {
  return (
    <>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <BrowserRouter basename="/assessment02">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="bookings" element={<Booking />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </MantineProvider>
    </>
  )
}

export default App;

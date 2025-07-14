import { useEffect, useState } from "react"; 
import { Container, Stack, Group, Title, Loader, Alert, Text } from "@mantine/core";
import BookingList from "../components/Booking/BookingList";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setCurrentUser(null);
    }
  }, []);  

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setError("You must be logged in to view bookings.");
      setLoading(false);
      return;
    }
  
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      // Fetch bookings for the logged-in user only
      const endpoint = `${API_BASE_URL}/bookings`
      const response = await fetch(endpoint, { headers });
  
      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg);
      }
  
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : [data]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to update bookings.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg);
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update booking status.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to delete bookings.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg);
      }

      setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete booking.");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser]);

  return (
    <Container size="md" py="xl">
      <Stack spacing="lg">
        <Group position="apart" wrap="wrap">
          <Title order={2}>My Bookings</Title>
        </Group>

        {loading && <Loader />}
        {error && <Alert color="red">{error}</Alert>}

        {!loading && !error && bookings.length === 0 && (
          <Text>No bookings found.</Text>
        )}

        {!loading && !error && bookings.length > 0 && (
          <BookingList
            bookings={bookings}
            onStatusUpdate={handleStatusUpdate}
            onDeleteBooking={handleDeleteBooking}
            currentUser={currentUser}
          />
        )}
      </Stack>
    </Container>
  );
};

export default Bookings;

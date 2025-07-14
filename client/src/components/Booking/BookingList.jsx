import { Card, Group, Text, Badge, Button, Stack, Anchor, Alert } from "@mantine/core";

const BookingList = ({ bookings, onStatusUpdate, onDeleteBooking, currentUser }) => {
  return (
    <Stack spacing="md">
      {bookings.map((booking) => (
        <Card key={booking._id} shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart" mb="xs">
            <Text fw={500}>
              {booking.bookingCourse?.name || "No course name"}
            </Text>
            <Badge color={booking.status === "Confirmed" ? "green" : "yellow"}>
              {booking.status}
            </Badge>
          </Group>

          <Stack spacing={4}>
            <Text size="sm">Time: {booking.bookingCourse?.time || "N/A"}</Text>
            <Text size="sm">
              Location: {booking.bookingCourse?.location?.suburb || "Unknown"} - {booking.bookingCourse?.location?.park || "Unknown"}
            </Text>
            {booking.bookingCourse?.location?.link && (
              <Anchor href={booking.bookingCourse.location.link} target="_blank" size="sm">
                View Location Map
              </Anchor>
            )}
          </Stack>

          <Group mt="md" spacing="xs">
            {/* Show update buttons only for the logged-in user who owns the booking */}
            {currentUser && (
              <>
                {/* Show "Confirm" button if the booking status is Pending */}
                {booking.status == "Pending" && (
                  <Button
                    size="xs"
                    onClick={() => onStatusUpdate(booking._id, "Confirmed")}
                  >
                    Confirm
                  </Button>
                )}

                {/* Show "Set to Pending" button if the booking status is Confirmed */}
                {booking.status == "Confirmed" && (
                  <Button
                    size="xs" color="yellow" variant="outline"
                    onClick={() => onStatusUpdate(booking._id, "Pending")}
                  >
                    Set to Pending
                  </Button>
                )}
              </>
            )}

            {/* Admin can delete a booking */}
            {currentUser?.is_admin && (
              <Button
                size="xs" color="red" variant="outline"
                onClick={() => onDeleteBooking(booking._id)}
              >
                Delete Booking
              </Button>
            )}
          </Group>
        </Card>
      ))}
    </Stack>
  );
};

export default BookingList;

import { Card, Text, Title, Badge, Group, Anchor, Button, Stack } from "@mantine/core";

const CourseCard = ({ course, onBook, onEdit, adminMode }) => {
  if (!course) return null;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group position="apart" mb="xs">
        <Title order={4}>{course.name}</Title>
        <Badge color="teal" variant="light">{course.location.suburb}</Badge>
      </Group>

      <Stack spacing="sm">
        <Text size="sm" color="dimmed">{course.description}</Text>
        <Text size="sm" color="gray">🕒 {course.time}</Text>
        <Text size="xs" color="gray">👨‍🏫 {course.teacher?.username || "Unknown"}</Text>
        <Anchor href={course.location.link} target="_blank" rel="noopener noreferrer" size="xs">
          📍 {course.location.park}
        </Anchor>
      </Stack>

      {adminMode ? (
        // Admin view - Edit or Delete options
        <Group position="apart" mt="md">
          <Button variant="outline" color="blue" onClick={() => onEdit(course)}>
            Edit
          </Button>
        </Group>
      ) : (
        // Regular user view - Book button
        <Button
          fullWidth
          mt="md"
          color="indigo"
          onClick={() => onBook(course)}
        >
          Book
        </Button>
      )}
    </Card>
  );
};

export default CourseCard;

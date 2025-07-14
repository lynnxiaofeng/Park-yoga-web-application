import { useState, useEffect } from "react";
import { Text, Title, Container, Loader, SimpleGrid, Alert, Button, Group, Stack, TextInput } from "@mantine/core";
import CourseCard from "../components/Course/CourseCard";
import CourseForm from "../components/Course/CourseForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = token
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        : {
            "Content-Type": "application/json",
          };

      const response = await fetch(`${API_BASE_URL}/courses`, { headers });

      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  //apply search and filter in frontend, connect the backend query in getting courses.
  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
  
      const headers = token
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        : {
            "Content-Type": "application/json",
          };
  
      const query = searchTerm ? `?location.suburb=${encodeURIComponent(searchTerm)}` : "";
      const response = await fetch(`${API_BASE_URL}/courses${query}`, { headers });
  
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  

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
  
  //handlle book button
  const handleBookClick = async (course) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to book a course.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingCourse: course._id,
          status: "Confirmed",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data?.error || data?.errors?.[0]?.msg || "Failed to book course.";
        throw new Error(msg);
      }

      alert(`Booking confirmed for: ${course.name}`);
    } catch (err) {
      console.error(err);
      alert("Booking failed: " + err.message);
    }
  };

  const reloadCourses = async () => {
    setLoading(true);
    await fetchCourses();
  };

  return (
    <Container fluid size="xl" py="xl">
      <Stack spacing="lg">
        <Group position="apart">
          <Title order={2}>
            {adminMode ? "Manage Courses" : "Available Courses"}
          </Title>

          {currentUser?.is_admin && (
            <Button 
              variant={adminMode ? "outline" : "light"}
              onClick={() => setAdminMode(!adminMode)}
            >
              {adminMode ? "Exit Admin Mode" : "Admin Mode"}
            </Button>
          )}
        </Group>

        {adminMode && (
          <>
            <Button onClick={() => setEditingCourse({})} mb="md">
              + Create New Course
            </Button>
            {/* Render CourseForm separately when editing */}
            {editingCourse !== null ? (
              <CourseForm
              course={Object.keys(editingCourse).length === 0 ? null : editingCourse}
              onSuccess={() => {
                setEditingCourse(null);
                reloadCourses();
              }}
              currentUser={currentUser}
            />
            ) : null}
          </>
        )}

        {loading && <Loader />}
        {error && <Alert color="red">{error}</Alert>}

        {!loading && !error && courses.length === 0 && (
          <Text>No courses available at the moment.</Text>
        )}
        {/* apply the search bar in courses page */}
        <Group position="apart" mt="md">
          <TextInput
            placeholder="Search by suburb..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            w="100%"
            maw={400} //responsive design
          />
          <Button onClick={handleSearch}>Search</Button>
          <Button variant="light" onClick={() => {
            setSearchTerm("");
            fetchCourses(); // reload all courses
          }}>Clear</Button>
        </Group>
        {/* showing the course */}
        <SimpleGrid
          cols={{ base: 1, sm: 3, lg: 5 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }} 
          //cards responsive design, this is from https://mantine.dev/core/simple-grid/
        >
          {courses.map((course) => (
            <div key={course._id}>
              {adminMode ? (
                <div 
                  onClick={() => setEditingCourse(course)}
                  style={{ cursor: "pointer" }}
                >
                  <CourseCard course={course} onBook={handleBookClick} />
                </div>
              ) : (
                <CourseCard course={course} onBook={handleBookClick} />
              )}
            </div>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default Courses;

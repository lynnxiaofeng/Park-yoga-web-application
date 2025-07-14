import { useState, useEffect } from "react";
import { Button } from "@mantine/core";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");

export default function CourseForm({ course = null, onSuccess, currentUser }) {
  const initialState = {
    name: "",
    description: "",
    location: { suburb: "", park: "", link: "" },
    time: "",
    teacher: "",
  };

  const [formData, setFormData] = useState(initialState);
  const isEditing = course !== null;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: course.name || "",
        description: course.description || "",
        location: {
          suburb: course.location?.suburb || "",
          park: course.location?.park || "",
          link: course.location?.link || "",
        },
        time: course.time || "",
        teacher: course.teacher || "",
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locField = name.split(".")[1];
      setFormData((prev) => ({...prev, location: {...prev.location, [locField]: value,},}));
    } else {
      setFormData((prev) => ({...prev, [name]: value,}));
    }
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    if (!currentUser?.is_admin) {
      alert("Only admins can create or edit courses.");
      return;
    }
    try {
      // Make a copy of formData
      const dataToSend = { ...formData };
      // If teacher is empty, remove it
      if (!dataToSend.teacher) {
        delete dataToSend.teacher;
      }
      const response = await fetch(
        isEditing ? `${API_BASE_URL}/courses/${course._id}` : `${API_BASE_URL}/courses`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(dataToSend),
        }
      );
      // Check if response is OK 
      if (!response.ok) {
        const errorData = await response.text();  // Get raw response text
        try {
          const errorJson = JSON.parse(errorData);  // Try to parse as JSON
          throw new Error(errorJson.error || "Something went wrong");
        } catch {
          throw new Error(errorData);  // If not JSON, throw raw text
        }
      }

      // If response is OK, parse JSON
      const data = await response.json();
      console.log("Course created/updated:", data);
      alert(isEditing ? "Course updated successfully" : "Course created successfully");
      if (!isEditing) setFormData(initialState);
      onSuccess && onSuccess(data);
    } catch (error) {
      console.error("Error:", error);
      //This is try to show the message nicely in the fronend, validate the input 
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.errors && Array.isArray(parsed.errors)) {
          const messages = parsed.errors.map(err => err.msg).join("\n");
          alert(messages); 
        } else {
          alert(parsed.error || "An unknown error occurred");
        }
      } catch {
        // If not JSON, just show raw message
        alert(error.message);
      }
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!currentUser?.is_admin) {
      alert("Only admins can delete courses.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${course._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete failed");
      }

      const data = await response.json();
      alert("Course deleted successfully");
      onSuccess && onSuccess(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name" value={formData.name} onChange={handleChange} placeholder="Course Name" className="border p-2 w-full"
        required
      />
      <input
        name="description" value={formData.description} onChange={handleChange} placeholder="Course Description" className="border p-2 w-full"
        required
      />
      <textarea name="location.suburb" value={formData.location.suburb} onChange={handleChange} placeholder="Suburb" className="border p-2 w-full"
        required
      />
      <input name="location.park" value={formData.location.park} onChange={handleChange} placeholder="Park Name" className="border p-2 w-full"
        required
      />
      <input name="location.link" value={formData.location.link} onChange={handleChange} placeholder="Location Link (URL)" className="border p-2 w-full"
        required
      />
      <input name="time" value={formData.time} onChange={handleChange} placeholder="Time" className="border p-2 w-full"
        required
      />
      <input name="teacher" value={formData.teacher} onChange={handleChange} placeholder="Teacher (optional user ID)" className="border p-2 w-full"
      />

      <div className="flex space-x-4">
        <Button mt="md" type="submit" color="green">
          {isEditing ? "Update Course" : "Create Course"}
        </Button>
        
        {isEditing && (
          <Button variant="outline" color="red" mt="md" onClick={handleDelete}>
            Delete Course
          </Button>
        )}
      </div>
    </form>
  );
}

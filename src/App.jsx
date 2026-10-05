import { useEffect, useState } from "react";
import Header from "./components/Header";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Get students from PostgreSQL
  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students");

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Load students when application starts
  useEffect(() => {
    fetchStudents();
  }, []);

  // Add newly created student to React state
  const handleStudentAdded = (newStudent) => {
    setStudents((previousStudents) => [
      ...previousStudents,
      newStudent,
    ]);
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete student.");
        return;
      }

      setStudents((previousStudents) =>
        previousStudents.filter((student) => student.id !== id)
      );
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Cannot connect to the server.");
    }
  };

  return (
    <div className="app">
      <Header />

      <main className="container">
        <StudentForm onStudentAdded={handleStudentAdded} />

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Student ID, Name or Department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <StudentList
          students={students}
          searchTerm={searchTerm}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;
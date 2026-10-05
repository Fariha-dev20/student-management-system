import { useState } from "react";

function StudentForm({ onStudentAdded }) {
  const [student, setStudent] = useState({
    student_id: "",
    name: "",
    department: "",
    semester: "",
    email: "",
  });

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !student.student_id ||
      !student.name ||
      !student.department ||
      !student.semester ||
      !student.email
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to add student.");
        return;
      }

      onStudentAdded(data);

      setStudent({
        student_id: "",
        name: "",
        department: "",
        semester: "",
        email: "",
      });

      alert("Student added successfully!");
    } catch (error) {
      console.error(error);
      alert("Cannot connect to the server.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Student</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="student_id"
          placeholder="Student ID"
          value={student.student_id}
          onChange={handleChange}
        />

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={student.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={student.department}
          onChange={handleChange}
        />

        <input
          type="number"
          name="semester"
          placeholder="Semester"
          min="1"
          max="8"
          value={student.semester}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={student.email}
          onChange={handleChange}
        />

        <button type="submit">Add Student</button>
      </form>
    </div>
  );
}

export default StudentForm;
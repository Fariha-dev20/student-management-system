function StudentList({ students, searchTerm, onDelete }) {
  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();

    return (
      student.student_id.toLowerCase().includes(search) ||
      student.name.toLowerCase().includes(search) ||
      student.department.toLowerCase().includes(search)
    );
  });

  return (
    <div className="list-container">
      <h2>Student Records</h2>

      {filteredStudents.length === 0 ? (
        <p className="no-records">No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.student_id}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td>{student.semester}</td>
                <td>{student.email}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentList;
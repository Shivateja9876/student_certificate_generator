import { useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [admissionNo, setAdmissionNo] = useState("");
  const [student, setStudent] = useState(null);

  const searchStudent = async () => {
    try {
      const res = await API.post("/students/search", {
        admission_no: admissionNo,
      });
      setStudent(res.data.student || res.data);
    } catch {
      alert("Student not found");
    }
  };

  const generateCertificate = () => {
    window.open(
      `http://localhost:5000/students/${student.admission_no}/certificate`,
      "_blank"
    );
  };

  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>

      <div className="search-box">
        <input
          placeholder="Admission Number"
          value={admissionNo}
          onChange={(e) => setAdmissionNo(e.target.value)}
        />
        <button onClick={searchStudent}>Search</button>
      </div>

      {student && (
        <div className="card">
          <p><b>Name:</b> {student.student_name}</p>
          <p><b>Admission No:</b> {student.admission_no}</p>
          <p><b>Class:</b> {student.class_on_admission}</p>

          <button onClick={generateCertificate}>
            Generate Certificate
          </button>
        </div>
      )}
    </div>
  );
}

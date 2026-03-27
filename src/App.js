import React, { useState } from 'react';
import './App.css';

const App = () => {
  // State for Student List
  const [students, setStudents] = useState([]);
  
  // State for Form Data
  const [formData, setFormData] = useState({ 
    id: null, name: '', email: '', marks: '', phone: '', age: '', grade: 'S' 
  });

  // State for Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAttribute, setSearchAttribute] = useState('name');

  // State for UI/Validation
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // --- Validation Logic ---
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!/^\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";
    if (!/^\d{10}$/.test(formData.phone)) tempErrors.phone = "Phone must be 10 digits";
    if (!formData.age || formData.age < 5 || formData.age > 100) tempErrors.age = "Age (5-100) required";
    if (formData.marks === '' || formData.marks < 0 || formData.marks > 100) tempErrors.marks = "Marks (0-100) required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      setStudents(students.map(s => (s.id === formData.id ? formData : s)));
    } else {
      setStudents([...students, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ id: null, name: '', email: '', marks: '', phone: '', age: '', grade: 'A' });
    setErrors({});
    setIsEditing(false);
  };

  const handleEdit = (student) => {
    setFormData(student);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  // --- Filter Logic ---
  const filteredStudents = students.filter(student => {
    const valueToSearch = student[searchAttribute]?.toString().toLowerCase() || "";
    return valueToSearch.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1>🎓 Student Profile Manager</h1>
        <p>Manage academic records with precision</p>
      </header>

      <main className="content">
        {/* Form Card */}
        <section className="card form-card">
          <h2>{isEditing ? 'Update Student' : 'Register New Student'}</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Alex Johnson" />
                {errors.name && <small className="error-text">{errors.name}</small>}
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="alex@school.com" />
                {errors.email && <small className="error-text">{errors.email}</small>}
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile" />
                {errors.phone && <small className="error-text">{errors.phone}</small>}
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Age</label>
                  <input name="age" type="number" value={formData.age} onChange={handleInputChange} />
                  {errors.age && <small className="error-text">{errors.age}</small>}
                </div>
                <div className="input-group">
                  <label>Marks (%)</label>
                  <input name="marks" type="number" value={formData.marks} onChange={handleInputChange} />
                  {errors.marks && <small className="error-text">{errors.marks}</small>}
                </div>
                <div className="input-group">
                  <label>Grade</label>
                  <select name="grade" value={formData.grade} onChange={handleInputChange}>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="button-group">
              <button type="submit" className="btn-save">{isEditing ? 'Update Record' : 'Add Student'}</button>
              <button type="button" className="btn-clear" onClick={resetForm}>Reset</button>
            </div>
          </form>
        </section>

        {/* List & Search Section */}
        <section className="display-section">
          <div className="filter-bar">
            <div className="search-wrapper">
              <select className="search-select" value={searchAttribute} onChange={(e) => setSearchAttribute(e.target.value)}>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="grade">Grade</option>
              </select>
              <input 
                type="text" 
                placeholder={`Search by ${searchAttribute}...`} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="count-badge">Total: {filteredStudents.length}</div>
          </div>

          <div className="student-grid">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(s => (
                <div key={s.id} className="student-card">
                  <div className="card-header">
                    <h3>{s.name}</h3>
                    <span className={`badge grade-${s.grade}`}>{s.grade}</span>
                  </div>
                  <div className="card-body">
                    <p><strong>Email:</strong> {s.email}</p>
                    <p><strong>Phone:</strong> {s.phone}</p>
                    <p><strong>Age:</strong> {s.age} | <strong>Score:</strong> {s.marks}%</p>
                  </div>
                  <div className="card-actions">
                    <button className="btn-edit" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-msg">No student records found matching your search.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
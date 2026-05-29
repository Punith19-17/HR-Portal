import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

/* -------------------- Mock navigation -------------------- */
const useMockNavigate = () => (path) => {
  alert(`Simulated navigation to: ${path || "Form Completion"}`);
};

/* -------------------- Icons -------------------- */
const UploadIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const SaveIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const ArrowRightIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const ArrowLeftIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const CheckCircleIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const XIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const PlusIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const TrashIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1-2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

/* -------------------- Styles -------------------- */
const styles = {
  container: { fontFamily: "'Inter', sans-serif", backgroundColor: "#f3f4f6", padding: 20, minHeight: "100vh" },
  card: { maxWidth: 1200, margin: "0 auto", backgroundColor: "#fff", borderRadius: 12, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)", padding: 32 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: 20, marginBottom: 24 },
  headerContent: { flexGrow: 1 },
  title: { fontSize: "1.75rem", fontWeight: 700, color: "#111827", margin: 0 },
  subtitle: { fontSize: "1rem", color: "#6b7280", marginTop: 4 },
  closeButton: { background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: 4, borderRadius: 6 },

  stepIndicator: { display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 32 },
  step: { display: "flex", alignItems: "center", gap: 8 },
  stepNumber: { width: 32, height: 32, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontWeight: 600, fontSize: "1rem" },
  stepText: { fontWeight: 600, fontSize: "0.9rem" },
  stepLine: { flexGrow: 1, height: 2, backgroundColor: "#d1d5db", margin: "0 16px" },

  formSection: { marginBottom: 40, padding: 24, border: "1px solid #e5e7eb", borderRadius: 8, backgroundColor: "#fafafa" },
  sectionTitle: { fontSize: "1.25rem", fontWeight: 600, color: "#111827", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #e5e7eb" },
  formGroup: {},
  label: { display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: 6 },
  required: { color: "#ef4444", marginLeft: 4 },

  input: { boxSizing: "border-box", width: "100%", padding: "7px 12px", height: 36, border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.9rem", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)" },
  select: { boxSizing: "border-box", width: "100%", padding: "7px 12px", height: 36, border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.9rem", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)", backgroundColor: "#fff" },
  textarea: { boxSizing: "border-box", width: "100%", padding: "8px 12px", minHeight: 80, border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.9rem", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)", resize: "vertical" },
  fileInput: { padding: "6px 0", fontSize: "0.9rem", color: "#4b5563" },

  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 16 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 16 },

  qualificationItem: { border: "1px solid #d1d5db", borderRadius: 6, padding: 16, marginBottom: 16, backgroundColor: "#fff" },
  itemHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: "1px dashed #e5e7eb" },
  itemTitle: { fontWeight: 600, fontSize: "1rem", color: "#111827" },

  alert: { padding: 12, borderRadius: 6, marginBottom: 20, fontSize: "0.9rem", fontWeight: 500 },
  alertSuccess: { backgroundColor: "#d1fae5", color: "#065f46", border: "1px solid #10b981" },
  alertError: { backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #ef4444" },

  button: { padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 8, border: "1px solid transparent" },
  buttonPrimary: { backgroundColor: "#030213", color: "white" },
  buttonOutline: { backgroundColor: "white", color: "#030213", border: "1px solid #d1d5db" },
  buttonGhost: { backgroundColor: "transparent", border: "none", color: "#6b7280" },

  buttonGroup: { display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 20, borderTop: "1px solid #e5e7eb", marginTop: 20 },
  buttonGroupBetween: { display: "flex", justifyContent: "space-between", paddingTop: 20, borderTop: "1px solid #e5e7eb", marginTop: 20 },
  sectionButtonGroup: { display: "flex", justifyContent: "flex-start", marginTop: 20 },
  separator: { height: 1, backgroundColor: "#e5e7eb", margin: "20px 0" }
};

/* -------------------- Alert -------------------- */
const AlertBox = ({ message, type }) => {
  if (!message) return null;
  const alertStyle = { ...styles.alert, ...(type === "success" ? styles.alertSuccess : styles.alertError) };
  return <div style={alertStyle}>{message}</div>;
};

/* =======================================================================
   TOP-LEVEL SECTIONS (moved out to prevent remounts and focus loss)
   ======================================================================= */

const AcademicQualificationSection = React.memo(function AcademicQualificationSection({
  academicQualifications,
  addEntry,
  removeEntry,
  handleNestedChange,
  handleNestedFileChange,
  handleSaveAcademicQualification,
  isSubmitting
}) {
  return (
    <div style={styles.formSection}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={styles.sectionTitle}>Academic Qualification</h3>
        <button
          style={{ ...styles.button, ...styles.buttonOutline }}
          type="button"
          onClick={() =>
            addEntry("academic", {
              qualification: "",
              university: "",
              year: "",
              specialization: "",
              result: "",
              class: "",
              certificate: null
            })
          }
        >
          <PlusIcon size={16} />
          Add Qualification
        </button>
      </div>

      {academicQualifications.map((qual, index) => (
        <div key={qual.id} style={styles.qualificationItem}>
          <div style={styles.itemHeader}>
            <div style={styles.itemTitle}>
              Qualification {index + 1} {qual.qualification && `- ${qual.qualification}`}
            </div>
            {academicQualifications.length > 1 && (
              <button
                style={{ ...styles.button, ...styles.buttonGhost, color: "#ef4444" }}
                type="button"
                onClick={() => removeEntry("academic", qual.id)}
              >
                <TrashIcon size={16} />
                Remove
              </button>
            )}
          </div>

          <div style={styles.grid3}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Employee ID</label>
              <input style={styles.input} type="text" placeholder="Employee ID" value={qual.employeeId} readOnly />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Qualification <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g., B.E / M.Tech / Ph.D"
                value={qual.qualification}
                onChange={(e) => handleNestedChange("academic", qual.id, "qualification", e.target.value)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Board / University <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter board/university name"
                value={qual.university}
                onChange={(e) => handleNestedChange("academic", qual.id, "university", e.target.value)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Year of Passing <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="number"
                placeholder="YYYY"
                value={qual.year}
                onChange={(e) => handleNestedChange("academic", qual.id, "year", e.target.value)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Specialization</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter specialization"
                value={qual.specialization || ""}
                onChange={(e) => handleNestedChange("academic", qual.id, "specialization", e.target.value)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Result in %</label>
              <input
                style={styles.input}
                type="number"
                placeholder="85.5"
                step="0.01"
                value={qual.result}
                onChange={(e) => handleNestedChange("academic", qual.id, "result", e.target.value)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Class</label>
              <select
                style={styles.select}
                value={qual.class}
                onChange={(e) => handleNestedChange("academic", qual.id, "class", e.target.value)}
              >
                <option value="">Select class</option>
                <option value="distinction">Distinction</option>
                <option value="first">First Class</option>
                <option value="second">Second Class</option>
                <option value="third">Third Class</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Upload Certificate</label>
              <input
                style={styles.fileInput}
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleNestedFileChange("academic", qual.id, "certificate", e.target.files[0])}
              />
            </div>
          </div>
        </div>
      ))}

      <div style={styles.sectionButtonGroup}>
        <button 
          style={{ ...styles.button, ...styles.buttonPrimary }} 
          type="button" 
          onClick={handleSaveAcademicQualification} 
          disabled={isSubmitting}
        >
          <SaveIcon size={16} />
          {isSubmitting ? "Saving..." : "Save Academic Qualification"}
        </button>
      </div>
    </div>
  );
});

const ServiceDataSection = React.memo(function ServiceDataSection({
  serviceDataEntries,
  addEntry,
  removeEntry,
  handleNestedChange,
  handleSaveServiceData
}) {
  return (
    <div style={styles.formSection}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={styles.sectionTitle}>Service Data (Previous Employment)</h3>
        <button
          style={{ ...styles.button, ...styles.buttonOutline }}
          type="button"
          onClick={() => addEntry("service", { collegeName: "", fromDate: "", toDate: "" })}
        >
          <PlusIcon size={16} />
          Add Service Record
        </button>
      </div>

      {serviceDataEntries.map((service, index) => (
        <div key={service.id} style={styles.qualificationItem}>
          <div style={styles.itemHeader}>
            <div style={styles.itemTitle}>Service Record {index + 1} {service.collegeName && `- ${service.collegeName}`}</div>
            {serviceDataEntries.length > 1 && (
              <button style={{ ...styles.button, ...styles.buttonGhost, color: "#ef4444" }} type="button" onClick={() => removeEntry("service", service.id)}>
                <TrashIcon size={16} /> Remove
              </button>
            )}
          </div>
          <div style={styles.grid3}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Employee ID</label>
              <input style={styles.input} type="text" placeholder="Employee ID" value={service.employeeId} readOnly />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name of Organization</label>
              <input style={styles.input} type="text" placeholder="Enter college/institution name" value={service.collegeName} onChange={(e) => handleNestedChange("service", service.id, "collegeName", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>From Date</label>
              <input style={styles.input} type="date" value={service.fromDate} onChange={(e) => handleNestedChange("service", service.id, "fromDate", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>To Date</label>
              <input style={styles.input} type="date" value={service.toDate} onChange={(e) => handleNestedChange("service", service.id, "toDate", e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <div style={styles.sectionButtonGroup}>
        <button style={{ ...styles.button, ...styles.buttonPrimary }} type="button" onClick={handleSaveServiceData}>
          <SaveIcon size={16} />
          Save Service Data
        </button>
      </div>
    </div>
  );
});

const ShortTermCourseSection = React.memo(function ShortTermCourseSection({
  shortTermCourses,
  addEntry,
  removeEntry,
  handleNestedChange,
  handleNestedFileChange,
  handleSaveShortTermCourses
}) {
  return (
    <div style={styles.formSection}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={styles.sectionTitle}>Short Term Course / Workshop / Training / FD Conference / Seminar</h3>
        <button
          style={{ ...styles.button, ...styles.buttonOutline }}
          type="button"
          onClick={() => addEntry("short", { type: "", name: "", date: "", certificate: null })}
        >
          <PlusIcon size={16} />
          Add Course
        </button>
      </div>

      {shortTermCourses.map((course, index) => (
        <div key={course.id} style={styles.qualificationItem}>
          <div style={styles.itemHeader}>
            <div style={styles.itemTitle}>Course {index + 1} {course.name && `- ${course.name}`}</div>
            {shortTermCourses.length > 1 && (
              <button style={{ ...styles.button, ...styles.buttonGhost, color: "#ef4444" }} type="button" onClick={() => removeEntry("short", course.id)}>
                <TrashIcon size={16} /> Remove
              </button>
            )}
          </div>

          <div style={styles.grid3}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Employee ID</label>
              <input style={styles.input} type="text" placeholder="Employee ID" value={course.employeeId} readOnly />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Type</label>
              <select style={styles.select} value={course.type} onChange={(e) => handleNestedChange("short", course.id, "type", e.target.value)}>
                <option value="">Select type</option>
                <option value="course">Short Term Course</option>
                <option value="workshop">Workshop</option>
                <option value="training">Training</option>
                <option value="conference">FD Conference</option>
                <option value="seminar">Seminar</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input style={styles.input} type="text" placeholder="Enter course/event name" value={course.name} onChange={(e) => handleNestedChange("short", course.id, "name", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date</label>
              <input style={styles.input} type="date" value={course.date} onChange={(e) => handleNestedChange("short", course.id, "date", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Certificate</label>
              <input style={styles.fileInput} type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleNestedFileChange("short", course.id, "certificate", e.target.files[0])} />
            </div>
          </div>
        </div>
      ))}

      <div style={styles.sectionButtonGroup}>
        <button style={{ ...styles.button, ...styles.buttonPrimary }} type="button" onClick={handleSaveShortTermCourses}>
          <SaveIcon size={16} />
          Save Short Term Courses
        </button>
      </div>
    </div>
  );
});

const PaperDetailsSection = React.memo(function PaperDetailsSection({
  paperDetails,
  addEntry,
  removeEntry,
  handleNestedChange,
  handleNestedFileChange,
  handleSavePaperDetails,
  isSubmitting // Add this prop
}) {
  return (
    <div style={styles.formSection}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={styles.sectionTitle}>Paper Details</h3>
        <button
          style={{ ...styles.button, ...styles.buttonOutline }}
          type="button"
          onClick={() => addEntry("paper", { type: "", level: "", name: "", date: "", title: "", certificate: null })}
        >
          <PlusIcon size={16} />
          Add Paper
        </button>
      </div>

      {paperDetails.map((paper, index) => (
        <div key={paper.id} style={styles.qualificationItem}>
          <div style={styles.itemHeader}>
            <div style={styles.itemTitle}>Paper {index + 1} {paper.title && `- ${paper.title}`}</div>
            {paperDetails.length > 1 && (
              <button style={{ ...styles.button, ...styles.buttonGhost, color: "#ef4444" }} type="button" onClick={() => removeEntry("paper", paper.id)}>
                <TrashIcon size={16} /> Remove
              </button>
            )}
          </div>

          <div style={styles.grid3}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Employee ID</label>
              <input style={styles.input} type="text" placeholder="Employee ID" value={paper.employeeId} readOnly />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Type</label>
              <select style={styles.select} value={paper.type} onChange={(e) => handleNestedChange("paper", paper.id, "type", e.target.value)}>
                <option value="">Select type</option>
                <option value="research">Research Paper</option>
                <option value="review">Review Paper</option>
                <option value="case">Case Study</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Level</label>
              <select style={styles.select} value={paper.level} onChange={(e) => handleNestedChange("paper", paper.id, "level", e.target.value)}>
                <option value="">Select level</option>
                <option value="international">International</option>
                <option value="national">National</option>
                <option value="state">State</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name (Journal/Conf.)</label>
              <input style={styles.input} type="text" placeholder="Journal/Conference name" value={paper.name} onChange={(e) => handleNestedChange("paper", paper.id, "name", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date</label>
              <input style={styles.input} type="date" value={paper.date} onChange={(e) => handleNestedChange("paper", paper.id, "date", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Paper Title</label>
              <input style={styles.input} type="text" placeholder="Enter paper title" value={paper.title} onChange={(e) => handleNestedChange("paper", paper.id, "title", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Certificate</label>
              <input style={styles.fileInput} type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleNestedFileChange("paper", paper.id, "certificate", e.target.files[0])} />
            </div>
          </div>
        </div>
      ))}

      <div style={styles.sectionButtonGroup}>
        <button 
          style={{ ...styles.button, ...styles.buttonPrimary }} 
          type="button" 
          onClick={handleSavePaperDetails}
          disabled={isSubmitting}
        >
          <SaveIcon size={16} />
          {isSubmitting ? "Saving..." : "Save Paper Details"}
        </button>
      </div>
    </div>
  );
});

const BookPublishedSection = React.memo(function BookPublishedSection({
  bookPublished,
  addEntry,
  removeEntry,
  handleNestedChange,
  handleNestedFileChange,
  handleSaveBookPublished,
  isSubmitting // Add this prop
}) {
  return (
    <div style={styles.formSection}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={styles.sectionTitle}>Book Published</h3>
        <button
          style={{ ...styles.button, ...styles.buttonOutline }}
          type="button"
          onClick={() => addEntry("book", { name: "", chapters: "", pagesFrom: "", pagesTo: "", year: "", document: null })}
        >
          <PlusIcon size={16} />
          Add Book
        </button>
      </div>

      {bookPublished.map((book, index) => (
        <div key={book.id} style={styles.qualificationItem}>
          <div style={styles.itemHeader}>
            <div style={styles.itemTitle}>Book {index + 1} {book.name && `- ${book.name}`}</div>
            {bookPublished.length > 1 && (
              <button style={{ ...styles.button, ...styles.buttonGhost, color: "#ef4444" }} type="button" onClick={() => removeEntry("book", book.id)}>
                <TrashIcon size={16} /> Remove
              </button>
            )}
          </div>

          <div style={styles.grid3}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Employee ID</label>
              <input style={styles.input} type="text" placeholder="Employee ID" value={book.employeeId} readOnly />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Book Name <span style={styles.required}>*</span></label>
              <input style={styles.input} type="text" placeholder="Enter book name" value={book.name} onChange={(e) => handleNestedChange("book", book.id, "name", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>No. of Chapters</label>
              <input style={styles.input} type="number" placeholder="0" value={book.chapters} onChange={(e) => handleNestedChange("book", book.id, "chapters", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Year <span style={styles.required}>*</span></label>
              <input style={styles.input} type="number" placeholder="YYYY" value={book.year} onChange={(e) => handleNestedChange("book", book.id, "year", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pages From <span style={styles.required}>*</span></label>
              <input style={styles.input} type="number" placeholder="1" value={book.pagesFrom} onChange={(e) => handleNestedChange("book", book.id, "pagesFrom", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pages To <span style={styles.required}>*</span></label>
              <input style={styles.input} type="number" placeholder="100" value={book.pagesTo} onChange={(e) => handleNestedChange("book", book.id, "pagesTo", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Upload Document</label>
              <input style={styles.fileInput} type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleNestedFileChange("book", book.id, "document", e.target.files[0])} />
            </div>
          </div>
        </div>
      ))}

      <div style={styles.sectionButtonGroup}>
        <button 
          style={{ ...styles.button, ...styles.buttonPrimary }} 
          type="button" 
          onClick={handleSaveBookPublished}
          disabled={isSubmitting}
        >
          <SaveIcon size={16} />
          {isSubmitting ? "Saving..." : "Save Book Published"}
        </button>
      </div>
    </div>
  );
});

const ProjectMajorSection = React.memo(function ProjectMajorSection({
  projectMajor,
  addEntry,
  removeEntry,
  handleNestedChange,
  handleNestedFileChange,
  handleSaveProjectMajor,
  isSubmitting // Add this prop
}) {
  return (
    <div style={styles.formSection}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={styles.sectionTitle}>Project Major</h3>
        <button
          style={{ ...styles.button, ...styles.buttonOutline }}
          type="button"
          onClick={() => addEntry("project", { type: "", name: "", sponsorer: "", amount: "", sanctionYear: "", certificate: null })}
        >
          <PlusIcon size={16} />
          Add Project
        </button>
      </div>

      {projectMajor.map((project, index) => (
        <div key={project.id} style={styles.qualificationItem}>
          <div style={styles.itemHeader}>
            <div style={styles.itemTitle}>Project {index + 1} {project.name && `- ${project.name}`}</div>
            {projectMajor.length > 1 && (
              <button style={{ ...styles.button, ...styles.buttonGhost, color: "#ef4444" }} type="button" onClick={() => removeEntry("project", project.id)}>
                <TrashIcon size={16} /> Remove
              </button>
            )}
          </div>

          <div style={styles.grid3}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Employee ID</label>
              <input style={styles.input} type="text" placeholder="Employee ID" value={project.employeeId} readOnly />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Type <span style={styles.required}>*</span></label>
              <select style={styles.select} value={project.type} onChange={(e) => handleNestedChange("project", project.id, "type", e.target.value)}>
                <option value="">Select type</option>
                <option value="research">Research</option>
                <option value="development">Development</option>
                <option value="consultancy">Consultancy</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name <span style={styles.required}>*</span></label>
              <input style={styles.input} type="text" placeholder="Enter project name" value={project.name} onChange={(e) => handleNestedChange("project", project.id, "name", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Sponsorer</label>
              <input style={styles.input} type="text" placeholder="Sponsoring organization" value={project.sponsorer} onChange={(e) => handleNestedChange("project", project.id, "sponsorer", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Amount</label>
              <input style={styles.input} type="number" placeholder="₹ 0" value={project.amount} onChange={(e) => handleNestedChange("project", project.id, "amount", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Year of Sanction <span style={styles.required}>*</span></label>
              <input style={styles.input} type="number" placeholder="YYYY" value={project.sanctionYear} onChange={(e) => handleNestedChange("project", project.id, "sanctionYear", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Certificate</label>
              <input style={styles.fileInput} type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleNestedFileChange("project", project.id, "certificate", e.target.files[0])} />
            </div>
          </div>
        </div>
      ))}

      <div style={styles.sectionButtonGroup}>
        <button 
          style={{ ...styles.button, ...styles.buttonPrimary }} 
          type="button" 
          onClick={handleSaveProjectMajor}
          disabled={isSubmitting}
        >
          <SaveIcon size={16} />
          {isSubmitting ? "Saving..." : "Save Project Major"}
        </button>
      </div>
    </div>
  );
});

const AwardsSection = React.memo(function AwardsSection({
  awards,
  addEntry,
  removeEntry,
  handleNestedChange,
  handleNestedFileChange,
  handleSaveAwards,
  isSubmitting // Add this prop
}) {
  return (
    <div style={styles.formSection}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={styles.sectionTitle}>Awards</h3>
        <button
          style={{ ...styles.button, ...styles.buttonOutline }}
          type="button"
          onClick={() => addEntry("awards", { name: "", organization: "", certificate: null })}
        >
          <PlusIcon size={16} />
          Add Award
        </button>
      </div>

      {awards.map((award, index) => (
        <div key={award.id} style={styles.qualificationItem}>
          <div style={styles.itemHeader}>
            <div style={styles.itemTitle}>Award {index + 1} {award.name && `- ${award.name}`}</div>
            {awards.length > 1 && (
              <button style={{ ...styles.button, ...styles.buttonGhost, color: "#ef4444" }} type="button" onClick={() => removeEntry("awards", award.id)}>
                <TrashIcon size={16} /> Remove
              </button>
            )}
          </div>
          <div style={styles.grid3}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Employee ID</label>
              <input style={styles.input} type="text" placeholder="Employee ID" value={award.employeeId} readOnly />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name <span style={styles.required}>*</span></label>
              <input style={styles.input} type="text" placeholder="Enter award name" value={award.name} onChange={(e) => handleNestedChange("awards", award.id, "name", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Award Organisation</label>
              <input style={styles.input} type="text" placeholder="Awarding organization" value={award.organization} onChange={(e) => handleNestedChange("awards", award.id, "organization", e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Certificate</label>
              <input style={styles.fileInput} type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleNestedFileChange("awards", award.id, "certificate", e.target.files[0])} />
            </div>
          </div>
        </div>
      ))}

      <div style={styles.sectionButtonGroup}>
        <button 
          style={{ ...styles.button, ...styles.buttonPrimary }} 
          type="button" 
          onClick={handleSaveAwards}
          disabled={isSubmitting}
        >
          <SaveIcon size={16} />
          {isSubmitting ? "Saving..." : "Save Awards"}
        </button>
      </div>
    </div>
  );
});

/* =======================================================================
   MAIN COMPONENT
   ======================================================================= */

const A_personalinfo = ({ staffType }) => {
  const navigate = useMockNavigate();
  const [currentStep, setCurrentStep] = useState("personal");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeType: staffType === "TEACHING_STAFF" ? "Teaching" : staffType === "NON_TEACHING_STAFF" ? "Non-Teaching" : "",
    name: "",
    emailId: "",
    gender: "",
    mobileNo: "",
    permanentAddress: "",
    aadhaarNumber: "",
    department: "",
    designation: "",
    dateOfBirth: "",
    profilePicture: null,
    maritalStatus: "",
    bloodGroup: "",
    panNo: "",
    accountNo: "",
    ifscCode: "",
    religion: "",
    category: "",
    caste: "",
    postalAddress: "",
    dateOfJoining: "",
    modeOfAppointment: ""
  });

  // initial arrays
  const initialAcademic = useMemo(() => [{ id: 1, employeeId: "", qualification: "", university: "", year: "", specialization: "", result: "", class: "", certificate: null }], []);
  const initialService = useMemo(() => [{ id: 1, employeeId: "", collegeName: "", fromDate: "", toDate: "" }], []);
  const initialShort = useMemo(() => [{ id: 1, employeeId: "", type: "", name: "", date: "", certificate: null }], []);
  const initialPaper = useMemo(() => [{ id: 1, employeeId: "", type: "", level: "", name: "", date: "", title: "", certificate: null }], []);
  const initialBook = useMemo(() => [{ id: 1, employeeId: "", name: "", chapters: "", pagesFrom: "", pagesTo: "", year: "", document: null }], []);
  const initialProject = useMemo(() => [{ id: 1, employeeId: "", type: "", name: "", sponsorer: "", amount: "", sanctionYear: "", certificate: null }], []);
  const initialAwards = useMemo(() => [{ id: 1, employeeId: "", name: "", organization: "", certificate: null }], []);

  const [academicQualifications, setAcademicQualifications] = useState(initialAcademic);
  const [serviceDataEntries, setServiceDataEntries] = useState(initialService);
  const [shortTermCourses, setShortTermCourses] = useState(initialShort);
  const [paperDetails, setPaperDetails] = useState(initialPaper);
  const [bookPublished, setBookPublished] = useState(initialBook);
  const [projectMajor, setProjectMajor] = useState(initialProject);
  const [awards, setAwards] = useState(initialAwards);

  // update nested employeeId when employeeId changes
  useEffect(() => {
    if (!formData.employeeId) return;
    const setAll = (setter) =>
      setter((prev) => prev.map((item) => (item.employeeId === formData.employeeId ? item : { ...item, employeeId: formData.employeeId })));
    setAll(setAcademicQualifications);
    setAll(setServiceDataEntries);
    setAll(setShortTermCourses);
    setAll(setPaperDetails);
    setAll(setBookPublished);
    setAll(setProjectMajor);
    setAll(setAwards);
  }, [formData.employeeId]);

  // keep employeeType in sync with prop
  useEffect(() => {
    setFormData((p) => ({ ...p, employeeType: staffType === "TEACHING_STAFF" ? "Teaching" : "Non-Teaching" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffType]);

  // handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev[name] === value ? prev : { ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, profilePicture: file }));
  }, []);

  const displayMessage = useCallback((msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    window.clearTimeout(displayMessage._t);
    displayMessage._t = window.setTimeout(() => setMessage(""), 5000);
  }, []);
  // @ts-ignore
  displayMessage._t = displayMessage._t || 0;

  const addEntry = useCallback((section, specific) => {
    const map = {
      academic: setAcademicQualifications,
      service: setServiceDataEntries,
      short: setShortTermCourses,
      paper: setPaperDetails,
      book: setBookPublished,
      project: setProjectMajor,
      awards: setAwards
    };
    const setter = map[section];
    if (!setter) return;
    setter((prev) => [...prev, { employeeId: formData.employeeId, ...specific, id: Date.now() }]);
  }, [formData.employeeId]);

  const removeEntry = useCallback((section, id) => {
    const map = {
      academic: setAcademicQualifications,
      service: setServiceDataEntries,
      short: setShortTermCourses,
      paper: setPaperDetails,
      book: setBookPublished,
      project: setProjectMajor,
      awards: setAwards
    };
    const setter = map[section];
    if (!setter) return;
    setter((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleNestedChange = useCallback((section, id, field, value) => {
    const map = {
      academic: setAcademicQualifications,
      service: setServiceDataEntries,
      short: setShortTermCourses,
      paper: setPaperDetails,
      book: setBookPublished,
      project: setProjectMajor,
      awards: setAwards
    };
    const setter = map[section];
    if (!setter) return;
    setter((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }, []);

  const handleNestedFileChange = useCallback((section, id, field, file) => {
    const map = {
      academic: setAcademicQualifications,
      service: setServiceDataEntries,
      short: setShortTermCourses,
      paper: setPaperDetails,
      book: setBookPublished,
      project: setProjectMajor,
      awards: setAwards
    };
    const setter = map[section];
    if (!setter) return;
    setter((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: file } : item)));
  }, []);

  const validatePersonalInformation = useCallback(() => {
    const requiredFields = [
      "name","dateOfBirth","aadhaarNumber","gender","maritalStatus","mobileNo","emailId",
      "postalAddress","permanentAddress","designation","department","dateOfJoining","employeeId","employeeType"
    ];
    const missing = requiredFields.filter((f) => (typeof formData[f] === "string" ? (formData[f] || "").trim() === "" : !formData[f]));
    if (missing.length) {
      displayMessage(`Please fill in all required fields. Missing: ${missing.join(", ")}`, "error");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) { displayMessage("Please enter a valid email address.", "error"); return false; }
    if (!/^\d{10}$/.test(formData.mobileNo)) { displayMessage("Mobile number must be 10 digits.", "error"); return false; }
    if (!/^\d{12}$/.test(formData.aadhaarNumber)) { displayMessage("Aadhaar number must be 12 digits.", "error"); return false; }
    if (!formData.profilePicture) { displayMessage("Please upload a profile picture.", "error"); return false; }
    return true;
  }, [displayMessage, formData]);

  /* -------------------- APIs -------------------- */
  const submitPersonalInformation = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("employee_id", formData.employeeId);
      formDataToSend.append("employee_type", formData.employeeType);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("doj", formData.dateOfJoining);
      formDataToSend.append("email_id", formData.emailId);
      formDataToSend.append("mobile_no", formData.mobileNo);
      formDataToSend.append("postal_address", formData.postalAddress);
      formDataToSend.append("permanent_address", formData.permanentAddress);
      formDataToSend.append("dob", formData.dateOfBirth);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("aadhaar_number", formData.aadhaarNumber);
      formDataToSend.append("marital_status", formData.maritalStatus);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("blood_group", formData.bloodGroup);
      formDataToSend.append("caste", formData.caste);
      formDataToSend.append("pan_no", formData.panNo);
      formDataToSend.append("account_no", formData.accountNo);
      formDataToSend.append("ifsc_code", formData.ifscCode);
      if (formData.profilePicture) formDataToSend.append("profile_picture", formData.profilePicture);

      // ✅ CORRECT - This is for personal information
const response = await axios.post("http://localhost:5000/api/personal-information1", formDataToSend, {
  headers: { "Content-Type": "multipart/form-data" },
  timeout: 30000
});

      displayMessage(response.data.message || "Saved", "success");
      return true;
    } catch (error) {
      let msg = "Failed to submit data. Please try again.";
      if (error.code === "ECONNABORTED") msg = "Request timeout. Please try again.";
      else if (error.response?.status === 409) msg = "Employee ID already exists. Please use a different ID.";
      else if (error.response?.status === 400) msg = error.response.data.message || "Please check all required fields.";
      else if (error.response?.data?.message) msg = error.response.data.message;
      else if (error.request) msg = "Cannot connect to server. Please check your connection.";
      displayMessage(msg, "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [displayMessage, formData]);

  const handleSaveAcademicQualification = useCallback(async () => {
  const endpoint = "http://localhost:5000/api/qualification-details"; // ✅ CORRECT ENDPOINT
  
  // Validation
  const missingInAny = academicQualifications.some((q) => !formData.employeeId || !q.qualification || !q.university || !String(q.year).trim());
  if (missingInAny) {
    displayMessage("Please fill: Employee ID, Qualification, Board/University and Year of Passing for all rows before saving.", "error");
    return;
  }
  
  const invalidYear = academicQualifications.some((q) => !/^\d{4}$/.test(String(q.year)));
  if (invalidYear) {
    displayMessage("Year of Passing must be a 4-digit year (e.g., 2022).", "error");
    return;
  }

  setIsSubmitting(true);
  const results = [];
  try {
    for (const q of academicQualifications) {
      const fd = new FormData();
      fd.append("employee_id", formData.employeeId);
      fd.append("qualification", q.qualification || "");
      fd.append("specialization", q.specialization || "");
      fd.append("board_university", q.university || "");
      fd.append("result_percentage", q.result || "");
      fd.append("year_of_pass", q.year || "");
      fd.append("class", q.class || "");
      if (q.certificate) fd.append("qualification_documents", q.certificate);

      try {
        // ✅ Now calling the correct qualification-details endpoint
        const res = await axios.post(endpoint, fd, { 
          headers: { "Content-Type": "multipart/form-data" }, 
          timeout: 30000 
        });
        results.push({ ok: true, data: res.data, row: q.id });
      } catch (err) {
        results.push({ 
          ok: false, 
          error: err.response?.data?.message || "Failed to insert qualification data.", 
          row: q.id 
        });
      }
    }
    
    const successCount = results.filter((r) => r.ok).length;
    const failCount = results.length - successCount;
    
    if (successCount > 0) {
      displayMessage(`Successfully saved ${successCount} qualification record${successCount > 1 ? "s" : ""}${failCount > 0 ? `, ${failCount} failed` : ""}.`, "success");
    }
    
    if (failCount > 0) {
      displayMessage(`Some records failed. Example: ${results.find((r) => !r.ok)?.error || "Unknown error"}`, "error");
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
    displayMessage("An unexpected error occurred while saving qualifications.", "error");
  } finally {
    setIsSubmitting(false);
  }
}, [academicQualifications, displayMessage, formData.employeeId]);

  // simple placeholders for other sections
 const handleSaveServiceData = useCallback(async () => {
  const endpoint = "http://localhost:5000/api/service-data";
  
  // Validation
  const missingInAny = serviceDataEntries.some((s) => !formData.employeeId || !s.collegeName || !s.fromDate);
  if (missingInAny) {
    displayMessage("Please fill: Employee ID, Name of Organization, and From Date for all rows before saving.", "error");
    return;
  }

  setIsSubmitting(true);
  const results = [];
  try {
    for (const s of serviceDataEntries) {
      // Create regular JSON data instead of FormData
      const data = {
        employee_id: formData.employeeId,
        name_of_organization: s.collegeName || "",
        from_date: s.fromDate || "",
        to_date: s.toDate || ""
      };

      try {
        // Send as JSON instead of FormData
        const res = await axios.post(endpoint, data, { 
          timeout: 30000 
          // Remove Content-Type header - axios will set application/json automatically
        });
        results.push({ ok: true, data: res.data, row: s.id });
      } catch (err) {
        results.push({ 
          ok: false, 
          error: err.response?.data?.message || "Failed to insert service data.", 
          row: s.id 
        });
      }
    }
    
    const successCount = results.filter((r) => r.ok).length;
    const failCount = results.length - successCount;
    
    if (successCount > 0) {
      displayMessage(`Successfully saved ${successCount} service record${successCount > 1 ? "s" : ""}${failCount > 0 ? `, ${failCount} failed` : ""}.`, "success");
    }
    
    if (failCount > 0) {
      displayMessage(`Some records failed. Example: ${results.find((r) => !r.ok)?.error || "Unknown error"}`, "error");
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
    displayMessage("An unexpected error occurred while saving service data.", "error");
  } finally {
    setIsSubmitting(false);
  }
}, [serviceDataEntries, displayMessage, formData.employeeId]);
const handleSaveShortTermCourses = useCallback(async () => {
  const endpoint = "http://localhost:5000/api/training"; // ✅ CORRECT ENDPOINT
  
  // Validation
  const missingInAny = shortTermCourses.some((course) => 
    !formData.employeeId || !course.type || !course.name || !course.date
  );
  
  if (missingInAny) {
    displayMessage("Please fill: Employee ID, Type, Name, and Date for all courses before saving.", "error");
    return;
  }

  setIsSubmitting(true);
  const results = [];
  
  try {
    for (const course of shortTermCourses) {
      const fd = new FormData();
      
      // ✅ Add fields that match the backend API
      fd.append("employee_id", formData.employeeId);
      fd.append("course_type", course.type || "");
      fd.append("course_name", course.name || "");
      fd.append("course_date", course.date || "");
      
      // Add certificate file if exists
      if (course.certificate) {
        fd.append("certificate_path", course.certificate);
      }

      try {
        // ✅ Call the training endpoint
        const res = await axios.post(endpoint, fd, { 
          headers: { "Content-Type": "multipart/form-data" }, 
          timeout: 30000 
        });
        results.push({ ok: true, data: res.data, row: course.id });
      } catch (err) {
        results.push({ 
          ok: false, 
          error: err.response?.data?.message || "Failed to insert training data.", 
          row: course.id 
        });
      }
    }
    
    const successCount = results.filter((r) => r.ok).length;
    const failCount = results.length - successCount;
    
    if (successCount > 0) {
      displayMessage(`Successfully saved ${successCount} training record${successCount > 1 ? "s" : ""}${failCount > 0 ? `, ${failCount} failed` : ""}.`, "success");
    }
    
    if (failCount > 0) {
      displayMessage(`Some records failed. Example: ${results.find((r) => !r.ok)?.error || "Unknown error"}`, "error");
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
    displayMessage("An unexpected error occurred while saving training data.", "error");
  } finally {
    setIsSubmitting(false);
  }
}, [shortTermCourses, displayMessage, formData.employeeId]);
 const handleSavePaperDetails = useCallback(async () => {
  const endpoint = "http://localhost:5000/api/paper-details";
  
  // Validation
  const missingInAny = paperDetails.some((paper) => 
    !formData.employeeId || !paper.type || !paper.level || !paper.name || !paper.date || !paper.title
  );
  
  if (missingInAny) {
    displayMessage("Please fill: Employee ID, Type, Level, Name, Date, and Title for all papers before saving.", "error");
    return;
  }

  setIsSubmitting(true);
  const results = [];
  
  try {
    for (const paper of paperDetails) {
      const fd = new FormData();
      
      // Map to paper_details table structure
      fd.append("employee_id", formData.employeeId);
      fd.append("paper_type", paper.type || "");
      fd.append("paper_level", paper.level || "");
      fd.append("journal_conference_name", paper.name || "");
      fd.append("paper_date", paper.date || "");
      fd.append("paper_title", paper.title || "");
      
      // Add certificate file if exists
      if (paper.certificate) {
        fd.append("certificate_path", paper.certificate);
      }

      try {
        const res = await axios.post(endpoint, fd, { 
          headers: { "Content-Type": "multipart/form-data" }, 
          timeout: 30000 
        });
        results.push({ ok: true, data: res.data, row: paper.id });
      } catch (err) {
        results.push({ 
          ok: false, 
          error: err.response?.data?.message || "Failed to insert paper details.", 
          row: paper.id 
        });
      }
    }
    
    const successCount = results.filter((r) => r.ok).length;
    const failCount = results.length - successCount;
    
    if (successCount > 0) {
      displayMessage(`Successfully saved ${successCount} paper record${successCount > 1 ? "s" : ""}${failCount > 0 ? `, ${failCount} failed` : ""}.`, "success");
    }
    
    if (failCount > 0) {
      displayMessage(`Some records failed. Example: ${results.find((r) => !r.ok)?.error || "Unknown error"}`, "error");
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
    displayMessage("An unexpected error occurred while saving paper details.", "error");
  } finally {
    setIsSubmitting(false);
  }
}, [paperDetails, displayMessage, formData.employeeId]);
  const handleSaveBookPublished = useCallback(async () => {
  const endpoint = "http://localhost:5000/api/book-published";
  
  // Validation
  const missingInAny = bookPublished.some((book) => 
    !formData.employeeId || !book.name || !book.year || !book.pagesFrom || !book.pagesTo
  );
  
  if (missingInAny) {
    displayMessage("Please fill: Employee ID, Book Name, Year, Pages From, and Pages To for all books before saving.", "error");
    return;
  }

  // Validate year format
  const invalidYear = bookPublished.some((book) => !/^\d{4}$/.test(String(book.year)));
  if (invalidYear) {
    displayMessage("Year must be a 4-digit year (e.g., 2023).", "error");
    return;
  }

  // Validate page numbers
  const invalidPages = bookPublished.some((book) => 
    parseInt(book.pagesFrom) >= parseInt(book.pagesTo)
  );
  if (invalidPages) {
    displayMessage("Pages From must be less than Pages To.", "error");
    return;
  }

  setIsSubmitting(true);
  const results = [];
  
  try {
    for (const book of bookPublished) {
      const fd = new FormData();
      
      // Map to BookPublished table structure
      fd.append("employee_id", formData.employeeId);
      fd.append("book_name", book.name || "");
      fd.append("number_of_chapters", book.chapters || "0");
      fd.append("publication_year", book.year || "");
      fd.append("pages_from", book.pagesFrom || "");
      fd.append("pages_to", book.pagesTo || "");
      
      // Add document file if exists
      if (book.document) {
        fd.append("document_path", book.document);
      }

      try {
        const res = await axios.post(endpoint, fd, { 
          headers: { "Content-Type": "multipart/form-data" }, 
          timeout: 30000 
        });
        results.push({ ok: true, data: res.data, row: book.id });
      } catch (err) {
        results.push({ 
          ok: false, 
          error: err.response?.data?.message || "Failed to insert book published data.", 
          row: book.id 
        });
      }
    }
    
    const successCount = results.filter((r) => r.ok).length;
    const failCount = results.length - successCount;
    
    if (successCount > 0) {
      displayMessage(`Successfully saved ${successCount} book record${successCount > 1 ? "s" : ""}${failCount > 0 ? `, ${failCount} failed` : ""}.`, "success");
    }
    
    if (failCount > 0) {
      displayMessage(`Some records failed. Example: ${results.find((r) => !r.ok)?.error || "Unknown error"}`, "error");
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
    displayMessage("An unexpected error occurred while saving book published data.", "error");
  } finally {
    setIsSubmitting(false);
  }
}, [bookPublished, displayMessage, formData.employeeId]);
 const handleSaveProjectMajor = useCallback(async () => {
  const endpoint = "http://localhost:5000/api/project-major";
  
  // Validation
  const missingInAny = projectMajor.some((project) => 
    !formData.employeeId || !project.type || !project.name || !project.sanctionYear
  );
  
  if (missingInAny) {
    displayMessage("Please fill: Employee ID, Type, Name, and Year of Sanction for all projects before saving.", "error");
    return;
  }

  // Validate year format
  const invalidYear = projectMajor.some((project) => !/^\d{4}$/.test(String(project.sanctionYear)));
  if (invalidYear) {
    displayMessage("Year of Sanction must be a 4-digit year (e.g., 2023).", "error");
    return;
  }

  // Validate amount if provided
  const invalidAmount = projectMajor.some((project) => 
    project.amount && parseFloat(project.amount) < 0
  );
  if (invalidAmount) {
    displayMessage("Amount cannot be negative.", "error");
    return;
  }

  setIsSubmitting(true);
  const results = [];
  
  try {
    for (const project of projectMajor) {
      const fd = new FormData();
      
      // Map to Project table structure
      fd.append("employee_id", formData.employeeId);
      fd.append("project_type", project.type || "");
      fd.append("project_name", project.name || "");
      fd.append("sponsorer", project.sponsorer || "");
      fd.append("amount", project.amount || "0");
      fd.append("sanction_year", project.sanctionYear || "");
      
      // Add certificate file if exists
      if (project.certificate) {
        fd.append("certificate_path", project.certificate);
      }

      try {
        const res = await axios.post(endpoint, fd, { 
          headers: { "Content-Type": "multipart/form-data" }, 
          timeout: 30000 
        });
        results.push({ ok: true, data: res.data, row: project.id });
      } catch (err) {
        results.push({ 
          ok: false, 
          error: err.response?.data?.message || "Failed to insert project major data.", 
          row: project.id 
        });
      }
    }
    
    const successCount = results.filter((r) => r.ok).length;
    const failCount = results.length - successCount;
    
    if (successCount > 0) {
      displayMessage(`Successfully saved ${successCount} project record${successCount > 1 ? "s" : ""}${failCount > 0 ? `, ${failCount} failed` : ""}.`, "success");
    }
    
    if (failCount > 0) {
      displayMessage(`Some records failed. Example: ${results.find((r) => !r.ok)?.error || "Unknown error"}`, "error");
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
    displayMessage("An unexpected error occurred while saving project major data.", "error");
  } finally {
    setIsSubmitting(false);
  }
}, [projectMajor, displayMessage, formData.employeeId]);
 const handleSaveAwards = useCallback(async () => {
  const endpoint = "http://localhost:5000/api/awards";
  
  // Validation
  const missingInAny = awards.some((award) => 
    !formData.employeeId || !award.name
  );
  
  if (missingInAny) {
    displayMessage("Please fill: Employee ID and Award Name for all awards before saving.", "error");
    return;
  }

  setIsSubmitting(true);
  const results = [];
  
  try {
    for (const award of awards) {
      const fd = new FormData();
      
      // Map to Awards table structure
      fd.append("employee_id", formData.employeeId);
      fd.append("award_name", award.name || "");
      fd.append("award_organization", award.organization || "");
      
      // Add certificate file if exists
      if (award.certificate) {
        fd.append("certificate_path", award.certificate);
      }

      try {
        const res = await axios.post(endpoint, fd, { 
          headers: { "Content-Type": "multipart/form-data" }, 
          timeout: 30000 
        });
        results.push({ ok: true, data: res.data, row: award.id });
      } catch (err) {
        results.push({ 
          ok: false, 
          error: err.response?.data?.message || "Failed to insert award data.", 
          row: award.id 
        });
      }
    }
    
    const successCount = results.filter((r) => r.ok).length;
    const failCount = results.length - successCount;
    
    if (successCount > 0) {
      displayMessage(`Successfully saved ${successCount} award record${successCount > 1 ? "s" : ""}${failCount > 0 ? `, ${failCount} failed` : ""}.`, "success");
    }
    
    if (failCount > 0) {
      displayMessage(`Some records failed. Example: ${results.find((r) => !r.ok)?.error || "Unknown error"}`, "error");
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
    displayMessage("An unexpected error occurred while saving award data.", "error");
  } finally {
    setIsSubmitting(false);
  }
}, [awards, displayMessage, formData.employeeId]);
  /* -------------------- Form nav -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === "personal") {
      await submitPersonalInformation();
    } else if (currentStep === "academic") {
      displayMessage("Academic and professional information saved successfully!", "success");
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (currentStep === "personal") {
      if (validatePersonalInformation()) {
        const ok = await submitPersonalInformation();
        if (ok) {
          setCurrentStep("academic");
          displayMessage("Personal information saved successfully! Moving to Academic & Professional section.", "success");
        }
      }
    } else if (currentStep === "academic") {
      navigate("/A_qualification");
    }
  };

  const handleBack = () => setCurrentStep("personal");

  /* -------------------- Render -------------------- */
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>Add New Employee {staffType && `- ${formData.employeeType} Staff`}</h1>
            <p style={styles.subtitle}>Fill in the employee information in two steps: personal information and academic qualifications.</p>
          </div>
          <button style={styles.closeButton} type="button" onClick={() => alert("Cancel form and navigate to dashboard.")}>
            <XIcon size={20} />
          </button>
        </div>

        {/* Steps */}
        <div style={styles.stepIndicator}>
          <div style={styles.step}>
            <div style={{ ...styles.stepNumber, backgroundColor: currentStep === "personal" ? "#030213" : "#10b981" }}>
              {currentStep === "academic" ? <CheckCircleIcon size={16} color="white" /> : "1"}
            </div>
            <span style={{ ...styles.stepText, color: currentStep === "personal" ? "#111827" : "#6b7280" }}>Personal Information</span>
          </div>
          <div style={styles.stepLine} />
          <div style={styles.step}>
            <div style={{ ...styles.stepNumber, backgroundColor: currentStep === "academic" ? "#030213" : "#f3f4f6", color: currentStep === "academic" ? "white" : "#9ca3af" }}>
              2
            </div>
            <span style={{ ...styles.stepText, color: currentStep === "academic" ? "#111827" : "#6b7280" }}>Academic & Professional</span>
          </div>
        </div>

        <AlertBox message={message} type={messageType} />

        <form onSubmit={handleSubmit}>
          {currentStep === "personal" && (
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Employee Information (Personal, Employment, & Financial)</h3>

              <div style={styles.grid3}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name <span style={styles.required}>*</span></label>
                  <input style={styles.input} type="text" placeholder="Enter full name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date of Birth <span style={styles.required}>*</span></label>
                  <input style={styles.input} type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Aadhaar No <span style={styles.required}>*</span></label>
                  <input style={styles.input} type="text" placeholder="XXXX XXXX XXXX" maxLength={12} name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} required />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Mobile <span style={styles.required}>*</span></label>
                  <input style={styles.input} type="tel" placeholder="+91 XXXXX XXXXX" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email <span style={styles.required}>*</span></label>
                  <input style={styles.input} type="email" placeholder="email@example.com" name="emailId" value={formData.emailId} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gender <span style={styles.required}>*</span></label>
                  <select style={styles.select} name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Employee ID <span style={styles.required}>*</span></label>
                  <input style={styles.input} type="text" placeholder="Enter Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Employee Type <span style={styles.required}>*</span></label>
                  <select style={styles.select} name="employeeType" value={formData.employeeType} onChange={handleChange} required>
                    <option value="">Select Employee Type</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Non-Teaching">Non-Teaching</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date of Joining <span style={styles.required}>*</span></label>
                  <input style={styles.input} type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} required />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Designation <span style={styles.required}>*</span></label>
                  <input style={styles.input} type="text" placeholder="Enter designation" name="designation" value={formData.designation} onChange={handleChange} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Department <span style={styles.required}>*</span></label>
                  <select style={styles.select} name="department" value={formData.department} onChange={handleChange} required>
                    <option value="">Select department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>PAN No</label>
                  <input style={styles.input} type="text" placeholder="ABCDE1234F" maxLength={10} name="panNo" value={formData.panNo} onChange={handleChange} />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Account No</label>
                  <input style={styles.input} type="text" placeholder="Bank account number" name="accountNo" value={formData.accountNo} onChange={handleChange} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>IFSC Code</label>
                  <input style={styles.input} type="text" placeholder="IFSC code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Marital Status</label>
                  <select style={styles.select} name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
                    <option value="">Select status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select style={styles.select} name="category" value={formData.category} onChange={handleChange}>
                    <option value="">Select category</option>
                    <option value="general">General</option>
                    <option value="obc">OBC</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Blood Group</label>
                  <select style={styles.select} name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Caste</label>
                  <input style={styles.input} type="text" placeholder="Enter caste" name="caste" value={formData.caste} onChange={handleChange} />
                </div>
              </div>

              <div style={styles.separator} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Postal Address <span style={styles.required}>*</span></label>
                  <textarea style={styles.textarea} placeholder="Enter postal address" name="postalAddress" value={formData.postalAddress} onChange={handleChange} required rows={3} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Permanent Address <span style={styles.required}>*</span></label>
                  <textarea style={styles.textarea} placeholder="Enter permanent address" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} required rows={3} />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Upload Picture <span style={styles.required}>*</span></label>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <input style={styles.fileInput} type="file" accept="image/*" onChange={handleFileChange} required />
                  <button style={{ ...styles.button, ...styles.buttonOutline }} type="button" onClick={() => alert("Simulating file upload action...")}>
                    <UploadIcon size={16} />
                    Upload
                  </button>
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button style={{ ...styles.button, ...styles.buttonOutline }} type="button" onClick={() => alert("Cancel action mock.")} disabled={isSubmitting}>
                  Cancel
                </button>
                <button style={{ ...styles.button, ...styles.buttonPrimary }} type="button" onClick={handleNext} disabled={isSubmitting}>
                  <ArrowRightIcon size={16} />
                  {isSubmitting ? "Saving..." : "Save & Next"}
                </button>
              </div>
            </div>
          )}

          {currentStep === "academic" && (
            <div>
              <AcademicQualificationSection
                academicQualifications={academicQualifications}
                addEntry={addEntry}
                removeEntry={removeEntry}
                handleNestedChange={handleNestedChange}
                handleNestedFileChange={handleNestedFileChange}
                handleSaveAcademicQualification={handleSaveAcademicQualification}
                isSubmitting={isSubmitting}
              />

              <ServiceDataSection
                serviceDataEntries={serviceDataEntries}
                addEntry={addEntry}
                removeEntry={removeEntry}
                handleNestedChange={handleNestedChange}
                handleSaveServiceData={handleSaveServiceData}
              />

              <ShortTermCourseSection
                shortTermCourses={shortTermCourses}
                addEntry={addEntry}
                removeEntry={removeEntry}
                handleNestedChange={handleNestedChange}
                handleNestedFileChange={handleNestedFileChange}
                handleSaveShortTermCourses={handleSaveShortTermCourses}
              />

             <PaperDetailsSection
  paperDetails={paperDetails}
  addEntry={addEntry}
  removeEntry={removeEntry}
  handleNestedChange={handleNestedChange}
  handleNestedFileChange={handleNestedFileChange}
  handleSavePaperDetails={handleSavePaperDetails}
  isSubmitting={isSubmitting} // Add this prop
/>

              <BookPublishedSection
  bookPublished={bookPublished}
  addEntry={addEntry}
  removeEntry={removeEntry}
  handleNestedChange={handleNestedChange}
  handleNestedFileChange={handleNestedFileChange}
  handleSaveBookPublished={handleSaveBookPublished}
  isSubmitting={isSubmitting} // Add this line
/>
            <ProjectMajorSection
  projectMajor={projectMajor}
  addEntry={addEntry}
  removeEntry={removeEntry}
  handleNestedChange={handleNestedChange}
  handleNestedFileChange={handleNestedFileChange}
  handleSaveProjectMajor={handleSaveProjectMajor}
  isSubmitting={isSubmitting} // Add this line
/>
            <AwardsSection
  awards={awards}
  addEntry={addEntry}
  removeEntry={removeEntry}
  handleNestedChange={handleNestedChange}
  handleNestedFileChange={handleNestedFileChange}
  handleSaveAwards={handleSaveAwards}
  isSubmitting={isSubmitting} // Add this line
/>

              <div style={styles.buttonGroupBetween}>
                <button style={{ ...styles.button, ...styles.buttonOutline }} type="button" onClick={handleBack}>
                  <ArrowLeftIcon size={16} />
                  Back
                </button>
                <div style={{ display: "flex", gap: 12 }}>
                  <button style={{ ...styles.button, ...styles.buttonOutline }} type="button" onClick={() => alert("Cancel action mock.")}>
                    Cancel
                  </button>
                  <button style={{ ...styles.button, ...styles.buttonPrimary }} type="button" onClick={handleNext}>
                    <CheckCircleIcon size={16} />
                    Complete
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default A_personalinfo;

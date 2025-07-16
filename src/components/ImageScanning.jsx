import React, { useState } from 'react';
import axios from 'axios';

function ImageScanning() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setResults([]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/scan-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log(res);

      setResults(res.data.matches || []);
      setError(res.data.error || "");
    } catch (err) {
      const msg =
        err?.response?.data?.error || "Unexpected error. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌐 AI Image Scanner</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="file-upload" style={styles.uploadBox}>
          {image ? image.name : "Click to Upload or Drop Image"}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>

        <button type="submit" style={styles.analyzeBtn} disabled={loading || !image}>
          {loading ? "Scanning..." : "Scan Image"}
        </button>
      </form>

      {error && <div style={styles.errorBox}>⚠️ {error}</div>}

      {results.length > 0 && (
        <div style={styles.resultBox}>
          <h3 style={styles.resultTitle}>🔍 Matches Found:</h3>
          <ul style={styles.matchList}>
            {results.map((r, i) => (
              <li key={i} style={styles.matchItem}>
                <a href={r.url} target="_blank" rel="noreferrer" style={styles.matchLink}>
                  {r.name || r.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && image && results.length === 0 && !error && (
        <div style={styles.resultBox}>
          <h3 style={styles.resultTitle}>✅ No matches found</h3>
          <p style={{ color: "#444" }}>This image doesn’t appear publicly on the web.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #fbefff, #e4f3ff)",
    padding: "2rem",
    borderRadius: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    margin: "2rem auto",
    fontFamily: "'Segoe UI', sans-serif"
  },
  title: {
    textAlign: "center",
    fontSize: "1.8rem",
    color: "#4c4081",
    marginBottom: "1.5rem"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  uploadBox: {
    background: "linear-gradient(to right, #f3eaff, #e6f7ff)",
    border: "2px dashed #bbb",
    padding: "1.5rem",
    width: "100%",
    textAlign: "center",
    borderRadius: "15px",
    cursor: "pointer",
    color: "#666",
    marginBottom: "1rem",
    transition: "all 0.3s ease"
  },
  analyzeBtn: {
    background: "#8a63d2",
    color: "white",
    border: "none",
    padding: "0.8rem 1.2rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s ease"
  },
  errorBox: {
    color: "#d33",
    background: "#fff0f0",
    padding: "1rem",
    borderRadius: "10px",
    marginTop: "1rem",
    textAlign: "center"
  },
  resultBox: {
    marginTop: "2rem",
    background: "#fff9fe",
    padding: "1.2rem",
    borderRadius: "15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  },
  resultTitle: {
    color: "#4a3085",
    marginBottom: "1rem"
  },
  matchList: {
    listStyle: "none",
    padding: 0
  },
  matchItem: {
    margin: "0.5rem 0",
    background: "#f2f6ff",
    padding: "0.7rem",
    borderRadius: "10px"
  },
  matchLink: {
    textDecoration: "none",
    color: "#2d5dd7",
    fontWeight: 500
  }
};

export default ImageScanning;

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar";
import { API_URL } from "../../config";
import "./issue.css";

const CreateIssue = () => {
  const { id } = useParams(); // Repository ID
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { title, description } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!title.trim()) {
      setError("Issue title is required");
      return;
    }

    if (!description.trim()) {
      setError("Issue description is required");
      return;
    }

    try {
      setLoading(true);

      const issueData = {
        title: title.trim(),
        description: description.trim(),
      };

      await axios.post(`${API_URL}/issue/create/${id}`, issueData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate(`/repo/${id}`);
    } catch (err) {
      console.error("Error creating issue:", err);
      setError(err.response?.data?.message || "Failed to create issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="issue-wrapper">
        <div className="issue-container">
          <div className="issue-header">
            <button
              className="back-button"
              onClick={() => navigate(`/repo/${id}`)}
              aria-label="Go back"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
              </svg>
              Back
            </button>
            <h1>Create a new issue</h1>
            <p className="subtitle">
              Report bugs, request features, or start discussions
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="issue-form">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="title">
                  Title
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={handleChange}
                  placeholder="Brief description of the issue"
                  className="form-input"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description
                  <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleChange}
                  placeholder="Detailed explanation of the issue..."
                  className="form-textarea"
                  rows="8"
                  required
                />
                <span className="form-hint">
                  Provide as much detail as possible to help resolve this issue
                </span>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/repo/${id}`)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                    </svg>
                    Create issue
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateIssue;
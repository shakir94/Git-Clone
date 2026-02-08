import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar";
import { API_URL } from "../../config";
import "./issue.css";

const UpdateIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [repoId, setRepoId] = useState("");

  const { title, description, status } = formData;

  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/issue/${id}`);
        const issue = response.data.issue;

        setFormData({
          title: issue.title || "",
          description: issue.description || "",
          status: issue.status || "open",
        });
        setRepoId(issue.repository);
        setFetchLoading(false);
      } catch (err) {
        console.error("Error fetching issue:", err);
        setError("Failed to load issue");
        setFetchLoading(false);
      }
    };

    fetchIssueDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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

      const updateData = {
        title: title.trim(),
        description: description.trim(),
        status,
      };

      await axios.put(`${API_URL}/issue/update/${id}`, updateData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess("Issue updated successfully!");

      setTimeout(() => {
        navigate(`/issue/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Error updating issue:", err);
      setError(err.response?.data?.message || "Failed to update issue");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <>
        <Navbar />
        <div className="issue-wrapper">
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#8b949e",
            }}
          >
            <div
              className="spinner-large"
              style={{ margin: "0 auto 16px" }}
            ></div>
            <p>Loading issue...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="issue-wrapper">
        <div className="issue-container">
          <div className="issue-header">
            <button
              className="back-button"
              onClick={() => navigate(`/issue/${id}`)}
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
            <h1>Update issue</h1>
            <p className="subtitle">Modify the issue details</p>
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

          {success && (
            <div className="alert alert-success">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
              </svg>
              {success}
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
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/issue/${id}`)}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                    </svg>
                    Update issue
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

export default UpdateIssue;
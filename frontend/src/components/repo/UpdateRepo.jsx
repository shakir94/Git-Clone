import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar";
import { API_URL } from "../../config";
import "./CreateRepo.css";

const UpdateRepo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    content: "",
  });
  const [repoName, setRepoName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const { description, content } = formData;

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/repo/${id}`);
        const repo = response.data;

        // Check if user is owner
        const userId = localStorage.getItem("userId");
        const ownerId = repo.owner?._id || repo.owner;
        
        if (ownerId !== userId) {
          setError("You are not authorized to edit this repository");
          setTimeout(() => navigate(`/repo/${id}`), 2000);
          return;
        }

        setRepoName(repo.name);
        setFormData({
          description: repo.description || "",
          content: "",
        });
        setFetchLoading(false);
      } catch (err) {
        console.error("Error fetching repository:", err);
        setError("Failed to load repository");
        setFetchLoading(false);
      }
    };

    fetchRepoDetails();
  }, [id, navigate]);

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

    try {
      setLoading(true);

      const updateData = {};

      if (description.trim()) {
        updateData.description = description.trim();
      }

      if (content.trim()) {
        updateData.content = content.trim();
      }

      const response = await axios.put(
        `${API_URL}/repo/update/${id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Repository updated successfully!");

      setTimeout(() => {
        navigate(`/repo/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Error updating repository:", err);
      setError(err.response?.data?.message || "Failed to update repository");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <>
        <Navbar />
        <div className="create-repo-wrapper">
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
            <p>Loading repository...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="create-repo-wrapper">
        <div className="create-repo-container">
          <div className="create-repo-header">
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
            <h1>Update repository</h1>
            <p className="subtitle">
              Update the description or add content to <strong>{repoName}</strong>
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

          <form onSubmit={handleSubmit} className="create-repo-form">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="description">
                  Description
                  <span className="optional">(optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleChange}
                  placeholder="Update repository description"
                  className="form-textarea"
                  rows="3"
                />
                <span className="form-hint">
                  Leave blank to keep the current description
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="content">
                  Add Content
                  <span className="optional">(optional)</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={handleChange}
                  placeholder="Add new content to the repository"
                  className="form-textarea"
                  rows="5"
                />
                <span className="form-hint">
                  This will be added to the repository's content list
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
                    Update repository
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

export default UpdateRepo;
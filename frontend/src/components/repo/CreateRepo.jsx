import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar";
import { API_URL } from "../../config";
import "./CreateRepo.css";

const CreateRepo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "public",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { name, description, visibility } = formData;

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
    if (!name.trim()) {
      setError("Repository name is required");
      return;
    }

    if (name.length < 3) {
      setError("Repository name must be at least 3 characters");
      return;
    }

    const nameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!nameRegex.test(name)) {
      setError(
        "Repository name can only contain letters, numbers, hyphens, and underscores",
      );
      return;
    }

    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User not authenticated. Please login again.");
        setLoading(false);
        return;
      }

      const repoData = {
        name: name.trim(),
        description: description.trim() || "",
        content: [],
        visibility,
        owner: userId,
        issues: [],
      };

      console.log("=== DEBUG INFO ===");
      console.log("API URL:", API_URL);
      console.log("Full endpoint:", `${API_URL}/repo/create`);
      console.log("User ID:", userId);
      console.log("Repo data being sent:", repoData);

      const response = await axios.post(`${API_URL}/repo/create`, repoData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Success! Response:", response.data);
      navigate("/");
      
    } catch (err) {
      console.error("=== ERROR DETAILS ===");
      console.error("Full error object:", err);
      
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
        console.error("Response headers:", err.response.headers);
        
        setError(
          err.response.data?.message || 
          `Server error: ${err.response.status}. Check console for details.`
        );
      } else if (err.request) {
        console.error("Request made but no response:", err.request);
        setError("No response from server. Please check your connection.");
      } else {
        console.error("Error setting up request:", err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-wrapper">
        <div className="create-repo-container">
          <div className="create-repo-header">
            <button
              className="back-button"
              onClick={() => navigate("/")}
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
            <h1>Create a new repository</h1>
            <p className="subtitle">
              A repository contains all project files, including the revision
              history.
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

          <form onSubmit={handleSubmit} className="create-repo-form">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="name">
                  Repository name
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="my-awesome-project"
                  className="form-input"
                  required
                  autoFocus
                />
                <span className="form-hint">
                  Great repository names are short and memorable. Need
                  inspiration? How about{" "}
                  <span
                    className="suggestion"
                    onClick={() =>
                      setFormData({ ...formData, name: "supreme-carnival" })
                    }
                  >
                    supreme-carnival
                  </span>
                  ?
                </span>
              </div>

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
                  placeholder="A brief description of your repository"
                  className="form-textarea"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="visibility-section">
                <h3>Visibility</h3>
                <p className="section-description">
                  Choose who can see this repository
                </p>

                <div className="radio-group">
                  <label
                    className={`radio-option ${visibility === "public" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibility === "public"}
                      onChange={handleChange}
                    />
                    <div className="radio-content">
                      <div className="radio-header">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.75.75 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                        </svg>
                        <strong>Public</strong>
                      </div>
                      <p>Anyone on the internet can see this repository</p>
                    </div>
                  </label>

                  <label
                    className={`radio-option ${visibility === "private" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={visibility === "private"}
                      onChange={handleChange}
                    />
                    <div className="radio-content">
                      <div className="radio-header">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M4 4v2h-.25A1.75 1.75 0 0 0 2 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0 0 14 13.25v-5.5A1.75 1.75 0 0 0 12.25 6H12V4a4 4 0 1 0-8 0Zm6.5 2V4a2.5 2.5 0 0 0-5 0v2Z"></path>
                        </svg>
                        <strong>Private</strong>
                      </div>
                      <p>
                        You choose who can see this repository
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/")}
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
                      <path d="M7.47 10.78a.75.75 0 0 0 1.06 0l3.75-3.75a.75.75 0 0 0-1.06-1.06L8.75 8.44V1.75a.75.75 0 0 0-1.5 0v6.69L4.78 5.97a.75.75 0 0 0-1.06 1.06l3.75 3.75ZM3.75 13a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z"></path>
                    </svg>
                    Create repository
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

export default CreateRepo;
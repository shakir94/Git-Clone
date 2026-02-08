import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar";
import { API_URL } from "../../config";
import "./repoDetail.css";

const RepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/repo/${id}`);
        console.log("Repository data:", response.data);
        setRepo(response.data);

        // Check if current user is the owner
        const userId = localStorage.getItem("userId");
        const ownerId = response.data.owner?._id || response.data.owner;
        setIsOwner(ownerId === userId);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching repository:", err);
        setError("Failed to load repository");
        setLoading(false);
      }
    };

    const fetchIssues = async () => {
      try {
        const response = await axios.get(`${API_URL}/issue/all/${id}`);
        setIssues(response.data.issues || []);
      } catch (err) {
        console.error("Error fetching issues:", err);
        // Don't show error if no issues found
        setIssues([]);
      }
    };

    fetchRepoDetails();
    fetchIssues();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await axios.delete(`${API_URL}/repo/delete/${id}`);

      navigate("/");
    } catch (err) {
      console.error("Error deleting repository:", err);
      alert(err.response?.data?.message || "Failed to delete repository");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="repo-detail-loading">
          <div className="spinner-large"></div>
          <p>Loading repository...</p>
        </div>
      </>
    );
  }

  if (error || !repo) {
    return (
      <>
        <Navbar />
        <div className="repo-detail-error">
          <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
          </svg>
          <h2>{error || "Repository not found"}</h2>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Go to Dashboard
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="repo-detail-wrapper">
        <div className="repo-detail-container">
          {/* Header */}
          <div className="repo-header">
            <button className="back-button" onClick={() => navigate("/")}>
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

            <div className="repo-title-section">
              <div className="repo-name-line">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                </svg>
                <h1>{repo.name}</h1>
                <span className={`visibility-badge ${repo.visibility}`}>
                  {repo.visibility === "public" ? (
                    <>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                      </svg>
                      Public
                    </>
                  ) : (
                    <>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M4 4v2h-.25A1.75 1.75 0 0 0 2 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0 0 14 13.25v-5.5A1.75 1.75 0 0 0 12.25 6H12V4a4 4 0 1 0-8 0Z"></path>
                      </svg>
                      Private
                    </>
                  )}
                </span>
              </div>

              {repo.description && (
                <p className="repo-description">{repo.description}</p>
              )}
            </div>

            {isOwner && (
              <div className="repo-actions">
                <button
                  className="btn-action btn-update"
                  onClick={() => navigate(`/repo/update/${id}`)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15Z"></path>
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="repo-content-section">
            <div className="content-header">
              <h3>Repository Content</h3>
            </div>

            {repo.content && repo.content.length > 0 ? (
              <div className="content-list">
                {repo.content.map((item, index) => (
                  <div key={index} className="content-item">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"></path>
                </svg>
                <p>This repository is empty</p>
                {isOwner && <span>Add content by updating the repository</span>}
              </div>
            )}
          </div>

          {/* Issues Section */}
          <div className="repo-issues-section">
            <div className="issues-header">
              <h3>Issues</h3>
              <div className="issues-header-actions">
                <span className="issue-count">{issues.length}</span>
                <button
                  className="btn-create-issue"
                  onClick={() => navigate(`/repo/${id}/issue/create`)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>
                  </svg>
                  New Issue
                </button>
              </div>
            </div>

            {issues && issues.length > 0 ? (
              <div className="issues-list">
                {issues.map((issue) => (
                  <div
                    key={issue._id}
                    className="issue-item"
                    onClick={() => navigate(`/issue/${issue._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="issue-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        {issue.status === "open" ? (
                          <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                        ) : (
                          <path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path>
                        )}
                      </svg>
                    </div>
                    <div className="issue-content">
                      <h4>{issue.title}</h4>
                      <p>{issue.description}</p>
                    </div>
                    <span className={`issue-status ${issue.status}`}>
                      {issue.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-small">
                <p>No issues yet</p>
                <span>Create your first issue to track bugs and features</span>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="modal-content delete-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="warning-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
                  </svg>
                </div>
                <h2>Delete Repository</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                <p className="warning-text">
                  Are you sure you want to delete <strong>{repo.name}</strong>?
                </p>
                <p className="warning-subtext">
                  This action <strong>cannot be undone</strong>. This will
                  permanently delete the repository and all of its content.
                </p>
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  className="delete-confirm-btn"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <span className="spinner"></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete Repository"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RepoDetail;


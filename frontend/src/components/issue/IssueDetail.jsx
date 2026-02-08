import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar";
import { API_URL } from "../../config";
import "./issue.css";

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/issue/${id}`);
        console.log("Issue data:", response.data);
        setIssue(response.data.issue);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching issue:", err);
        setError("Failed to load issue");
        setLoading(false);
      }
    };

    fetchIssueDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await axios.delete(`${API_URL}/issue/delete/${id}`);

      navigate(`/repo/${issue.repository}`);
    } catch (err) {
      console.error("Error deleting issue:", err);
      alert(err.response?.data?.message || "Failed to delete issue");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleStatusToggle = async () => {
    try {
      const newStatus = issue.status === "open" ? "closed" : "open";

      const response = await axios.put(`${API_URL}/issue/update/${id}`, {
        status: newStatus,
      });

      setIssue(response.data.issue);
    } catch (err) {
      console.error("Error updating issue status:", err);
      alert("Failed to update issue status");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="issue-detail-loading">
          <div className="spinner-large"></div>
          <p>Loading issue...</p>
        </div>
      </>
    );
  }

  if (error || !issue) {
    return (
      <>
        <Navbar />
        <div className="issue-detail-error">
          <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
          </svg>
          <h2>{error || "Issue not found"}</h2>
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
      <div className="issue-detail-wrapper">
        <div className="issue-detail-container">
          {/* Header */}
          <div className="issue-detail-header">
            <button
              className="back-button"
              onClick={() => navigate(`/repo/${issue.repository}`)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
              </svg>
              Back to Repository
            </button>

            <div className="issue-title-section">
              <div className="issue-title-line">
                <div className="issue-icon-large">
                  <svg
                    width="24"
                    height="24"
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
                <h1>{issue.title}</h1>
                <span className={`issue-status-badge ${issue.status}`}>
                  {issue.status}
                </span>
              </div>
            </div>

            <div className="issue-actions">
              <button
                className="btn-action btn-update"
                onClick={() => navigate(`/issue/update/${id}`)}
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
                className={`btn-action ${issue.status === "open" ? "btn-close" : "btn-reopen"}`}
                onClick={handleStatusToggle}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  {issue.status === "open" ? (
                    <path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path>
                  ) : (
                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                  )}
                </svg>
                {issue.status === "open" ? "Close issue" : "Reopen issue"}
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
          </div>

          {/* Description Section */}
          <div className="issue-description-section">
            <h3>Description</h3>
            <div className="issue-description-content">
              <p>{issue.description}</p>
            </div>
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
                <h2>Delete Issue</h2>
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
                  Are you sure you want to delete this issue?
                </p>
                <p className="warning-subtext">
                  This action <strong>cannot be undone</strong>. This will
                  permanently delete the issue.
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
                    "Delete Issue"
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

export default IssueDetail;
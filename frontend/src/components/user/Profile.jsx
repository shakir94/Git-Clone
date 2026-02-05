import React, { useEffect, useState } from "react";
import "./profile.css";
import Navbar from "../../Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";
import { API_URL } from "../../config";

const Profile = () => {
  const { setCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [followers] = useState(150);
  const [following] = useState(75);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `${API_URL}/userProfile/${userId}`,
          );
          console.log(response);
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details:", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <>
      <Navbar />
      <section id="profile">
        <div className="profile-header">
          <div className="tabs">
            <div
              className={`tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.75.75 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
              </svg>
              <span>Overview</span>
            </div>
            <div
              className={`tab ${activeTab === "starred" ? "active" : ""}`}
              onClick={() => setActiveTab("starred")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
              </svg>
              <span>Starred Repositories</span>
            </div>
          </div>
        </div>
        <button
          style={{
            position: "fixed",
            right: "20px",
            bottom: "20px",
            background: "black",
            color: "white",
            padding: "10px 20px",
            cursor: "pointer",
          }}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCurrentUser(null);
            window.location.href = "/auth";
          }}
        >
          Logout
        </button>

        <div className="profile-content">
          <aside className="profile-sidebar">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {/* <span>{userDetails?.username}</span> */}
              </div>
              <h2 className="username">{userDetails?.username}</h2>
            </div>

            <button
              className={`follow-btn ${isFollowing ? "following" : ""}`}
              onClick={handleFollow}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>

            <div className="followers-info">
              <div className="follower-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Z"></path>
                </svg>
                <span>
                  <strong>{followers}</strong> followers
                </span>
              </div>
              <div className="follower-item">
                <span>
                  <strong>{following}</strong> following
                </span>
              </div>
            </div>
          </aside>

          <HeatMapProfile />
        </div>
      </section>
    </>
  );
};

export default Profile;

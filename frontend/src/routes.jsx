import React, { useEffect } from "react";
import { useNavigate, useRoutes, useLocation } from "react-router-dom"; 

//pages list
import Dashboard from "../src/components/dashboard/Dashboard";
import Profile from "../src/components/user/Profile";
import Login from "../src/components/auth/Login";
import Signup from "../src/components/auth/Signup";
import UpdateProfile from "./components/user/UpdatUser";
import CreateRepo from "./components/repo/CreateRepo";

//AuthContext
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (
      !userIdFromStorage &&
      !["/auth", "/signup"].includes(location.pathname) 
    ) {
      navigate("/auth");
    }

    if (userIdFromStorage && location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser, location.pathname]); 

  let elements = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/edit-profile",
      element: <UpdateProfile />,
    },
    {
      path: "/create-repository",
      element: <CreateRepo />,
    },
  ]);

  return elements;
};

export default ProjectRoutes;
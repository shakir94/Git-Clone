import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";
import Navbar from "../../Navbar";
import { API_URL } from "../../config";


const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepo = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/repo/user/${userId}`,
        );
        console.log(response.data);
        setRepositories(response.data.repositories);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    const fetchSuggestedRepo = async () => {
      try {
        const response = await axios.get(`${API_URL}/repo/all`);
        console.log(response.data);
        setSuggestedRepositories(response.data.repositories);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };
    fetchRepo();
    fetchSuggestedRepo();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
    <Navbar/>
    <section id="dashboard">
      <aside>
        <h2>suggested Repositories</h2>
        {suggestedRepositories.map((repo) => {
          return (
            <div key={repo._id}>
              <h3>{repo.name}</h3>
              <h3>{repo.description}</h3>
            </div>
          );
        })}
      </aside>
      <main>
        <h2>Your Repositories</h2>
        <div id="serach">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchResults.map((repo) => {
          return (
            <div key={repo._id}>
              <h3>{repo.name}</h3>
              <h3>{repo.description}</h3>
            </div>
          );
        })}
      </main>
      <aside>
        <h2>Upcoming events</h2>
        <ul>
          <li>
            <p>Ecommerce--comming soon</p>
          </li>
          <li>
            <p>Investing app--coming soon</p>
          </li>
         
         
        </ul>
      </aside>
    </section>
    </>
  );
};

export default Dashboard;

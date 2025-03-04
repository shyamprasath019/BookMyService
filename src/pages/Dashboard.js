import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import AccountSetup from "../components/AccountSetup"; // Import the AccountSettings component
import "./Dashboard.css";

function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userRole = queryParams.get("role"); // Get role from URL query params
  const [activeTab, setActiveTab] = useState("Overview");
  const [projects, setProjects] = useState([]); // For Projects tab
  const [messages, setMessages] = useState([]); // For Inbox tab
  const [connections, setConnections] = useState([]); // For Connections tab
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Fetch data based on the active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "Projects") {
          // Fetch projects
          const projectsQuery = query(
            collection(db, "projects"),
            where(userRole === "client" ? "clientId" : "freelancerId", "==", auth.currentUser.uid)
          );
          const projectsSnapshot = await getDocs(projectsQuery);
          const projectsData = projectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(projectsData);
        } else if (activeTab === "Inbox") {
          // Fetch messages
          const messagesQuery = query(
            collection(db, "messages"),
            where("receiverId", "==", auth.currentUser.uid)
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          const messagesData = messagesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(messagesData);
        } else if (activeTab === "Connections") {
          // Fetch connections
          const connectionsQuery = query(
            collection(db, "connections"),
            where(userRole === "client" ? "clientId" : "freelancerId", "==", auth.currentUser.uid)
          );
          const connectionsSnapshot = await getDocs(connectionsQuery);
          const connectionsData = connectionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setConnections(connectionsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, userRole]);

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    switch (activeTab) {
      case "Overview":
        return (
          <div>
            <h3>Welcome to your {userRole === "client" ? "Client" : "Freelancer"} Dashboard!</h3>
            <p>Here you can manage your projects, payments, and profile.</p>
          </div>
        );
      case "Projects":
        return (
          <div>
            <h3>{userRole === "client" ? "My Projects" : "Projects Worked On"}</h3>
            {projects.length > 0 ? (
              <ul>
                {projects.map((project) => (
                  <li key={project.id}>
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No projects found.</p>
            )}
          </div>
        );
      case "Inbox":
        return (
          <div>
            <h3>Inbox</h3>
            {messages.length > 0 ? (
              <ul>
                {messages.map((message) => (
                  <li key={message.id}>
                    <h4>{message.senderName}</h4>
                    <p>{message.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No messages found.</p>
            )}
          </div>
        );
      case "Connections":
        return (
          <div>
            <h3>{userRole === "client" ? "Freelancers" : "Clients"}</h3>
            {connections.length > 0 ? (
              <ul>
                {connections.map((connection) => (
                  <li key={connection.id}>
                    <h4>{connection.name}</h4>
                    <p>{connection.email}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No connections found.</p>
            )}
          </div>
        );
      case "AccountSettings":
        return <AccountSetup />; // Render the AccountSettings component
      default:
        return (
          <div>
            <h3>Welcome!</h3>
            <p>Select a section from the sidebar to view its content.</p>
          </div>
        );
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/"); // Redirect to the sign-in page after logout
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Dashboard</h3>
        <ul>
          <li
            className={activeTab === "Overview" ? "active" : ""}
            onClick={() => setActiveTab("Overview")}
          >
            Overview
          </li>
          <li
            className={activeTab === "Projects" ? "active" : ""}
            onClick={() => setActiveTab("Projects")}
          >
            {userRole === "client" ? "My Projects" : "Projects Worked On"}
          </li>
          <li
            className={activeTab === "Inbox" ? "active" : ""}
            onClick={() => setActiveTab("Inbox")}
          >
            Inbox
          </li>
          <li
            className={activeTab === "Connections" ? "active" : ""}
            onClick={() => setActiveTab("Connections")}
          >
            {userRole === "client" ? "Freelancers" : "Clients"}
          </li>
          <li
            className={activeTab === "AccountSettings" ? "active" : ""}
            onClick={() => setActiveTab("AccountSettings")}
          >
            Account Settings
          </li>
          <li>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h2>{activeTab}</h2>
        <div className="content-area">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Dashboard;
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import "./Dashboard.css";

function ClientDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Client Dashboard</h1>
      <div className="dashboard-menu">
        <Link to="/my-profile">My Profile</Link>
        <Link to="/payments">Payments</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/support">Support</Link>
        
      </div>
      <div className="dashboard-content">
        <h2>Welcome, Client!</h2>
        <p>Manage your projects, payments, and profile here.</p>
      </div>
    </div>
  );
}

export default ClientDashboard;

// function ClientDashboard() {
//   const [user] = useAuthState(auth); // Current logged-in user

//   if (!user) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="dashboard-container">
//       <h2>Client Dashboard</h2>

//       <div className="dashboard-cards">
//         <div className="card">
//           <h3>Posted Projects</h3>
//           <p>View and manage your posted projects.</p>
//           <button onClick={() => alert("Navigate to posted projects")}>
//             View Projects
//           </button>
//         </div>

//         <div className="card">
//           <h3>Messages</h3>
//           <p>Check your messages with freelancers.</p>
//           <button onClick={() => alert("Navigate to messages")}>
//             View Messages
//           </button>
//         </div>

//         <div className="card">
//           <h3>Bids</h3>
//           <p>Review bids on your projects.</p>
//           <button onClick={() => alert("Navigate to bids")}>
//             View Bids
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ClientDashboard;
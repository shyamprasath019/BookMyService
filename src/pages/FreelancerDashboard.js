import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import "./Dashboard.css";

function FreelancerDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Freelancer Dashboard</h1>
      <div className="dashboard-menu">
        <Link to="/my-profile">My Profile</Link>
        <Link to="/payments">Payments</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/support">Support</Link>
      </div>
      <div className="dashboard-content">
        <h2>Welcome, Freelancer!</h2>
        <p>Manage your bids, projects, and profile here.</p>
      </div>
    </div>
  );
}

export default FreelancerDashboard;

// function FreelancerDashboard() {
//   const [user] = useAuthState(auth); // Current logged-in user

//   if (!user) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="dashboard-container">
//       <h2>Freelancer Dashboard</h2>

//       <div className="dashboard-cards">
//         <div className="card">
//           <h3>Available Projects</h3>
//           <p>Find and bid on new projects.</p>
//           <button onClick={() => alert("Navigate to available projects")}>
//             View Projects
//           </button>
//         </div>

//         <div className="card">
//           <h3>Messages</h3>
//           <p>Check your messages with clients.</p>
//           <button onClick={() => alert("Navigate to messages")}>
//             View Messages
//           </button>
//         </div>

//         <div className="card">
//           <h3>Your Bids</h3>
//           <p>Track the status of your bids.</p>
//           <button onClick={() => alert("Navigate to your bids")}>
//             View Bids
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FreelancerDashboard;
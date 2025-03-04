import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./AccountSetup.css";

function AccountSetup() {
  const [user] = useAuthState(auth); // Current logged-in user
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState([]); // For freelancers
  const [hourlyRate, setHourlyRate] = useState(0); // For freelancers
  const [experience, setExperience] = useState(""); // For freelancers
  const [portfolio, setPortfolio] = useState(""); // For freelancers
  const [availability, setAvailability] = useState("available"); // For freelancers
  const [role, setRole] = useState(""); // client or freelancer
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Fetch user role from Firestore (if already set during sign-up)
      const fetchUserRole = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      };

      fetchUserRole();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    const userData = {
      uid: user.uid,
      name,
      email: user.email,
      role,
      profileImage,
      location,
      createdAt: new Date(),
    };

    if (role === "freelancer") {
      userData.skills = skills;
      userData.hourlyRate = hourlyRate;
      userData.experience = experience;
      userData.portfolio = portfolio;
      userData.availability = availability;
    }

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    // Redirect to the appropriate dashboard
    if (role === "client") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="account-setup-container">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Profile Picture URL</label>
          <input
            type="url"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {role === "freelancer" && (
          <>
            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                value={skills.join(", ")}
                onChange={(e) => setSkills(e.target.value.split(", "))}
                required
              />
            </div>

            <div className="form-group">
              <label>Hourly Rate (USD)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label>Portfolio/Website</label>
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </>
        )}

        <button type="submit">Save and Continue</button>
      </form>
    </div>
  );
}

export default AccountSetup;
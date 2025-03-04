import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./MyProfile.css";

function MyProfile() {
  const [user] = useAuthState(auth); // Current logged-in user
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>No profile data found.</p>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-details">
        <div className="profile-image">
          <img
            src={profile.profileImage || "default-profile.png"}
            alt={profile.name}
          />
        </div>

        <div className="profile-info">
          <h3>{profile.name}</h3>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Location:</strong> {profile.location}</p>

          {profile.role === "freelancer" && (
            <>
              <p><strong>Skills:</strong> {profile.skills.join(", ")}</p>
              <p><strong>Hourly Rate:</strong> ${profile.hourlyRate}/hr</p>
              <p><strong>Experience:</strong> {profile.experience}</p>
              <p><strong>Portfolio:</strong> <a href={profile.portfolio} target="_blank" rel="noopener noreferrer">{profile.portfolio}</a></p>
              <p><strong>Availability:</strong> <span className={profile.availability}>{profile.availability}</span></p>
            </>
          )}
        </div>
      </div>

      <button onClick={() => alert("Edit profile functionality coming soon!")}>
        Edit Profile
      </button>
    </div>
  );
}

export default MyProfile;
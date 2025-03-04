import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AccountSetup.css";

function AccountSetup() {
  const [user] = useAuthState(auth); // Current logged-in user
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [accountType, setAccountType] = useState("freelancer"); // Default to freelancer
  const [availability, setAvailability] = useState("yes");
  const [experience, setExperience] = useState(0);
  const [portfolio, setPortfolio] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Pre-fill email if user is logged in
      setName(user.displayName || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to complete your profile.");
      return;
    }

    setLoading(true);

    const userData = {
      uid: user.uid,
      name,
      email: user.email,
      accountType,
      availability,
      bio,
      createdAt: new Date().toISOString(),
      location,
      profileImage,
    };

    if (accountType === "freelancer") {
      userData.experience = experience;
      userData.portfolio = portfolio;
      userData.priceRange = priceRange;
      userData.skills = skills;
      userData.rating = 0; // Default rating for new freelancers
    }

    try {
      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), userData);
      alert("Profile setup complete!");
      navigate("/dashboard"); // Redirect to dashboard after setup
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
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

        <div className="form-group">
          <label>Profile Image URL</label>
          <input
            type="url"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            placeholder="Paste a link to your profile image"
          />
        </div>

        <div className="form-group">
          <label>Account Type</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>

        <div className="form-group">
          <label>Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            required
          >
            <option value="yes">Available</option>
            <option value="no">Not Available</option>
          </select>
        </div>

        {accountType === "freelancer" && (
          <>
            <div className="form-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label>Portfolio URL</label>
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="Link to your portfolio"
              />
            </div>

            <div className="form-group">
              <label>Price Range</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: Number(e.target.value) })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: Number(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                value={skills.join(", ")}
                onChange={(e) => setSkills(e.target.value.split(", "))}
                placeholder="e.g., UI, UX, Figma, HCI"
                required
              />
            </div>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default AccountSetup;
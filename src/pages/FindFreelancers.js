import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./FindFreelancers.css";

function FindFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [filters, setFilters] = useState({
    skills: "",
    experience: "",
    hourlyRateMin: "",
    hourlyRateMax: "",
    location: "",
    rating: "",
    availability: "",
  });
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    // Fetch freelancers from Firestore
    const fetchFreelancers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedFreelancers = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.accountType === "freelancer"); // Filter by role
      setFreelancers(fetchedFreelancers);
      setFilteredFreelancers(fetchedFreelancers);
    };

    fetchFreelancers();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...freelancers];

    if (filters.skills) {
      filtered = filtered.filter((freelancer) =>
        freelancer.skills.some((skill) =>
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        )
      );
    }

    if (filters.experience) {
      filtered = filtered.filter(
        (freelancer) => freelancer.experience === filters.experience
      );
    }

    if (filters.hourlyRateMin) {
      filtered = filtered.filter(
        (freelancer) => freelancer.hourlyRate >= Number(filters.hourlyRateMin)
      );
    }

    if (filters.hourlyRateMax) {
      filtered = filtered.filter(
        (freelancer) => freelancer.hourlyRate <= Number(filters.hourlyRateMax)
      );
    }

    if (filters.location) {
      filtered = filtered.filter((freelancer) =>
        freelancer.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(
        (freelancer) => freelancer.rating >= Number(filters.rating)
      );
    }

    if (filters.availability) {
      filtered = filtered.filter(
        (freelancer) => freelancer.availability === filters.availability
      );
    }

    setFilteredFreelancers(filtered);
  }, [filters, freelancers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const sortedFreelancers = [...filteredFreelancers].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "experience") {
      return b.experience - a.experience;
    } else if (sortBy === "hourlyRate") {
      return a.hourlyRate - b.hourlyRate;
    }
    return 0;
  });

  return (
    <div className="find-freelancers-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Filters</h3>

        <div className="filter-group">
          <label>Skills/Expertise</label>
          <input
            type="text"
            name="skills"
            placeholder="e.g., React, Design"
            value={filters.skills}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Experience Level</label>
          <select
            name="experience"
            value={filters.experience}
            onChange={handleFilterChange}
          >
            <option value="">Any</option>
            <option value="1">Beginner</option>
            <option value="3">Intermediate</option>
            <option value="5">Expert</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Hourly Rate Range</label>
          <div className="rate-range">
            <input
              type="number"
              name="hourlyRateMin"
              placeholder="Min"
              value={filters.hourlyRateMin}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="hourlyRateMax"
              placeholder="Max"
              value={filters.hourlyRateMax}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Location/Timezone</label>
          <input
            type="text"
            name="location"
            placeholder="e.g., New York, GMT+5"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Rating Threshold</label>
          <select
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
          >
            <option value="">Any</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Availability</label>
          <select
            name="availability"
            value={filters.availability}
            onChange={handleFilterChange}
          >
            <option value="">Any</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {/* Sidebar CTA */}
        <div className="sidebar-cta">
          <p>Can't find the right talent? Post your project and let freelancers come to you</p>
          <button onClick={() => (window.location.href = "/PostProject")}>
            Post your project
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="sort-options">
          <label>Sort By:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="rating">Rating</option>
            <option value="experience">Experience</option>
            <option value="hourlyRate">Hourly Rate</option>
          </select>
        </div>

        <div className="freelancers-grid">
          {sortedFreelancers.length > 0 ? (
            sortedFreelancers.map((freelancer) => (
              // <div key={freelancer.id} className="freelancer-card">
              //   <div className="profile-preview">
              //     <img
              //       src={freelancer.profileImage || "default-profile.png"}
              //       alt={freelancer.name}
              //     />
              //     {/* <div className="quick-preview">
              //       <h4>{freelancer.name}</h4>
              //       <p>{freelancer.bio}</p>
              //       <button className="contact-button">Contact Freelancer</button>
              //     </div> */}
              //   </div>
              //   <h3>{freelancer.name}</h3>
              //   <p>{freelancer.skills.join(", ")}</p>
              //   <p>Rating: {freelancer.rating} ⭐</p>
              //   <p>Hourly Rate: ${freelancer.hourlyRate}/hr</p>
              //   <p>Location: {freelancer.location}</p>
              //   <p>
              //     Availability:{" "}
              //     <span
              //       className={
              //         freelancer.availability === "available"
              //           ? "available"
              //           : "unavailable"
              //       }
              //     >
              //       {freelancer.availability}
              //     </span>
              //   </p>
              //   <button className="contact-button">Contact Freelancer</button>
              // </div>
              <div key={freelancer.id} className="freelancer-card">
                {/* Column 1: Profile Picture, Name, Role */}
                <div className="column profile-column">
                  <img
                    src={freelancer.profileImage || "default-profile.png"}
                    alt={freelancer.name}
                    className="profile-image"
                  />
                  <h3>{freelancer.name}</h3>
                  <p className="role">{freelancer.role}</p>
                </div>

                {/* Column 2: Other Details */}
                <div className="column details-column">
                  <p>
                    <strong>Skills:</strong> {freelancer.skills.join(", ")}
                  </p>
                  <p>
                    <strong>Rating:</strong> {freelancer.rating} ⭐
                  </p>
                  <p>
                    <strong>Hourly Rate:</strong> ${freelancer.hourlyRate}/hr
                  </p>
                  <p>
                    <strong>Location:</strong> {freelancer.location}
                  </p>
                  <p>
                    <strong>Availability:</strong>{" "}
                    <span
                      className={
                        freelancer.availability === "available" ? "available" : "unavailable"
                      }
                    >
                      {freelancer.availability}
                    </span>
                  </p>
                </div>

                {/* Column 3: Contact Button */}
                <div className="column contact-column">
                  <button className="contact-button">Contact Freelancer</button>
                </div>
              </div>
              ))
              ) : (
              <p>No freelancers found matching your criteria.</p>
              )}
        </div>
      </div>
    </div>
  );
}

export default FindFreelancers;
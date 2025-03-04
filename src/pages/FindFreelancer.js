import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./FindFreelancers.css";

function FindFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    role: "",
    skill: "",
    minRate: "",
    maxRate: "",
    minRating: "",
    availability: "",
  });

  useEffect(() => {
    // Fetch freelancers from Firestore
    const fetchFreelancers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedFreelancers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFreelancers(fetchedFreelancers);
      setFilteredFreelancers(fetchedFreelancers);
    };

    // Fetch skills dynamically
    const fetchSkills = async () => {
      const skillSet = new Set();
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        doc.data().skills.forEach((skill) => skillSet.add(skill));
      });
      setSkills([...skillSet]);
    };

    fetchFreelancers();
    fetchSkills();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = [...freelancers];

    // Filter by keyword (name, role)
    if (filters.keyword) {
      filtered = filtered.filter(
        (freelancer) =>
          freelancer.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          freelancer.role.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    // Filter by role
    if (filters.role) {
      filtered = filtered.filter((freelancer) => freelancer.role === filters.role);
    }

    // Filter by skill
    if (filters.skill) {
      filtered = filtered.filter((freelancer) => freelancer.skills.includes(filters.skill));
    }

    // Filter by price range
    if (filters.minRate) {
      filtered = filtered.filter((freelancer) => Number(freelancer.priceRange.min) >= Number(filters.minRate));
    }
    if (filters.maxRate) {
      filtered = filtered.filter((freelancer) => Number(freelancer.priceRange.max) <= Number(filters.maxRate));
    }

    // Filter by rating
    if (filters.minRating) {
      filtered = filtered.filter((freelancer) => freelancer.rating >= Number(filters.minRating));
    }

    // Filter by availability
    if (filters.availability) {
      filtered = filtered.filter((freelancer) => freelancer.availability === filters.availability);
    }

    setFilteredFreelancers(filtered);
  };

  return (
    <div className="find-freelancers-container">
      <h1>Find Freelancers</h1>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="keyword">Keyword</label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            placeholder="Search by name or role"
            value={filters.keyword}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="role">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            placeholder="e.g., UI/UX Designer"
            value={filters.role}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="skill">Skill</label>
          <select id="skill" name="skill" value={filters.skill} onChange={handleFilterChange}>
            <option value="">All Skills</option>
            {skills.map((skill, index) => (
              <option key={index} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="minRate">Min Rate ($/hr)</label>
          <input type="number" id="minRate" name="minRate" value={filters.minRate} onChange={handleFilterChange} />
        </div>

        <div className="filter-group">
          <label htmlFor="maxRate">Max Rate ($/hr)</label>
          <input type="number" id="maxRate" name="maxRate" value={filters.maxRate} onChange={handleFilterChange} />
        </div>

        <div className="filter-group">
          <label htmlFor="minRating">Min Rating</label>
          <input type="number" id="minRating" name="minRating" value={filters.minRating} onChange={handleFilterChange} />
        </div>

        <div className="filter-group">
          <label htmlFor="availability">Availability</label>
          <select id="availability" name="availability" value={filters.availability} onChange={handleFilterChange}>
            <option value="">Any</option>
            <option value="Available now">Available now</option>
            <option value="Available in 2 weeks">Available in 2 weeks</option>
          </select>
        </div>

        <button className="apply-filters-button" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

      {/* Freelancer Listings */}
      <div className="freelancer-listings">
        {filteredFreelancers.length > 0 ? (
          filteredFreelancers.map((freelancer) => (
            <div key={freelancer.id} className="freelancer-card">
              <img src={freelancer.profileImage} alt={freelancer.name} className="freelancer-image" />
              <h2>{freelancer.name}</h2>
              <p>{freelancer.role}</p>
              <p>Skills: {freelancer.skills.join(", ")}</p>
              <p>Rate: ${freelancer.priceRange.min} - ${freelancer.priceRange.max}/hr</p>
              <p>Rating: ⭐ {freelancer.rating}</p>
              <p>Availability: {freelancer.availability}</p>
              <p>Location: {freelancer.location}</p>
              <p>Experience: {freelancer.experience} years</p>
              <a href={freelancer.portfolio} target="_blank" rel="noopener noreferrer">
                View Portfolio
              </a>
            </div>
          ))
        ) : (
          <p>No freelancers found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}

export default FindFreelancers;

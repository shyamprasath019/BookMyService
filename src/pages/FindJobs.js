import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import "./FindJobs.css";

function FindJobs() {
  const [user] = useAuthState(auth); // Current logged-in user
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    minBudget: "",
    maxBudget: "",
    deadline: "",
  });
  const [showBidForm, setShowBidForm] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch jobs from Firestore in real-time
    const unsubscribeJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const fetchedJobs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);
      setLoading(false);
    });

    // Fetch categories from Firestore
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const fetchedCategories = querySnapshot.docs.map((doc) => doc.data().Name);
        setCategories(fetchedCategories);
      } catch (err) {
        setError("Failed to fetch categories.");
        console.error(err);
      }
    };

    fetchCategories();

    return () => unsubscribeJobs(); // Cleanup listener
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Filter by keyword
    if (filters.keyword) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          job.description.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((job) => job.category === filters.category);
    }

    // Filter by budget range
    if (filters.minBudget) {
      filtered = filtered.filter((job) => Number(job.budget.min) >= Number(filters.minBudget));
    }
    if (filters.maxBudget) {
      filtered = filtered.filter((job) => Number(job.budget.max) <= Number(filters.maxBudget));
    }

    // Filter by deadline
    if (filters.deadline) {
      filtered = filtered.filter((job) => new Date(job.deadline) <= new Date(filters.deadline));
    }

    setFilteredJobs(filtered);
  };

  const handleBidSubmit = async (jobId, jobBudget) => {
    if (!user) {
      alert("Please log in to place a bid.");
      return;
    }

    if (!bidAmount || !proposal) {
      alert("Please fill in all fields.");
      return;
    }

    // Validate bid amount against job budget
    if (Number(bidAmount) < Number(jobBudget.min) || Number(bidAmount) > Number(jobBudget.max)) {
      alert(`Bid amount must be between $${jobBudget.min} and $${jobBudget.max}.`);
      return;
    }

    try {
      // Save bid to Firestore
      await addDoc(collection(db, "bids"), {
        jobId,
        freelancerId: user.uid,
        bidAmount: Number(bidAmount),
        proposal,
        createdAt: new Date(),
      });

      alert("Bid submitted successfully!");
      setShowBidForm(null);
      setBidAmount("");
      setProposal("");
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Failed to submit bid. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="find-jobs-container">
      <h1>Find Jobs</h1>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="keyword">Keyword</label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            placeholder="Search by title or description"
            value={filters.keyword}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="minBudget">Min Budget</label>
          <input
            type="number"
            id="minBudget"
            name="minBudget"
            placeholder="e.g., 100"
            value={filters.minBudget}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxBudget">Max Budget</label>
          <input
            type="number"
            id="maxBudget"
            name="maxBudget"
            placeholder="e.g., 1000"
            value={filters.maxBudget}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={filters.deadline}
            onChange={handleFilterChange}
          />
        </div>

        <button className="apply-filters-button" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

      {/* Job Listings */}
      <div className="job-listings">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <h2>{job.title}</h2>
              <p>{job.description}</p>
              <div className="job-details">
                <span>Category: {job.category}</span>
                <span>
                  Budget: ${job.budget.min} - ${job.budget.max}
                </span>
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                <span>Posted: {new Date(job.createdAt?.seconds * 1000).toLocaleDateString()}</span>
              </div>

              {showBidForm === job.id ? (
                <div className="bid-form">
                  <input
                    type="number"
                    placeholder="Your bid amount ($)"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                  <textarea
                    placeholder="Write your proposal (max 500 characters)"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    maxLength={500}
                  />
                  <div className="bid-actions">
                    <button onClick={() => handleBidSubmit(job.id, job.budget)}>Submit Bid</button>
                    <button onClick={() => setShowBidForm(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowBidForm(job.id)}>Place Bid</button>
              )}
            </div>
          ))
        ) : (
          <p>No jobs found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}

export default FindJobs;
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./PostProject.css";

function PostProject() {
  const [user] = useAuthState(auth); // Current logged-in user
  const [step, setStep] = useState(1); // Current step in the form
  const [project, setProject] = useState({
    title: "",
    description: "",
    skills: [],
    experienceLevel: "",
    budgetType: "fixed",
    budgetAmount: "",
    timeline: "",
    deadline: "",
    files: [],
    screeningQuestions: [],
    preferredLocation: "",
    preferredTimezone: "",
    visibility: "public",
    urgency: "normal",
    invitedFreelancers: [],
  });
  const [suggestedFreelancers, setSuggestedFreelancers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setProject((prev) => ({ ...prev, files }));
  };

  // Handle adding screening questions
  const addScreeningQuestion = () => {
    setProject((prev) => ({
      ...prev,
      screeningQuestions: [...prev.screeningQuestions, ""],
    }));
  };

  const handleScreeningQuestionChange = (index, value) => {
    const updatedQuestions = [...project.screeningQuestions];
    updatedQuestions[index] = value;
    setProject((prev) => ({ ...prev, screeningQuestions: updatedQuestions }));
  };

  // Handle inviting freelancers
  const handleInviteFreelancer = (freelancerId) => {
    setProject((prev) => ({
      ...prev,
      invitedFreelancers: [...prev.invitedFreelancers, freelancerId],
    }));
  };

  // Submit the project
  const handleSubmit = async () => {
    if (!user) {
      alert("Please log in to post a project.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "projects"), {
        ...project,
        clientId: user.uid,
        createdAt: new Date(),
      });
      alert("Project posted successfully!");
      setStep(1); // Reset form
      setProject({
        title: "",
        description: "",
        skills: [],
        experienceLevel: "",
        budgetType: "fixed",
        budgetAmount: "",
        timeline: "",
        deadline: "",
        files: [],
        screeningQuestions: [],
        preferredLocation: "",
        preferredTimezone: "",
        visibility: "public",
        urgency: "normal",
        invitedFreelancers: [],
      });
    } catch (error) {
      console.error("Error posting project:", error);
      setError("Failed to post project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-project-container">
      <h1>Post a Project</h1>

      {/* Step Navigation */}
      <div className="step-navigation">
        <button onClick={() => setStep(1)} disabled={step === 1}>
          Step 1: Project Details
        </button>
        <button onClick={() => setStep(2)} disabled={step === 2}>
          Step 2: Skills & Budget
        </button>
        <button onClick={() => setStep(3)} disabled={step === 3}>
          Step 3: Timeline & Files
        </button>
        <button onClick={() => setStep(4)} disabled={step === 4}>
          Step 4: Screening & Visibility
        </button>
      </div>

      {/* Step 1: Project Details */}
      {step === 1 && (
        <div className="form-step">
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              value={project.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Project Description</label>
            <textarea
              name="description"
              value={project.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}

      {/* Step 2: Skills & Budget */}
      {step === 2 && (
        <div className="form-step">
          <div className="form-group">
            <label>Required Skills</label>
            <input
              type="text"
              name="skills"
              value={project.skills.join(", ")}
              onChange={(e) =>
                setProject((prev) => ({
                  ...prev,
                  skills: e.target.value.split(", "),
                }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Experience Level</label>
            <select
              name="experienceLevel"
              value={project.experienceLevel}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div className="form-group">
            <label>Budget Type</label>
            <select
              name="budgetType"
              value={project.budgetType}
              onChange={handleInputChange}
              required
            >
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>

          <div className="form-group">
            <label>Budget Amount ($)</label>
            <input
              type="number"
              name="budgetAmount"
              value={project.budgetAmount}
              onChange={handleInputChange}
              required
            />
          </div>

          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={() => setStep(3)}>Next</button>
        </div>
      )}

      {/* Step 3: Timeline & Files */}
      {step === 3 && (
        <div className="form-step">
          <div className="form-group">
            <label>Timeline</label>
            <input
              type="text"
              name="timeline"
              value={project.timeline}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={project.deadline}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>File Attachments</label>
            <input type="file" multiple onChange={handleFileUpload} />
          </div>

          <button onClick={() => setStep(2)}>Back</button>
          <button onClick={() => setStep(4)}>Next</button>
        </div>
      )}

      {/* Step 4: Screening & Visibility */}
      {step === 4 && (
        <div className="form-step">
          <div className="form-group">
            <label>Screening Questions</label>
            {project.screeningQuestions.map((question, index) => (
              <input
                key={index}
                type="text"
                value={question}
                onChange={(e) =>
                  handleScreeningQuestionChange(index, e.target.value)
                }
                placeholder="Enter a screening question"
              />
            ))}
            <button onClick={addScreeningQuestion}>Add Question</button>
          </div>

          <div className="form-group">
            <label>Preferred Freelancer Location</label>
            <input
              type="text"
              name="preferredLocation"
              value={project.preferredLocation}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Preferred Timezone</label>
            <input
              type="text"
              name="preferredTimezone"
              value={project.preferredTimezone}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Project Visibility</label>
            <select
              name="visibility"
              value={project.visibility}
              onChange={handleInputChange}
            >
              <option value="public">Public</option>
              <option value="invite-only">Invite Only</option>
            </select>
          </div>

          <div className="form-group">
            <label>Project Urgency</label>
            <select
              name="urgency"
              value={project.urgency}
              onChange={handleInputChange}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <button onClick={() => setStep(3)}>Back</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Posting..." : "Post Project"}
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default PostProject;
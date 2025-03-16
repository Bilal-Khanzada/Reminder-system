import React, { useState, useEffect } from "react";
// import "./ReminderForm.css"; // Import the separate CSS file

const TOTAL_REMINDERS = 3;

const ReminderForm = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // New state for email
  const [selectedType, setSelectedType] = useState("");
  const [customOccasion, setCustomOccasion] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  // Initialize step from localStorage (or default to 1)
  const [step, setStep] = useState(
    Number(localStorage.getItem("reminderStep")) || 1
  );

  // Persist step changes in localStorage
  useEffect(() => {
    localStorage.setItem("reminderStep", step);
  }, [step]);

  // Automatically clear success or error messages after 2 seconds
  useEffect(() => {
    let timer;
    if (success || error) {
      timer = setTimeout(() => {
        setSuccess(false);
        setError("");
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);

  const handleSubmit = async () => {
    // Validate required fields (note: email is now required)
    if (
      !name ||
      !email ||
      !selectedType ||
      !day ||
      !month ||
      (selectedType === "Other" && !customOccasion)
    )
      return;

    setLoading(true);
    setError("");
    const startTime = Date.now();

    try {
      const response = await fetch("http://localhost:3000/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email, // Pass email along with the reminder details
          occasion: selectedType === "Other" ? customOccasion : selectedType,
          day,
          month,
        }),
      });

      // Ensure a minimum loading time of 2 seconds
      const minLoadingTime = 2000;
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadingTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minLoadingTime - elapsedTime)
        );
      }

      if (response.ok) {
        // Increase progress if not already complete
        if (step < TOTAL_REMINDERS) {
          setStep((prev) => prev + 1);
        }
        setSuccess(true);
        // Reset form fields
        setName("");
        setEmail("");
        setSelectedType("");
        setCustomOccasion("");
        setDay("");
        setMonth("");
      } else {
        throw new Error("Failed to save reminder");
      }
    } catch (err) {
      console.error("Error submitting reminder:", err);
      setError("Failed to add reminder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Remind me about...</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <span className={`step ${step >= 1 ? "active" : ""}`}>1</span>
          <span className={`step ${step >= 2 ? "active" : ""}`}>2</span>
          <span className={`step ${step >= 3 ? "active" : ""}`}>3</span>
        </div>
        <p className="subtext">
          {step < TOTAL_REMINDERS
            ? `Almost there! Add ${
                TOTAL_REMINDERS - step + 1
              } reminder${TOTAL_REMINDERS - step === 1 ? "" : "s"} to get £5 credit`
            : "You’re all set!"}
        </p>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Their name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="name-input"
        />

        {/* New Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />

        {/* Occasion Type Buttons */}
        <div className="occasion-buttons">
          <button
            className={`option-btn ${
              selectedType === "Birthday" ? "selected" : ""
            }`}
            onClick={() => setSelectedType("Birthday")}
          >
            Birthday
          </button>
          <button
            className={`option-btn ${
              selectedType === "Anniversary" ? "selected" : ""
            }`}
            onClick={() => setSelectedType("Anniversary")}
          >
            Anniversary
          </button>
          <button
            className={`option-btn ${
              selectedType === "Other" ? "selected" : ""
            }`}
            onClick={() => setSelectedType("Other")}
          >
            Something else
          </button>
        </div>

        {/* Custom Occasion Input (when "Other" is selected) */}
        {selectedType === "Other" && (
          <input
            type="text"
            placeholder="What's the occasion?"
            value={customOccasion}
            onChange={(e) => setCustomOccasion(e.target.value)}
            className="custom-occasion-input"
          />
        )}

        {/* Day & Month Inputs */}
        <div className="date-inputs">
          <input
            type="number"
            placeholder="Day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="day-input"
          />
          <input
            type="number"
            placeholder="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="month-input"
          />
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="loading-spinner">
            {/* Replace with a spinner icon or animation as desired */}
            Loading...
          </div>
        )}

        {/* Success & Error Banners */}
        {success && (
          <div className="banner success">Reminder added successfully!</div>
        )}
        {error && <div className="banner error">{error}</div>}

        {/* Submit Button */}
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={
            loading ||
            !name ||
            !email ||
            !selectedType ||
            !day ||
            !month ||
            (selectedType === "Other" && !customOccasion)
          }
        >
          {loading ? "Adding..." : "Add reminder"}
        </button>
      </div>
    </div>
  );
};

export default ReminderForm;

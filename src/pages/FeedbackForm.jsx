import React, { useState } from "react";
import { Star, Send, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AchievementSection from "../components/AchievementSection";

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
  });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const categories = [
    "Sports Facilities",
    "Equipment Quality",
    "Coaching Staff",
    "Events Organization",
    "Overall Experience",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (rating === 0) {
      setError("Please select a rating before submitting.");
      setIsSubmitting(false);
      return;
    }

    const feedbackData = {
      token,
      rating,
      reason: formData.reason,
      description: formData.description,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/feedback/submit",
        feedbackData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success response
      setFormData({ reason: "", description: "" });
      setRating(0);
      setSuccess(response.data.message || "Feedback submitted successfully!");
      console.log("Server response:", response.data.feedback);

      // Hide the form after successful submission
      setTimeout(() => {
        setShowForm(false);
        setSuccess("");
      }, 3000); // Hide after 3 seconds
    } catch (err) {
      console.error("Full error context:", {
        error: err.response?.data?.message || err.message,
        stack: err.stack,
      });

      setError(
        err.response?.data?.message ||
          "An error occurred while submitting feedback."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Achievement Section */}
      <AchievementSection />

      {/* Feedback Button and Form Section */}
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50">
        {/* Give Feedback Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 px-8 py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 active:shadow-md"
        >
          <MessageSquare className="h-5 w-5" />
          {showForm ? "Hide Feedback Form" : "Give Feedback"}
          {showForm ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {/* Feedback Form */}
        {showForm && (
          <div className="bg-white shadow-xl rounded-xl p-8 my-4 max-w-2xl w-full transition-all duration-300 ease-in-out">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Your Feedback Matters
              </h2>
              <p className="text-gray-600 mt-2">
                Help us improve our sports facilities and services
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div className="text-center">
                <label className="block text-gray-700 font-medium mb-4">
                  Overall Rating
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  What did you like about our services? or What can we improve?
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={4}
                  required
                  minLength={10}
                  maxLength={400}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;

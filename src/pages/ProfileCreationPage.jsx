import React, { useState } from "react";
import { User, Camera, FileText, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebaseConfig"; // Import firebase storage config
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { useCookies } from "react-cookie"; // Import the cookies library to retrieve token from cookie

const ProfileCreationPage = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]); // Get token from cookie
  const token = cookies.token;

  const userId = useSelector((state) => state.auth.id); // Access userId from Redux store

  // State to hold files, upload status, and downloadable URLs
  const [profilePic, setProfilePic] = useState(null);
  const [feeReceipt, setFeeReceipt] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState({
    profilePicUrl: null,
    feeReceiptUrl: null,
  });

  const [formData, setFormData] = useState({
    department: "",
    currentYear: "",
    age: "",
    description: "",
    address: "",
    sports_interest: "",
    achievements: "",
  });

  const departments = [
    "IT",
    "CS",
    "EnTC",
    "Mech",
    "Biotech",
    "Electrical",
    "Civil",
  ];
  const years = ["FE", "SE", "TE", "BE"];

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "profilePic") {
      setProfilePic(file); // Store file directly for upload
      handleUpload(file, "profilePic");
    } else if (type === "feeReceipt") {
      setFeeReceipt(file);
      handleUpload(file, "feeReceipt");
    }
  };

  const handleUpload = async (file, type) => {
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `users/${userId}/${type}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: Track upload progress here
      },
      (error) => {
        console.error("Error uploading file:", error);
        setUploading(false);
        alert("File upload failed, process will be cancelled.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setUploading(false);
          setDownloadUrls((prevUrls) => ({
            ...prevUrls,
            [`${type}Url`]: downloadURL,
          }));
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Wait for 5 seconds before submitting the data
    setTimeout(async () => {
      try {
        const dataToPost = {
          userId: userId,
          profile_picture: downloadUrls.profilePicUrl,
          collegeid: downloadUrls.feeReceiptUrl, // collegeid refers to feeReceipt URL
          department: formData.department,
          year: formData.currentYear,
          age: formData.age,
          description: formData.description,
          address: formData.address,
          sports_interest: formData.sports_interest,
          achievements: formData.achievements,
        };

        console.log(dataToPost);

        const response = await fetch(
          "http://localhost:5000/api/auth/create-profile",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Pass the token here
            },
            body: JSON.stringify(dataToPost),
          }
        );

        const result = await response.json();

        if (response.status === 200) {
          alert("Profile created successfully!");
          navigate("/"); // Redirect to profile or wherever necessary
        } else {
          alert(result.message || "Error creating profile");
        }
      } catch (error) {
        console.error("Error submitting profile:", error);
        alert("Error creating profile, try again later.");
      }
    }, 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Student Profile
          </h1>
          <p className="text-xl text-gray-600">Submit your academic details</p>
        </div>

        <div className="space-y-8">
          {/* Profile Picture */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Camera className="h-6 w-6 text-indigo-600" />
              Profile Picture
            </h2>
            <div className="flex flex-col items-center mt-4">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 mb-4">
                {profilePic ? (
                  <img
                    src={URL.createObjectURL(profilePic)}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-20 w-20 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700">
                Upload Picture
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profilePic")}
                  required
                />
              </label>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6 text-indigo-600" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div>
                <label className="block text-gray-700 mb-2">Department</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  name="department"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Current Year</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  name="currentYear"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  className="w-full p-3 border rounded-lg"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Info className="h-6 w-6 text-indigo-600" />
              Additional Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={2}
                  minLength={10}
                  maxLength={250}
                  name="description"
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={2}
                  minLength={10}
                  maxLength={250}
                  name="address"
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Sports Interest and Achievements */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Info className="h-6 w-6 text-indigo-600" /> Sports Interest &
              Achievements
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Sports Interest (put like Chess, Cricket, Volleyball, etc.)
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={1}
                  minLength={10}
                  maxLength={100}
                  name="sports_interest"
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Achievements (put like Achievement 1, Achievement 2, etc.)</label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={2}
                  minLength={10}
                  maxLength={300}
                  name="achievements"
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600" />
              Documents
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Fee Receipt
                </label>
                <label>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "feeReceipt")}
                    required
                  />
                  <div className="w-full p-3 border rounded-lg cursor-pointer">
                    Upload Fee Receipt
                  </div>
                </label>
                {feeReceipt && (
                  <div className="mt-2 text-green-500">
                    Fee Receipt Uploaded
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreationPage;

// src/pages/ManageAccount/ManageAccount.jsx
import { useState, useRef, useEffect } from 'react';
import './ManageAccount.css';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import EditLinks from '../../components/EditLinks/EditLinks';
import ProfileInfoCard from '../../components/ProfileInfoCard/ProfileInfoCard';
import ProfileAvatar from '../../components/ProfileAvatar/ProfileAvatar';

// API Base URL
import config from "../../config";

// Data
import { schoolAddresses } from "../../data/schoolAddresses";

const ManageAccount = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ New: track fetch errors

  const fileInputRef = useRef(null);

  const [tempProfile, setTempProfile] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    contact_number: "",
  });

  // ✅ Load user data — no redirects on failure
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      const storedUserStr = sessionStorage.getItem("currentUser");
      if (!storedUserStr) {
        setError("No session found. Please log in.");
        setLoading(false);
        return;
      }

      let storedUser;
      try {
        storedUser = JSON.parse(storedUserStr);
      } catch (e) {
        setError("Invalid session data.");
        setLoading(false);
        return;
      }

      const { role, user_id } = storedUser;
      if (!role || !user_id) {
        setError("Session missing required info.");
        setLoading(false);
        return;
      }

      let endpoint;
      if (role === "school") {
        endpoint = "/school/account/info/";
      } else if (role === "office" || role === "admin") {
        endpoint = "/focal/account/info/";
      } else {
        setError("Unknown user role.");
        setLoading(false);
        return;
      }

      try {
        const fullUrl = `${config.API_BASE_URL}${endpoint}`;
        const res = await fetch(fullUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setError("Session expired or invalid.");
          } else {
            setError(`Failed to load profile: ${res.status} ${res.statusText}`);
          }
          setLoading(false);
          return;
        }

        const backendData = await res.json();

        let finalRole = role;
        if (!finalRole) {
          finalRole = user_id?.includes("FOCAL") ? "office" : user_id?.includes("ADMIN") ? "admin" : "school";
        }

        const mergedData = {
          user_id: backendData.user_id || user_id || "",
          first_name: backendData.first_name || "",
          last_name: backendData.last_name || "",
          middle_name: backendData.middle_name || "",
          email: backendData.email || "",
          contact_number: backendData.contact_number || "",
          avatar: backendData.avatar || null,
          role: finalRole,
          school_name: backendData.school_name || "Not specified",
          school_address: backendData.school_address || "Not specified",
          position: backendData.position || "Not specified",
          office: backendData.office || "Not specified",
          section_designation: backendData.section_designation || "Not specified",
          registration_date: backendData.registration_date || new Date().toISOString(),
          active: backendData.active !== undefined ? backendData.active : true,
        };

        if (finalRole === "school" && (mergedData.school_address === "N/A" || mergedData.school_address === "Not specified")) {
          const correctAddress = schoolAddresses[mergedData.school_name];
          if (correctAddress) {
            mergedData.school_address = correctAddress;
          }
        }

        sessionStorage.setItem("currentUser", JSON.stringify(mergedData));
        setUserData(mergedData);
        setAvatar(mergedData.avatar);
        setTempProfile({
          first_name: mergedData.first_name,
          middle_name: mergedData.middle_name,
          last_name: mergedData.last_name,
          email: mergedData.email,
          contact_number: mergedData.contact_number,
        });
      } catch (error) {
        console.error("Error fetching user ", error);
        setError("Unable to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Show success toast after reload if flag exists
  useEffect(() => {
    const shouldShowToast = sessionStorage.getItem("showProfileUpdateSuccess");
    if (shouldShowToast === "true") {
      toast.success("✅ Profile updated successfully!");
      sessionStorage.removeItem("showProfileUpdateSuccess");
    }
  }, []);

  // ✅ Retry loading
  const handleRetry = () => {
    setError(null);
    // Re-run the fetch logic
    const fetchUserData = async () => {
      // ... (reuse logic above or extract into a function)
      // For brevity, we'll just reload the page — or better: extract fetchUserData
      window.location.reload(); // Simple fallback
    };
    fetchUserData();
  };

  // Save profile logic remains unchanged (no login redirect)
  const handleSaveProfile = async () => {
    if (!tempProfile.first_name.trim() || !tempProfile.last_name.trim()) {
      toast.warn("First and last name are required.");
      return;
    }
    if (!tempProfile.email || !tempProfile.email.includes("@")) {
      toast.warn("Please enter a valid email.");
      return;
    }
    if (!tempProfile.contact_number?.trim()) {
      toast.warn("Please enter a contact number.");
      return;
    }

    try {
      const userId = userData.user_id;
      const role = userData.role;
      if (!userId) throw new Error("User ID not found");

      const payload = {
        first_name: tempProfile.first_name.trim(),
        middle_name: tempProfile.middle_name?.trim() || '',
        last_name: tempProfile.last_name.trim(),
        email: tempProfile.email.trim(),
        contact_number: tempProfile.contact_number.trim(),
      };

      const endpoint = role === "school"
        ? `/school/account/update/id/?user_id=${encodeURIComponent(userId)}`
        : `/focal/account/update/id/?user_id=${encodeURIComponent(userId)}`;

      const fullUrl = `${config.API_BASE_URL}${endpoint}`;
      const res = await fetch(fullUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Update failed: ${res.status}`);
      }

      const updatedData = { ...userData, ...payload };
      sessionStorage.setItem("currentUser", JSON.stringify(updatedData));
      sessionStorage.setItem("showProfileUpdateSuccess", "true");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(`❌ Failed to update profile: ${error.message}`);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPG, PNG, GIF)");
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large. Max 5MB allowed.");
        e.target.value = '';
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result;
          setAvatar(base64Image);
          const savedUser = JSON.parse(sessionStorage.getItem("currentUser"));
          const updatedUser = { ...savedUser, avatar: base64Image };
          sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
          setUserData(prev => ({ ...prev, avatar: base64Image }));
          toast.info("Profile picture updated!", { autoClose: 1500 });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to process image.");
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    toast.info(isEditing ? "Exited edit mode." : "Edit mode enabled.", { autoClose: 1500 });
  };

  // ✅ Render loading, error, or content
  if (loading) {
    return <div className="manage-account-app">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="manage-account-app error-view">
        <div className="error-message">
          <h3>⚠️ Unable to load your profile</h3>
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Retry
          </button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="manage-account-app error-view">
        <p>No profile data available.</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div className="manage-account-app">
      <main className="manage-account-main">
        <div className="profile-section">
          <ProfileAvatar
            avatar={avatar}
            isEditing={isEditing}
            onButtonClick={handleButtonClick}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            userName={`${userData.first_name} ${userData.middle_name} ${userData.last_name}`}
          />
          <ProfileInfoCard
            userData={userData}
            isEditing={isEditing}
            toggleEditMode={toggleEditMode}
          />
        </div>

        {isEditing && (
          <EditLinks
            tempProfile={tempProfile}
            setTempProfile={setTempProfile}
            handleSaveProfile={handleSaveProfile}
          />
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ManageAccount;
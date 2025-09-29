// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { FiLogIn } from "react-icons/fi";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from "../../components/ParticleBackground/Particle2.jsx";
import logo from "../../assets/images/logo-w-text.png";
import { schoolAddresses } from "../../data/schoolAddresses";
import config from "../../config";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState(""); // Must be string
  const [checkingAuth, setCheckingAuth] = useState(true); // For initial check
  const navigate = useNavigate();
  const location = useLocation();

  const isSchoolPath = location.pathname.includes("/login/school");
  const isOfficePath = location.pathname.includes("/login/office");

  // 🔍 Auto-check if already logged in (via cookie)
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Determine which profile endpoint to use based on current route
      let profileEndpoint;
      if (isSchoolPath) {
        profileEndpoint = "/school/account/info/";
      } else if (isOfficePath) {
        profileEndpoint = "/focal/account/info/";
      } else {
        // Default fallback: try school first, or handle generic case
        profileEndpoint = "/school/account/info/";
      }

      try {
        const res = await fetch(`${config.API_BASE_URL}${profileEndpoint}`, {
          method: "GET",
          credentials: "include", // Essential for sending cookies
        });

        if (res.ok) {
          const profileData = await res.json();

          // Determine role
          let role = "school";
          if (profileData.user_id?.includes("FOCAL")) {
            role = "office";
          } else if (profileData.user_id?.includes("ADMIN")) {
            role = "admin";
          }

          // Build user object (same as in handleSubmit)
          const userData = {
            user_id: profileData.user_id || "",
            first_name: profileData.first_name || "",
            middle_name: profileData.middle_name || "",
            last_name: profileData.last_name || "",
            school_name: profileData.school_name || "Not specified",
            school_address: profileData.school_address || "Not specified",
            position: profileData.position || "Not specified",
            office: profileData.office || "Not specified",
            section_designation: profileData.section_designation || "Not specified",
            email: profileData.email || "",
            contact_number: profileData.contact_number || "",
            registration_date: profileData.registration_date || new Date().toISOString(),
            active: profileData.active !== undefined ? profileData.active : true,
            avatar: profileData.avatar || null,
            role,
          };

          // Fix school address
          if (role === "school" && (userData.school_address === "N/A" || userData.school_address === "Not specified")) {
            const correctAddress = schoolAddresses[userData.school_name];
            if (correctAddress) {
              userData.school_address = correctAddress;
            }
          }

          // Save to sessionStorage (for UI access, not auth)
          sessionStorage.setItem("currentUser", JSON.stringify(userData));

          // Redirect based on role
          if (role === "school") {
            navigate("/home", { replace: true });
          } else if (role === "office" || role === "admin") {
            navigate("/task/ongoing", { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
          return;
        }
      } catch (err) {
        console.warn("Auto-login check failed (expected if not logged in):", err);
        // Continue to login form
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [isSchoolPath, isOfficePath, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target);
    const email = formData.get("email").trim();
    const password = formData.get("password");

    let loginEndpoint;
    if (isSchoolPath) {
      loginEndpoint = "/school/login";
    } else if (isOfficePath) {
      loginEndpoint = "/focal/login";
    } else {
      // Fallback: assume school
      loginEndpoint = "/school/login";
    }

    try {
      const loginResponse = await fetch(`${config.API_BASE_URL}${loginEndpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let loginData;
      let errorMsg = "";

      if (!loginResponse.ok) {
        try {
          loginData = await loginResponse.json();
        } catch {
          throw new Error(`Login failed: ${loginResponse.status}`);
        }

        if (typeof loginData.detail === "string") {
          errorMsg = loginData.detail;
        } else if (Array.isArray(loginData.detail)) {
          errorMsg = loginData.detail
            .map((e) => e.msg || "Invalid input")
            .filter(Boolean)
            .join(" • ");
        } else if (loginData.message) {
          errorMsg = loginData.message;
        } else {
          errorMsg = `Login failed (${loginResponse.status})`;
        }
        throw new Error(errorMsg);
      }

      // ✅ No need to store access_token in sessionStorage — cookies handle auth
      const { user_id } = await loginResponse.json();

      // Fetch profile (same as auto-check)
      let profileEndpoint = isSchoolPath ? "/school/account/info/" : "/focal/account/info/";
      const profileResponse = await fetch(`${config.API_BASE_URL}${profileEndpoint}`, {
        method: "GET",
        credentials: "include",
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to load user profile after login.");
      }

      const profileData = await profileResponse.json();

      let role = "school";
      if (profileData.user_id?.includes("FOCAL")) role = "office";
      else if (profileData.user_id?.includes("ADMIN")) role = "admin";

      const userData = {
        user_id: profileData.user_id || user_id || "",
        first_name: profileData.first_name || "",
        middle_name: profileData.middle_name || "",
        last_name: profileData.last_name || "",
        school_name: profileData.school_name || "Not specified",
        school_address: profileData.school_address || "Not specified",
        position: profileData.position || "Not specified",
        office: profileData.office || "Not specified",
        section_designation: profileData.section_designation || "Not specified",
        email: profileData.email || email,
        contact_number: profileData.contact_number || "",
        registration_date: profileData.registration_date || new Date().toISOString(),
        active: profileData.active !== undefined ? profileData.active : true,
        avatar: profileData.avatar || null,
        role,
      };

      if (role === "school" && (userData.school_address === "N/A" || userData.school_address === "Not specified")) {
        const correctAddress = schoolAddresses[userData.school_name];
        if (correctAddress) {
          userData.school_address = correctAddress;
        }
      }

      // ✅ Only store user data (not tokens) for UI
      sessionStorage.setItem("currentUser", JSON.stringify(userData));

      // Redirect
      if (role === "school") {
        navigate("/home");
      } else if (role === "office" || role === "admin") {
        navigate("/task/ongoing");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to server. Please try again later.");
      console.error("Login error:", err);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (isSchoolPath) navigate("/register/school");
    else if (isOfficePath) navigate("/register/office");
    else navigate("/register");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  // Show loading during auth check
  if (checkingAuth) {
    return (
      <div className="login-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Checking login status...</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-background-image">
        <img src={background} alt="DepEd Biñan City Building" />
      </div>
      <div className="login-blue-overlay">
        <ParticleBackground />
        <div className="login-form-container">
          <div className="login-header">
            <div className="login-logo-container" onClick={handleLogoClick}>
              <img src={logo} className="logo-w-text" alt="Logo" />
            </div>
            <p className="login-subtitle">
              Please login or sign up to start your session.
            </p>
          </div>

          {error && typeof error === "string" && error.length > 0 && (
            <div className="login-error">
              <p>{error}</p>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            {/* ... form fields unchanged ... */}
            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">Email</label>
              <div className="login-input-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="login-form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-form-label">Password</label>
              <div className="login-password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="login-form-input"
                  placeholder="Enter password"
                  required
                />
                <button type="button" className="login-toggle-password" onClick={togglePasswordVisibility}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="login-forgot-password">
                <a href="#forgot" className="login-forgot-link">I forgot my password</a>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                backgroundColor: isHovering ? "#1e4a76" : "#2563eb",
                transition: "background-color 0.2s ease",
              }}
            >
              <FiLogIn className="login-icon" />
              Log in
            </button>
          </form>

          <div className="register-section">
            <p className="register-text">
              Need an account?{" "}
              <a
                href={isSchoolPath ? "/register/school" : "/register/office"}
                className="register-link"
                onClick={handleRegisterClick}
              >
                Register here
              </a>
            </p>
          </div>

          <div className="login-terms-notice">
            <p>
              By using this service, you understand and agree to the DepEd Online Services{" "}
              <a href="#terms" className="login-terms-link">Terms of Use</a> and{" "}
              <a href="#privacy" className="login-terms-link">Privacy Statement</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
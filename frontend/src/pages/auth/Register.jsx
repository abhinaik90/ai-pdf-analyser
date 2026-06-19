// src/pages/auth/Register.jsx
//
// Registration page UI.
// IMPORTANT: This component contains NO direct axios/API code.
// It calls the existing `register()` function from authService.js directly
// (not through AuthContext, since registering does not log the user in —
// per the requirement, we redirect to the Login page afterwards instead).
 
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authService";
 
const Register = () => {
  const navigate = useNavigate();
 
  // Form field values.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
 
  // Field-level validation errors (shown under each input).
  const [fieldErrors, setFieldErrors] = useState({});
 
  // Error message(s) returned by the backend (e.g. "Email already in use").
  const [serverError, setServerError] = useState("");
 
  // True while the register request is in flight.
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  // Update form state as the user types, clearing that field's error.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
 
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
 
  // Client-side validation. Returns an errors object;
  // empty object means the form is valid.
  const validate = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
    if (!formData.name.trim()) {
      errors.name = "Full name is required.";
    }
 
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
 
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
 
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match.";
    }
 
    return errors;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
 
    const errors = validate();
    setFieldErrors(errors);
 
    if (Object.keys(errors).length > 0) {
      return;
    }
 
    setIsSubmitting(true);
 
    try {
      // Only the fields the backend needs — confirmPassword is
      // a client-side-only concept and is never sent to the API.
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
 
      // Registration does not log the user in — send them to Login
      // to authenticate with their new credentials.
      navigate("/login");
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        "Registration failed. Please check your details and try again.";
      setServerError(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Sign up to start chatting with your documents</p>
 
        {serverError && <div style={styles.serverError}>{serverError}</div>}
 
        <form onSubmit={handleSubmit} noValidate>
          {/* Name field */}
          <div style={styles.field}>
            <label htmlFor="name" style={styles.label}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                ...styles.input,
                ...(fieldErrors.name ? styles.inputError : {}),
              }}
              placeholder="Jane Doe"
              autoComplete="name"
            />
            {fieldErrors.name && (
              <span style={styles.errorText}>{fieldErrors.name}</span>
            )}
          </div>
 
          {/* Email field */}
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                ...styles.input,
                ...(fieldErrors.email ? styles.inputError : {}),
              }}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {fieldErrors.email && (
              <span style={styles.errorText}>{fieldErrors.email}</span>
            )}
          </div>
 
          {/* Password field */}
          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                ...styles.input,
                ...(fieldErrors.password ? styles.inputError : {}),
              }}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {fieldErrors.password && (
              <span style={styles.errorText}>{fieldErrors.password}</span>
            )}
          </div>
 
          {/* Confirm Password field */}
          <div style={styles.field}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                ...styles.input,
                ...(fieldErrors.confirmPassword ? styles.inputError : {}),
              }}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {fieldErrors.confirmPassword && (
              <span style={styles.errorText}>{fieldErrors.confirmPassword}</span>
            )}
          </div>
 
          <button type="submit" disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
 
        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.footerLink}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
 
// Same visual language as Login.jsx, kept self-contained in this file
// (no shared CSS file was requested for this step).
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f6fa",
    padding: "16px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    padding: "32px",
    boxSizing: "border-box",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 600,
    color: "#1f2329",
    textAlign: "center",
  },
  subtitle: {
    margin: "8px 0 24px",
    fontSize: "14px",
    color: "#6b7280",
    textAlign: "center",
  },
  serverError: {
    backgroundColor: "#fdecea",
    color: "#b3261e",
    border: "1px solid #f5c2c0",
    borderRadius: "6px",
    padding: "10px 12px",
    fontSize: "13px",
    marginBottom: "16px",
    textAlign: "center",
  },
  field: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s ease",
  },
  inputError: {
    borderColor: "#dc2626",
  },
  errorText: {
    display: "block",
    marginTop: "4px",
    fontSize: "12px",
    color: "#dc2626",
  },
  button: {
    width: "100%",
    padding: "11px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#4f46e5",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "4px",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "13px",
    color: "#6b7280",
    textAlign: "center",
  },
  footerLink: {
    color: "#4f46e5",
    fontWeight: 600,
    textDecoration: "none",
  },
};
 
export default Register;
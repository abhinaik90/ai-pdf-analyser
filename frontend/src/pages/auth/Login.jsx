// src/pages/auth/Login.jsx
//
// Login page UI.
// IMPORTANT: This component contains NO direct API/axios logic.
// All authentication logic lives in AuthContext (which itself delegates
// to authService.js). This component only handles:
//   - form state
//   - client-side validation
//   - calling login() from AuthContext
//   - displaying loading / error states
//   - navigating to /dashboard on success

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form field values.
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Field-level validation errors (shown under each input).
  const [fieldErrors, setFieldErrors] = useState({});

  // Error message returned by the backend (e.g. "Invalid credentials").
  const [serverError, setServerError] = useState("");

  // True while the login request is in flight — disables the form
  // and shows a loading indicator on the submit button.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form state as the user types, and clear that field's
  // error as soon as they start correcting it.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Simple client-side validation. Returns an errors object;
  // empty object means the form is valid.
  const validate = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const errors = validate();
    setFieldErrors(errors);

    // Stop here if there are validation errors.
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // All actual API work happens inside AuthContext's login().
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // On success, move to the dashboard.
      navigate("/dashboard");
    } catch (error) {
      // Prefer a message from the backend response, fall back to a generic one.
      const backendMessage =
        error?.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      setServerError(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Log in to access your documents</p>

        {serverError && <div style={styles.serverError}>{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
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
              autoComplete="current-password"
            />
            {fieldErrors.password && (
              <span style={styles.errorText}>{fieldErrors.password}</span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={styles.footerLink}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

// Plain inline styles — no extra CSS file required, keeps this
// component fully self-contained as per the "generate only Login.jsx" rule.
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

export default Login;
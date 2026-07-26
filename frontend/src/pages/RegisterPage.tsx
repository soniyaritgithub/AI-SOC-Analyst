import {
  useState,
  type FormEvent,
} from "react";

import {
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/auth.service";
import { getApiErrorMessage } from "../utils/api-error";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    isAuthenticated,
  } = useAuth();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!fullName.trim()) {
      setError(
        "Please enter your full name.",
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "Please enter your email address.",
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter a password.",
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        "Please confirm your password.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.register({
        email:
          email.trim().toLowerCase(),

        full_name:
          fullName.trim(),

        department:
          department.trim(),

        phone_number:
          phoneNumber.trim(),

        password,

        confirm_password:
          confirmPassword,
      });

      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess: true,
        },
      });
    } catch (registerError) {
      setError(
        getApiErrorMessage(
          registerError,
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page register-page">
      <section className="login-page__hero">
        <div className="login-page__hero-content">
          <div className="login-brand">
            <div className="login-brand__icon">
              <ShieldCheck
                size={30}
                aria-hidden="true"
              />
            </div>

            <div>
              <span className="login-brand__eyebrow">
                Security Operations Center
              </span>

              <h1>
                AI SOC Analyst
              </h1>
            </div>
          </div>

          <div className="login-page__intro">
            <p className="login-page__label">
              SECURE SOC ACCESS
            </p>

            <h2>
              Join the
              <br />
              defense network.
            </h2>

            <p>
              Create your SOC analyst account
              and access the centralized
              security monitoring workspace.
            </p>
          </div>

          <div className="login-page__status">
            <span />

            Secure Registration
          </div>
        </div>
      </section>

      <section className="login-page__form-section">
        <div className="login-card register-card">
          <div className="login-card__header">
            <div className="login-card__mobile-logo">
              <ShieldCheck
                size={26}
                aria-hidden="true"
              />

              <span>
                AI SOC Analyst
              </span>
            </div>

            <p className="login-card__eyebrow">
              CREATE ACCOUNT
            </p>

            <h2>
              Join the SOC
            </h2>

            <p>
              Create your analyst account
              to get started.
            </p>
          </div>

          <form
            className="login-form register-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {error && (
              <div
                className="login-form__error"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="full-name">
                Full name
              </label>

              <div className="input-wrapper">
                <UserRound
                  size={18}
                  className="input-wrapper__icon"
                  aria-hidden="true"
                />

                <input
                  id="full-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={fullName}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setFullName(
                      event.target.value,
                    )
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-email">
                Email address
              </label>

              <div className="input-wrapper">
                <Mail
                  size={18}
                  className="input-wrapper__icon"
                  aria-hidden="true"
                />

                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="analyst@example.com"
                  value={email}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                />
              </div>
            </div>

            <div className="register-form__grid">
              <div className="form-group">
                <label htmlFor="department">
                  Department
                </label>

                <div className="input-wrapper">
                  <Building2
                    size={18}
                    className="input-wrapper__icon"
                    aria-hidden="true"
                  />

                  <input
                    id="department"
                    type="text"
                    placeholder="SOC"
                    value={department}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      setDepartment(
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone-number">
                  Phone number
                </label>

                <div className="input-wrapper">
                  <Phone
                    size={18}
                    className="input-wrapper__icon"
                    aria-hidden="true"
                  />

                  <input
                    id="phone-number"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Phone number"
                    value={phoneNumber}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      setPhoneNumber(
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-password">
                Password
              </label>

              <div className="input-wrapper">
                <LockKeyhole
                  size={18}
                  className="input-wrapper__icon"
                  aria-hidden="true"
                />

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Create password"
                  value={password}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current,
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <div className="input-wrapper">
                <LockKeyhole
                  size={18}
                  className="input-wrapper__icon"
                  aria-hidden="true"
                />

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) =>
                        !current,
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating account..."
                : "Create SOC account"}
            </button>

            <div className="auth-switch">
              <span>
                Already have an account?
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="login-card__footer">
            <ShieldCheck
              size={15}
              aria-hidden="true"
            />

            New accounts use SOC Analyst access
          </div>
        </div>
      </section>
    </main>
  );
}
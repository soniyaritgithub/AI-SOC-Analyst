import {
  useState,
  type FormEvent,
} from "react";

import {
  Activity,
  BrainCircuit,
  Eye,
  EyeOff,
  Hexagon,
  LockKeyhole,
  Mail,
  Radar,
  ShieldCheck,
} from "lucide-react";

import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { getApiErrorMessage } from "../utils/api-error";

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

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

    if (!email.trim()) {
      setError(
        "Please enter your email address.",
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      const state =
        location.state as
          | LocationState
          | null;

      navigate(
        state?.from || "/dashboard",
        {
          replace: true,
        },
      );
    } catch (loginError) {
      setError(
        getApiErrorMessage(loginError),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div
        className="cyber-background"
        aria-hidden="true"
      >
        <div className="cyber-scan-line" />

        <div className="cyber-orbit cyber-orbit--one" />
        <div className="cyber-orbit cyber-orbit--two" />
        
        <div className="threat-radar threat-radar--one">
          <span />
          <span />
          <span />

          <Radar size={20} />
        </div>

        <div className="threat-radar threat-radar--two">
          <span />
          <span />
          <span />

          <Radar size={16} />
        </div>

        <div className="cyber-hex-field">
          <Hexagon className="cyber-hex cyber-hex--1" />
          <Hexagon className="cyber-hex cyber-hex--2" />
          <Hexagon className="cyber-hex cyber-hex--3" />
          <Hexagon className="cyber-hex cyber-hex--4" />
          <Hexagon className="cyber-hex cyber-hex--5" />
        </div>

        <span className="cyber-node cyber-node--1" />
        <span className="cyber-node cyber-node--2" />
        <span className="cyber-node cyber-node--3" />
        <span className="cyber-node cyber-node--4" />
        <span className="cyber-node cyber-node--5" />
        <span className="cyber-node cyber-node--6" />

        <span className="cyber-line cyber-line--1" />
        <span className="cyber-line cyber-line--2" />
        <span className="cyber-line cyber-line--3" />
      </div>

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

          <div
            className="ai-core-scene"
            aria-hidden="true"
          >
            <div className="ai-core">
              <div className="ai-core__ring ai-core__ring--outer" />

              <div className="ai-core__ring ai-core__ring--middle" />

              <div className="ai-core__ring ai-core__ring--vertical" />

              <div className="ai-core__energy">
                <div className="ai-core__sphere">
                  <BrainCircuit size={30} />
                </div>
              </div>

              <span className="ai-core__particle ai-core__particle--1" />
              <span className="ai-core__particle ai-core__particle--2" />
              <span className="ai-core__particle ai-core__particle--3" />
            </div>

            <div className="ai-core__caption">
              <span className="ai-core__caption-dot" />

              AI THREAT INTELLIGENCE
            </div>
          </div>

          <div className="login-page__intro">
            <p className="login-page__label">
              ENTERPRISE SECURITY
              MONITORING
            </p>

            <h2>
              Detect threats.
              <br />
              Respond faster.
            </h2>

            <p>
              Monitor security incidents,
              analyze threats and respond
              to critical events from one
              centralized SOC workspace.
            </p>
          </div>

          <div className="threat-counter">
            <div className="threat-counter__icon">
              <ShieldCheck
                size={18}
                aria-hidden="true"
              />
            </div>

            <div className="threat-counter__content">
              <span className="threat-counter__label">
                LIVE THREAT PROTECTION
              </span>

              <div className="threat-counter__value">
                <strong>127</strong>
                <span>threats blocked today</span>
              </div>
            </div>

            <div
              className="threat-counter__live"
              aria-label="Live monitoring"
            >
              <span />
              LIVE
            </div>
          </div>

          <div className="login-page__status">
            <span />

            Secure SOC Environment
          </div>
        </div>
      </section>

      <section className="login-page__form-section">
        <div className="login-card">
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

            <div
              className="mobile-ai-core"
              aria-hidden="true"
            >
              <div className="mobile-ai-core__ring">
                <div className="mobile-ai-core__center">
                  <BrainCircuit size={20} />
                </div>
              </div>

              <span>AI DEFENSE ACTIVE</span>
            </div>

            <div className="login-card__telemetry">
              <span>
                <Activity
                  size={13}
                  aria-hidden="true"
                />

                LIVE
              </span>

              <span>SOC-01</span>
            </div>

            <div className="ai-security-status">
              <span className="ai-security-status__pulse" />

              <span>
                AI SECURITY ENGINE ONLINE
              </span>
            </div>

            <p className="login-card__eyebrow">
              SECURE ACCESS
            </p>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to access your
              security operations dashboard.
            </p>
          </div>

          <form
            className="login-form"
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
              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">
                <Mail
                  size={18}
                  className="input-wrapper__icon"
                  aria-hidden="true"
                />

                <input
                  id="email"
                  name="email"
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

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <LockKeyhole
                  size={18}
                  className="input-wrapper__icon"
                  aria-hidden="true"
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
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
                    <EyeOff
                      size={18}
                      aria-hidden="true"
                    />
                  ) : (
                    <Eye
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="button-spinner" />
                  Signing in...
                </>
              ) : (
                "Sign in to SOC"
              )}
            </button>
          </form>

          <div className="login-card__footer">
            <ShieldCheck
              size={15}
              aria-hidden="true"
            />

            Protected enterprise access
          </div>
        </div>
      </section>
    </main>
  );
}
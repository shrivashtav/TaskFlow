import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckSquare, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleFillTestCredentials = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email.trim(), password);
      showToast('Welcome back to TaskFlow!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const isEmailInvalid = touched.email && !email.trim();
  const isPasswordInvalid = touched.password && !password.trim();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
        padding: '1.5rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--slate-200)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 6px 16px rgba(79, 70, 229, 0.3)'
            }}
          >
            <CheckSquare size={26} />
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Welcome to TaskFlow
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
            Mini Task Management System with MySQL & REST API
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger-text)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address <span className="required-star">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                className={`form-control ${isEmailInvalid ? 'is-invalid' : ''}`}
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail
                size={16}
                color="var(--slate-400)"
                style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            {isEmailInvalid && (
              <div className="invalid-feedback">
                <AlertCircle size={14} />
                Email address is required
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password <span className="required-star">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type="password"
                className={`form-control ${isPasswordInvalid ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock
                size={16}
                color="var(--slate-400)"
                style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            {isPasswordInvalid && (
              <div className="invalid-feedback">
                <AlertCircle size={14} />
                Password is required
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div
          style={{
            marginTop: '1.75rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--slate-50)',
            border: '1px solid var(--slate-200)',
            fontSize: '0.8125rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--slate-700)' }}>
              <Sparkles size={14} color="var(--primary-600)" />
              <span>Test Credentials (Predefined)</span>
            </div>
            <button
              type="button"
              onClick={handleFillTestCredentials}
              className="btn btn-sm"
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                color: 'var(--primary-600)',
                background: 'var(--primary-50)'
              }}
            >
              Auto Fill
            </button>
          </div>
          <div style={{ color: 'var(--slate-600)', lineHeight: '1.5' }}>
            <div><strong>Email:</strong> admin@example.com</div>
            <div><strong>Password:</strong> admin123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

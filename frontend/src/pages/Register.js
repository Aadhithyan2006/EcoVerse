import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { register, clearError } from '../store/slices/authSlice';

const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' };

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', grade: '' });

  useEffect(() => { if (token) navigate('/dashboard'); }, [token, navigate]);
  useEffect(() => () => dispatch(clearError()), [dispatch]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.07) 0%, transparent 60%), #0a0f1a', padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 460, background: '#111827', border: '1px solid #1e2d42', borderRadius: 20, padding: '2.5rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #22c55e, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-seedling" style={{ color: '#fff', fontSize: '0.95rem' }} />
          </div>
          <span style={{ fontFamily: 'Sora, Inter, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#f1f5f9' }}>EcoVerse</span>
        </div>

        <h1 style={{ fontFamily: 'Sora, Inter, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem', color: '#f1f5f9' }}>Create your account</h1>
        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.75rem' }}>Join thousands of eco learners worldwide</p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontSize: '0.85rem' }}>
            <i className="fa-solid fa-circle-exclamation" /> {error}
          </div>
        )}

        <form onSubmit={e => { e.preventDefault(); dispatch(register(form)); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Full name</label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-user" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '0.8rem' }} />
              <input placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ paddingLeft: '2.25rem' }} required />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email address</label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-envelope" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '0.8rem' }} />
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ paddingLeft: '2.25rem' }} required />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '0.8rem' }} />
              <input type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingLeft: '2.25rem' }} required minLength={6} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Age</label>
              <input type="number" placeholder="e.g. 14" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Grade / Class</label>
              <input placeholder="e.g. Grade 9" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
            disabled={loading}>
            {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Creating account...</> : <>Create Account <i className="fa-solid fa-arrow-right" /></>}
          </motion.button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e2d42', textAlign: 'center', fontSize: '0.875rem', color: '#475569' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#22c55e', fontWeight: 600 }}>Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}

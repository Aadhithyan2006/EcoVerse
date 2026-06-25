import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { logout } from '../store/slices/authSlice';

const links = [
  { to: '/dashboard',   label: 'Dashboard',   icon: 'fa-solid fa-gauge-high' },
  { to: '/eco-world',   label: 'Eco World',    icon: 'fa-solid fa-earth-americas' },
  { to: '/lessons',     label: 'Lessons',      icon: 'fa-solid fa-book-open' },
  { to: '/challenges',  label: 'Challenges',   icon: 'fa-solid fa-leaf' },
  { to: '/leaderboard', label: 'Leaderboard',  icon: 'fa-solid fa-trophy' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(s => s.auth.user);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <nav style={{
      background: 'rgba(17,24,39,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1e2d42',
      padding: '0 1.5rem',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/dashboard">
        <motion.div whileHover={{ scale: 1.03 }} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fa-solid fa-seedling" style={{ color: '#fff', fontSize: '0.9rem' }} />
          </div>
          <span style={{ fontFamily: 'Sora, Inter, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            EcoVerse
          </span>
        </motion.div>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {links.map(l => {
          const active = location.pathname === l.to;
          return (
            <Link key={l.to} to={l.to}>
              <motion.div whileHover={{ scale: 1.03 }} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.75rem', borderRadius: 8,
                fontSize: '0.82rem', fontWeight: active ? 600 : 500,
                color: active ? '#22c55e' : '#94a3b8',
                background: active ? 'rgba(34,197,94,0.08)' : 'transparent',
                border: active ? '1px solid rgba(34,197,94,0.15)' : '1px solid transparent',
                transition: 'all 0.15s',
              }}>
                <i className={l.icon} style={{ fontSize: '0.75rem' }} />
                {l.label}
              </motion.div>
            </Link>
          );
        })}
        {user?.role === 'admin' && (
          <Link to="/admin">
            <motion.div whileHover={{ scale: 1.03 }} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.75rem', borderRadius: 8,
              fontSize: '0.82rem', fontWeight: 500, color: '#f59e0b',
              background: location.pathname === '/admin' ? 'rgba(245,158,11,0.08)' : 'transparent',
              border: '1px solid transparent',
            }}>
              <i className="fa-solid fa-shield-halved" style={{ fontSize: '0.75rem' }} />
              Admin
            </motion.div>
          </Link>
        )}
      </div>

      {/* User area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3a5f, #0d2818)',
              border: '2px solid #22c55e44',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700, color: '#22c55e',
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2 }}>{user.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#22c55e', lineHeight: 1.2 }}>
                <i className="fa-solid fa-bolt" style={{ marginRight: 3 }} />
                {user.ecoScore || 0} pts
              </div>
            </div>
          </div>
        )}
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={handleLogout} className="btn btn-ghost"
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '0.4rem' }}>
          <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: '0.75rem' }} />
          Sign out
        </motion.button>
      </div>
    </nav>
  );
}

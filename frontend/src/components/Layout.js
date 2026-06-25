import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import api from '../utils/api';

const NAV = [
  { to: '/',            label: 'Overview',   icon: 'fa-solid fa-house' },
  { to: '/dashboard',   label: 'Dashboard',  icon: 'fa-solid fa-gauge-high' },
  { to: '/eco-world',   label: 'Eco World',  icon: 'fa-solid fa-earth-americas' },
  { to: '/lessons',     label: 'Lessons',    icon: 'fa-solid fa-book-open' },
  { to: '/challenges',  label: 'Challenges', icon: 'fa-solid fa-leaf' },
  { to: '/leaderboard', label: 'Leaderboard',icon: 'fa-solid fa-trophy' },
];

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(s => s.auth.user);

  return (
    <nav style={{
      background: 'rgba(5,13,7,0.96)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(34,197,94,0.1)',
      padding: '0 1.75rem', height: 62,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#22c55e,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(34,197,94,0.3)' }}>
          <i className="fa-solid fa-seedling" style={{ color: '#fff', fontSize: '0.85rem' }} />
        </div>
        <span style={{ fontFamily: 'Sora,Inter,sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#e8f5e9', letterSpacing: '-0.02em' }}>EcoVerse</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
        {NAV.map(l => {
          const active = location.pathname === l.to;
          return (
            <Link key={l.to} to={l.to} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.8rem', borderRadius: 9,
                fontSize: '0.82rem', fontWeight: active ? 600 : 400,
                color: active ? '#4ade80' : '#4a7c59',
                background: active ? 'rgba(34,197,94,0.08)' : 'transparent',
                border: active ? '1px solid rgba(34,197,94,0.18)' : '1px solid transparent',
                transition: 'all 0.15s',
              }}>
                <i className={l.icon} style={{ fontSize: '0.72rem' }} />{l.label}
              </div>
            </Link>
          );
        })}
        {user?.role === 'admin' && (
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: 9, fontSize: '0.82rem', color: '#fbbf24', border: '1px solid transparent' }}>
              <i className="fa-solid fa-shield-halved" style={{ fontSize: '0.72rem' }} />Admin
            </div>
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {user && (
          <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(34,197,94,0.3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f2d14,#0a1f0d)' }}>
              {user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4ade80', fontFamily: 'Sora,sans-serif' }}>{user.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e8f5e9', lineHeight: 1.2 }}>{user.name}</div>
              <div style={{ fontSize: '0.68rem', color: '#22c55e', lineHeight: 1.2 }}>
                <i className="fa-solid fa-bolt" style={{ marginRight: 3, fontSize: '0.6rem' }} />{user.ecoScore || 0} pts
              </div>
            </div>
          </Link>
        )}
        <button onClick={() => { dispatch(logout()); navigate('/login'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.38rem 0.8rem', borderRadius: 9, border: '1px solid rgba(34,197,94,0.15)', background: 'transparent', color: '#4a7c59', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.15s', fontFamily: 'Inter,sans-serif' }}
          onMouseEnter={e => { e.target.style.color = '#4ade80'; e.target.style.borderColor = 'rgba(34,197,94,0.3)'; }}
          onMouseLeave={e => { e.target.style.color = '#4a7c59'; e.target.style.borderColor = 'rgba(34,197,94,0.15)'; }}>
          <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: '0.7rem' }} />Sign out
        </button>
      </div>
    </nav>
  );
}

function ChatBot() {
  const user = useSelector(s => s.auth.user);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: 'ai', text: "Hi! I'm TerraNova AI. Ask me about climate, oceans, forests, or eco tips!" }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async (t) => {
    const msg = (t || input).trim();
    if (!msg || busy) return;
    setInput('');
    setMsgs(p => [...p, { role: 'user', text: msg }]);
    setBusy(true);
    try {
      const { data } = await api.post('/terranova/chat', { message: msg, history: [] });
      setMsgs(p => [...p, { role: 'ai', text: data.response, suggestions: data.suggestions }]);
    } catch {
      setMsgs(p => [...p, { role: 'ai', text: 'Sorry, having trouble connecting.' }]);
    }
    setBusy(false);
  };

  return (
    <div>
      <button onClick={() => setOpen(o => !o)}
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 500, width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#22c55e,#14b8a6)', boxShadow: '0 4px 20px rgba(34,197,94,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
        <i className={open ? 'fa-solid fa-xmark' : 'fa-solid fa-leaf'} style={{ color: '#fff', fontSize: '1rem' }} />
      </button>
      {open && (
        <div style={{ position: 'fixed', bottom: '5rem', right: '1.5rem', zIndex: 499, width: 360, height: 500, background: '#071009', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.7)', overflow: 'hidden' }}>
          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgba(34,197,94,0.1)', background: 'linear-gradient(135deg,#071009,#0a1509)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#22c55e,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-leaf" style={{ color: '#fff', fontSize: '0.875rem' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#e8f5e9', fontFamily: 'Sora,sans-serif' }}>TerraNova AI</div>
              <div style={{ fontSize: '0.68rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />Sustainability Guide
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '0.2rem' }}>
                <div style={{ maxWidth: '88%', padding: '0.55rem 0.875rem', borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px', background: m.role === 'user' ? 'linear-gradient(135deg,#22c55e,#14b8a6)' : '#0f1f11', color: m.role === 'user' ? '#fff' : '#a5d6a7', fontSize: '0.82rem', lineHeight: 1.55, border: m.role === 'ai' ? '1px solid rgba(34,197,94,0.1)' : 'none', whiteSpace: 'pre-wrap' }}>
                  {m.text}
                </div>
                {m.suggestions && m.suggestions.map((s, si) => (
                  <button key={si} onClick={() => send(s)} style={{ padding: '0.2rem 0.6rem', borderRadius: 20, border: '1px solid rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.05)', color: '#4ade80', fontSize: '0.68rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>{s}</button>
                ))}
              </div>
            ))}
            {busy && <div style={{ color: '#22c55e', fontSize: '0.78rem', padding: '0.25rem 0' }}>Thinking...</div>}
          </div>
          <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(34,197,94,0.1)', display: 'flex', gap: '0.5rem' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Ask anything eco..." style={{ flex: 1, borderRadius: 10, padding: '0.55rem 0.75rem', fontSize: '0.82rem', background: '#0a1509', border: '1px solid rgba(34,197,94,0.15)', color: '#e8f5e9', outline: 'none' }} />
            <button onClick={() => send()} disabled={!input.trim() || busy} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#22c55e,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fa-solid fa-paper-plane" style={{ color: '#fff', fontSize: '0.75rem' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-root)' }}>
      <Navbar />
      <main style={{ flex: 1 }}><Outlet /></main>
      <ChatBot />
    </div>
  );
}



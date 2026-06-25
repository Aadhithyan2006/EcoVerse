import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import EcoScoreRing from '../components/EcoScoreRing';
import BadgeDisplay from '../components/BadgeDisplay';
import api from '../utils/api';

const levelInfo = (score) => {
  if (score < 100)  return { label: 'Seedling',    color: '#22c55e', icon: 'fa-solid fa-seedling',      next: 100 };
  if (score < 500)  return { label: 'Sprout',       color: '#14b8a6', icon: 'fa-solid fa-leaf',          next: 500 };
  if (score < 1000) return { label: 'Guardian',     color: '#3b82f6', icon: 'fa-solid fa-shield-halved', next: 1000 };
  return              { label: 'Eco Legend',  color: '#fbbf24', icon: 'fa-solid fa-trophy',        next: 5000 };
};

const QUICK = [
  { to: '/eco-world',   icon: 'fa-solid fa-earth-americas', label: 'Eco World',     sub: 'Explore 3D worlds',   color: '#22c55e' },
  { to: '/lessons',     icon: 'fa-solid fa-book-open',      label: 'Lessons',       sub: 'Continue learning',   color: '#3b82f6' },
  { to: '/challenges',  icon: 'fa-solid fa-leaf',           label: 'Challenges',    sub: 'Real-world tasks',    color: '#14b8a6' },
  { to: '/leaderboard', icon: 'fa-solid fa-trophy',         label: 'Leaderboard',   sub: 'See your ranking',    color: '#fbbf24' },
];

export default function Dashboard() {
  const user = useSelector(s => s.auth.user);
  const [recs, setRecs] = useState(null);
  useEffect(() => { api.get('/recommendation').then(r => setRecs(r.data)).catch(() => {}); }, []);
  if (!user) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>;

  const lv = levelInfo(user.ecoScore || 0);
  const progress = Math.min(((user.ecoScore || 0) / lv.next) * 100, 100);

  return (
    <PageTransition>
      <div className="page-container">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg,#071009 0%,#0a1509 100%)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 18, padding: '1.75rem 2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ width: 60, height: 60, borderRadius: 15, background: 'linear-gradient(135deg,#0f2d14,#071009)', border: '1.5px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: '#4ade80', fontFamily: 'Sora,sans-serif', flexShrink: 0 }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Welcome back</div>
            <h1 style={{ fontSize: '1.4rem', marginBottom: '0.4rem', color: '#e8f5e9' }}>{user.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: lv.color }}>
                <i className={lv.icon} style={{ fontSize: '0.7rem' }} />{lv.label}
              </span>
              {user.grade && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> {user.grade}</span>}
            </div>
            <div style={{ maxWidth: 260 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Progress to next level</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{user.ecoScore || 0} / {lv.next}</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: 'fa-solid fa-fire', label: 'Streak', value: user.streak?.current || 0, color: '#fbbf24' },
              { icon: 'fa-solid fa-coins', label: 'Coins', value: user.ecoCoins || 0, color: '#22c55e' },
              { icon: 'fa-solid fa-medal', label: 'Badges', value: user.badges?.length || 0, color: '#60a5fa' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <i className={s.icon} style={{ fontSize: '1rem', color: s.color, marginBottom: '0.2rem', display: 'block' }} />
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e8f5e9', fontFamily: 'Sora,sans-serif', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <EcoScoreRing score={user.ecoScore || 0} max={lv.next} size={100} />
        </motion.div>

        {/* Quick links */}
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          {QUICK.map((item, i) => (
            <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.02, y: -2 }}
                style={{ background: `${item.color}08`, border: `1px solid ${item.color}18`, borderRadius: 14, padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${item.color}15`, border: `1px solid ${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.625rem' }}>
                  <i className={item.icon} style={{ fontSize: '0.85rem', color: item.color }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#e8f5e9', marginBottom: '0.15rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.sub}</div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid-2">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <i className="fa-solid fa-medal" style={{ color: '#fbbf24', fontSize: '0.85rem' }} />
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#e8f5e9' }}>My Badges</span>
            </div>
            <BadgeDisplay badges={user.badges || []} />
          </div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#60a5fa', fontSize: '0.85rem' }} />
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#e8f5e9' }}>Recommended for You</span>
            </div>
            {recs ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {recs.tips?.map((tip, i) => (
                  <div key={i} style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '0.625rem 0.875rem', fontSize: '0.8rem', color: 'var(--text-secondary)', borderLeft: '2px solid #22c55e', lineHeight: 1.5 }}>
                    <i className="fa-solid fa-lightbulb" style={{ color: '#22c55e', marginRight: '0.35rem', fontSize: '0.7rem' }} />{tip}
                  </div>
                ))}
                {recs.recommendations?.slice(0, 2).map(l => (
                  <Link key={l.id} to={`/lessons/${l.id}`} style={{ textDecoration: 'none' }}>
                    <motion.div whileHover={{ x: 3 }} style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '0.625rem 0.875rem', fontSize: '0.8rem', color: '#4ade80', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <i className="fa-solid fa-book-open" style={{ fontSize: '0.7rem' }} />{l.title}
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fa-solid fa-spinner fa-spin" />Loading...
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

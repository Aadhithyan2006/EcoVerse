import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchLeaderboard } from '../store/slices/leaderboardSlice';
import PageTransition from '../components/PageTransition';

const rankStyle = [
  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: 'fa-solid fa-trophy' },
  { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', icon: 'fa-solid fa-medal' },
  { color: '#b45309', bg: 'rgba(180,83,9,0.1)', border: 'rgba(180,83,9,0.25)', icon: 'fa-solid fa-medal' },
];

export default function Leaderboard() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.leaderboard);
  const currentUser = useSelector(s => s.auth.user);

  useEffect(() => { dispatch(fetchLeaderboard()); }, [dispatch]);

  return (
    <PageTransition>
      <div className="page-container" style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontFamily: 'Sora, Inter, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.3rem' }}>Leaderboard</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>Top eco warriors ranked by total points</p>
        </div>

        {/* Top 3 podium */}
        {items.length >= 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '0.75rem', marginBottom: '2rem' }}>
            {[items[1], items[0], items[2]].map((entry, i) => {
              const pos = i === 0 ? 1 : i === 1 ? 0 : 2;
              const rs = rankStyle[pos];
              const heights = [110, 140, 95];
              return (
                <motion.div key={entry._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pos * 0.1 }}
                  style={{ flex: 1, maxWidth: 160, textAlign: 'center', background: rs.bg, border: `1px solid ${rs.border}`, borderRadius: '12px 12px 0 0', padding: '1rem 0.5rem', height: heights[pos], display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#111827', border: `2px solid ${rs.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: rs.color, fontFamily: 'Sora, sans-serif' }}>
                    {entry.userId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <i className={rs.icon} style={{ color: rs.color, fontSize: '0.85rem' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f1f5f9' }}>{entry.userId?.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#475569' }}>{entry.score} pts</div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full list */}
        {loading ? (
          <div style={{ color: '#475569', textAlign: 'center', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-spinner fa-spin" /> Loading...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {items.map((entry, i) => {
              const isMe = entry.userId?._id === currentUser?._id;
              const rs = rankStyle[i] || null;
              return (
                <motion.div key={entry._id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.025 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 1rem', borderRadius: 10, background: isMe ? 'rgba(34,197,94,0.06)' : '#111827', border: `1px solid ${isMe ? 'rgba(34,197,94,0.25)' : '#1e2d42'}` }}>
                  <div style={{ width: 28, textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: rs ? rs.color : '#475569', flexShrink: 0 }}>
                    {rs ? <i className={rs.icon} /> : `#${i + 1}`}
                  </div>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: isMe ? 'rgba(34,197,94,0.1)' : '#161f2e', border: `1px solid ${isMe ? 'rgba(34,197,94,0.3)' : '#1e2d42'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: isMe ? '#22c55e' : '#94a3b8', flexShrink: 0 }}>
                    {entry.userId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f1f5f9' }}>
                      {entry.userId?.name}
                      {isMe && <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', color: '#22c55e', fontWeight: 600 }}>YOU</span>}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                      <i className="fa-solid fa-medal" style={{ marginRight: 3 }} />{entry.userId?.badges?.length || 0} badges
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isMe ? '#22c55e' : '#f1f5f9' }}>
                    {entry.score.toLocaleString()} <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 400 }}>pts</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

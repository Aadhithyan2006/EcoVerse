import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../utils/api';
import PageTransition from '../components/PageTransition';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [tab, setTab] = useState('overview');

  const loadData = () => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/admin/pending-challenges').then(r => setPending(r.data)).catch(() => {});
  };
  useEffect(() => { loadData(); }, []);

  const handleApprove = async (challengeId, userId, status) => {
    try {
      await api.post('/challenges/approve', { challengeId, userId, status });
      toast.success(`Submission ${status}`);
      loadData();
    } catch { toast.error('Action failed'); }
  };

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalUsers,        icon: 'fa-solid fa-users',          color: '#3b82f6' },
    { label: 'Lessons',        value: stats.totalLessons,      icon: 'fa-solid fa-book-open',       color: '#22c55e' },
    { label: 'Challenges',     value: stats.totalChallenges,   icon: 'fa-solid fa-leaf',            color: '#14b8a6' },
    { label: 'Quizzes',        value: stats.totalQuizzes,      icon: 'fa-solid fa-pen-to-square',   color: '#f59e0b' },
    { label: 'Pending Reviews',value: stats.pendingSubmissions,icon: 'fa-solid fa-clock',           color: '#ef4444' },
  ] : [];

  return (
    <PageTransition>
      <div className="page-container">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontFamily: 'Sora, Inter, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.3rem' }}>Admin Dashboard</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>Monitor students, lessons, and challenge submissions</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e2d42', paddingBottom: '0' }}>
          {['overview', 'pending'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: tab === t ? 600 : 400, color: tab === t ? '#22c55e' : '#475569', borderBottom: tab === t ? '2px solid #22c55e' : '2px solid transparent', marginBottom: -1, textTransform: 'capitalize', transition: 'all 0.15s' }}>
              {t === 'pending' && stats?.pendingSubmissions > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 700, marginRight: '0.4rem' }}>
                  {stats.pendingSubmissions}
                </span>
              )}
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div>
            <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
              {statCards.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="stat-card">
                  <div className="stat-icon" style={{ background: `${s.color}12`, border: `1px solid ${s.color}20` }}>
                    <i className={s.icon} style={{ color: s.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>{s.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <i className="fa-solid fa-ranking-star" style={{ color: '#f59e0b', fontSize: '0.9rem' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Top Students</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stats?.topStudents?.map((s, i) => (
                  <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: '#0a0f1a', borderRadius: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: i === 0 ? '#f59e0b' : '#475569', width: 20 }}>#{i + 1}</span>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#161f2e', border: '1px solid #1e2d42', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>
                      {s.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ flex: 1, fontWeight: 500, fontSize: '0.875rem' }}>{s.name}</span>
                    <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.875rem' }}>{s.ecoScore} pts</span>
                    <span style={{ color: '#475569', fontSize: '0.75rem' }}>{s.badges?.length || 0} badges</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'pending' && (
          <div>
            {pending.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '2rem', marginBottom: '0.75rem', display: 'block', color: '#22c55e', opacity: 0.5 }} />
                No pending submissions.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pending.map(challenge =>
                  challenge.submissions.filter(s => s.status === 'pending').map(sub => (
                    <div key={sub._id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.875rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{challenge.taskName}</div>
                          <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.5rem' }}>
                            <i className="fa-solid fa-user" style={{ marginRight: '0.35rem' }} />
                            {sub.userId?.name} · {sub.userId?.email}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#94a3b8', background: '#0a0f1a', borderRadius: 8, padding: '0.6rem 0.875rem', borderLeft: '3px solid #1e2d42' }}>
                            {sub.proof}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <motion.button whileHover={{ scale: 1.04 }} className="btn btn-primary"
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}
                            onClick={() => handleApprove(challenge._id, sub.userId?._id, 'approved')}>
                            <i className="fa-solid fa-check" /> Approve
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.04 }} className="btn btn-danger"
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}
                            onClick={() => handleApprove(challenge._id, sub.userId?._id, 'rejected')}>
                            <i className="fa-solid fa-xmark" /> Reject
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

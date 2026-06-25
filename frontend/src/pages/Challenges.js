import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../utils/api';
import PageTransition from '../components/PageTransition';

const worldConfig = {
  forest: { icon: 'fa-solid fa-tree',          color: '#22c55e', bg: 'rgba(34,197,94,0.06)' },
  ocean:  { icon: 'fa-solid fa-water',          color: '#3b82f6', bg: 'rgba(59,130,246,0.06)' },
  city:   { icon: 'fa-solid fa-city',           color: '#f59e0b', bg: 'rgba(245,158,11,0.06)' },
};

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [proof, setProof] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { api.get('/challenges').then(r => setChallenges(r.data)).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proof.trim()) { toast.warning('Please provide proof of your action.'); return; }
    setSubmitting(true);
    try {
      await api.post('/challenges/submit', { challengeId: selected._id, proof });
      toast.success('Submission received — pending review.');
      setSelected(null); setProof('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    }
    setSubmitting(false);
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontFamily: 'Sora, Inter, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.3rem' }}>Eco Challenges</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>Complete real-world sustainability tasks and earn points</p>
        </div>

        <div className="grid-2">
          {challenges.map((c, i) => {
            const wc = worldConfig[c.world] || worldConfig.forest;
            return (
              <motion.div key={c._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="card" whileHover={{ scale: 1.01, borderColor: '#243447' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: wc.bg, border: `1px solid ${wc.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={wc.icon} style={{ fontSize: '1rem', color: wc.color }} />
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, color: '#f59e0b', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <i className="fa-solid fa-bolt" style={{ fontSize: '0.6rem' }} /> {c.points} pts
                  </span>
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.4rem', color: '#f1f5f9' }}>{c.taskName}</h3>
                <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>{c.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, color: '#60a5fa', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', textTransform: 'capitalize' }}>
                    <i className="fa-solid fa-paperclip" style={{ fontSize: '0.6rem' }} /> {c.proofType}
                  </span>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }} onClick={() => setSelected(c)}>
                    Submit Proof
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem', backdropFilter: 'blur(4px)' }}
              onClick={e => e.target === e.currentTarget && setSelected(null)}>
              <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
                style={{ background: '#111827', border: '1px solid #1e2d42', borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 500 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{selected.taskName}</h2>
                    <p style={{ color: '#475569', fontSize: '0.82rem' }}>{selected.description}</p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem' }}>
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' }}>
                    {selected.proofType === 'photo' ? 'Photo URL or description of your action' : 'Describe what you did'}
                  </label>
                  <textarea rows={4} value={proof} onChange={e => setProof(e.target.value)}
                    placeholder="Describe your eco action in detail..." style={{ marginBottom: '1.25rem', resize: 'vertical' }} />
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <motion.button type="button" whileHover={{ scale: 1.02 }} className="btn btn-secondary"
                      onClick={() => setSelected(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</motion.button>
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} className="btn btn-primary"
                      disabled={submitting} style={{ flex: 1, justifyContent: 'center' }}>
                      {submitting ? <><i className="fa-solid fa-spinner fa-spin" /> Submitting...</> : <><i className="fa-solid fa-paper-plane" /> Submit</>}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TYPE = { video: { icon: 'fa-solid fa-circle-play', color: '#3b82f6' }, text: { icon: 'fa-solid fa-file-lines', color: '#22c55e' }, game: { icon: 'fa-solid fa-gamepad', color: '#fbbf24' } };
const WORLD = { forest: { color: '#22c55e', label: 'Forest' }, ocean: { color: '#3b82f6', label: 'Ocean' }, city: { color: '#fbbf24', label: 'City' } };
const DIFF = { beginner: '#22c55e', intermediate: '#fbbf24', advanced: '#ef4444' };

export default function LessonCard({ lesson, completed }) {
  const navigate = useNavigate();
  const t = TYPE[lesson.type] || TYPE.text;
  const w = WORLD[lesson.world] || WORLD.forest;
  return (
    <motion.div className="card" whileHover={{ scale: 1.015, boxShadow: '0 8px 28px rgba(0,0,0,0.5)', borderColor: 'rgba(34,197,94,0.2)' }}
      style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
      onClick={() => navigate(`/lessons/${lesson._id}`)}>
      {completed && (
        <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fa-solid fa-check" style={{ fontSize: '0.6rem', color: '#22c55e' }} />
        </div>
      )}
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${t.color}12`, border: `1px solid ${t.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
        <i className={t.icon} style={{ fontSize: '0.9rem', color: t.color }} />
      </div>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: '#e8f5e9', lineHeight: 1.4 }}>{lesson.title}</h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{lesson.topic}</p>
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {[
          { label: lesson.difficulty, color: DIFF[lesson.difficulty] || '#94a3b8' },
          { label: w.label, color: w.color },
        ].map((b, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, color: b.color, background: `${b.color}10`, border: `1px solid ${b.color}20`, textTransform: 'capitalize' }}>{b.label}</span>
        ))}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)' }}>
          <i className="fa-solid fa-bolt" style={{ fontSize: '0.55rem' }} />{lesson.points}
        </span>
      </div>
    </motion.div>
  );
}

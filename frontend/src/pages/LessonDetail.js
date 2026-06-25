import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import api from '../utils/api';
import PageTransition from '../components/PageTransition';
import { fetchProfile } from '../store/slices/authSlice';

const diffColor = { beginner: '#22c55e', intermediate: '#f59e0b', advanced: '#ef4444' };
const worldColor = { forest: '#22c55e', ocean: '#3b82f6', city: '#f59e0b' };

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [lesson, setLesson] = useState(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    api.get(`/lessons/${id}`).then(r => setLesson(r.data)).catch(() => navigate('/lessons'));
  }, [id, navigate]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const { data } = await api.post('/lessons/complete', { lessonId: id });
      if (data.alreadyDone) toast.info('Already completed this lesson.');
      else { toast.success(`+${data.pointsEarned} eco points earned!`); dispatch(fetchProfile()); }
    } catch { toast.error('Something went wrong.'); }
    setCompleting(false);
  };

  if (!lesson) return (
    <div style={{ padding: '2rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <i className="fa-solid fa-spinner fa-spin" /> Loading...
    </div>
  );

  return (
    <PageTransition>
      <div className="page-container" style={{ maxWidth: 860 }}>
        <motion.button whileHover={{ x: -3 }} onClick={() => navigate('/lessons')}
          style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <i className="fa-solid fa-arrow-left" /> Back to Lessons
        </motion.button>

        {/* Header */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: 'Sora, Inter, sans-serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.6rem', color: '#f1f5f9' }}>{lesson.title}</h1>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, color: diffColor[lesson.difficulty], background: `${diffColor[lesson.difficulty]}15`, border: `1px solid ${diffColor[lesson.difficulty]}25`, textTransform: 'capitalize' }}>
                  {lesson.difficulty}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, color: worldColor[lesson.world] || '#94a3b8', background: `${worldColor[lesson.world] || '#94a3b8'}15`, border: `1px solid ${worldColor[lesson.world] || '#94a3b8'}25`, textTransform: 'capitalize' }}>
                  <i className="fa-solid fa-earth-americas" style={{ fontSize: '0.6rem' }} /> {lesson.world}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, color: '#f59e0b', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <i className="fa-solid fa-bolt" style={{ fontSize: '0.6rem' }} /> {lesson.points} pts
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-primary"
                onClick={handleComplete} disabled={completing}>
                {completing ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</> : <><i className="fa-solid fa-circle-check" /> Mark Complete</>}
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} className="btn btn-secondary"
                onClick={() => navigate(`/quizzes/${id}`)}>
                <i className="fa-solid fa-pen-to-square" /> Take Quiz
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="card">
          {lesson.type === 'video' && lesson.contentURL ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 10 }}>
              <iframe src={lesson.contentURL} title={lesson.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: 10 }}
                allowFullScreen />
            </div>
          ) : lesson.type === 'game' ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <i className="fa-solid fa-gamepad" style={{ fontSize: '1.8rem', color: '#f59e0b' }} />
              </div>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>This lesson is an interactive mini-game.</p>
              <motion.button whileHover={{ scale: 1.03 }} className="btn btn-primary" onClick={() => navigate('/eco-world')}>
                <i className="fa-solid fa-play" /> Play in Eco World
              </motion.button>
            </div>
          ) : (
            <div style={{ lineHeight: 1.85, color: '#cbd5e1', fontSize: '0.925rem' }}>
              {lesson.content ? lesson.content.split('\n').map((line, i) => {
                if (line === '') return <div key={i} style={{ height: '0.75rem' }} />;
                if (line === line.toUpperCase() && line.trim().length > 3 && !line.includes(':')) {
                  return <h3 key={i} style={{ fontFamily: 'Sora,Inter,sans-serif', fontSize: '1rem', fontWeight: 700, color: '#4ade80', marginTop: '1.25rem', marginBottom: '0.4rem' }}>{line}</h3>;
                }
                if (line.endsWith(':') && line === line.toUpperCase()) {
                  return <h3 key={i} style={{ fontFamily: 'Sora,Inter,sans-serif', fontSize: '1rem', fontWeight: 700, color: '#4ade80', marginTop: '1.25rem', marginBottom: '0.4rem' }}>{line}</h3>;
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                  return <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem', paddingLeft: '0.5rem' }}>
                    <span style={{ color: '#22c55e', flexShrink: 0, marginTop: '0.1rem' }}>•</span>
                    <span>{line.slice(2)}</span>
                  </div>;
                }
                if (/^\d+\./.test(line)) {
                  return <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem', paddingLeft: '0.5rem' }}>
                    <span style={{ color: '#22c55e', flexShrink: 0, fontWeight: 600, minWidth: 20 }}>{line.match(/^\d+/)[0]}.</span>
                    <span>{line.replace(/^\d+\.\s*/, '')}</span>
                  </div>;
                }
                return <p key={i} style={{ marginBottom: '0.4rem', color: '#a5d6a7' }}>{line}</p>;
              }) : 'Content coming soon.'}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

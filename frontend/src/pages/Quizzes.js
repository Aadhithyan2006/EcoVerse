import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import api from '../utils/api';
import PageTransition from '../components/PageTransition';
import { fetchProfile } from '../store/slices/authSlice';

export default function Quizzes() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState(null);

  useEffect(() => {
    api.get(`/quizzes/${lessonId}`)
      .then(r => { setQuiz(r.data); setAnswers(new Array(r.data.questions.length).fill(null)); })
      .catch(() => navigate('/lessons'));
  }, [lessonId, navigate]);

  const handleSubmit = async () => {
    if (answers.includes(null)) { toast.warning('Please answer all questions first.'); return; }
    try {
      const { data } = await api.post('/quizzes/submit', { quizId: quiz._id, answers });
      setResults(data);
      toast.success(`Quiz complete! +${data.pointsEarned} pts`);
      dispatch(fetchProfile());
    } catch { toast.error('Submission failed.'); }
  };

  if (!quiz) return (
    <div style={{ padding: '2rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <i className="fa-solid fa-spinner fa-spin" /> Loading quiz...
    </div>
  );

  const q = quiz.questions[current];
  const pct = Math.round(((answers.filter(a => a !== null).length) / quiz.questions.length) * 100);

  return (
    <PageTransition>
      <div className="page-container" style={{ maxWidth: 720 }}>
        <motion.button whileHover={{ x: -3 }} onClick={() => navigate(`/lessons/${lessonId}`)}
          style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <i className="fa-solid fa-arrow-left" /> Back to Lesson
        </motion.button>

        <h1 style={{ fontFamily: 'Sora, Inter, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>{quiz.title}</h1>
        <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{quiz.questions.length} questions · {quiz.points} points available</p>

        {!results ? (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#475569' }}>Question {current + 1} of {quiz.questions.length}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{pct}% answered</span>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {quiz.questions.map((_, i) => (
                  <div key={i} onClick={() => setCurrent(i)} style={{
                    flex: 1, height: 4, borderRadius: 2, cursor: 'pointer',
                    background: answers[i] !== null ? '#22c55e' : i === current ? '#3b82f6' : '#1e2d42',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="card" style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {q.type === 'scenario' ? 'Scenario' : 'Multiple Choice'}
                </p>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', color: '#f1f5f9', lineHeight: 1.5 }}>{q.question}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {q.options.map((opt, i) => {
                    const selected = answers[current] === i;
                    return (
                      <motion.button key={i} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
                        onClick={() => { const a = [...answers]; a[current] = i; setAnswers(a); }}
                        style={{
                          padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid',
                          borderColor: selected ? 'rgba(34,197,94,0.5)' : '#1e2d42',
                          background: selected ? 'rgba(34,197,94,0.08)' : '#0a0f1a',
                          color: selected ? '#22c55e' : '#cbd5e1',
                          cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem',
                          transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.75rem',
                        }}>
                        <span style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid ${selected ? '#22c55e' : '#2d4a6a'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, color: selected ? '#22c55e' : '#475569', background: selected ? 'rgba(34,197,94,0.1)' : 'transparent' }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <motion.button whileHover={{ scale: 1.03 }} className="btn btn-secondary"
                onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
                <i className="fa-solid fa-arrow-left" /> Previous
              </motion.button>
              {current < quiz.questions.length - 1 ? (
                <motion.button whileHover={{ scale: 1.03 }} className="btn btn-primary" onClick={() => setCurrent(current + 1)}>
                  Next <i className="fa-solid fa-arrow-right" />
                </motion.button>
              ) : (
                <motion.button whileHover={{ scale: 1.03 }} className="btn btn-primary" onClick={handleSubmit}>
                  <i className="fa-solid fa-paper-plane" /> Submit Quiz
                </motion.button>
              )}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="card" style={{ textAlign: 'center', marginBottom: '1.25rem', background: 'linear-gradient(135deg, #0d1f12, #0a1628)', borderColor: 'rgba(34,197,94,0.2)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: results.correct === results.total ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.1)', border: `1px solid ${results.correct === results.total ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <i className={results.correct === results.total ? 'fa-solid fa-trophy' : 'fa-solid fa-star'} style={{ fontSize: '1.5rem', color: results.correct === results.total ? '#f59e0b' : '#22c55e' }} />
              </div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.4rem', fontWeight: 700 }}>{results.correct}/{results.total} Correct</h2>
              <p style={{ color: '#22c55e', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 600 }}>+{results.pointsEarned} eco points earned</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {results.results.map((r, i) => (
                <div key={i} className="card" style={{ borderColor: r.isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', padding: '0.875rem' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <i className={r.isCorrect ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'} style={{ color: r.isCorrect ? '#22c55e' : '#ef4444', fontSize: '0.9rem', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.2rem' }}>{r.question}</p>
                      {r.explanation && <p style={{ fontSize: '0.78rem', color: '#475569' }}>{r.explanation}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <motion.button whileHover={{ scale: 1.03 }} className="btn btn-secondary" onClick={() => navigate('/lessons')}>
                <i className="fa-solid fa-book-open" /> Back to Lessons
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} className="btn btn-primary" onClick={() => navigate('/challenges')}>
                Try a Challenge <i className="fa-solid fa-arrow-right" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}

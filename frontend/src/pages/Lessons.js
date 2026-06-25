import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchLessons } from '../store/slices/lessonSlice';
import LessonCard from '../components/LessonCard';
import PageTransition from '../components/PageTransition';

const worlds = ['all', 'forest', 'ocean', 'city'];
const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

export default function Lessons() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.lessons);
  const user = useSelector(s => s.auth.user);
  const [world, setWorld] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  useEffect(() => {
    const params = {};
    if (world !== 'all') params.world = world;
    if (difficulty !== 'all') params.difficulty = difficulty;
    dispatch(fetchLessons(params));
  }, [world, difficulty, dispatch]);

  const completed = user?.completedLessons || [];

  const FilterBtn = ({ active, onClick, children }) => (
    <motion.button whileHover={{ scale: 1.03 }} onClick={onClick}
      style={{
        padding: '0.35rem 0.875rem', borderRadius: 8, border: '1px solid',
        borderColor: active ? 'rgba(34,197,94,0.4)' : '#1e2d42',
        background: active ? 'rgba(34,197,94,0.08)' : 'transparent',
        color: active ? '#22c55e' : '#94a3b8',
        fontSize: '0.8rem', fontWeight: active ? 600 : 500,
        cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
      }}>
      {children}
    </motion.button>
  );

  return (
    <PageTransition>
      <div className="page-container">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontFamily: 'Sora, Inter, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.3rem' }}>Learning Modules</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>Explore lessons across forest, ocean, and city worlds</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500, marginRight: '0.25rem' }}>WORLD</span>
            {worlds.map(w => <FilterBtn key={w} active={world === w} onClick={() => setWorld(w)}>{w}</FilterBtn>)}
          </div>
          <div style={{ width: 1, height: 24, background: '#1e2d42' }} />
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500, marginRight: '0.25rem' }}>LEVEL</span>
            {difficulties.map(d => <FilterBtn key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>{d}</FilterBtn>)}
          </div>
        </div>

        {loading ? (
          <div style={{ color: '#475569', textAlign: 'center', padding: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-spinner fa-spin" /> Loading lessons...
          </div>
        ) : (
          <div className="grid-3">
            {items.map((lesson, i) => (
              <motion.div key={lesson._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <LessonCard lesson={lesson} completed={completed.includes(lesson._id)} />
              </motion.div>
            ))}
            {items.length === 0 && (
              <div style={{ color: '#475569', gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                <i className="fa-solid fa-book-open" style={{ fontSize: '2rem', marginBottom: '0.75rem', display: 'block', opacity: 0.3 }} />
                No lessons found for these filters.
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

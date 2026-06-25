import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageTransition from '../components/PageTransition';
import TreePlanter from '../games/TreePlanter';
import OceanCleanup from '../games/OceanCleanup';
import WildlifeSorter from '../games/WildlifeSorter';
import SolarBuilder from '../games/SolarBuilder';
import api from '../utils/api';

const GAMES = [
  {
    id: 'tree',
    title: 'Tree Planting Simulator',
    desc: 'Click on soil patches to plant trees and restore the forest before time runs out.',
    icon: 'fa-solid fa-tree',
    color: '#22c55e',
    bg: 'linear-gradient(135deg, #0d2818 0%, #1a3a1a 100%)',
    photo: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=300&fit=crop&auto=format',
    border: 'rgba(34,197,94,0.25)',
    world: 'Forest',
    difficulty: 'Easy',
    time: '45s',
    points: '15 pts/tree',
  },
  {
    id: 'ocean',
    title: 'Ocean Cleanup',
    desc: 'Pilot a cleanup boat to collect ocean trash. Avoid jellyfish or lose a life.',
    icon: 'fa-solid fa-ship',
    color: '#3b82f6',
    bg: 'linear-gradient(135deg, #0a1628 0%, #0d2a4a 100%)',
    photo: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&h=300&fit=crop&auto=format',
    border: 'rgba(59,130,246,0.25)',
    world: 'Ocean',
    difficulty: 'Medium',
    time: '60s',
    points: '20 pts/item',
  },
  {
    id: 'wildlife',
    title: 'Wildlife Habitat Sorter',
    desc: 'Sort animals into their correct natural habitats — forest, ocean, or sky.',
    icon: 'fa-solid fa-paw',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #1a1000 0%, #2a1a00 100%)',
    photo: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&h=300&fit=crop&auto=format',
    border: 'rgba(245,158,11,0.25)',
    world: 'All Worlds',
    difficulty: 'Easy',
    time: '90s',
    points: '10-40 pts/animal',
  },
  {
    id: 'solar',
    title: 'Green City Builder',
    desc: 'Place solar panels, wind turbines, and trees to power a city with clean energy.',
    icon: 'fa-solid fa-solar-panel',
    color: '#14b8a6',
    bg: 'linear-gradient(135deg, #001414 0%, #0a2020 100%)',
    photo: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=300&fit=crop&auto=format',
    border: 'rgba(20,184,166,0.25)',
    world: 'City',
    difficulty: 'Hard',
    time: '120s',
    points: 'Up to 300 pts',
  },
];

export default function EcoWorld() {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState(null);

  const handleScore = async (pts) => {
    if (pts > 0) {
      try {
        toast.success(`+${pts} eco points earned!`);
      } catch {}
    }
  };

  return (
    <PageTransition>
      <div className="page-container">
        {/* Hero */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #22c55e, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-earth-americas" style={{ color: '#fff', fontSize: '1rem' }} />
            </div>
            <h1 style={{ fontFamily: 'Sora, Inter, sans-serif', fontSize: '1.5rem', fontWeight: 700 }}>Eco World Games</h1>
          </div>
          <p style={{ color: '#475569', fontSize: '0.875rem', maxWidth: 560 }}>
            Play nature-themed games to earn eco points. Each game teaches real sustainability concepts through interactive gameplay.
          </p>
        </div>

        {/* Game cards */}
        <div className="grid-2">
          {GAMES.map((game, i) => (
            <motion.div key={game.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.015, y: -3 }}
              style={{ background: game.bg, border: `1px solid ${game.border}`, borderRadius: 18, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setActiveGame(game.id)}
            >
              {/* Card top */}
              <div style={{ padding: '1.5rem 1.5rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${game.color}18`, border: `1px solid ${game.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={game.icon} style={{ fontSize: '1.4rem', color: game.color }} />
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, color: game.color, background: `${game.color}15`, border: `1px solid ${game.color}25` }}>
                    {game.difficulty}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Sora, Inter, sans-serif', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', color: '#f1f5f9' }}>{game.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55 }}>{game.desc}</p>
              </div>

              {/* Card footer */}
              <div style={{ padding: '0.875rem 1.5rem', borderTop: `1px solid ${game.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <i className="fa-solid fa-clock" style={{ color: game.color, fontSize: '0.65rem' }} /> {game.time}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <i className="fa-solid fa-bolt" style={{ color: '#f59e0b', fontSize: '0.65rem' }} /> {game.points}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <i className="fa-solid fa-earth-americas" style={{ color: game.color, fontSize: '0.65rem' }} /> {game.world}
                  </span>
                </div>
                <motion.div whileHover={{ x: 3 }} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: game.color }}>
                  Play <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.7rem' }} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lessons shortcut */}
        <div style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', background: '#111827', border: '1px solid #1e2d42', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Want to learn more?</div>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>Explore structured lessons on climate, biodiversity, and renewable energy.</div>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} className="btn btn-primary" onClick={() => navigate('/lessons')}>
            <i className="fa-solid fa-book-open" /> Browse Lessons
          </motion.button>
        </div>
      </div>

      {/* Game Modal */}
      <AnimatePresence>
        {activeGame && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1rem', backdropFilter: 'blur(6px)' }}
            onClick={e => e.target === e.currentTarget && setActiveGame(null)}>
            <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
              style={{ width: '100%', maxWidth: 740, position: 'relative' }}>
              {activeGame === 'tree'     && <TreePlanter    onClose={() => setActiveGame(null)} onScore={handleScore} />}
              {activeGame === 'ocean'    && <OceanCleanup   onClose={() => setActiveGame(null)} onScore={handleScore} />}
              {activeGame === 'wildlife' && <WildlifeSorter onClose={() => setActiveGame(null)} onScore={handleScore} />}
              {activeGame === 'solar'    && <SolarBuilder   onClose={() => setActiveGame(null)} onScore={handleScore} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

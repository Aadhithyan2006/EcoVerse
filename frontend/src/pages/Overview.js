import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: 'fa-solid fa-earth-americas', color: '#22c55e', title: 'Eco Worlds', desc: 'Explore Forest, Ocean, and City worlds with interactive 3D maps, mini-games, and real eco challenges.' },
  { icon: 'fa-solid fa-gamepad',        color: '#3b82f6', title: 'Gamified Learning', desc: 'Earn eco points, unlock badges, and level up from Seedling to Eco Legend through lessons and quizzes.' },
  { icon: 'fa-solid fa-leaf',           color: '#14b8a6', title: 'Real Challenges', desc: 'Submit real-world eco actions — plant trees, do beach cleanups, switch to reusables — and get verified.' },
  { icon: 'fa-solid fa-trophy',         color: '#fbbf24', title: 'Global Leaderboard', desc: 'Compete with students worldwide. Climb the ranks and earn exclusive certificates and achievements.' },
  { icon: 'fa-solid fa-wand-magic-sparkles', color: '#a78bfa', title: 'TerraNova AI', desc: 'Your personal AI sustainability guide. Ask anything about climate, oceans, forests, or renewable energy.' },
  { icon: 'fa-solid fa-users',          color: '#f97316', title: 'Community', desc: 'Follow friends, send invites, track streaks together, and build your eco network.' },
];

const WORLDS = [
  { icon: 'fa-solid fa-tree',  color: '#22c55e', name: 'Forest World',  desc: 'Biodiversity, deforestation, wildlife conservation' },
  { icon: 'fa-solid fa-water', color: '#3b82f6', name: 'Ocean World',   desc: 'Marine ecosystems, plastic pollution, coral reefs' },
  { icon: 'fa-solid fa-city',  color: '#fbbf24', name: 'City World',    desc: 'Renewable energy, urban sustainability, green tech' },
];

export default function Overview() {
  return (
    <div style={{ background: 'var(--bg-root)', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 70%)', top: -200, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '0.35rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#4ade80', marginBottom: '1.5rem' }}>
            <i className="fa-solid fa-seedling" /> Gamified Sustainability Learning
          </div>
          <h1 style={{ fontFamily: 'Sora,Inter,sans-serif', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 800, color: '#e8f5e9', marginBottom: '1rem', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
            Learn sustainability.<br />
            <span style={{ color: '#4ade80', textShadow: '0 0 40px rgba(74,222,128,0.3)' }}>Play. Earn. Impact.</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#a5d6a7', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.7 }}>
            EcoVerse is an immersive gamified platform where students explore eco-worlds, complete real-world challenges, earn badges, and compete globally — all while learning about climate, biodiversity, and renewable energy.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard">
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(34,197,94,0.4)' }} whileTap={{ scale: 0.97 }}
                style={{ padding: '0.75rem 1.75rem', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#22c55e,#14b8a6)', color: '#fff', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-gauge-high" /> Go to Dashboard
              </motion.button>
            </Link>
            <Link to="/eco-world">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ padding: '0.75rem 1.75rem', borderRadius: 12, border: '1px solid rgba(34,197,94,0.25)', cursor: 'pointer', background: 'rgba(34,197,94,0.06)', color: '#4ade80', fontSize: '0.95rem', fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-earth-americas" /> Explore Eco World
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.25rem 3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Sora,Inter,sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#e8f5e9', marginBottom: '0.5rem' }}>Everything you need to learn sustainability</h2>
          <p style={{ color: '#4a7c59', fontSize: '0.875rem' }}>Six powerful features designed for the next generation of eco-leaders</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1rem' }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.015, borderColor: `${f.color}30` }}
              style={{ background: 'var(--bg-card)', border: '1px solid rgba(34,197,94,0.08)', borderRadius: 16, padding: '1.25rem', transition: 'all 0.2s' }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: `${f.color}12`, border: `1px solid ${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
                <i className={f.icon} style={{ fontSize: '1rem', color: f.color }} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e8f5e9', marginBottom: '0.4rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#4a7c59', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Worlds */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.25rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Sora,Inter,sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#e8f5e9', marginBottom: '0.5rem' }}>Three immersive eco-worlds</h2>
          <p style={{ color: '#4a7c59', fontSize: '0.875rem' }}>Each world has unique lessons, quizzes, challenges, and mini-games</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>
          {WORLDS.map((w, i) => (
            <Link key={i} to="/eco-world" style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ scale: 1.02, y: -3 }}
                style={{ background: `linear-gradient(135deg,${w.color}08,${w.color}04)`, border: `1px solid ${w.color}20`, borderRadius: 18, padding: '1.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${w.color}15`, border: `1px solid ${w.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <i className={w.icon} style={{ fontSize: '1.3rem', color: w.color }} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e8f5e9', marginBottom: '0.4rem' }}>{w.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#4a7c59', lineHeight: 1.6 }}>{w.desc}</p>
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: w.color }}>
                  Explore <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.65rem' }} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '3rem 1.25rem 5rem' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.06),rgba(20,184,166,0.04))', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 20, padding: '3rem 2rem', maxWidth: 600, margin: '0 auto' }}>
          <i className="fa-solid fa-seedling" style={{ fontSize: '2rem', color: '#22c55e', marginBottom: '1rem', display: 'block' }} />
          <h2 style={{ fontFamily: 'Sora,Inter,sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#e8f5e9', marginBottom: '0.75rem' }}>Ready to start your eco journey?</h2>
          <p style={{ color: '#4a7c59', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Join thousands of students making a real difference.</p>
          <Link to="/dashboard">
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(34,197,94,0.4)' }} whileTap={{ scale: 0.97 }}
              style={{ padding: '0.75rem 2rem', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#22c55e,#14b8a6)', color: '#fff', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>
              Get Started Free
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}

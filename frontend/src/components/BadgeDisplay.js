import React from 'react';
import { motion } from 'framer-motion';

const META = {
  'Eco Starter':    { icon: 'fa-solid fa-seedling',       color: '#22c55e' },
  'Green Guardian': { icon: 'fa-solid fa-shield-halved',  color: '#14b8a6' },
  'Earth Champion': { icon: 'fa-solid fa-earth-americas', color: '#3b82f6' },
  'Eco Legend':     { icon: 'fa-solid fa-trophy',         color: '#fbbf24' },
};

export default function BadgeDisplay({ badges = [] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
      {badges.map((badge, i) => {
        const m = META[badge.name] || { icon: 'fa-solid fa-star', color: '#fbbf24' };
        return (
          <motion.div key={i} whileHover={{ scale: 1.1, y: -2 }} title={badge.name}
            style={{ width: 48, height: 48, borderRadius: 12, background: `${m.color}10`, border: `1px solid ${m.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}>
            <i className={m.icon} style={{ fontSize: '1.1rem', color: m.color }} />
          </motion.div>
        );
      })}
      {badges.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No badges yet. Complete lessons to earn them.</p>}
    </div>
  );
}

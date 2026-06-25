import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchProfile } from '../store/slices/authSlice';
import PageTransition from '../components/PageTransition';
import BadgeDisplay from '../components/BadgeDisplay';
import EcoScoreRing from '../components/EcoScoreRing';
import api from '../utils/api';

const ACHIEVEMENTS = [
  { title: 'First Lesson',   desc: 'Completed your first lesson',   icon: 'fa-solid fa-book-open',      color: '#22c55e', check: u => (u.completedLessons||[]).length > 0 },
  { title: 'Quiz Master',    desc: 'Scored 100% on a quiz',         icon: 'fa-solid fa-star',            color: '#fbbf24', check: u => (u.ecoScore||0) >= 20 },
  { title: 'Eco Challenger', desc: 'Submitted first challenge',     icon: 'fa-solid fa-leaf',            color: '#14b8a6', check: u => (u.ecoTasks||[]).length > 0 },
  { title: 'Streak Keeper',  desc: 'Maintained a 7-day streak',     icon: 'fa-solid fa-fire',            color: '#f97316', check: u => (u.streak?.current||0) >= 7 },
  { title: 'World Explorer', desc: 'Visited all 3 eco-worlds',      icon: 'fa-solid fa-earth-americas',  color: '#3b82f6', check: u => (u.unlockedWorlds||[]).length >= 3 },
  { title: 'Top Scorer',     desc: 'Earned 500+ eco points',        icon: 'fa-solid fa-trophy',          color: '#a78bfa', check: u => (u.ecoScore||0) >= 500 },
];

function profileStrength(user) {
  let s = 0;
  if (user.name) s += 20;
  if (user.bio) s += 20;
  if (user.grade) s += 15;
  if (user.age) s += 10;
  if ((user.badges||[]).length > 0) s += 20;
  if ((user.completedLessons||[]).length > 0) s += 15;
  return Math.min(s, 100);
}

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);
  const fileRef = useRef();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ name: '', bio: '', grade: '', age: '' });
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState(null); // 'followers' | 'following' | null

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', bio: user.bio || '', grade: user.grade || '', age: user.age || '' });
      // Accept both http URLs and base64 data URLs
      const av = user.avatar;
      setPreview(av && (av.startsWith('http') || av.startsWith('data:')) ? av : null);
    }
  }, [user]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      setUploading(true);
      try {
        await api.post('/user/avatar', { avatar: dataUrl });
        dispatch(fetchProfile());
        toast.success('Profile photo updated!');
      } catch { toast.error('Upload failed'); }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/user/profile', form);
      dispatch(fetchProfile());
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  if (!user) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>;

  const strength = profileStrength(user);
  const levelLabel = user.ecoScore < 100 ? 'Seedling' : user.ecoScore < 500 ? 'Sprout' : user.ecoScore < 1000 ? 'Guardian' : 'Eco Legend';
  const levelColor = user.ecoScore < 100 ? '#22c55e' : user.ecoScore < 500 ? '#14b8a6' : user.ecoScore < 1000 ? '#3b82f6' : '#fbbf24';
  const inp = { width: '100%', background: 'var(--bg-input)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10, padding: '0.6rem 0.875rem', fontSize: '0.875rem', color: '#e8f5e9', outline: 'none', fontFamily: 'Inter,sans-serif', boxSizing: 'border-box' };

  return (
    <>
    <PageTransition>
      <div className="page-container" style={{ maxWidth: 1000 }}>

        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg,#071009,#0a1509)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 20, padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.75rem', flexWrap: 'wrap' }}>

          {/* Avatar with upload */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 88, height: 88, borderRadius: 22, overflow: 'hidden', border: '2px solid rgba(34,197,94,0.3)', background: 'linear-gradient(135deg,#0f2d14,#071009)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {preview ? (
                <img src={preview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#4ade80', fontFamily: 'Sora,sans-serif' }}>{user.name?.charAt(0).toUpperCase()}</span>
              )}
              {uploading && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ color: '#22c55e', fontSize: '1.2rem' }} />
                </div>
              )}
            </div>
            {/* Upload button */}
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => fileRef.current.click()}
              title="Upload photo"
              style={{ position: 'absolute', bottom: -6, right: -6, width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#14b8a6)', border: '2px solid #071009', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <i className="fa-solid fa-camera" style={{ color: '#fff', fontSize: '0.65rem' }} />
            </motion.button>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            {!editing ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.4rem', color: '#e8f5e9' }}>{user.name}</h1>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, color: levelColor, background: `${levelColor}12`, border: `1px solid ${levelColor}25` }}>
                    <i className="fa-solid fa-seedling" style={{ fontSize: '0.6rem' }} />{levelLabel}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#4a7c59', marginBottom: '0.75rem', maxWidth: 420, lineHeight: 1.6 }}>
                  {user.bio || <span style={{ fontStyle: 'italic', color: '#2d5a3d' }}>No bio yet — click Edit Profile to add one.</span>}
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem', color: '#4a7c59' }}>
                  {user.grade && <span><i className="fa-solid fa-graduation-cap" style={{ marginRight: 4 }} />{user.grade}</span>}
                  {user.age && <span><i className="fa-solid fa-calendar" style={{ marginRight: 4 }} />Age {user.age}</span>}
                  <span><i className="fa-solid fa-envelope" style={{ marginRight: 4 }} />{user.email}</span>
                </div>
              </>
            ) : (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 440 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#4a7c59', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#4a7c59', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade</label>
                    <input value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} placeholder="e.g. Grade 9" style={inp} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#4a7c59', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bio</label>
                  <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell the eco community about yourself..." rows={2} style={{ ...inp, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#4a7c59', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Age</label>
                  <input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Your age" style={{ ...inp, width: 120 }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" disabled={saving} style={{ padding: '0.5rem 1.25rem', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#22c55e,#14b8a6)', color: '#fff', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} style={{ padding: '0.5rem 1rem', borderRadius: 10, border: '1px solid rgba(34,197,94,0.15)', cursor: 'pointer', background: 'transparent', color: '#4a7c59', fontSize: '0.82rem', fontFamily: 'Inter,sans-serif' }}>Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Right: score + edit button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <EcoScoreRing score={user.ecoScore || 0} max={1000} size={90} />
            {!editing && (
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => setEditing(true)}
                style={{ padding: '0.45rem 1rem', borderRadius: 10, border: '1px solid rgba(34,197,94,0.2)', cursor: 'pointer', background: 'rgba(34,197,94,0.06)', color: '#4ade80', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <i className="fa-solid fa-pen" style={{ fontSize: '0.65rem' }} />Edit Profile
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
          {[
            { icon: 'fa-solid fa-fire',        color: '#f97316', val: user.streak?.current || 0,           label: 'Day Streak' },
            { icon: 'fa-solid fa-coins',        color: '#22c55e', val: user.ecoCoins || 0,                  label: 'Eco Coins' },
            { icon: 'fa-solid fa-book-open',    color: '#3b82f6', val: (user.completedLessons||[]).length,  label: 'Lessons Done' },
            { icon: 'fa-solid fa-medal',        color: '#fbbf24', val: (user.badges||[]).length,            label: 'Badges' },
            { icon: 'fa-solid fa-user-plus',    color: '#14b8a6', val: (user.followers||[]).length,         label: 'Followers',    onClick: () => setModal('followers') },
            { icon: 'fa-solid fa-user-check',   color: '#a78bfa', val: (user.following||[]).length,         label: 'Following',    onClick: () => setModal('following') },
          ].map((s, i) => (
            <div key={i} className="stat-card" onClick={s.onClick} style={{ cursor: s.onClick ? 'pointer' : 'default', transition: 'border-color 0.2s' }}
              onMouseEnter={e => { if (s.onClick) e.currentTarget.style.borderColor = `${s.color}40`; }}
              onMouseLeave={e => { if (s.onClick) e.currentTarget.style.borderColor = 'rgba(34,197,94,0.08)'; }}>
              <div className="stat-icon" style={{ background: `${s.color}12`, border: `1px solid ${s.color}20` }}>
                <i className={s.icon} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#e8f5e9', fontFamily: 'Sora,sans-serif', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '0.68rem', color: '#4a7c59', marginTop: 2 }}>
                  {s.label}{s.onClick && <i className="fa-solid fa-chevron-right" style={{ marginLeft: 4, fontSize: '0.55rem', opacity: 0.5 }} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Profile Strength */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <i className="fa-solid fa-chart-line" style={{ color: '#22c55e', fontSize: '0.85rem' }} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#e8f5e9' }}>Profile Strength</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.82rem', fontWeight: 700, color: strength >= 80 ? '#22c55e' : strength >= 50 ? '#fbbf24' : '#f87171' }}>{strength}%</span>
              </div>
              <div className="progress-bar" style={{ height: 8, marginBottom: '0.875rem' }}>
                <div className="progress-fill" style={{ width: `${strength}%`, background: strength >= 80 ? 'linear-gradient(90deg,#22c55e,#14b8a6)' : strength >= 50 ? 'linear-gradient(90deg,#fbbf24,#f97316)' : 'linear-gradient(90deg,#f87171,#ef4444)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { label: 'Name added',             done: !!user.name },
                  { label: 'Profile photo uploaded',  done: !!(user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:'))) },
                  { label: 'Bio written',             done: !!user.bio },
                  { label: 'Grade set',               done: !!user.grade },
                  { label: 'First badge earned',      done: (user.badges||[]).length > 0 },
                  { label: 'First lesson completed',  done: (user.completedLessons||[]).length > 0 },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: item.done ? '#4ade80' : '#4a7c59' }}>
                    <i className={item.done ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'} style={{ fontSize: '0.75rem', color: item.done ? '#22c55e' : '#2d5a3d' }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Friend Invites + Share Link */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <i className="fa-solid fa-user-plus" style={{ color: '#14b8a6', fontSize: '0.85rem' }} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#e8f5e9' }}>Friend Invites</span>
                {(user.friendInvites||[]).filter(x => x.status === 'pending').length > 0 && (
                  <span style={{ marginLeft: 'auto', background: '#22c55e', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>
                    {(user.friendInvites||[]).filter(x => x.status === 'pending').length}
                  </span>
                )}
              </div>

              {/* Shareable invite link */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4a7c59', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Invite Link</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 9, padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#4a7c59', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {`${window.location.origin}/join?ref=${user._id}`}
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/join?ref=${user._id}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    style={{ padding: '0.5rem 0.875rem', borderRadius: 9, border: '1px solid rgba(34,197,94,0.25)', background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.06)', color: copied ? '#4ade80' : '#22c55e', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                    <i className={copied ? 'fa-solid fa-check' : 'fa-solid fa-copy'} style={{ fontSize: '0.65rem' }} />
                    {copied ? 'Copied!' : 'Copy'}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: 'Join me on EcoVerse!', text: `${user.name} invited you to join EcoVerse — a gamified sustainability learning platform!`, url: `${window.location.origin}/join?ref=${user._id}` });
                      } else {
                        navigator.clipboard.writeText(`${window.location.origin}/join?ref=${user._id}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    style={{ padding: '0.5rem 0.875rem', borderRadius: 9, border: '1px solid rgba(20,184,166,0.25)', background: 'rgba(20,184,166,0.06)', color: '#2dd4bf', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
                    <i className="fa-solid fa-share-nodes" style={{ fontSize: '0.65rem' }} />Share
                  </motion.button>
                </div>
              </div>

              {/* Pending invites list */}
              {(user.friendInvites||[]).length === 0 ? (
                <p style={{ fontSize: '0.78rem', color: '#2d5a3d', lineHeight: 1.5 }}>No pending invites yet. Share your link above to invite eco friends!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(user.friendInvites||[]).slice(0, 4).map((inv, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: 'var(--bg-input)', borderRadius: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#4ade80' }}>
                        {inv.from?.name?.charAt(0) || '?'}
                      </div>
                      <span style={{ flex: 1, fontSize: '0.8rem', color: '#a5d6a7' }}>{inv.from?.name || 'Unknown'}</span>
                      <span style={{ fontSize: '0.68rem', color: '#4a7c59', textTransform: 'capitalize', padding: '2px 8px', borderRadius: 20, background: inv.status === 'pending' ? 'rgba(34,197,94,0.08)' : 'transparent', border: inv.status === 'pending' ? '1px solid rgba(34,197,94,0.2)' : 'none' }}>{inv.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Badges */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <i className="fa-solid fa-medal" style={{ color: '#fbbf24', fontSize: '0.85rem' }} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#e8f5e9' }}>Badges</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#4a7c59' }}>{(user.badges||[]).length} earned</span>
              </div>
              <BadgeDisplay badges={user.badges || []} />
            </div>

            {/* Achievements */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <i className="fa-solid fa-star" style={{ color: '#fbbf24', fontSize: '0.85rem' }} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#e8f5e9' }}>Achievements</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#4a7c59' }}>{ACHIEVEMENTS.filter(a => a.check(user)).length}/{ACHIEVEMENTS.length}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {ACHIEVEMENTS.map((a, i) => {
                  const earned = a.check(user);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', background: earned ? `${a.color}08` : 'var(--bg-input)', border: `1px solid ${earned ? a.color + '20' : 'rgba(34,197,94,0.05)'}`, borderRadius: 10, opacity: earned ? 1 : 0.4, transition: 'all 0.2s' }}>
                      <i className={a.icon} style={{ fontSize: '0.85rem', color: earned ? a.color : '#2d5a3d', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: earned ? '#e8f5e9' : '#2d5a3d', lineHeight: 1.2 }}>{a.title}</div>
                        <div style={{ fontSize: '0.62rem', color: '#2d5a3d', lineHeight: 1.3 }}>{a.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>

    {/* Followers / Following Modal */}
    {modal && (
      <div onClick={() => setModal(null)}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400, padding: '1rem', backdropFilter: 'blur(4px)' }}>
        <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          style={{ background: '#071009', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 20, padding: '1.5rem', width: '100%', maxWidth: 420, maxHeight: '70vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e8f5e9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className={modal === 'followers' ? 'fa-solid fa-user-plus' : 'fa-solid fa-user-check'} style={{ color: modal === 'followers' ? '#14b8a6' : '#a78bfa', fontSize: '0.85rem' }} />
              {modal === 'followers' ? 'Followers' : 'Following'}
              <span style={{ fontSize: '0.75rem', color: '#4a7c59', fontWeight: 400 }}>
                ({modal === 'followers' ? (user.followers||[]).length : (user.following||[]).length})
              </span>
            </h3>
            <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#4a7c59', cursor: 'pointer', fontSize: '1rem' }}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(modal === 'followers' ? (user.followers||[]) : (user.following||[])).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#2d5a3d' }}>
                <i className="fa-solid fa-users" style={{ fontSize: '2rem', marginBottom: '0.75rem', display: 'block', opacity: 0.3 }} />
                <p style={{ fontSize: '0.85rem' }}>
                  {modal === 'followers' ? 'No followers yet. Share your invite link!' : 'Not following anyone yet.'}
                </p>
              </div>
            ) : (
              (modal === 'followers' ? (user.followers||[]) : (user.following||[])).map((u, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.625rem 0.75rem', background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.08)', borderRadius: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(34,197,94,0.2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f2d14,#071009)' }}>
                    {u.avatar && (u.avatar.startsWith('http') || u.avatar.startsWith('data:')) ? (
                      <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4ade80', fontFamily: 'Sora,sans-serif' }}>{u.name?.charAt(0)?.toUpperCase() || '?'}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e8f5e9' }}>{u.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.7rem', color: '#4a7c59' }}>
                      <i className="fa-solid fa-bolt" style={{ marginRight: 3, fontSize: '0.6rem', color: '#22c55e' }} />{u.ecoScore || 0} pts
                    </div>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#4a7c59', padding: '2px 8px', borderRadius: 20, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}>
                    {u.ecoScore < 100 ? 'Seedling' : u.ecoScore < 500 ? 'Sprout' : 'Guardian'}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    )}
    </>
  );
}

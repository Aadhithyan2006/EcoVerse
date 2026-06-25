import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { login, register, clearError } from '../store/slices/authSlice';


const WORLDS = [
  { icon: '', label: 'Forest World', sub: 'Biodiversity & Trees', color: '#22c55e', locked: false },
  { icon: '', label: 'Ocean World', sub: 'Marine Ecosystems', color: '#3b82f6', locked: false },
  { icon: '', label: 'Energy World', sub: 'Renewable Sources', color: '#f59e0b', locked: false },
];

const FEATURES = [
  { icon: '', title: 'Gamified Learning', desc: 'Earn eco points, unlock worlds, and level up as you complete lessons and real-world challenges.' },
  { icon: '', title: 'TerraNova AI', desc: 'Your personal AI sustainability guide — ask anything about climate, oceans, forests, or renewable energy.' },
  { icon: '', title: 'Global Leaderboard', desc: 'Compete with students worldwide. Climb the ranks and earn exclusive badges and certificates.' },
  { icon: '', title: '3 Eco Worlds', desc: 'Explore Forest, Ocean, and City worlds with interactive 3D maps and mini-games.' },
];

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector(s => s.auth);
  const [tab, setTab] = useState('signin');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', grade: '' });
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [googleMsg, setGoogleMsg] = React.useState('');

  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      setGoogleError(true);
      setTimeout(() => setGoogleError(false), 4000);
      return;
    }
    setGoogleLoading(true);
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + clientId + '&redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/google/callback') + '&response_type=token&scope=email%20profile';
  };

  useEffect(() => { if (token) navigate('/dashboard'); }, [token, navigate]);
  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'signin') dispatch(login({ email: form.email, password: form.password }));
    else dispatch(register(form));
  };

  const inp = {
    width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '0.7rem 1rem', fontSize: '0.9rem', color: '#f0fdf4',
    outline: 'none', fontFamily: 'Inter,sans-serif', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg,#020c06 0%,#041a0c 30%,#061f10 60%,#030e07 100%)', fontFamily: "'Inter',sans-serif", position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,197,94,0.12) 0%,transparent 70%)', top: -100, left: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(20,184,166,0.08) 0%,transparent 70%)', bottom: -80, left: '30%', pointerEvents: 'none' }} />

      {/* LEFT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 3rem 3rem 4rem', position: 'relative', zIndex: 1, overflowY: 'auto' }}>

        {/* Hero heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, lineHeight: 1.2, color: '#f0fdf4', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Your sustainable{' '}
            <span style={{ color: '#4ade80', textShadow: '0 0 30px rgba(74,222,128,0.4)' }}>adventure</span>
            {' '}starts here.
          </h1>
        </motion.div>

        {/* Project description */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p style={{ fontSize: '0.95rem', color: '#86efac', lineHeight: 1.7, maxWidth: 480, marginBottom: '1.75rem', opacity: 0.9 }}>
            <strong style={{ color: '#4ade80' }}>EcoVerse</strong> is a gamified sustainability learning platform where students explore
            interactive eco-worlds, complete real-world challenges, earn badges, and compete on a global leaderboard —
            all while learning about climate change, biodiversity, and renewable energy.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem', maxWidth: 520 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 14, padding: '0.875rem' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{f.icon}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f0fdf4', marginBottom: '0.25rem' }}>{f.title}</div>
              <div style={{ fontSize: '0.72rem', color: '#86efac', opacity: 0.75, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* World cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          {WORLDS.map((w, i) => (
            <div key={i} style={{ flex: '1 1 130px', minWidth: 120, borderRadius: 16, background: w.locked ? 'rgba(255,255,255,0.03)' : `linear-gradient(135deg,${w.color}18,${w.color}08)`, border: `1px solid ${w.locked ? 'rgba(255,255,255,0.06)' : w.color+'30'}`, padding: '0.875rem', position: 'relative', opacity: w.locked ? 0.5 : 1 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{w.icon}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f0fdf4', marginBottom: '0.15rem' }}>{w.label}</div>
              <div style={{ fontSize: '0.68rem', color: '#86efac', opacity: 0.7 }}>{w.sub}</div>
              {w.locked && <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '2px 6px', fontSize: '0.6rem', color: '#94a3b8' }}> Locked</div>}
            </div>
          ))}
        </motion.div>

        {/* Stats — shown only after login, so show placeholder text here */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 14, maxWidth: 520 }}>
            <span style={{ fontSize: '1.2rem' }}></span>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4ade80', marginBottom: '0.15rem' }}>Your stats appear after login</div>
              <div style={{ fontSize: '0.72rem', color: '#86efac', opacity: 0.75 }}>Eco Score  Global Rank  Day Streak — all tracked and updated in real time on your dashboard.</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT */}
      <div style={{ width: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 3rem 2rem 2rem', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2rem', boxShadow: '0 8px 64px rgba(0,0,0,0.5)' }}>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0fdf4', marginBottom: '0.25rem' }}>Welcome back, Explorer</h2>
            <p style={{ fontSize: '0.82rem', color: '#86efac', opacity: 0.8 }}>Sign in to continue your sustainability adventure.</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
            {['signin','signup'].map(t => (
              <button key={t} onClick={() => { setTab(t); dispatch(clearError()); }}
                style={{ flex: 1, padding: '0.6rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: tab===t ? '#4ade80' : '#4b7a5a', borderBottom: tab===t ? '2px solid #4ade80' : '2px solid transparent', marginBottom: -1, transition: 'all 0.2s' }}>
                {t === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.65rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.82rem' }}>
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#86efac', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your full name" required style={inp}
                  onFocus={e=>{e.target.style.borderColor='#22c55e';e.target.style.boxShadow='0 0 0 3px rgba(34,197,94,0.15)'}}
                  onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.1)';e.target.style.boxShadow='none'}} />
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#86efac', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@school.edu" required style={inp}
                onFocus={e=>{e.target.style.borderColor='#22c55e';e.target.style.boxShadow='0 0 0 3px rgba(34,197,94,0.15)'}}
                onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.1)';e.target.style.boxShadow='none'}} />
            </div>

            <div style={{ marginBottom: tab==='signin' ? '0.5rem' : '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#86efac', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw?'text':'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Your password" required minLength={6}
                  style={{...inp, paddingRight:'2.5rem'}}
                  onFocus={e=>{e.target.style.borderColor='#22c55e';e.target.style.boxShadow='0 0 0 3px rgba(34,197,94,0.15)'}}
                  onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.1)';e.target.style.boxShadow='none'}} />
                <button type="button" onClick={()=>setShowPw(p=>!p)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#86efac', fontSize:'0.85rem' }}>
                  {showPw?'':''}
                </button>
              </div>
            </div>

            {tab==='signin' && (
              <div style={{ textAlign:'right', marginBottom:'1.25rem' }}>
                <span style={{ fontSize:'0.78rem', color:'#4ade80', cursor:'pointer' }}>Forgot password?</span>
              </div>
            )}

            {tab==='signup' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1rem' }}>
                <div>
                  <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#86efac', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Age</label>
                  <input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="e.g. 14" style={inp}
                    onFocus={e=>{e.target.style.borderColor='#22c55e'}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.1)'}} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#86efac', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Grade</label>
                  <input value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})} placeholder="e.g. Grade 9" style={inp}
                    onFocus={e=>{e.target.style.borderColor='#22c55e'}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.1)'}} />
                </div>
              </div>
            )}

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale:1.02, boxShadow:'0 8px 32px rgba(34,197,94,0.5)' }} whileTap={{ scale:0.98 }}
              style={{ width:'100%', padding:'0.85rem', borderRadius:14, border:'none', cursor:loading?'default':'pointer', background:'linear-gradient(135deg,#22c55e 0%,#16a34a 50%,#14b8a6 100%)', color:'#fff', fontSize:'0.95rem', fontWeight:700, boxShadow:'0 4px 24px rgba(34,197,94,0.35)', marginBottom:'1rem' }}>
              {loading ? ' Please wait...' : tab==='signin' ? 'Sign In to EcoVerse ' : ' Create My Account'}
            </motion.button>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', margin:'0.5rem 0 0.875rem', color:'#4b7a5a', fontSize:'0.75rem' }}>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
            or continue with
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
          </div>

          <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1rem' }}>
            <button onClick={handleGoogleLogin} disabled={googleLoading} style={{ flex:1, padding:'0.65rem', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'#f0fdf4', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', opacity: googleLoading ? 0.7 : 1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              {googleLoading ? 'Signing in...' : 'Google'}
            </button>
            <button onClick={() => alert('Apple Sign-In requires an Apple Developer account. Please use email/password or Google.')} style={{ flex:1, padding:'0.65rem', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'#f0fdf4', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Apple
            </button>
          </div>

          {googleMsg && (
            <div style={{ fontSize:'0.72rem', color:'#86efac', textAlign:'center', marginBottom:'0.5rem', padding:'0.4rem', background:'rgba(34,197,94,0.06)', borderRadius:8, border:'1px solid rgba(34,197,94,0.15)' }}>
              {googleMsg}
            </div>
          )}
          <p style={{ textAlign:'center', fontSize:'0.8rem', color:'#4b7a5a', marginBottom:'1rem' }}>
            New to EcoVerse?{' '}
            <span onClick={()=>setTab('signup')} style={{ color:'#4ade80', fontWeight:700, cursor:'pointer' }}>Create a free account</span>
          </p>

          <div style={{ display:'flex', gap:'0.5rem' }}>
            {[{icon:'',label:'Secure & Private',sub:'Encrypted'},{icon:'',label:'Always Free',sub:'No credit card'},{icon:'',label:'48K+ Students',sub:'Worldwide'}].map((f,i)=>(
              <div key={i} style={{ flex:1, background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'0.6rem 0.5rem', textAlign:'center' }}>
                <div style={{ fontSize:'1rem', marginBottom:'0.2rem' }}>{f.icon}</div>
                <div style={{ fontSize:'0.65rem', fontWeight:700, color:'#4ade80' }}>{f.label}</div>
                <div style={{ fontSize:'0.6rem', color:'#86efac', opacity:0.6 }}>{f.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}






import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const W=720, H=440;
const TRASH_TYPES=['bottle','bag','can','net','tire'];
const TRASH_COLORS={bottle:'#a8d8a8',bag:'#f0e68c',can:'#cd853f',net:'#deb887',tire:'#555'};

function spawnTrash(count){
  return Array.from({length:count},(_,i)=>({
    id:i,x:60+Math.random()*(W-120),y:60+Math.random()*(H-120),
    type:TRASH_TYPES[Math.floor(Math.random()*TRASH_TYPES.length)],
    vx:(Math.random()-0.5)*0.8,vy:(Math.random()-0.5)*0.8,
    r:10+Math.random()*8,collected:false,bobPhase:Math.random()*Math.PI*2,
  }));
}

function spawnJellyfish(count){
  return Array.from({length:count},(_,i)=>({
    id:i,x:100+Math.random()*(W-200),y:80+Math.random()*(H-160),
    vx:(Math.random()-0.5)*0.9,vy:(Math.random()-0.5)*0.9,
    phase:Math.random()*Math.PI*2,r:22,
  }));
}

function drawWater(ctx,t){
  const grad=ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,'#0a3d5c');
  grad.addColorStop(0.4,'#0d5a8a');
  grad.addColorStop(0.8,'#0a7ab5');
  grad.addColorStop(1,'#0891b2');
  ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
  // Caustic light patterns
  ctx.fillStyle='rgba(255,255,255,0.03)';
  for(let i=0;i<8;i++){
    const x=(i*120+t*15)%(W+100)-50;
    ctx.beginPath(); ctx.ellipse(x,H*0.25,12,H*0.55,-0.25,0,Math.PI*2); ctx.fill();
  }
  // Wave lines
  for(let row=0;row<10;row++){
    ctx.strokeStyle=`rgba(255,255,255,${0.04+row*0.008})`;
    ctx.lineWidth=1.2;
    ctx.beginPath();
    for(let x=0;x<=W;x+=3){
      const y=row*46+28+Math.sin((x/55)+t*0.7+row)*5+Math.sin((x/30)+t*1.1+row*0.5)*2.5;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  // Bubbles
  for(let i=0;i<6;i++){
    const bx=(i*130+t*8)%(W+60)-30;
    const by=H-(((t*20+i*80)%H));
    ctx.beginPath(); ctx.arc(bx,by,2+i%3,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1; ctx.stroke();
  }
}

function drawSeafloor(ctx){
  const sf=ctx.createLinearGradient(0,H-60,0,H);
  sf.addColorStop(0,'#1a5c3a'); sf.addColorStop(1,'#0d3a22');
  ctx.fillStyle=sf; ctx.fillRect(0,H-60,W,60);
  // Seaweed
  ctx.strokeStyle='#2d8a4e'; ctx.lineWidth=3;
  for(let x=30;x<W;x+=55){
    const h=20+Math.sin(x*0.2)*10;
    ctx.beginPath(); ctx.moveTo(x,H-60);
    ctx.quadraticCurveTo(x+8,H-60-h*0.5,x+4,H-60-h);
    ctx.stroke();
  }
  // Rocks
  [80,200,380,520,650].forEach(rx=>{
    const rg=ctx.createRadialGradient(rx-4,H-52,2,rx,H-48,18);
    rg.addColorStop(0,'#6a6a6a'); rg.addColorStop(1,'#3a3a3a');
    ctx.beginPath(); ctx.ellipse(rx,H-48,18,12,0,0,Math.PI*2);
    ctx.fillStyle=rg; ctx.fill();
  });
}

function drawTrash(ctx,item,t){
  if(item.collected)return;
  const bob=Math.sin(t*1.5+item.bobPhase)*2;
  ctx.save(); ctx.translate(item.x,item.y+bob);
  ctx.fillStyle=TRASH_COLORS[item.type]||'#aaa';
  if(item.type==='bottle'){
    ctx.beginPath(); ctx.rect(-5,-14,10,20); ctx.fill();
    ctx.fillStyle='#888'; ctx.fillRect(-3,-18,6,5);
    ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(-5,-5); ctx.lineTo(5,-5); ctx.stroke();
  } else if(item.type==='bag'){
    ctx.fillStyle='rgba(240,230,140,0.75)';
    ctx.beginPath(); ctx.ellipse(0,0,10,13,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(200,190,100,0.5)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(-4,-10); ctx.quadraticCurveTo(0,-18,4,-10); ctx.stroke();
  } else if(item.type==='can'){
    ctx.beginPath(); ctx.rect(-7,-11,14,22); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(-7,-4); ctx.lineTo(7,-4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-7,4); ctx.lineTo(7,4); ctx.stroke();
  } else if(item.type==='net'){
    ctx.strokeStyle='rgba(222,184,135,0.8)'; ctx.lineWidth=1.5;
    for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-12+i*8,-10);ctx.lineTo(-8+i*8,10);ctx.stroke();}
    for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-12,-6+i*8);ctx.lineTo(12,-6+i*8);ctx.stroke();}
  } else {
    ctx.beginPath(); ctx.arc(0,0,item.r,0,Math.PI*2);
    ctx.fillStyle='rgba(80,80,80,0.7)'; ctx.fill();
    ctx.beginPath(); ctx.arc(0,0,item.r*0.6,0,Math.PI*2);
    ctx.strokeStyle='rgba(60,60,60,0.8)'; ctx.lineWidth=3; ctx.stroke();
  }
  ctx.restore();
}

function drawJellyfish(ctx,jf,t){
  ctx.save(); ctx.translate(jf.x,jf.y);
  const pulse=Math.sin(t*2+jf.phase)*0.15+1;
  ctx.scale(pulse,pulse);
  const g=ctx.createRadialGradient(0,-5,2,0,0,jf.r);
  g.addColorStop(0,'rgba(255,80,200,0.9)'); g.addColorStop(0.6,'rgba(200,40,160,0.6)'); g.addColorStop(1,'rgba(150,20,120,0.2)');
  ctx.beginPath(); ctx.arc(0,0,jf.r,Math.PI,0); ctx.fillStyle=g; ctx.fill();
  // Tentacles
  ctx.strokeStyle='rgba(255,120,220,0.5)'; ctx.lineWidth=1.5;
  for(let i=-3;i<=3;i++){
    ctx.beginPath(); ctx.moveTo(i*5,jf.r*0.8);
    ctx.quadraticCurveTo(i*5+Math.sin(t*1.5+i)*6,jf.r+14,i*5,jf.r+24);
    ctx.stroke();
  }
  // Glow
  ctx.beginPath(); ctx.arc(0,0,jf.r+4,Math.PI,0);
  ctx.strokeStyle='rgba(255,100,220,0.15)'; ctx.lineWidth=4; ctx.stroke();
  ctx.restore();
}

function drawBoat(ctx,bx,by,dir){
  ctx.save(); ctx.translate(bx,by);
  if(dir<0) ctx.scale(-1,1);
  // Wake
  ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-20,8); ctx.quadraticCurveTo(-40,14,-60,10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-20,4); ctx.quadraticCurveTo(-35,8,-50,5); ctx.stroke();
  // Hull
  const hull=ctx.createLinearGradient(0,-14,0,14);
  hull.addColorStop(0,'#f0f0f0'); hull.addColorStop(1,'#a0a0a0');
  ctx.beginPath();
  ctx.moveTo(-26,-8); ctx.lineTo(26,-8); ctx.lineTo(22,14); ctx.lineTo(-22,14); ctx.closePath();
  ctx.fillStyle=hull; ctx.fill();
  ctx.strokeStyle='#888'; ctx.lineWidth=1.5; ctx.stroke();
  // Red stripe
  ctx.fillStyle='#e84040';
  ctx.beginPath(); ctx.rect(-26,-2,52,4); ctx.fill();
  // Cabin
  ctx.fillStyle='#4a90d9';
  ctx.beginPath(); ctx.rect(-10,-22,20,14); ctx.fill();
  ctx.fillStyle='#87ceeb';
  ctx.beginPath(); ctx.rect(-8,-20,6,6); ctx.fill();
  ctx.beginPath(); ctx.rect(2,-20,6,6); ctx.fill();
  // Mast
  ctx.strokeStyle='#8B4513'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(0,-22); ctx.lineTo(0,-36); ctx.stroke();
  ctx.fillStyle='#e84040';
  ctx.beginPath(); ctx.moveTo(0,-36); ctx.lineTo(12,-30); ctx.lineTo(0,-24); ctx.closePath(); ctx.fill();
  // Net arm
  ctx.strokeStyle='#8B4513'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(22,0); ctx.lineTo(36,8); ctx.stroke();
  ctx.restore();
}

export default function OceanCleanup({onClose,onScore}){
  const canvasRef=useRef();
  const state=useRef({
    boat:{x:W/2,y:H/2},
    trash:spawnTrash(14),
    jellyfish:spawnJellyfish(5),
    keys:{},score:0,lives:3,startTime:Date.now(),running:true,t:0,dir:1,
    hitCooldown:0,particles:[],
  });
  const animRef=useRef();
  const [ui,setUi]=useState({score:0,lives:3,timeLeft:60,collected:0});
  const [done,setDone]=useState(false);
  const [hitFlash,setHitFlash]=useState(false);

  useEffect(()=>{
    const onKey=(e)=>{state.current.keys[e.key]=e.type==='keydown';};
    window.addEventListener('keydown',onKey);
    window.addEventListener('keyup',onKey);
    return()=>{window.removeEventListener('keydown',onKey);window.removeEventListener('keyup',onKey);};
  },[]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    const ctx=canvas.getContext('2d');
    const loop=()=>{
      const s=state.current;
      if(!s.running)return;
      s.t+=0.016;
      const spd=3.8;
      const k=s.keys;
      if((k['ArrowLeft']||k['a']||k['A'])&&s.boat.x>30){s.boat.x-=spd;s.dir=-1;}
      if((k['ArrowRight']||k['d']||k['D'])&&s.boat.x<W-30){s.boat.x+=spd;s.dir=1;}
      if((k['ArrowUp']||k['w']||k['W'])&&s.boat.y>30){s.boat.y-=spd;}
      if((k['ArrowDown']||k['s']||k['S'])&&s.boat.y<H-70){s.boat.y+=spd;}
      // Move trash
      s.trash.forEach(t=>{
        if(t.collected)return;
        t.x+=t.vx; t.y+=t.vy;
        if(t.x<t.r||t.x>W-t.r)t.vx*=-1;
        if(t.y<t.r||t.y>H-80)t.vy*=-1;
        if(Math.hypot(t.x-s.boat.x,t.y-s.boat.y)<36+t.r-4){
          t.collected=true; s.score+=20;
          for(let i=0;i<8;i++){const a=Math.random()*Math.PI*2;s.particles.push({x:t.x,y:t.y,vx:Math.cos(a)*2,vy:Math.sin(a)*2-1,r:3,color:'#4ade80',life:1});}
        }
      });
      // Respawn collected trash
      const active=s.trash.filter(t=>!t.collected).length;
      if(active<6){
        const newT=spawnTrash(4);
        newT.forEach(t=>{t.id=Date.now()+Math.random();});
        s.trash=[...s.trash.filter(t=>!t.collected),...newT];
      }
      // Move jellyfish
      if(s.hitCooldown>0)s.hitCooldown--;
      s.jellyfish.forEach(jf=>{
        jf.x+=jf.vx; jf.y+=jf.vy;
        if(jf.x<jf.r||jf.x>W-jf.r)jf.vx*=-1;
        if(jf.y<jf.r||jf.y>H-80)jf.vy*=-1;
        if(s.hitCooldown===0&&Math.hypot(jf.x-s.boat.x,jf.y-s.boat.y)<36+jf.r-10){
          s.lives=Math.max(0,s.lives-1);
          s.hitCooldown=90;
          jf.x=Math.random()*W; jf.y=Math.random()*(H-100);
          setHitFlash(true); setTimeout(()=>setHitFlash(false),500);
          if(s.lives===0){s.running=false;setDone(true);onScore&&onScore(s.score);}
        }
      });
      // Particles
      s.particles=s.particles.filter(p=>p.life>0);
      s.particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.05;p.life-=0.04;});
      const timeLeft=Math.max(0,60-Math.floor((Date.now()-s.startTime)/1000));
      if(timeLeft===0){s.running=false;setDone(true);onScore&&onScore(s.score);}
      const collected=s.trash.filter(t=>t.collected).length;
      setUi({score:s.score,lives:s.lives,timeLeft,collected});
      // Draw
      drawWater(ctx,s.t);
      s.trash.forEach(t=>drawTrash(ctx,t,s.t));
      s.jellyfish.forEach(jf=>drawJellyfish(ctx,jf,s.t));
      drawSeafloor(ctx);
      drawBoat(ctx,s.boat.x,s.boat.y,s.dir);
      // Particles
      s.particles.forEach(p=>{ctx.globalAlpha=p.life;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();});
      ctx.globalAlpha=1;
      if(s.hitCooldown>60){ctx.fillStyle='rgba(239,68,68,0.2)';ctx.fillRect(0,0,W,H);}
      animRef.current=requestAnimationFrame(loop);
    };
    animRef.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(animRef.current);
  },[]);

  return(
    <div style={{background:'#071009',border:'1px solid rgba(59,130,246,0.2)',borderRadius:18,overflow:'hidden',width:'100%',maxWidth:740,position:'relative'}}>
      <div style={{padding:'0.875rem 1.25rem',borderBottom:'1px solid rgba(59,130,246,0.12)',background:'linear-gradient(135deg,#071009,#0a1628)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700,fontSize:'1rem',fontFamily:'Sora,sans-serif',color:'#e8f5e9'}}>Ocean Cleanup</div>
          <div style={{fontSize:'0.72rem',color:'#4a7c59'}}>Arrow keys / WASD to move. Collect trash, avoid jellyfish!</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'1.25rem'}}>
          <div style={{display:'flex',gap:4}}>{[0,1,2].map(i=><i key={i} className="fa-solid fa-heart" style={{color:i<ui.lives?'#ef4444':'rgba(239,68,68,0.2)',fontSize:'0.9rem'}}/>)}</div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'1.2rem',fontWeight:800,color:ui.timeLeft<=10?'#ef4444':'#4ade80',fontFamily:'Sora,sans-serif'}}>{ui.timeLeft}s</div>
            <div style={{fontSize:'0.62rem',color:'#4a7c59'}}>TIME</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'1.2rem',fontWeight:800,color:'#fbbf24',fontFamily:'Sora,sans-serif'}}>{ui.score}</div>
            <div style={{fontSize:'0.62rem',color:'#4a7c59'}}>POINTS</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#4a7c59',cursor:'pointer',fontSize:'1.1rem'}}><i className="fa-solid fa-xmark"/></button>
        </div>
      </div>
      <div style={{position:'relative'}}>
        <canvas ref={canvasRef} width={W} height={H} style={{width:'100%',display:'block'}} tabIndex={0}/>
        {done&&<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.82)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.75rem'}}>
          <div style={{fontSize:'2rem',fontWeight:800,fontFamily:'Sora,sans-serif',color:ui.lives===0?'#ef4444':'#4ade80'}}>{ui.lives===0?'Boat Sunk!':'Mission Complete!'}</div>
          <div style={{fontSize:'1rem',color:'#a5d6a7'}}>Collected <strong style={{color:'#4ade80'}}>{ui.collected} items</strong></div>
          <div style={{fontSize:'1.4rem',fontWeight:700,color:'#fbbf24'}}>{ui.score} eco points earned</div>
          <motion.button whileHover={{scale:1.04}} className="btn btn-primary" onClick={onClose} style={{marginTop:'0.5rem'}}><i className="fa-solid fa-check"/> Done</motion.button>
        </div>}
      </div>
    </div>
  );
}

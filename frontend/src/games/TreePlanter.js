import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const W = 720, H = 440;
const SOIL = [
  {x:80,y:290,r:42},{x:195,y:315,r:36},{x:330,y:295,r:44},
  {x:470,y:310,r:38},{x:600,y:280,r:40},{x:145,y:348,r:32},
  {x:415,y:348,r:35},{x:555,y:345,r:33},{x:260,y:340,r:30},
];
const ROCKS = [
  {x:265,y:300,rx:30,ry:19},{x:510,y:275,rx:24,ry:15},{x:92,y:325,rx:20,ry:13},
];
const BIRDS = [{x:100,y:60,vx:0.4},{x:350,y:40,vx:0.3},{x:580,y:75,vx:0.5}];

function lerp(a,b,t){return a+(b-a)*t;}

function drawSky(ctx,t){
  const sky=ctx.createLinearGradient(0,0,0,H*0.55);
  sky.addColorStop(0,'#1a3a5c');
  sky.addColorStop(0.5,'#2d6a8f');
  sky.addColorStop(1,'#5ba3c9');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.55);
  // Sun glow
  const sg=ctx.createRadialGradient(620,55,5,620,55,70);
  sg.addColorStop(0,'rgba(255,230,100,0.9)');
  sg.addColorStop(0.4,'rgba(255,200,50,0.4)');
  sg.addColorStop(1,'rgba(255,180,0,0)');
  ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(620,55,70,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(620,55,32,0,Math.PI*2);
  ctx.fillStyle='#ffe066'; ctx.fill();
}

function drawClouds(ctx,t){
  const clouds=[[120,52,1.0],[300,38,0.85],[500,65,0.95]];
  clouds.forEach(([cx,cy,s],i)=>{
    const ox=Math.sin(t*0.3+i)*8;
    ctx.save(); ctx.translate(cx+ox,cy); ctx.scale(s,s);
    ctx.fillStyle='rgba(255,255,255,0.88)';
    [[0,0,22],[26,-9,18],[-26,-9,18],[16,10,16],[-16,10,16]].forEach(([dx,dy,r])=>{
      ctx.beginPath(); ctx.arc(dx,dy,r,0,Math.PI*2); ctx.fill();
    });
    ctx.restore();
  });
}

function drawBirds(ctx,t){
  ctx.strokeStyle='rgba(30,30,60,0.7)'; ctx.lineWidth=1.5;
  BIRDS.forEach((b,i)=>{
    const bx=(b.x+t*b.vx*30)%(W+60)-30;
    const by=b.y+Math.sin(t*2+i)*4;
    const flap=Math.sin(t*6+i)*0.4;
    ctx.beginPath();
    ctx.moveTo(bx-8,by); ctx.quadraticCurveTo(bx-4,by-6+flap*8,bx,by);
    ctx.quadraticCurveTo(bx+4,by-6+flap*8,bx+8,by);
    ctx.stroke();
  });
}

function drawGround(ctx){
  const g=ctx.createLinearGradient(0,H*0.52,0,H);
  g.addColorStop(0,'#3a6b2a'); g.addColorStop(0.25,'#2d5520'); g.addColorStop(1,'#1a3a10');
  ctx.fillStyle=g; ctx.fillRect(0,H*0.52,W,H*0.48);
  // Grass tufts
  ctx.strokeStyle='#4a8a35'; ctx.lineWidth=1.5;
  for(let x=20;x<W;x+=18){
    const h=4+Math.sin(x*0.3)*2;
    ctx.beginPath(); ctx.moveTo(x,H*0.52); ctx.lineTo(x-3,H*0.52-h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+4,H*0.52); ctx.lineTo(x+1,H*0.52-h-1); ctx.stroke();
  }
}

function drawSoil(ctx){
  SOIL.forEach(p=>{
    const sg=ctx.createRadialGradient(p.x-8,p.y-5,2,p.x,p.y,p.r);
    sg.addColorStop(0,'#8b5e3c'); sg.addColorStop(0.6,'#6b4226'); sg.addColorStop(1,'#4a2e18');
    ctx.beginPath(); ctx.ellipse(p.x,p.y,p.r,p.r*0.52,0,0,Math.PI*2);
    ctx.fillStyle=sg; ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=1; ctx.stroke();
  });
}

function drawRocks(ctx){
  ROCKS.forEach(r=>{
    const rg=ctx.createRadialGradient(r.x-6,r.y-5,2,r.x,r.y,r.rx);
    rg.addColorStop(0,'#b0b0b0'); rg.addColorStop(0.5,'#808080'); rg.addColorStop(1,'#505050');
    ctx.beginPath(); ctx.ellipse(r.x,r.y,r.rx,r.ry,0,0,Math.PI*2);
    ctx.fillStyle=rg; ctx.fill();
    ctx.strokeStyle='#404040'; ctx.lineWidth=1; ctx.stroke();
    // Highlight
    ctx.beginPath(); ctx.ellipse(r.x-4,r.y-3,r.rx*0.4,r.ry*0.35,0,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.fill();
  });
}

function drawTree(ctx,t,tree){
  const age=Math.min((t-tree.plantedAt)/4,1);
  const trunkH=lerp(8,42,age);
  const crownR=lerp(5,26,age);
  const baseY=tree.y+8;
  // Shadow
  ctx.beginPath(); ctx.ellipse(tree.x+5,baseY+3,crownR*0.7,crownR*0.22,0,0,Math.PI*2);
  ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fill();
  // Trunk
  const tg=ctx.createLinearGradient(tree.x-5,0,tree.x+5,0);
  tg.addColorStop(0,'#a0724a'); tg.addColorStop(1,'#5c3a1e');
  ctx.fillStyle=tg;
  ctx.beginPath();
  ctx.moveTo(tree.x-4,baseY);
  ctx.quadraticCurveTo(tree.x-3,baseY-trunkH*0.5,tree.x-2,baseY-trunkH);
  ctx.lineTo(tree.x+2,baseY-trunkH);
  ctx.quadraticCurveTo(tree.x+3,baseY-trunkH*0.5,tree.x+4,baseY);
  ctx.closePath(); ctx.fill();
  // Crown layers
  const sway=Math.sin(t*1.2+tree.x*0.05)*2*age;
  [0,-crownR*0.38,-crownR*0.72].forEach((dy,i)=>{
    const r=crownR*(1-i*0.18);
    const cg=ctx.createRadialGradient(tree.x+sway-r*0.2,baseY-trunkH+dy-r*0.2,r*0.1,tree.x+sway,baseY-trunkH+dy,r);
    cg.addColorStop(0,i===0?'#6abf5e':'#5aaf4e');
    cg.addColorStop(0.6,'#3d8b3d'); cg.addColorStop(1,'#1e5c1e');
    ctx.beginPath(); ctx.arc(tree.x+sway,baseY-trunkH+dy,r,0,Math.PI*2);
    ctx.fillStyle=cg; ctx.fill();
  });
  // Fruit when mature
  if(age>0.85){
    for(let i=0;i<3;i++){
      const fx=tree.x+sway+Math.cos(i*2.1)*crownR*0.55;
      const fy=baseY-trunkH+Math.sin(i*2.1)*crownR*0.4;
      ctx.beginPath(); ctx.arc(fx,fy,3,0,Math.PI*2);
      ctx.fillStyle='#e84040'; ctx.fill();
    }
  }
}

function drawParticles(ctx,particles){
  particles.forEach(p=>{
    ctx.globalAlpha=p.life;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=p.color; ctx.fill();
  });
  ctx.globalAlpha=1;
}

export default function TreePlanter({onClose,onScore}){
  const canvasRef=useRef();
  const state=useRef({trees:[],startTime:Date.now(),running:true,t:0,particles:[]});
  const animRef=useRef();
  const [timeLeft,setTimeLeft]=useState(45);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const [msg,setMsg]=useState('');
  const [combo,setCombo]=useState(0);
  const comboRef=useRef(0);
  const msgTimer=useRef();

  const showMsg=(text)=>{
    setMsg(text);
    clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),1500);
  };

  useEffect(()=>{
    const canvas=canvasRef.current;
    const ctx=canvas.getContext('2d');
    const loop=(ts)=>{
      const s=state.current;
      if(!s.running)return;
      s.t+=0.016;
      const remaining=Math.max(0,45-Math.floor((Date.now()-s.startTime)/1000));
      setTimeLeft(remaining);
      if(remaining===0){s.running=false;setDone(true);onScore&&onScore(s.trees.length*15);return;}
      // Update particles
      s.particles=s.particles.filter(p=>p.life>0);
      s.particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.08;p.life-=0.03;});
      // Draw
      drawSky(ctx,s.t); drawClouds(ctx,s.t); drawBirds(ctx,s.t);
      drawGround(ctx); drawSoil(ctx); drawRocks(ctx);
      s.trees.forEach(tree=>drawTree(ctx,s.t,tree));
      drawParticles(ctx,s.particles);
      animRef.current=requestAnimationFrame(loop);
    };
    animRef.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(animRef.current);
  },[]);

  const handleClick=useCallback((e)=>{
    const s=state.current;
    if(!s.running)return;
    const rect=canvasRef.current.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(W/rect.width);
    const my=(e.clientY-rect.top)*(H/rect.height);
    const onRock=ROCKS.some(r=>{const dx=(mx-r.x)/r.rx,dy=(my-r.y)/r.ry;return dx*dx+dy*dy<1;});
    if(onRock){showMsg('That is a rock! Find soil.');comboRef.current=0;setCombo(0);return;}
    const onSoil=SOIL.some(p=>{const dx=mx-p.x,dy=(my-p.y)/0.52;return Math.sqrt(dx*dx+dy*dy)<p.r;});
    if(!onSoil){showMsg('Plant on the brown soil patches!');comboRef.current=0;setCombo(0);return;}
    const tooClose=s.trees.some(t=>Math.hypot(mx-t.x,my-t.y)<38);
    if(tooClose){showMsg('Too close to another tree!');return;}
    s.trees.push({x:mx,y:my,plantedAt:s.t});
    comboRef.current++;
    setCombo(comboRef.current);
    const pts=comboRef.current>=3?20:15;
    setScore(prev=>prev+pts);
    // Particles
    for(let i=0;i<12;i++){
      const angle=Math.random()*Math.PI*2;
      s.particles.push({x:mx,y:my,vx:Math.cos(angle)*2.5,vy:Math.sin(angle)*2.5-2,r:3+Math.random()*3,color:['#4ade80','#22c55e','#86efac','#fbbf24'][Math.floor(Math.random()*4)],life:1});
    }
    showMsg(comboRef.current>=3?`COMBO x${comboRef.current}! +${pts} pts`:'+'+pts+' pts');
  },[]);

  const pct=Math.min((score/300)*100,100);

  return(
    <div style={{background:'#0a1509',border:'1px solid rgba(34,197,94,0.2)',borderRadius:18,overflow:'hidden',width:'100%',maxWidth:740,position:'relative'}}>
      <div style={{padding:'0.875rem 1.25rem',borderBottom:'1px solid rgba(34,197,94,0.12)',background:'linear-gradient(135deg,#071009,#0a1f0d)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700,fontSize:'1rem',fontFamily:'Sora,sans-serif',color:'#e8f5e9'}}>Tree Planting Simulator</div>
          <div style={{fontSize:'0.72rem',color:'#4a7c59'}}>Click soil patches to plant trees. Build combos for bonus points!</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'1.25rem'}}>
          {combo>=3&&<div style={{fontSize:'0.78rem',fontWeight:700,color:'#fbbf24',background:'rgba(251,191,36,0.1)',border:'1px solid rgba(251,191,36,0.3)',borderRadius:8,padding:'3px 8px'}}>COMBO x{combo}</div>}
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'1.3rem',fontWeight:800,color:timeLeft<=10?'#ef4444':'#4ade80',fontFamily:'Sora,sans-serif'}}>{timeLeft}s</div>
            <div style={{fontSize:'0.62rem',color:'#4a7c59'}}>TIME</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'1.3rem',fontWeight:800,color:'#fbbf24',fontFamily:'Sora,sans-serif'}}>{score}</div>
            <div style={{fontSize:'0.62rem',color:'#4a7c59'}}>POINTS</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#4a7c59',cursor:'pointer',fontSize:'1.1rem'}}><i className="fa-solid fa-xmark"/></button>
        </div>
      </div>
      {/* Progress bar */}
      <div style={{height:4,background:'rgba(34,197,94,0.1)'}}>
        <div style={{height:'100%',background:'linear-gradient(90deg,#22c55e,#14b8a6)',width:pct+'%',transition:'width 0.3s'}}/>
      </div>
      <div style={{position:'relative'}}>
        <canvas ref={canvasRef} width={W} height={H} onClick={handleClick} style={{width:'100%',display:'block',cursor:done?'default':'crosshair'}}/>
        {msg&&<div style={{position:'absolute',top:'45%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.8)',color:'#4ade80',padding:'0.5rem 1.25rem',borderRadius:20,fontSize:'0.9rem',fontWeight:700,pointerEvents:'none',whiteSpace:'nowrap',border:'1px solid rgba(34,197,94,0.3)'}}>{msg}</div>}
        {done&&<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.82)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.75rem'}}>
          <div style={{fontSize:'2.2rem',fontWeight:800,fontFamily:'Sora,sans-serif',color:'#4ade80'}}>Forest Restored!</div>
          <div style={{fontSize:'1rem',color:'#a5d6a7'}}>You planted <strong style={{color:'#4ade80'}}>{state.current.trees.length} trees</strong></div>
          <div style={{fontSize:'1.4rem',fontWeight:700,color:'#fbbf24'}}>{score} eco points earned</div>
          <motion.button whileHover={{scale:1.04}} className="btn btn-primary" onClick={onClose} style={{marginTop:'0.5rem'}}><i className="fa-solid fa-check"/> Done</motion.button>
        </div>}
      </div>
    </div>
  );
}

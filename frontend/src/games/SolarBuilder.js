import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_COLS=9, GRID_ROWS=6, TARGET=400;
const ITEMS=[
  { id:'solar',  label:'Solar Panel',  icon:'fa-solid fa-solar-panel', color:'#f59e0b', power:18, desc:'Converts sunlight to electricity' },
  { id:'wind',   label:'Wind Turbine', icon:'fa-solid fa-wind',        color:'#60a5fa', power:28, desc:'Harnesses wind kinetic energy' },
  { id:'tree',   label:'Tree',         icon:'fa-solid fa-tree',        color:'#22c55e', power:6,  desc:'Absorbs CO2 and cools the city' },
  { id:'hydro',  label:'Hydro Dam',    icon:'fa-solid fa-water',       color:'#14b8a6', power:40, desc:'Uses flowing water for power' },
  { id:'battery',label:'Battery',      icon:'fa-solid fa-battery-full',color:'#a78bfa', power:0,  desc:'Stores excess energy for night', storage:true },
];
const ZONE_BG={solar:'rgba(245,158,11,0.1)',wind:'rgba(96,165,250,0.1)',tree:'rgba(34,197,94,0.1)',hydro:'rgba(20,184,166,0.1)',battery:'rgba(167,139,250,0.1)'};

export default function SolarBuilder({onClose,onScore}){
  const [grid,setGrid]=useState(()=>Array(GRID_ROWS).fill(null).map(()=>Array(GRID_COLS).fill(null)));
  const [selected,setSelected]=useState('solar');
  const [power,setPower]=useState(0);
  const [storage,setStorage]=useState(0);
  const [timeLeft,setTimeLeft]=useState(120);
  const [done,setDone]=useState(false);
  const [won,setWon]=useState(false);
  const [particles,setParticles]=useState([]);
  const [pulseCell,setPulseCell]=useState(null);
  const timerRef=useRef();
  const powerRef=useRef(0);

  useEffect(()=>{
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){clearInterval(timerRef.current);setDone(true);return 0;}
        return t-1;
      });
    },1000);
    return()=>clearInterval(timerRef.current);
  },[]);

  const handleCell=(row,col)=>{
    if(done||grid[row][col])return;
    const item=ITEMS.find(i=>i.id===selected);
    const newGrid=grid.map(r=>[...r]);
    newGrid[row][col]=item;
    setGrid(newGrid);
    if(item.storage){
      setStorage(s=>s+50);
    } else {
      const newPower=power+item.power;
      powerRef.current=newPower;
      setPower(newPower);
      if(newPower>=TARGET){
        clearInterval(timerRef.current);
        setWon(true); setDone(true);
        onScore&&onScore(Math.round((newPower/TARGET)*100+timeLeft));
      }
    }
    setPulseCell(`${row}-${col}`);
    setTimeout(()=>setPulseCell(null),400);
    // Particles
    setParticles(p=>[...p,{id:Date.now(),row,col,color:item.color}]);
    setTimeout(()=>setParticles(p=>p.filter(x=>x.id!==Date.now())),600);
  };

  const pct=Math.min((power/TARGET)*100,100);
  const filledCells=grid.flat().filter(Boolean).length;
  const totalCells=GRID_ROWS*GRID_COLS;
  const selectedItem=ITEMS.find(i=>i.id===selected);

  return(
    <div style={{background:'#071009',border:'1px solid rgba(34,197,94,0.15)',borderRadius:18,overflow:'hidden',width:'100%',maxWidth:720,position:'relative'}}>
      {/* Header */}
      <div style={{padding:'0.875rem 1.25rem',borderBottom:'1px solid rgba(34,197,94,0.1)',background:'linear-gradient(135deg,#071009,#0a1f0d)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700,fontSize:'1rem',fontFamily:'Sora,sans-serif',color:'#e8f5e9'}}>Green City Builder</div>
          <div style={{fontSize:'0.72rem',color:'#4a7c59'}}>Build a renewable energy city. Reach {TARGET} MW to win!</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'1.25rem'}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'1.2rem',fontWeight:800,color:timeLeft<=20?'#ef4444':'#4ade80',fontFamily:'Sora,sans-serif'}}>{timeLeft}s</div>
            <div style={{fontSize:'0.62rem',color:'#4a7c59'}}>TIME</div>
          </div>
          {storage>0&&<div style={{textAlign:'center'}}>
            <div style={{fontSize:'1rem',fontWeight:700,color:'#a78bfa',fontFamily:'Sora,sans-serif'}}>{storage} kWh</div>
            <div style={{fontSize:'0.62rem',color:'#4a7c59'}}>STORED</div>
          </div>}
          <button onClick={onClose} style={{background:'none',border:'none',color:'#4a7c59',cursor:'pointer',fontSize:'1.1rem'}}><i className="fa-solid fa-xmark"/></button>
        </div>
      </div>
      <div style={{padding:'0.875rem 1.25rem'}}>
        {/* Power meter */}
        <div style={{marginBottom:'0.875rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.3rem'}}>
            <span style={{fontSize:'0.78rem',color:'#94a3b8',display:'flex',alignItems:'center',gap:'0.35rem'}}><i className="fa-solid fa-bolt" style={{color:'#fbbf24'}}/> Power Generated</span>
            <span style={{fontSize:'0.78rem',fontWeight:700,color:pct>=100?'#22c55e':'#e8f5e9'}}>{power} / {TARGET} MW {pct>=100&&'TARGET REACHED!'}</span>
          </div>
          <div style={{height:12,background:'rgba(34,197,94,0.08)',borderRadius:6,overflow:'hidden',border:'1px solid rgba(34,197,94,0.1)'}}>
            <motion.div animate={{width:pct+'%'}} transition={{duration:0.4}}
              style={{height:'100%',background:pct>=100?'#22c55e':'linear-gradient(90deg,#f59e0b,#22c55e)',borderRadius:6,boxShadow:pct>=100?'0 0 12px #22c55e':undefined}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:'0.25rem'}}>
            {[0,25,50,75,100].map(m=><span key={m} style={{fontSize:'0.6rem',color:'#4a7c59'}}>{m}%</span>)}
          </div>
        </div>
        {/* Tool selector */}
        <div style={{display:'flex',gap:'0.4rem',marginBottom:'0.875rem',flexWrap:'wrap'}}>
          {ITEMS.map(item=>(
            <motion.button key={item.id} whileHover={{scale:1.04}} whileTap={{scale:0.96}}
              onClick={()=>setSelected(item.id)}
              style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.4rem 0.75rem',borderRadius:9,border:'1px solid',borderColor:selected===item.id?`${item.color}60`:'rgba(34,197,94,0.1)',background:selected===item.id?`${item.color}15`:'transparent',color:selected===item.id?item.color:'#4a7c59',fontSize:'0.78rem',fontWeight:selected===item.id?600:400,cursor:'pointer',transition:'all 0.15s'}}>
              <i className={item.icon} style={{fontSize:'0.72rem'}}/>
              {item.label}
              <span style={{fontSize:'0.65rem',opacity:0.7}}>{item.storage?'Storage':'+'+item.power+'MW'}</span>
            </motion.button>
          ))}
        </div>
        {/* Selected item info */}
        <div style={{fontSize:'0.72rem',color:'#4a7c59',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
          <i className={selectedItem.icon} style={{color:selectedItem.color}}/>
          <span style={{color:'#94a3b8'}}>{selectedItem.desc}</span>
          <span style={{marginLeft:'auto',color:'#4a7c59'}}>{filledCells}/{totalCells} cells used</span>
        </div>
        {/* Grid */}
        <div style={{display:'grid',gridTemplateColumns:`repeat(${GRID_COLS},1fr)`,gap:3,background:'rgba(0,0,0,0.3)',borderRadius:12,padding:8,border:'1px solid rgba(34,197,94,0.08)'}}>
          {grid.map((row,ri)=>row.map((cell,ci)=>{
            const key=`${ri}-${ci}`;
            const isPulsing=pulseCell===key;
            return(
              <motion.div key={key}
                animate={isPulsing?{scale:[1,1.3,1]}:{scale:1}}
                transition={{duration:0.3}}
                whileHover={!cell&&!done?{scale:1.1,background:ZONE_BG[selected]}:{}}
                onClick={()=>handleCell(ri,ci)}
                style={{aspectRatio:'1',borderRadius:7,background:cell?ZONE_BG[cell.id]:'rgba(34,197,94,0.03)',border:`1px solid ${cell?cell.color+'25':'rgba(34,197,94,0.06)'}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:cell||done?'default':'pointer',transition:'all 0.12s',position:'relative'}}>
                {cell&&<motion.div initial={{scale:0,rotate:-20}} animate={{scale:1,rotate:0}} transition={{type:'spring',stiffness:300}}>
                  <i className={cell.icon} style={{fontSize:'0.95rem',color:cell.color}}/>
                </motion.div>}
              </motion.div>
            );
          }))}
        </div>
      </div>
      {/* Done overlay */}
      <AnimatePresence>
        {done&&<motion.div initial={{opacity:0}} animate={{opacity:1}} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.75rem',borderRadius:18}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:won?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.1)',border:`2px solid ${won?'rgba(34,197,94,0.4)':'rgba(239,68,68,0.3)'}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <i className={won?'fa-solid fa-bolt':'fa-solid fa-clock'} style={{fontSize:'2rem',color:won?'#22c55e':'#ef4444'}}/>
          </div>
          <div style={{fontSize:'1.8rem',fontWeight:800,fontFamily:'Sora,sans-serif',color:won?'#22c55e':'#e8f5e9'}}>{won?'City Powered!':'Time\'s Up!'}</div>
          <div style={{fontSize:'1rem',color:'#94a3b8'}}>{power} MW generated  {filledCells} buildings placed</div>
          <div style={{fontSize:'1.4rem',fontWeight:700,color:'#fbbf24'}}>{Math.round((power/TARGET)*100+timeLeft)} eco points</div>
          <motion.button whileHover={{scale:1.04}} className="btn btn-primary" onClick={onClose} style={{marginTop:'0.5rem'}}><i className="fa-solid fa-check"/> Done</motion.button>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

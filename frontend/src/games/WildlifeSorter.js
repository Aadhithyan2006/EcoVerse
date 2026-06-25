import { AnimalIcon } from './AnimalIcons';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ANIMALS = [
  { name: 'Red Fox',           habitat: 'forest', emoji: '🦊', color: '#d2691e', fact: 'Foxes are omnivores that live in forests and grasslands worldwide.' },
  { name: 'Bottlenose Dolphin',habitat: 'ocean',  emoji: '🐬', color: '#4169e1', fact: 'Dolphins are highly intelligent and live in pods in warm ocean waters.' },
  { name: 'Bald Eagle',        habitat: 'sky',    emoji: '🦅', color: '#8b4513', fact: 'Bald eagles soar at heights of 10,000 feet and can spot prey from 2 miles away.' },
  { name: 'Brown Bear',        habitat: 'forest', emoji: '', color: '#8b6914', fact: 'Brown bears are apex predators that roam forests and mountains.' },
  { name: 'Great White Shark', habitat: 'ocean',  emoji: '', color: '#708090', fact: 'Great white sharks are apex predators essential for ocean ecosystem balance.' },
  { name: 'Barn Owl',          habitat: 'sky',    emoji: '', color: '#c8a96e', fact: 'Barn owls can locate prey in complete darkness using their exceptional hearing.' },
  { name: 'White-tailed Deer', habitat: 'forest', emoji: '', color: '#c8a96e', fact: 'White-tailed deer are key herbivores that shape forest vegetation.' },
  { name: 'Giant Octopus',     habitat: 'ocean',  emoji: '', color: '#9b59b6', fact: 'Giant octopuses are highly intelligent and can change color in milliseconds.' },
  { name: 'Peregrine Falcon',  habitat: 'sky',    emoji: '', color: '#4a4a6a', fact: 'Peregrine falcons are the fastest animals on Earth, diving at 240 mph.' },
  { name: 'Gray Wolf',         habitat: 'forest', emoji: '', color: '#696969', fact: 'Gray wolves are keystone predators that regulate prey populations.' },
  { name: 'Sea Turtle',        habitat: 'ocean',  emoji: '', color: '#2e8b57', fact: 'Sea turtles have navigated Earth oceans for over 100 million years.' },
  { name: 'Macaw Parrot',      habitat: 'sky',    emoji: '', color: '#228b22', fact: 'Macaws are seed dispersers that help regenerate tropical rainforests.' },
  { name: 'Black Bear',        habitat: 'forest', emoji: '', color: '#2c2c2c', fact: 'Black bears are important seed dispersers and forest ecosystem engineers.' },
  { name: 'Blue Whale',        habitat: 'ocean',  emoji: '', color: '#1e3a5f', fact: 'Blue whales are the largest animals ever to have lived on Earth.' },
  { name: 'Albatross',         habitat: 'sky',    emoji: '', color: '#e8e8e8', fact: 'Albatrosses can fly 10,000 miles without landing, using wind currents.' },
];

const ZONES = [
  { id: 'forest', label: 'Forest', color: '#22c55e', bg: 'linear-gradient(135deg,#0d2818,#1a3a1a)', icon: 'fa-solid fa-tree', desc: 'Woodlands & Mountains' },
  { id: 'ocean',  label: 'Ocean',  color: '#3b82f6', bg: 'linear-gradient(135deg,#0a1628,#0d2a4a)', icon: 'fa-solid fa-water', desc: 'Seas & Oceans' },
  { id: 'sky',    label: 'Sky',    color: '#60a5fa', bg: 'linear-gradient(135deg,#0a1a2e,#1a2a4a)', icon: 'fa-solid fa-cloud', desc: 'Air & Atmosphere' },
];

export default function WildlifeSorter({onClose,onScore}){
  const [queue]=useState(()=>[...ANIMALS].sort(()=>Math.random()-0.5));
  const [current,setCurrent]=useState(0);
  const [score,setScore]=useState(0);
  const [streak,setStreak]=useState(0);
  const [lives,setLives]=useState(3);
  const [feedback,setFeedback]=useState(null);
  const [done,setDone]=useState(false);
  const [timeLeft,setTimeLeft]=useState(90);
  const [showFact,setShowFact]=useState(false);
  const timerRef=useRef();
  const scoreRef=useRef(0);

  useEffect(()=>{
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){clearInterval(timerRef.current);setDone(true);onScore&&onScore(scoreRef.current);return 0;}
        return t-1;
      });
    },1000);
    return()=>clearInterval(timerRef.current);
  },[]);

  const handleZone=(zoneId)=>{
    if(done||feedback||current>=queue.length)return;
    const animal=queue[current];
    const correct=animal.habitat===zoneId;
    const newStreak=correct?streak+1:0;
    const pts=correct?Math.min(10+newStreak*5,40):0;
    const newScore=score+pts;
    scoreRef.current=newScore;
    setFeedback({correct,zone:zoneId,animal,pts});
    setStreak(newStreak);
    setScore(newScore);
    if(!correct){
      const newLives=lives-1;
      setLives(newLives);
      if(newLives===0){setTimeout(()=>{setDone(true);onScore&&onScore(newScore);},1200);return;}
    }
    setShowFact(true);
    setTimeout(()=>{
      setShowFact(false);
      setFeedback(null);
      if(current+1>=queue.length){setDone(true);clearInterval(timerRef.current);onScore&&onScore(newScore);}
      else setCurrent(c=>c+1);
    },1800);
  };

  const animal=queue[current];
  const progress=(current/queue.length)*100;
  const zoneColors={'forest':'#22c55e','ocean':'#3b82f6','sky':'#60a5fa'};

  return(
    <div style={{background:'#071009',border:'1px solid rgba(34,197,94,0.15)',borderRadius:18,overflow:'hidden',width:'100%',maxWidth:680}}>
      {/* Header */}
      <div style={{padding:'0.875rem 1.25rem',borderBottom:'1px solid rgba(34,197,94,0.1)',background:'linear-gradient(135deg,#071009,#0a1f0d)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700,fontSize:'1rem',fontFamily:'Sora,sans-serif',color:'#e8f5e9'}}>Wildlife Habitat Sorter</div>
          <div style={{fontSize:'0.72rem',color:'#4a7c59'}}>Sort animals into their correct habitats. Build streaks for bonus points!</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <div style={{display:'flex',gap:4}}>{[0,1,2].map(i=><i key={i} className="fa-solid fa-heart" style={{color:i<lives?'#ef4444':'rgba(239,68,68,0.2)',fontSize:'0.9rem'}}/>)}</div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'1.2rem',fontWeight:800,color:timeLeft<=15?'#ef4444':'#4ade80',fontFamily:'Sora,sans-serif'}}>{timeLeft}s</div>
            <div style={{fontSize:'0.62rem',color:'#4a7c59'}}>TIME</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'1.2rem',fontWeight:800,color:'#fbbf24',fontFamily:'Sora,sans-serif'}}>{score}</div>
            <div style={{fontSize:'0.62rem',color:'#4a7c59'}}>POINTS</div>
          </div>
          {streak>=2&&<div style={{fontSize:'0.78rem',fontWeight:700,color:'#fbbf24',background:'rgba(251,191,36,0.1)',border:'1px solid rgba(251,191,36,0.3)',borderRadius:8,padding:'3px 8px'}}><i className="fa-solid fa-fire"/> {streak}x</div>}
          <button onClick={onClose} style={{background:'none',border:'none',color:'#4a7c59',cursor:'pointer',fontSize:'1.1rem'}}><i className="fa-solid fa-xmark"/></button>
        </div>
      </div>
      {/* Progress */}
      <div style={{height:3,background:'rgba(34,197,94,0.08)'}}>
        <div style={{height:'100%',background:'linear-gradient(90deg,#22c55e,#14b8a6)',width:progress+'%',transition:'width 0.3s'}}/>
      </div>
      <div style={{padding:'1.25rem'}}>
        {!done?(
          <>
            {/* Animal card */}
            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{opacity:0,scale:0.88,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.88,y:-20}}
                style={{textAlign:'center',marginBottom:'1.25rem',position:'relative'}}>
                <div style={{width:96,height:96,borderRadius:24,background:`${animal.color}18`,border:`2px solid ${animal.color}40`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.875rem',position:'relative',boxShadow:`0 0 30px ${animal.color}20`}}>
                  <AnimalIcon name={animal.name} color={animal.color} habitat={animal.habitat} size={96} />
                  {feedback&&<motion.div initial={{scale:0}} animate={{scale:1}} style={{position:'absolute',top:-10,right:-10,width:30,height:30,borderRadius:'50%',background:feedback.correct?'#22c55e':'#ef4444',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 12px ${feedback.correct?'#22c55e':'#ef4444'}`}}>
                    <i className={feedback.correct?'fa-solid fa-check':'fa-solid fa-xmark'} style={{color:'#fff',fontSize:'0.8rem'}}/>
                  </motion.div>}
                </div>
                <div style={{fontSize:'1.4rem',fontWeight:800,fontFamily:'Sora,sans-serif',color:'#e8f5e9',marginBottom:'0.25rem'}}>{animal.name}</div>
                <AnimatePresence>
                  {showFact&&<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{fontSize:'0.8rem',color:feedback?.correct?'#4ade80':'#f87171',background:feedback?.correct?'rgba(34,197,94,0.08)':'rgba(239,68,68,0.08)',border:`1px solid ${feedback?.correct?'rgba(34,197,94,0.2)':'rgba(239,68,68,0.2)'}`,borderRadius:10,padding:'0.5rem 0.875rem',maxWidth:400,margin:'0.5rem auto 0',lineHeight:1.5}}>
                    {feedback?.correct?`Correct! +${feedback.pts} pts${streak>=2?' ('+streak+'x streak!)':''}`:`Wrong! ${animal.name} lives in the ${animal.habitat}.`}
                    <div style={{marginTop:'0.3rem',color:'#94a3b8',fontSize:'0.75rem'}}>{animal.fact}</div>
                  </motion.div>}
                </AnimatePresence>
                <div style={{fontSize:'0.72rem',color:'#4a7c59',marginTop:'0.5rem'}}>{current+1} of {queue.length} animals</div>
              </motion.div>
            </AnimatePresence>
            {/* Zone buttons */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem'}}>
              {ZONES.map(zone=>(
                <motion.button key={zone.id} whileHover={{scale:1.04,y:-3}} whileTap={{scale:0.97}}
                  onClick={()=>handleZone(zone.id)} disabled={!!feedback}
                  style={{background:zone.bg,border:`1px solid ${zone.color}30`,borderRadius:14,padding:'1.1rem 0.75rem',cursor:feedback?'default':'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem',opacity:feedback?0.7:1,transition:'all 0.15s',boxShadow:feedback?'none':`0 4px 16px ${zone.color}10`}}>
                  <i className={zone.icon} style={{fontSize:'1.5rem',color:zone.color}}/>
                  <span style={{fontWeight:700,fontSize:'0.9rem',color:zone.color}}>{zone.label}</span>
                  <span style={{fontSize:'0.68rem',color:'#4a7c59'}}>{zone.desc}</span>
                </motion.button>
              ))}
            </div>
          </>
        ):(
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} style={{textAlign:'center',padding:'1rem 0'}}>
            <div style={{width:80,height:80,borderRadius:'50%',background:'rgba(34,197,94,0.1)',border:'2px solid rgba(34,197,94,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem'}}>
              <i className="fa-solid fa-trophy" style={{fontSize:'2rem',color:'#fbbf24'}}/>
            </div>
            <div style={{fontSize:'1.8rem',fontWeight:800,fontFamily:'Sora,sans-serif',marginBottom:'0.4rem',color:'#e8f5e9'}}>
              {lives===0?'Out of Lives!':'Mission Complete!'}
            </div>
            <div style={{fontSize:'1rem',color:'#94a3b8',marginBottom:'0.5rem'}}>Sorted {current} of {queue.length} animals</div>
            <div style={{fontSize:'1.5rem',fontWeight:700,color:'#fbbf24',marginBottom:'1.25rem'}}>{score} eco points earned</div>
            <motion.button whileHover={{scale:1.04}} className="btn btn-primary" onClick={onClose}><i className="fa-solid fa-check"/> Done</motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}




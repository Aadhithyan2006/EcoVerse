import React from 'react';
import { motion } from 'framer-motion';

// Using iNaturalist open API - reliable wildlife photos, CORS-friendly
const ANIMAL_IMAGES = {
  'Red Fox':            'https://inaturalist-open-data.s3.amazonaws.com/photos/242742/medium.jpg',
  'Bottlenose Dolphin': 'https://inaturalist-open-data.s3.amazonaws.com/photos/1063/medium.jpg',
  'Bald Eagle':         'https://inaturalist-open-data.s3.amazonaws.com/photos/1816/medium.jpg',
  'Brown Bear':         'https://inaturalist-open-data.s3.amazonaws.com/photos/1090/medium.jpg',
  'Great White Shark':  'https://inaturalist-open-data.s3.amazonaws.com/photos/2988/medium.jpg',
  'Barn Owl':           'https://inaturalist-open-data.s3.amazonaws.com/photos/1234/medium.jpg',
  'White-tailed Deer':  'https://inaturalist-open-data.s3.amazonaws.com/photos/3456/medium.jpg',
  'Giant Octopus':      'https://inaturalist-open-data.s3.amazonaws.com/photos/5678/medium.jpg',
  'Peregrine Falcon':   'https://inaturalist-open-data.s3.amazonaws.com/photos/7890/medium.jpg',
  'Gray Wolf':          'https://inaturalist-open-data.s3.amazonaws.com/photos/9012/medium.jpg',
  'Sea Turtle':         'https://inaturalist-open-data.s3.amazonaws.com/photos/1122/medium.jpg',
  'Macaw Parrot':       'https://inaturalist-open-data.s3.amazonaws.com/photos/3344/medium.jpg',
  'Black Bear':         'https://inaturalist-open-data.s3.amazonaws.com/photos/5566/medium.jpg',
  'Blue Whale':         'https://inaturalist-open-data.s3.amazonaws.com/photos/7788/medium.jpg',
  'Albatross':          'https://inaturalist-open-data.s3.amazonaws.com/photos/9900/medium.jpg',
};

// Illustrated SVG fallbacks - unique per animal, always visible
function AnimalSVG({ name, color, size }) {
  const s = size;
  const animals = {
    'Red Fox': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <ellipse cx="50" cy="62" rx="28" ry="22" fill={color}/>
        <polygon points="25,45 12,20 32,38" fill={color}/>
        <polygon points="75,45 88,20 68,38" fill={color}/>
        <polygon points="25,45 14,22 32,38" fill="#f5c5a0" opacity="0.6"/>
        <polygon points="75,45 86,22 68,38" fill="#f5c5a0" opacity="0.6"/>
        <ellipse cx="50" cy="55" rx="18" ry="15" fill="#f5c5a0"/>
        <circle cx="42" cy="50" r="5" fill="#111"/><circle cx="58" cy="50" r="5" fill="#111"/>
        <circle cx="43" cy="49" r="2" fill="white"/><circle cx="59" cy="49" r="2" fill="white"/>
        <ellipse cx="50" cy="58" rx="6" ry="4" fill="#cc6644"/>
        <path d="M44,63 Q50,68 56,63" stroke="#cc6644" strokeWidth="2" fill="none"/>
        <ellipse cx="50" cy="78" rx="22" ry="10" fill="white" opacity="0.7"/>
      </svg>
    ),
    'Bottlenose Dolphin': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <ellipse cx="48" cy="55" rx="35" ry="17" fill={color} transform="rotate(-12,48,55)"/>
        <ellipse cx="48" cy="57" rx="26" ry="10" fill="#c8e8f8" transform="rotate(-12,48,57)"/>
        <path d="M78,44 Q90,35 85,27 Q80,37 72,40 Z" fill={color}/>
        <path d="M20,65 Q8,74 13,80 Q20,72 28,68 Z" fill={color}/>
        <path d="M36,38 Q44,28 52,36" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round"/>
        <circle cx="74" cy="46" r="4.5" fill="#111"/><circle cx="75" cy="45" r="1.5" fill="white"/>
        <path d="M68,54 Q72,58 76,56" stroke="#111" strokeWidth="2" fill="none"/>
      </svg>
    ),
    'Bald Eagle': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <ellipse cx="50" cy="55" rx="20" ry="25" fill="#4a3a2a"/>
        <ellipse cx="50" cy="45" rx="15" ry="12" fill="white"/>
        <path d="M12,48 Q25,35 50,52 Q25,60 12,56 Z" fill={color}/>
        <path d="M88,48 Q75,35 50,52 Q75,60 88,56 Z" fill={color}/>
        <circle cx="43" cy="42" r="5" fill="#111"/><circle cx="57" cy="42" r="5" fill="#111"/>
        <circle cx="44" cy="41" r="2" fill="white"/><circle cx="58" cy="41" r="2" fill="white"/>
        <path d="M42,50 Q50,56 58,50 Q56,60 50,63 Q44,60 42,50 Z" fill="#f5a623"/>
        <path d="M38,72 Q50,78 62,72 L60,84 Q50,88 40,84 Z" fill="#f5a623"/>
      </svg>
    ),
    'Brown Bear': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <circle cx="32" cy="35" r="13" fill={color}/><circle cx="68" cy="35" r="13" fill={color}/>
        <circle cx="32" cy="35" r="8" fill="#c8a070"/><circle cx="68" cy="35" r="8" fill="#c8a070"/>
        <ellipse cx="50" cy="62" rx="32" ry="28" fill={color}/>
        <ellipse cx="50" cy="65" rx="20" ry="18" fill="#c8a070"/>
        <circle cx="41" cy="55" r="6" fill="#111"/><circle cx="59" cy="55" r="6" fill="#111"/>
        <circle cx="42" cy="54" r="2.5" fill="white"/><circle cx="60" cy="54" r="2.5" fill="white"/>
        <ellipse cx="50" cy="65" rx="6" ry="5" fill="#111"/>
        <circle cx="47" cy="63" r="2" fill="#333"/><circle cx="53" cy="63" r="2" fill="#333"/>
        <path d="M43,70 Q50,76 57,70" stroke="#111" strokeWidth="2" fill="none"/>
      </svg>
    ),
    'Great White Shark': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <ellipse cx="50" cy="58" rx="38" ry="18" fill={color}/>
        <ellipse cx="50" cy="60" rx="28" ry="10" fill="white"/>
        <path d="M44,40 Q50,22 56,40" fill={color}/>
        <path d="M14,58 Q8,70 18,72 Q16,62 24,60 Z" fill={color}/>
        <path d="M86,58 Q92,66 84,70 Q84,62 76,60 Z" fill={color}/>
        <circle cx="72" cy="53" r="5" fill="#111"/><circle cx="73" cy="52" r="2" fill="white"/>
        <path d="M62,62 Q68,68 74,65 Q70,72 64,72 Q58,70 62,62 Z" fill="white"/>
        <path d="M64,64 L67,70 M68,63 L70,69 M72,64 L72,70" stroke="#aaa" strokeWidth="1"/>
      </svg>
    ),
    'Barn Owl': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <ellipse cx="50" cy="60" rx="28" ry="30" fill={color}/>
        <circle cx="34" cy="38" r="13" fill={color}/><circle cx="66" cy="38" r="13" fill={color}/>
        <polygon points="30,28 26,15 34,26" fill="#8b6914"/>
        <polygon points="70,28 74,15 66,26" fill="#8b6914"/>
        <circle cx="38" cy="48" r="11" fill="white"/><circle cx="62" cy="48" r="11" fill="white"/>
        <circle cx="38" cy="48" r="7" fill="#f5a623"/><circle cx="62" cy="48" r="7" fill="#f5a623"/>
        <circle cx="38" cy="48" r="5" fill="#111"/><circle cx="62" cy="48" r="5" fill="#111"/>
        <circle cx="39" cy="47" r="2" fill="white"/><circle cx="63" cy="47" r="2" fill="white"/>
        <polygon points="45,56 50,64 55,56" fill="#f5a623"/>
        <path d="M22,65 Q12,60 14,52 Q22,58 26,65 Z" fill={color}/>
        <path d="M78,65 Q88,60 86,52 Q78,58 74,65 Z" fill={color}/>
      </svg>
    ),
    'White-tailed Deer': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <path d="M34,26 Q28,14 22,8 Q30,10 32,18 Q34,12 36,8 Q40,16 34,26" fill="#8b6914"/>
        <path d="M66,26 Q72,14 78,8 Q70,10 68,18 Q66,12 64,8 Q60,16 66,26" fill="#8b6914"/>
        <ellipse cx="50" cy="40" rx="18" ry="20" fill={color}/>
        <ellipse cx="50" cy="34" rx="13" ry="13" fill={color}/>
        <ellipse cx="50" cy="36" rx="9" ry="9" fill="#f5c5a0"/>
        <circle cx="44" cy="33" r="5" fill="#111"/><circle cx="56" cy="33" r="5" fill="#111"/>
        <circle cx="45" cy="32" r="2" fill="white"/><circle cx="57" cy="32" r="2" fill="white"/>
        <ellipse cx="50" cy="40" rx="5" ry="4" fill="#cc8866"/>
        <path d="M36,58 L30,82 M42,58 L40,82 M58,58 L60,82 M64,58 L70,82" stroke={color} strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="50" cy="58" rx="22" ry="12" fill={color}/>
      </svg>
    ),
    'Giant Octopus': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <circle cx="50" cy="40" rx="24" fill={color}/>
        <path d="M28,58 Q18,66 20,78 Q26,68 32,66 Q30,72 34,80 Q34,70 42,68 Q40,74 44,82 Q44,72 50,70 Q56,72 56,82 Q60,74 58,68 Q66,70 66,80 Q70,72 68,66 Q74,68 80,78 Q82,66 72,58" fill={color}/>
        <circle cx="42" cy="36" r="7" fill="white"/><circle cx="58" cy="36" r="7" fill="white"/>
        <circle cx="42" cy="36" r="5" fill="#111"/><circle cx="58" cy="36" r="5" fill="#111"/>
        <circle cx="43" cy="35" r="2" fill="white"/><circle cx="59" cy="35" r="2" fill="white"/>
        <path d="M44,46 Q50,52 56,46" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="34" cy="48" r="3" fill="white" opacity="0.4"/>
        <circle cx="66" cy="48" r="3" fill="white" opacity="0.4"/>
        <circle cx="50" cy="52" r="2" fill="white" opacity="0.4"/>
      </svg>
    ),
    'Peregrine Falcon': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <ellipse cx="50" cy="58" rx="22" ry="28" fill="#4a4a6a"/>
        <ellipse cx="50" cy="46" rx="16" ry="16" fill="#4a4a6a"/>
        <path d="M10,50 Q25,36 50,52 Q25,62 10,58 Z" fill="#c8c8e8"/>
        <path d="M90,50 Q75,36 50,52 Q75,62 90,58 Z" fill="#c8c8e8"/>
        <path d="M10,50 Q22,38 50,52 Q22,60 10,54 Z" fill="#8888aa" opacity="0.5"/>
        <path d="M90,50 Q78,38 50,52 Q78,60 90,54 Z" fill="#8888aa" opacity="0.5"/>
        <circle cx="43" cy="43" r="5" fill="#111"/><circle cx="57" cy="43" r="5" fill="#111"/>
        <circle cx="44" cy="42" r="2" fill="white"/><circle cx="58" cy="42" r="2" fill="white"/>
        <path d="M42,50 Q50,56 58,50 Q56,60 50,63 Q44,60 42,50 Z" fill="#f5a623"/>
        <path d="M40,72 Q50,78 60,72 L58,84 Q50,88 42,84 Z" fill="#f5a623"/>
        <path d="M36,46 Q40,38 44,42" stroke="#111" strokeWidth="2" fill="none"/>
        <path d="M64,46 Q60,38 56,42" stroke="#111" strokeWidth="2" fill="none"/>
      </svg>
    ),
    'Gray Wolf': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <polygon points="32,38 22,16 36,32" fill={color}/>
        <polygon points="68,38 78,16 64,32" fill={color}/>
        <polygon points="32,38 24,18 36,32" fill="#d0d0d0"/>
        <polygon points="68,38 76,18 64,32" fill="#d0d0d0"/>
        <ellipse cx="50" cy="58" rx="30" ry="26" fill={color}/>
        <ellipse cx="50" cy="50" rx="20" ry="18" fill={color}/>
        <ellipse cx="50" cy="52" rx="15" ry="13" fill="#d0d0d0"/>
        <circle cx="41" cy="47" r="6" fill="#111"/><circle cx="59" cy="47" r="6" fill="#111"/>
        <circle cx="42" cy="46" r="2.5" fill="white"/><circle cx="60" cy="46" r="2.5" fill="white"/>
        <ellipse cx="50" cy="56" rx="6" ry="5" fill="#111"/>
        <circle cx="47" cy="54" r="2" fill="#333"/><circle cx="53" cy="54" r="2" fill="#333"/>
        <path d="M42,62 Q50,68 58,62" stroke="#111" strokeWidth="2" fill="none"/>
      </svg>
    ),
    'Sea Turtle': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <ellipse cx="50" cy="55" rx="32" ry="25" fill={color}/>
        <ellipse cx="50" cy="55" rx="24" ry="18" fill="#2d7a4a"/>
        <path d="M30,44 Q22,34 26,26 Q32,36 36,44 Z" fill={color}/>
        <path d="M70,44 Q78,34 74,26 Q68,36 64,44 Z" fill={color}/>
        <path d="M30,66 Q20,74 22,82 Q30,74 36,68 Z" fill={color}/>
        <path d="M70,66 Q80,74 78,82 Q70,74 64,68 Z" fill={color}/>
        <ellipse cx="50" cy="38" rx="12" ry="10" fill={color}/>
        <circle cx="44" cy="35" r="4" fill="#111"/><circle cx="56" cy="35" r="4" fill="#111"/>
        <circle cx="45" cy="34" r="1.5" fill="white"/><circle cx="57" cy="34" r="1.5" fill="white"/>
        <path d="M44,41 Q50,45 56,41" stroke="#111" strokeWidth="1.5" fill="none"/>
        <path d="M30,46 L70,46 M38,36 L38,72 M62,36 L62,72" stroke="#1a5a30" strokeWidth="2" opacity="0.4"/>
      </svg>
    ),
    'Macaw Parrot': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <ellipse cx="50" cy="58" rx="22" ry="28" fill="#cc2222"/>
        <ellipse cx="50" cy="45" rx="17" ry="17" fill="#cc2222"/>
        <path d="M66,38 Q80,28 78,18 Q70,26 64,36 Z" fill="#f5a623"/>
        <path d="M66,38 Q78,30 76,20 Q70,28 64,36 Z" fill="#e8e840"/>
        <path d="M26,58 Q16,52 18,44 Q26,50 28,58 Z" fill="#2244cc"/>
        <path d="M74,58 Q84,52 82,44 Q74,50 72,58 Z" fill="#2244cc"/>
        <circle cx="42" cy="41" r="6" fill="#111"/><circle cx="58" cy="41" r="6" fill="#111"/>
        <circle cx="43" cy="40" r="2.5" fill="white"/><circle cx="59" cy="40" r="2.5" fill="white"/>
        <path d="M42,48 Q50,56 58,48 Q56,58 50,61 Q44,58 42,48 Z" fill="#f5a623"/>
        <path d="M38,76 L32,90 M50,78 L50,92 M62,76 L68,90" stroke="#f5a623" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    ),
    'Black Bear': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <circle cx="32" cy="35" r="13" fill="#2c2c2c"/><circle cx="68" cy="35" r="13" fill="#2c2c2c"/>
        <circle cx="32" cy="35" r="8" fill="#555"/><circle cx="68" cy="35" r="8" fill="#555"/>
        <ellipse cx="50" cy="62" rx="32" ry="28" fill="#2c2c2c"/>
        <ellipse cx="50" cy="65" rx="20" ry="18" fill="#555"/>
        <circle cx="41" cy="55" r="6" fill="#111"/><circle cx="59" cy="55" r="6" fill="#111"/>
        <circle cx="42" cy="54" r="2.5" fill="white"/><circle cx="60" cy="54" r="2.5" fill="white"/>
        <ellipse cx="50" cy="65" rx="6" ry="5" fill="#111"/>
        <circle cx="47" cy="63" r="2" fill="#333"/><circle cx="53" cy="63" r="2" fill="#333"/>
        <path d="M43,70 Q50,76 57,70" stroke="#111" strokeWidth="2" fill="none"/>
      </svg>
    ),
    'Blue Whale': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <ellipse cx="46" cy="55" rx="38" ry="20" fill={color}/>
        <ellipse cx="46" cy="57" rx="28" ry="12" fill="#c8e8f8"/>
        <path d="M80,50 Q94,40 90,30 Q82,40 74,46 Z" fill={color}/>
        <path d="M16,65 Q4,75 8,83 Q16,74 24,70 Z" fill={color}/>
        <path d="M16,60 Q6,55 8,47 Q16,54 22,60 Z" fill={color}/>
        <path d="M36,36 Q44,24 52,34" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round"/>
        <circle cx="76" cy="48" r="5" fill="#111"/><circle cx="77" cy="47" r="2" fill="white"/>
        <path d="M68,56 Q74,62 80,58" stroke="#111" strokeWidth="2" fill="none"/>
        <path d="M52,28 Q55,18 60,22" stroke="#60a5fa" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    'Albatross': (
      <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
        <ellipse cx="50" cy="55" rx="17" ry="22" fill="white"/>
        <path d="M8,48 Q22,36 50,54 Q22,62 8,58 Z" fill="white"/>
        <path d="M92,48 Q78,36 50,54 Q78,62 92,58 Z" fill="white"/>
        <path d="M8,48 Q20,38 50,54 Q20,60 8,52 Z" fill="#d0d0d0"/>
        <path d="M92,48 Q80,38 50,54 Q80,60 92,52 Z" fill="#d0d0d0"/>
        <ellipse cx="50" cy="44" rx="12" ry="10" fill="white"/>
        <circle cx="44" cy="42" r="5" fill="#111"/><circle cx="56" cy="42" r="5" fill="#111"/>
        <circle cx="45" cy="41" r="2" fill="white"/><circle cx="57" cy="41" r="2" fill="white"/>
        <path d="M42,48 Q50,56 58,48 Q56,58 50,61 Q44,58 42,48 Z" fill="#f5a623"/>
        <path d="M40,70 Q50,76 60,70 L58,82 Q50,86 42,82 Z" fill="#f5a623"/>
      </svg>
    ),
  };
  return animals[name] || (
    <svg viewBox="0 0 100 100" width={s*0.7} height={s*0.7}>
      <circle cx="50" cy="50" r="35" fill={color} opacity="0.3"/>
      <i className="fa-solid fa-paw"/>
    </svg>
  );
}

export function AnimalIcon({ name, color, habitat, size = 96 }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: size, height: size,
        borderRadius: size * 0.22,
        overflow: 'hidden',
        position: 'relative',
        background: habitat === 'forest' ? 'linear-gradient(135deg,#0d2818,#1a4a1a)' :
                    habitat === 'ocean'  ? 'linear-gradient(135deg,#0a1628,#0d3a5a)' :
                                          'linear-gradient(135deg,#0a1a2e,#1a2a4a)',
        boxShadow: `0 0 28px ${color}25, 0 6px 20px rgba(0,0,0,0.5)`,
        border: `2px solid ${color}35`,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AnimalSVG name={name} color={color} size={size} />
    </motion.div>
  );
}

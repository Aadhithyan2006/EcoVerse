const router = require('express').Router();
const auth = require('../middleware/auth');

// TerraNova AI — rule-based eco knowledge engine
// No external API key needed; runs fully locally.

const ECO_KNOWLEDGE = {
  greetings: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'howdy'],
  climate: ['climate change', 'global warming', 'greenhouse', 'carbon', 'co2', 'emissions', 'temperature', 'fossil fuel', 'paris agreement'],
  ocean: ['ocean', 'sea', 'marine', 'coral', 'plastic', 'pollution', 'fish', 'whale', 'jellyfish', 'acidification'],
  forest: ['forest', 'tree', 'deforestation', 'biodiversity', 'wildlife', 'amazon', 'rainforest', 'logging', 'habitat'],
  energy: ['solar', 'wind', 'renewable', 'energy', 'turbine', 'hydropower', 'nuclear', 'fossil', 'electricity', 'power'],
  waste: ['waste', 'recycle', 'compost', 'plastic', 'landfill', 'trash', 'garbage', 'reuse', 'zero waste', 'packaging'],
  water: ['water', 'drought', 'freshwater', 'river', 'lake', 'groundwater', 'irrigation', 'conservation'],
  food: ['food', 'vegan', 'plant-based', 'agriculture', 'farming', 'organic', 'meat', 'diet', 'sustainable food'],
  tips: ['tip', 'advice', 'how can i', 'what can i do', 'help', 'suggest', 'recommend', 'ways to'],
  quiz: ['quiz', 'test', 'question', 'challenge', 'learn', 'lesson', 'study'],
  score: ['score', 'points', 'badge', 'rank', 'leaderboard', 'progress', 'level'],
};

const RESPONSES = {
  greetings: [
    "Hello! I'm TerraNova AI, your sustainability guide. Ask me anything about climate, oceans, forests, energy, or how to live more sustainably!",
    "Hey there! Ready to explore the world of sustainability? I'm TerraNova AI — ask me anything eco-related!",
    "Hi! I'm TerraNova AI. Whether it's climate science, renewable energy, or daily eco tips — I'm here to help.",
  ],
  climate: [
    "**Climate Change** is the long-term shift in global temperatures caused primarily by human activities like burning fossil fuels.\n\n🌡️ **Key facts:**\n- Earth has warmed ~1.1°C since pre-industrial times\n- CO₂ levels are at their highest in 800,000 years\n- The Paris Agreement aims to limit warming to 1.5°C\n\n💡 **What you can do:** Reduce energy use, eat less meat, use public transport, and support renewable energy policies.",
    "**Greenhouse gases** like CO₂, methane, and nitrous oxide trap heat in the atmosphere. The main sources are:\n\n🏭 Energy production (34%)\n🌾 Agriculture (24%)\n🏗️ Industry (21%)\n🚗 Transport (14%)\n\nReducing these emissions is critical to slowing climate change.",
  ],
  ocean: [
    "**Ocean health** is critical — oceans absorb 30% of CO₂ and produce 50% of Earth's oxygen.\n\n🌊 **Threats:**\n- Plastic pollution (8M tonnes enter oceans yearly)\n- Ocean acidification (pH dropped 0.1 since industrialization)\n- Coral bleaching (50% of coral reefs lost since 1950)\n- Overfishing\n\n💡 **Help:** Reduce single-use plastics, support marine protected areas, choose sustainable seafood.",
    "**Ocean acidification** happens when CO₂ dissolves in seawater, forming carbonic acid. This harms shellfish, coral, and marine ecosystems.\n\nThe ocean has absorbed 30% of human CO₂ emissions — but at a cost to its chemistry and biodiversity.",
  ],
  forest: [
    "**Forests** cover 31% of Earth's land and are home to 80% of terrestrial species.\n\n🌳 **Why they matter:**\n- Absorb ~2.6 billion tonnes of CO₂ per year\n- Regulate rainfall and water cycles\n- Home to indigenous communities\n\n⚠️ **Threat:** 10 million hectares of forest are lost every year, mainly to agriculture.\n\n💡 **Help:** Support reforestation projects, choose FSC-certified wood, reduce paper waste.",
    "**Deforestation** is responsible for about 10% of global carbon emissions. The Amazon alone stores 150-200 billion tonnes of carbon.\n\nPlanting trees is great, but protecting existing old-growth forests is even more important — they store far more carbon than young trees.",
  ],
  energy: [
    "**Renewable Energy** sources are replenished naturally and produce little to no emissions:\n\n☀️ **Solar** — fastest growing energy source, costs dropped 90% in 10 years\n💨 **Wind** — now the cheapest electricity source in many countries\n💧 **Hydro** — largest renewable source globally\n🌋 **Geothermal** — uses Earth's internal heat\n\n🌍 Renewables now supply ~30% of global electricity. The goal is 100% by 2050.",
    "**Solar panels** convert sunlight into electricity using photovoltaic cells. A typical home solar system:\n- Generates 10,000–12,000 kWh/year\n- Offsets ~4 tonnes of CO₂ annually\n- Pays back its energy cost in 1–4 years\n\nSolar is now the cheapest form of electricity in history.",
  ],
  waste: [
    "**Waste reduction** follows the hierarchy: **Refuse → Reduce → Reuse → Recycle → Rot (compost)**\n\n♻️ **Facts:**\n- Only 9% of all plastic ever produced has been recycled\n- Food waste accounts for 8% of global emissions\n- The average person generates 4.4 lbs of trash daily\n\n💡 **Tips:** Carry reusable bags/bottles, compost food scraps, buy second-hand, avoid single-use packaging.",
    "**Composting** turns food scraps and yard waste into nutrient-rich soil. It:\n- Diverts waste from landfills (which produce methane)\n- Reduces need for chemical fertilizers\n- Improves soil health and water retention\n\nYou can compost fruit/vegetable scraps, coffee grounds, eggshells, and paper.",
  ],
  water: [
    "**Water conservation** is critical — only 3% of Earth's water is fresh, and less than 1% is accessible.\n\n💧 **Save water by:**\n- Fixing leaks (a dripping tap wastes 3,000 gallons/year)\n- Taking shorter showers\n- Using drought-resistant plants\n- Collecting rainwater\n- Running full loads in dishwashers/washing machines\n\nAgriculture uses 70% of global freshwater — choosing plant-based foods helps significantly.",
  ],
  food: [
    "**Sustainable eating** is one of the most impactful personal choices:\n\n🥩 Beef produces 60kg CO₂ per kg of food\n🐔 Chicken produces 6kg CO₂ per kg\n🥦 Vegetables produce <2kg CO₂ per kg\n\n💡 **Tips:**\n- Eat more plant-based meals\n- Buy local and seasonal produce\n- Reduce food waste (plan meals, use leftovers)\n- Choose organic when possible\n- Grow your own herbs/vegetables",
  ],
  tips: [
    "Here are **10 practical eco tips** you can start today:\n\n1. 🚶 Walk or cycle for short trips\n2. 🌱 Eat one plant-based meal per day\n3. ♻️ Sort your recycling correctly\n4. 💡 Switch to LED bulbs\n5. 🛍️ Carry a reusable bag\n6. 🚿 Take shorter showers\n7. 🔌 Unplug devices when not in use\n8. 🌳 Plant a tree or support reforestation\n9. 🛒 Buy second-hand clothing\n10. 📢 Talk to others about sustainability!",
    "**Reducing your carbon footprint** starts with understanding your biggest impact areas:\n\n✈️ **Flights** — one transatlantic flight = 1.5 tonnes CO₂\n🚗 **Driving** — switch to EV or public transport\n🏠 **Home energy** — insulate, use renewables\n🍖 **Diet** — reduce meat, especially beef\n🛍️ **Shopping** — buy less, buy better\n\nThe average person in a developed country emits 10–15 tonnes CO₂/year. The target is under 2 tonnes by 2050.",
  ],
  quiz: [
    "Ready to test your eco knowledge? Head to the **Lessons** section to find quizzes on:\n\n📚 Climate Change\n🌊 Ocean Pollution\n⚡ Renewable Energy\n🌿 Biodiversity\n\nComplete lessons first, then take the quiz to earn eco points and badges!",
  ],
  score: [
    "Your **EcoScore** reflects your learning progress and real-world actions:\n\n🌱 **Seedling** — 0–99 pts\n🌿 **Sprout** — 100–499 pts\n🌳 **Guardian** — 500–999 pts\n🏆 **Eco Legend** — 1000+ pts\n\nEarn points by completing lessons, passing quizzes, and submitting eco challenges. Check the Leaderboard to see your ranking!",
  ],
  default: [
    "That's a great question! I'm TerraNova AI, specialized in sustainability topics. Try asking me about:\n\n🌡️ Climate change\n🌊 Ocean conservation\n🌳 Forests & biodiversity\n⚡ Renewable energy\n♻️ Waste reduction\n💧 Water conservation\n🥗 Sustainable food\n\nOr ask for eco tips and I'll give you actionable advice!",
    "I'm not sure about that specific topic, but I can help with sustainability, climate science, eco tips, and environmental education. What would you like to explore?",
  ],
};

function detectTopic(message) {
  const lower = message.toLowerCase();
  for (const [topic, keywords] of Object.entries(ECO_KNOWLEDGE)) {
    if (keywords.some(kw => lower.includes(kw))) return topic;
  }
  return 'default';
}

function getResponse(topic) {
  const pool = RESPONSES[topic] || RESPONSES.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildContext(history) {
  // Simple context: if last topic was X, bias toward related topics
  return history.slice(-3).map(h => h.role + ': ' + h.content).join('\n');
}

router.post('/chat', auth, (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ message: 'Empty message' });

    const topic = detectTopic(message);
    const response = getResponse(topic);

    // Add follow-up suggestion
    const followUps = {
      climate: ['Tell me about renewable energy', 'What can I do to help?', 'Explain the Paris Agreement'],
      ocean:   ['How does plastic affect marine life?', 'What is ocean acidification?', 'How can I help the ocean?'],
      forest:  ['Why is deforestation bad?', 'How do forests help climate?', 'Tell me about biodiversity'],
      energy:  ['How do solar panels work?', 'What is wind energy?', 'Compare renewable vs fossil fuels'],
      waste:   ['How do I start composting?', 'What can be recycled?', 'Tips for zero waste living'],
      water:   ['How much water do I use daily?', 'What causes droughts?', 'Water saving tips'],
      food:    ['What is a carbon footprint of food?', 'Benefits of plant-based diet', 'How to reduce food waste'],
      tips:    ['Tell me about climate change', 'How to reduce my carbon footprint', 'Eco challenges I can do'],
      default: ['Tell me about climate change', 'Give me eco tips', 'How can I help the environment?'],
    };

    const suggestions = (followUps[topic] || followUps.default).slice(0, 3);

    res.json({ response, topic, suggestions, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/topics', auth, (req, res) => {
  res.json({
    topics: [
      { id: 'climate', label: 'Climate Change',    icon: 'fa-solid fa-temperature-high' },
      { id: 'ocean',   label: 'Ocean Health',       icon: 'fa-solid fa-water' },
      { id: 'forest',  label: 'Forests',            icon: 'fa-solid fa-tree' },
      { id: 'energy',  label: 'Renewable Energy',   icon: 'fa-solid fa-solar-panel' },
      { id: 'waste',   label: 'Waste & Recycling',  icon: 'fa-solid fa-recycle' },
      { id: 'tips',    label: 'Eco Tips',           icon: 'fa-solid fa-lightbulb' },
    ]
  });
});

module.exports = router;

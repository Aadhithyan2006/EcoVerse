const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

const lessons = [
  // FOREST WORLD
  { title: 'What is Climate Change?', topic: 'Climate', type: 'text', difficulty: 'beginner', world: 'forest', points: 10, content: 'Climate change refers to long-term shifts in global temperatures and weather patterns. Since the 1800s, human activities â€” primarily burning fossil fuels â€” have been the main driver. This releases greenhouse gases like COâ‚‚ and methane that trap heat in the atmosphere, causing global warming.\n\nKey facts:\nâ€¢ Earth has warmed ~1.2Â°C since pre-industrial times\nâ€¢ COâ‚‚ levels are at their highest in 800,000 years\nâ€¢ Extreme weather events are becoming more frequent\nâ€¢ Sea levels are rising ~3.3mm per year\n\nThe Paris Agreement (2015) aims to limit warming to 1.5Â°C above pre-industrial levels.' },
  { title: 'Biodiversity & Ecosystems', topic: 'Biodiversity', type: 'text', difficulty: 'advanced', world: 'forest', points: 30, content: 'Biodiversity refers to the variety of life on Earth â€” from genes to species to ecosystems. It underpins all life on Earth and provides essential services:\n\nâ€¢ Food security through pollination and soil health\nâ€¢ Clean water through natural filtration\nâ€¢ Climate regulation through carbon storage\nâ€¢ Medicine â€” 70% of cancer drugs come from nature\n\nThreats to biodiversity:\nâ€¢ Habitat destruction (deforestation, urbanisation)\nâ€¢ Climate change\nâ€¢ Pollution\nâ€¢ Invasive species\nâ€¢ Overexploitation\n\nCurrently, 1 million species face extinction â€” the 6th mass extinction event in Earth\'s history.' },
  { title: 'Deforestation & Its Impact', topic: 'Forests', type: 'text', difficulty: 'intermediate', world: 'forest', points: 20, content: 'Deforestation is the large-scale removal of forests, primarily for agriculture, logging, and urban expansion. It is responsible for about 10% of global carbon emissions.\n\nImpacts:\nâ€¢ Loss of habitat for 80% of terrestrial species\nâ€¢ Disruption of water cycles and rainfall patterns\nâ€¢ Soil erosion and degradation\nâ€¢ Displacement of indigenous communities\nâ€¢ Contribution to climate change\n\nThe Amazon rainforest alone stores 150â€“200 billion tonnes of carbon. Protecting existing forests is more effective than planting new ones.\n\nSolutions: Sustainable forestry, reforestation, reducing beef consumption (a major driver of deforestation).' },
  { title: 'Carbon Footprint Basics', topic: 'Climate', type: 'text', difficulty: 'beginner', world: 'forest', points: 10, content: 'A carbon footprint is the total amount of greenhouse gases produced by your actions, measured in COâ‚‚ equivalent.\n\nAverage carbon footprints:\nâ€¢ USA: ~16 tonnes COâ‚‚/year per person\nâ€¢ India: ~2 tonnes COâ‚‚/year per person\nâ€¢ Global target: Under 2 tonnes by 2050\n\nBiggest contributors:\n1. Diet (especially beef and dairy)\n2. Transport (flights, cars)\n3. Home energy use\n4. Shopping and consumption\n\nHow to reduce it:\nâ€¢ Eat less meat\nâ€¢ Use public transport or cycle\nâ€¢ Switch to renewable energy\nâ€¢ Buy less, buy second-hand\nâ€¢ Offset unavoidable emissions' },
  { title: 'Soil Health & Agriculture', topic: 'Agriculture', type: 'text', difficulty: 'intermediate', world: 'forest', points: 20, content: 'Healthy soil is the foundation of all food production. It contains billions of microorganisms per teaspoon and stores more carbon than all plants and the atmosphere combined.\n\nThreats to soil:\nâ€¢ Chemical fertilisers and pesticides\nâ€¢ Monoculture farming\nâ€¢ Overgrazing\nâ€¢ Erosion from deforestation\n\nSustainable practices:\nâ€¢ Composting and organic matter addition\nâ€¢ Crop rotation\nâ€¢ Cover cropping\nâ€¢ Reduced tillage\nâ€¢ Agroforestry\n\nHealthy soil grows healthier food, sequesters carbon, and filters water naturally.' },

  // OCEAN WORLD
  { title: 'Ocean Pollution & You', topic: 'Ocean', type: 'video', difficulty: 'beginner', world: 'ocean', points: 10, contentURL: 'https://www.youtube.com/embed/UQJQV_hAWKY', content: 'Our oceans cover 71% of Earth\'s surface and produce 50% of the oxygen we breathe. Yet they face unprecedented threats from human activity.\n\nMajor pollutants:\nâ€¢ Plastic (8 million tonnes enter oceans yearly)\nâ€¢ Agricultural runoff (nitrogen, phosphorus)\nâ€¢ Oil spills\nâ€¢ Heavy metals\nâ€¢ Noise pollution\n\nImpacts:\nâ€¢ Coral bleaching (50% of reefs lost since 1950)\nâ€¢ Dead zones (400+ worldwide)\nâ€¢ Microplastics in the food chain\nâ€¢ Threat to 700+ marine species\n\nWhat you can do: Reduce single-use plastics, participate in beach cleanups, choose sustainable seafood.' },
  { title: 'Ocean Acidification', topic: 'Ocean', type: 'text', difficulty: 'intermediate', world: 'ocean', points: 20, content: 'Ocean acidification occurs when COâ‚‚ dissolves in seawater, forming carbonic acid. Since industrialisation, ocean pH has dropped from 8.2 to 8.1 â€” a 26% increase in acidity.\n\nEffects:\nâ€¢ Coral reefs dissolve (they need alkaline water)\nâ€¢ Shellfish cannot form shells\nâ€¢ Disrupts fish behaviour and navigation\nâ€¢ Threatens the base of the marine food web\n\nThe ocean has absorbed 30% of all human COâ‚‚ emissions â€” acting as a buffer for climate change, but at a severe cost to marine life.\n\nSolutions: Reducing COâ‚‚ emissions is the only long-term fix. Local actions include reducing runoff and protecting coastal ecosystems.' },
  { title: 'Marine Ecosystems', topic: 'Marine Life', type: 'text', difficulty: 'beginner', world: 'ocean', points: 10, content: 'Marine ecosystems are among the most diverse and productive on Earth. They include:\n\nâ€¢ Coral reefs â€” "rainforests of the sea", home to 25% of marine species\nâ€¢ Mangroves â€” coastal forests that protect shorelines and store carbon\nâ€¢ Seagrass meadows â€” nurseries for fish and carbon sinks\nâ€¢ Deep sea â€” least explored, most mysterious ecosystem\nâ€¢ Open ocean â€” home to whales, sharks, tuna, and plankton\n\nPlankton produce 50% of Earth\'s oxygen through photosynthesis. Protecting marine ecosystems protects our own survival.' },
  { title: 'Sustainable Fishing', topic: 'Ocean', type: 'text', difficulty: 'intermediate', world: 'ocean', points: 20, content: 'Overfishing is one of the greatest threats to ocean health. Over 90% of the world\'s fish stocks are fully exploited or overfished.\n\nProblems with industrial fishing:\nâ€¢ Bycatch (unintended species caught and discarded)\nâ€¢ Bottom trawling destroys seafloor habitats\nâ€¢ Illegal, unreported fishing\nâ€¢ Destruction of coral reefs\n\nSustainable alternatives:\nâ€¢ Line fishing and pole-and-line methods\nâ€¢ Aquaculture (fish farming) when done responsibly\nâ€¢ Marine Protected Areas (MPAs)\nâ€¢ Consumer choices â€” look for MSC certification\n\nChoosing sustainable seafood is one of the most impactful food choices you can make.' },
  { title: 'Plastic Pollution Crisis', topic: 'Waste', type: 'text', difficulty: 'beginner', world: 'ocean', points: 10, content: 'Plastic was invented in 1907. Since then, 9.2 billion tonnes have been produced â€” and only 9% has been recycled.\n\nThe problem:\nâ€¢ Plastic takes 400â€“1000 years to decompose\nâ€¢ It breaks into microplastics that enter food chains\nâ€¢ Found in human blood, lungs, and placentas\nâ€¢ Great Pacific Garbage Patch is twice the size of Texas\n\nSingle-use plastics to avoid:\nâ€¢ Plastic bags â†’ use reusable bags\nâ€¢ Plastic bottles â†’ use a reusable bottle\nâ€¢ Straws â†’ use metal or bamboo straws\nâ€¢ Food packaging â†’ buy loose produce\n\nThe solution starts with refusing, not just recycling.' },

  // CITY WORLD
  { title: 'Renewable Energy Sources', topic: 'Energy', type: 'text', difficulty: 'intermediate', world: 'city', points: 20, content: 'Renewable energy comes from natural sources replenished faster than consumed. Unlike fossil fuels, they produce little to no greenhouse gas emissions.\n\nTypes:\nâ˜€ï¸ Solar â€” fastest growing, costs dropped 90% in 10 years\nðŸ’¨ Wind â€” cheapest electricity source in many countries\nðŸ’§ Hydro â€” largest renewable source globally\nðŸŒ‹ Geothermal â€” uses Earth\'s internal heat\nðŸŒ¿ Biomass â€” organic matter converted to energy\n\nGlobal progress:\nâ€¢ Renewables now supply ~30% of global electricity\nâ€¢ Solar and wind are now cheaper than coal in most countries\nâ€¢ Target: 100% renewable electricity by 2050\n\nBarriers: Energy storage, grid infrastructure, political will.' },
  { title: 'Waste Segregation Basics', topic: 'Waste', type: 'game', difficulty: 'beginner', world: 'city', points: 15, content: 'Proper waste segregation is the first step in waste management. When waste is sorted correctly, more can be recycled and less ends up in landfill.\n\nCategories:\nâ™»ï¸ Recyclable: Paper, cardboard, glass, metals, hard plastics\nðŸŒ± Compostable: Food scraps, garden waste, paper towels\nðŸ—‘ï¸ General waste: Contaminated items, soft plastics, ceramics\nâš ï¸ Hazardous: Batteries, electronics, chemicals, medicines\n\nWhy it matters:\nâ€¢ Landfills produce methane (80x more potent than COâ‚‚)\nâ€¢ Recycling saves energy and raw materials\nâ€¢ Composting returns nutrients to soil\n\nTip: When in doubt, check your local council guidelines.' },
  { title: 'Sustainable Cities', topic: 'Urban', type: 'text', difficulty: 'intermediate', world: 'city', points: 20, content: 'Cities cover only 3% of Earth\'s land but consume 75% of its resources and produce 80% of greenhouse gas emissions. Making cities sustainable is critical.\n\nKey strategies:\nðŸšŒ Public transport â€” reduces per-person emissions by 45%\nðŸ—ï¸ Green buildings â€” passive design, solar panels, insulation\nðŸŒ³ Urban green spaces â€” parks, green roofs, urban forests\nâš¡ Smart grids â€” efficient energy distribution\nðŸš² Cycling infrastructure â€” reduces cars and improves health\n\nExamples:\nâ€¢ Copenhagen: 62% of residents cycle to work\nâ€¢ Singapore: 47% green cover in a dense city\nâ€¢ Curitiba, Brazil: Pioneer of bus rapid transit\n\nSustainable cities improve quality of life while reducing environmental impact.' },
  { title: 'Green Technology & Innovation', topic: 'Technology', type: 'text', difficulty: 'advanced', world: 'city', points: 30, content: 'Green technology (cleantech) refers to products and services that use renewable materials and energy sources, reduce emissions, and have minimal environmental impact.\n\nKey innovations:\nðŸ”‹ Battery storage â€” enables 24/7 renewable energy\nðŸš— Electric vehicles â€” zero tailpipe emissions\nðŸ’¡ LED lighting â€” 75% more efficient than incandescent\nðŸ  Smart home systems â€” optimise energy use\nðŸŒ¾ Vertical farming â€” 95% less water, no pesticides\nðŸŒŠ Wave and tidal energy â€” untapped ocean power\n\nEmerging technologies:\nâ€¢ Green hydrogen as fuel\nâ€¢ Carbon capture and storage\nâ€¢ Lab-grown meat\nâ€¢ Biodegradable plastics\n\nInvestment in cleantech reached $500 billion in 2023.' },
  { title: 'Water Conservation', topic: 'Water', type: 'text', difficulty: 'beginner', world: 'city', points: 10, content: 'Only 3% of Earth\'s water is fresh, and less than 1% is accessible. Yet we waste enormous amounts daily.\n\nWater facts:\nâ€¢ A dripping tap wastes 3,000 gallons per year\nâ€¢ Agriculture uses 70% of global freshwater\nâ€¢ 2 billion people lack access to safe drinking water\nâ€¢ By 2025, half the world may face water scarcity\n\nHow to conserve water:\nðŸš¿ Take shorter showers (saves 10 gallons per minute)\nðŸŒ¿ Use drought-resistant plants in gardens\nðŸ”§ Fix leaks immediately\nðŸ¥— Eat less meat (1kg beef requires 15,000 litres of water)\nðŸŒ§ï¸ Collect rainwater for gardens\n\nWater conservation is climate action â€” water treatment uses significant energy.' },
  { title: 'Circular Economy', topic: 'Economy', type: 'text', difficulty: 'advanced', world: 'city', points: 30, content: 'A circular economy is an alternative to the traditional "take-make-dispose" model. It aims to keep resources in use for as long as possible.\n\nPrinciples:\n1. Design out waste and pollution\n2. Keep products and materials in use\n3. Regenerate natural systems\n\nExamples:\nâ€¢ Repair cafes â€” fix instead of replace\nâ€¢ Product-as-a-service â€” lease, don\'t own\nâ€¢ Industrial symbiosis â€” one company\'s waste is another\'s resource\nâ€¢ Remanufacturing â€” restore products to original quality\n\nBenefits:\nâ€¢ Reduces raw material extraction\nâ€¢ Creates local jobs\nâ€¢ Saves money for businesses and consumers\nâ€¢ Reduces waste and emissions\n\nThe EU Circular Economy Action Plan targets 55% recycling by 2025.' },
  { title: 'Air Quality & Health', topic: 'Pollution', type: 'text', difficulty: 'intermediate', world: 'city', points: 20, content: 'Air pollution kills 7 million people per year â€” more than AIDS, malaria, and tuberculosis combined. It is the world\'s largest environmental health risk.\n\nMain pollutants:\nâ€¢ PM2.5 â€” tiny particles that penetrate lungs and bloodstream\nâ€¢ NOâ‚‚ â€” from vehicles and industry\nâ€¢ Ozone (Oâ‚ƒ) â€” formed by sunlight reacting with pollutants\nâ€¢ Carbon monoxide â€” from incomplete combustion\n\nHealth effects:\nâ€¢ Respiratory diseases (asthma, COPD)\nâ€¢ Cardiovascular disease\nâ€¢ Cognitive impairment in children\nâ€¢ Premature death\n\nSolutions:\nâ€¢ Transition to electric vehicles\nâ€¢ Clean cooking fuels\nâ€¢ Industrial emission controls\nâ€¢ Urban green spaces\nâ€¢ Active transport (cycling, walking)' },
  { title: 'Food Systems & Sustainability', topic: 'Food', type: 'text', difficulty: 'intermediate', world: 'forest', points: 20, content: 'The global food system accounts for 26% of greenhouse gas emissions and uses 50% of habitable land.\n\nCarbon footprint of foods (kg COâ‚‚ per kg):\nðŸ¥© Beef: 60 kg\nðŸ‘ Lamb: 24 kg\nðŸ· Pork: 7 kg\nðŸ” Chicken: 6 kg\nðŸ¥› Dairy: 3 kg\nðŸ¥¦ Vegetables: <2 kg\n\nFood waste:\nâ€¢ 1/3 of all food produced is wasted\nâ€¢ Food waste = 8% of global emissions\nâ€¢ If food waste were a country, it would be the 3rd largest emitter\n\nSustainable choices:\nâ€¢ Eat more plant-based meals\nâ€¢ Buy local and seasonal\nâ€¢ Reduce food waste (meal planning, composting)\nâ€¢ Grow your own food' },
  { title: 'Climate Justice', topic: 'Climate', type: 'text', difficulty: 'advanced', world: 'forest', points: 30, content: 'Climate justice recognises that climate change disproportionately affects the world\'s most vulnerable populations â€” those who have contributed least to the problem.\n\nKey inequalities:\nâ€¢ Low-income countries face the worst impacts (floods, droughts, heat)\nâ€¢ Indigenous communities lose lands and livelihoods\nâ€¢ Women and girls are more vulnerable to climate disasters\nâ€¢ Future generations inherit the consequences of today\'s decisions\n\nExamples:\nâ€¢ Bangladesh â€” 1m sea level rise would displace 17 million people\nâ€¢ Sub-Saharan Africa â€” crop yields could fall 50% by 2050\nâ€¢ Pacific Islands â€” entire nations face submersion\n\nClimate justice demands:\nâ€¢ Rich nations cut emissions fastest\nâ€¢ Climate finance for developing nations\nâ€¢ Loss and damage compensation\nâ€¢ Inclusion of marginalised voices in policy' },
];

const quizzes = [
  {
    title: 'Climate Change Fundamentals', points: 25, lessonIndex: 0,
    questions: [
      { question: 'What is the primary cause of climate change?', options: ['Volcanic eruptions', 'Human activities burning fossil fuels', 'Solar flares', 'Natural ocean cycles'], correctAnswer: 1, explanation: 'Human activities, especially burning coal, oil and gas, are the primary driver of modern climate change.' },
      { question: 'By how much has Earth warmed since pre-industrial times?', options: ['0.5Â°C', '1.2Â°C', '2.5Â°C', '3.0Â°C'], correctAnswer: 1, explanation: 'Earth has warmed approximately 1.2Â°C since the pre-industrial era.' },
      { question: 'What does the Paris Agreement aim to limit warming to?', options: ['1.0Â°C', '1.5Â°C', '2.0Â°C', '2.5Â°C'], correctAnswer: 1, explanation: 'The Paris Agreement aims to limit global warming to 1.5Â°C above pre-industrial levels.' },
      { question: 'Which gas is the main greenhouse gas from human activities?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide (COâ‚‚)', 'Hydrogen'], correctAnswer: 2, explanation: 'COâ‚‚ from burning fossil fuels is the primary greenhouse gas driving climate change.' },
      { question: 'What percentage of global emissions does the energy sector produce?', options: ['14%', '24%', '34%', '44%'], correctAnswer: 2, explanation: 'Energy production accounts for approximately 34% of global greenhouse gas emissions.' },
    ]
  },
  {
    title: 'Biodiversity Assessment', points: 30, lessonIndex: 1,
    questions: [
      { question: 'What percentage of terrestrial species live in forests?', options: ['40%', '60%', '80%', '95%'], correctAnswer: 2, explanation: 'Forests are home to approximately 80% of all terrestrial species.' },
      { question: 'How many species currently face extinction?', options: ['100,000', '500,000', '1 million', '5 million'], correctAnswer: 2, explanation: 'According to IPBES, approximately 1 million species currently face extinction.' },
      { question: 'Which is NOT a threat to biodiversity?', options: ['Habitat destruction', 'Climate change', 'Photosynthesis', 'Invasive species'], correctAnswer: 2, explanation: 'Photosynthesis is a natural process that supports life â€” not a threat to biodiversity.' },
      { question: 'What percentage of cancer drugs come from nature?', options: ['30%', '50%', '70%', '90%'], correctAnswer: 2, explanation: 'Approximately 70% of cancer drugs are derived from natural sources.' },
      { question: 'What is the current extinction event called?', options: ['5th mass extinction', '6th mass extinction', 'Holocene extinction', 'Both B and C'], correctAnswer: 3, explanation: 'The current event is called both the 6th mass extinction and the Holocene extinction.' },
    ]
  },
  {
    title: 'Ocean Health Quiz', points: 25, lessonIndex: 5,
    questions: [
      { question: 'How much plastic enters the ocean every year?', options: ['1 million tonnes', '4 million tonnes', '8 million tonnes', '20 million tonnes'], correctAnswer: 2, explanation: 'Approximately 8 million tonnes of plastic enter the oceans every year.' },
      { question: 'What percentage of coral reefs have been lost since 1950?', options: ['20%', '35%', '50%', '70%'], correctAnswer: 2, explanation: 'About 50% of the world\'s coral reefs have been lost since 1950.' },
      { question: 'What percentage of Earth\'s oxygen does the ocean produce?', options: ['20%', '35%', '50%', '70%'], correctAnswer: 2, explanation: 'Marine phytoplankton produce approximately 50% of Earth\'s oxygen.' },
      { question: 'How much of human COâ‚‚ emissions has the ocean absorbed?', options: ['10%', '20%', '30%', '40%'], correctAnswer: 2, explanation: 'The ocean has absorbed approximately 30% of all human COâ‚‚ emissions.' },
      { question: 'What is the Great Pacific Garbage Patch?', options: ['A recycling facility', 'A concentration of marine debris', 'An oil spill', 'A coral reef'], correctAnswer: 1, explanation: 'The Great Pacific Garbage Patch is a massive concentration of marine debris, mostly microplastics.' },
    ]
  },
  {
    title: 'Renewable Energy Assessment', points: 30, lessonIndex: 10,
    questions: [
      { question: 'By how much have solar panel costs dropped in 10 years?', options: ['30%', '60%', '90%', '95%'], correctAnswer: 2, explanation: 'Solar panel costs have dropped by approximately 90% over the past decade.' },
      { question: 'What percentage of global electricity do renewables supply?', options: ['10%', '20%', '30%', '50%'], correctAnswer: 2, explanation: 'Renewables now supply approximately 30% of global electricity generation.' },
      { question: 'Which renewable energy source is currently the largest globally?', options: ['Solar', 'Wind', 'Hydropower', 'Geothermal'], correctAnswer: 2, explanation: 'Hydropower remains the largest source of renewable electricity globally.' },
      { question: 'What is the main challenge for 24/7 renewable energy?', options: ['Cost', 'Energy storage', 'Land use', 'Public acceptance'], correctAnswer: 1, explanation: 'Energy storage (batteries) is the main challenge for continuous renewable energy supply.' },
      { question: 'Which country generates the most solar energy?', options: ['USA', 'Germany', 'China', 'India'], correctAnswer: 2, explanation: 'China is the world\'s largest producer of solar energy, accounting for about 35% of global capacity.' },
    ]
  },
  {
    title: 'Waste & Recycling Test', points: 20, lessonIndex: 11,
    questions: [
      { question: 'What percentage of all plastic ever produced has been recycled?', options: ['9%', '25%', '40%', '60%'], correctAnswer: 0, explanation: 'Only 9% of all plastic ever produced has been recycled.' },
      { question: 'Which waste category does food scraps belong to?', options: ['Recyclable', 'Compostable', 'General waste', 'Hazardous'], correctAnswer: 1, explanation: 'Food scraps are compostable â€” they can be turned into nutrient-rich compost.' },
      { question: 'What gas do landfills produce that contributes to climate change?', options: ['Carbon dioxide', 'Methane', 'Nitrous oxide', 'Ozone'], correctAnswer: 1, explanation: 'Landfills produce methane as organic waste decomposes. Methane is 80x more potent than COâ‚‚ over 20 years.' },
      { question: 'What is the correct waste hierarchy order?', options: ['Reduce, Reuse, Recycle', 'Refuse, Reduce, Reuse, Recycle, Rot', 'Recycle, Reduce, Reuse', 'Reuse, Recycle, Reduce'], correctAnswer: 1, explanation: 'The full waste hierarchy is: Refuse â†’ Reduce â†’ Reuse â†’ Recycle â†’ Rot (compost).' },
      { question: 'How long does a plastic bottle take to decompose?', options: ['10 years', '50 years', '200 years', '400-1000 years'], correctAnswer: 3, explanation: 'Plastic bottles take 400â€“1000 years to decompose.' },
    ]
  },
  {
    title: 'Carbon Footprint Challenge', points: 25, lessonIndex: 3,
    questions: [
      { question: 'What is the average carbon footprint per person in the USA?', options: ['4 tonnes', '8 tonnes', '16 tonnes', '24 tonnes'], correctAnswer: 2, explanation: 'The average American has a carbon footprint of approximately 16 tonnes COâ‚‚ per year.' },
      { question: 'Which food has the highest carbon footprint per kg?', options: ['Chicken', 'Pork', 'Beef', 'Lamb'], correctAnswer: 2, explanation: 'Beef produces approximately 60kg COâ‚‚ per kg of food â€” the highest of any common food.' },
      { question: 'What is the global target carbon footprint per person by 2050?', options: ['Under 2 tonnes', 'Under 5 tonnes', 'Under 8 tonnes', 'Under 10 tonnes'], correctAnswer: 0, explanation: 'To limit warming to 1.5Â°C, the global average needs to fall to under 2 tonnes per person by 2050.' },
      { question: 'Which transport mode has the highest carbon footprint per km?', options: ['Car', 'Train', 'Short-haul flight', 'Long-haul flight'], correctAnswer: 2, explanation: 'Short-haul flights have the highest carbon footprint per km due to fuel use during takeoff and landing.' },
      { question: 'What percentage of global emissions does the food system produce?', options: ['10%', '18%', '26%', '35%'], correctAnswer: 2, explanation: 'The global food system accounts for approximately 26% of greenhouse gas emissions.' },
    ]
  },
  {
    title: 'Water Conservation Quiz', points: 20, lessonIndex: 14,
    questions: [
      { question: 'What percentage of Earth\'s water is fresh?', options: ['1%', '3%', '10%', '25%'], correctAnswer: 1, explanation: 'Only 3% of Earth\'s water is fresh, and less than 1% is accessible for human use.' },
      { question: 'How much water does agriculture use globally?', options: ['30%', '50%', '70%', '90%'], correctAnswer: 2, explanation: 'Agriculture accounts for approximately 70% of global freshwater withdrawals.' },
      { question: 'How many litres of water does producing 1kg of beef require?', options: ['1,000', '5,000', '10,000', '15,000'], correctAnswer: 3, explanation: 'Producing 1kg of beef requires approximately 15,000 litres of water.' },
      { question: 'How much water does a dripping tap waste per year?', options: ['100 gallons', '500 gallons', '3,000 gallons', '10,000 gallons'], correctAnswer: 2, explanation: 'A dripping tap can waste approximately 3,000 gallons of water per year.' },
      { question: 'By 2025, what fraction of the world may face water scarcity?', options: ['One quarter', 'One third', 'Half', 'Two thirds'], correctAnswer: 2, explanation: 'By 2025, approximately half the world\'s population could face high water stress.' },
    ]
  },
  {
    title: 'Sustainable Cities Assessment', points: 25, lessonIndex: 12,
    questions: [
      { question: 'What percentage of global resources do cities consume?', options: ['25%', '50%', '75%', '90%'], correctAnswer: 2, explanation: 'Cities cover only 3% of land but consume approximately 75% of global resources.' },
      { question: 'By how much does public transport reduce per-person emissions?', options: ['15%', '30%', '45%', '60%'], correctAnswer: 2, explanation: 'Using public transport instead of a private car can reduce per-person emissions by approximately 45%.' },
      { question: 'What percentage of Copenhagen residents cycle to work?', options: ['22%', '42%', '62%', '82%'], correctAnswer: 2, explanation: 'Approximately 62% of Copenhagen residents cycle to work.' },
      { question: 'What is a green roof?', options: ['A roof painted green', 'A roof covered with vegetation', 'A solar panel roof', 'An energy-efficient roof'], correctAnswer: 1, explanation: 'A green roof is covered with vegetation and soil, providing insulation and supporting biodiversity.' },
      { question: 'What percentage of greenhouse gases do cities produce?', options: ['40%', '60%', '80%', '95%'], correctAnswer: 2, explanation: 'Cities produce approximately 80% of global greenhouse gas emissions.' },
    ]
  },
];

const challenges = [
  { taskName: 'Plant a Tree', description: 'Plant a tree in your garden, school, or community space. Submit a photo with the sapling.', proofType: 'photo', points: 100, world: 'forest' },
  { taskName: 'Zero Waste Day', description: 'Spend an entire day producing zero waste. Document everything you refused, reduced, or composted.', proofType: 'text', points: 75, world: 'city' },
  { taskName: 'Beach or Park Cleanup', description: 'Organise or join a cleanup of a beach, park, or river. Submit photos of the waste collected.', proofType: 'both', points: 150, world: 'ocean' },
  { taskName: 'Switch to Reusables', description: 'Replace 5 single-use items with reusable alternatives this week. List what you switched.', proofType: 'text', points: 50, world: 'city' },
  { taskName: 'Meatless Week', description: 'Go meat-free for an entire week. Share your meals and how you felt about the experience.', proofType: 'text', points: 80, world: 'forest' },
  { taskName: 'Cycle or Walk to School', description: 'Cycle or walk to school/work for 5 consecutive days instead of using a car or bus.', proofType: 'text', points: 60, world: 'city' },
  { taskName: 'Start a Compost Bin', description: 'Set up a compost bin at home or school. Document the setup and first week of composting.', proofType: 'both', points: 90, world: 'forest' },
  { taskName: 'Energy Audit', description: 'Conduct an energy audit of your home or classroom. Identify 5 ways to reduce energy use.', proofType: 'text', points: 70, world: 'city' },
  { taskName: 'Teach Someone About Climate', description: 'Teach a family member or friend about one climate change topic. Describe what you taught and their reaction.', proofType: 'text', points: 40, world: 'forest' },
  { taskName: 'Ocean Awareness Campaign', description: 'Create a poster, social media post, or presentation about ocean pollution. Share it with at least 10 people.', proofType: 'both', points: 120, world: 'ocean' },
  { taskName: 'Grow Your Own Food', description: 'Grow at least one vegetable, herb, or fruit from seed. Document the growth over 2 weeks.', proofType: 'photo', points: 85, world: 'forest' },
  { taskName: 'Reduce Screen Time Energy', description: 'Reduce your device screen time by 30% for one week to save electricity. Track your usage.', proofType: 'text', points: 45, world: 'city' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Lesson.deleteMany();
  await Quiz.deleteMany();
  await Challenge.deleteMany();

  const createdLessons = await Lesson.insertMany(lessons);
  console.log(`${createdLessons.length} lessons seeded`);

  const quizDocs = quizzes.map(q => ({
    lessonId: createdLessons[q.lessonIndex]?._id,
    title: q.title,
    points: q.points,
    questions: q.questions,
  }));
  await Quiz.insertMany(quizDocs);
  console.log(`${quizDocs.length} quizzes seeded`);

  await Challenge.insertMany(challenges);
  console.log(`${challenges.length} challenges seeded`);

  if (!await User.findOne({ email: 'admin@ecoverse.com' })) {
    await User.create({ name: 'Admin', email: 'admin@ecoverse.com', password: 'admin123', role: 'admin' });
    console.log('Admin created: admin@ecoverse.com / admin123');
  }

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

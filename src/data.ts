import { Product, Dealer, SuccessStory } from './types';

export const PRODUCTS: Product[] = [
  // MAIZE
  {
    id: 'sra-9048',
    name: 'SRA 9048',
    cropType: 'Maize',
    category: 'Maize',
    tagline: 'High starch recovery & premium kernel depth.',
    image: 'https://cdn.phototourl.com/free/2026-07-19-33d365fe-1746-435e-adda-bd768792c4f6.png',
    rating: 4.8,
    expectedYield: '34 - 38 Quintals/Acre',
    diseaseResistance: ['Turcicum Leaf Blight', 'Common Rust'],
    germinationRate: '98%',
    climateSuitability: 'Wide adaptability, High heat tolerance',
    soilCompatibility: 'Well-drained sandy loam, deep black soils',
    waterAvailability: 'Medium irrigation (3-4 cycles)',
    sowingWindow: 'June - July (Kharif) / Oct - Nov (Rabi)',
    harvestWindow: 'Oct - Nov (Kharif) / Feb - Mar (Rabi)',
    availableSizes: ['4kg', '8kg'],
    states: ['Telangana', 'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Haryana', 'Bihar'],
    description: 'SRA 9048 is an elite hybrid maize variety known for its uniform bold grains, strong stalk performance, and exceptional tip filling. Ideal for high-yielding commercial feed and starch processing.',
    features: [
      'Bold orange-yellow grain texture with high test weight',
      'Excellent stay-green character for dual-use silage fodder',
      'Strong lodging resistance even under heavy winds'
    ],
    benefits: [
      'Commanding market premium due to superior grain lust',
      'Reduced post-harvest seed cracking',
      'Optimized fodder value after cob harvest'
    ],
    fertilizerGuide: 'N:P:K at 120:60:40 kg/Acre. Split Nitrogen into 3 applications.',
    irrigationGuide: 'Ensure adequate moisture during silking and milk stages.',
    growthDuration: '110 - 115 Days',
    height: '220 - 240 cm',
    grainQuality: 'Glossy orange-yellow semi-flint grains',
    brochureUrl: '#'
  },
  {
    id: 'sra-9092',
    name: 'SRA 9092',
    cropType: 'Maize',
    category: 'Maize',
    tagline: 'Excellent tip filling and high shelling percentage.',
    image: 'https://cdn.phototourl.com/member/2026-07-19-d9108367-dfca-4551-bf64-6186cb6ac014.png',
    rating: 4.9,
    expectedYield: '35 - 40 Quintals/Acre',
    diseaseResistance: ['Maydis Leaf Blight', 'Fusarium Stalk Rot'],
    germinationRate: '99%',
    climateSuitability: 'Warm & sunny, excellent summer survival',
    soilCompatibility: 'Clay loam and alluvial soils',
    waterAvailability: 'Moderate irrigation',
    sowingWindow: 'Kharif: June - July / Rabi: Oct - Dec',
    harvestWindow: 'Kharif: Oct / Rabi: Mar - Apr',
    availableSizes: ['4kg', '8kg'],
    states: ['Telangana', 'Andhra Pradesh', 'Madhya Pradesh', 'Gujarat', 'Haryana'],
    description: 'SRA 9092 stands out with its heavy grain weight and deep kernel configuration. It maintains robust plant health throughout the vegetative and grain-filling stages, offering farmers maximum tonnage.',
    features: [
      'Superb shelling recovery exceeding 84%',
      'Uniform grain rows (16-18 rows per cob)',
      'Tight husk cover protecting against bird damage'
    ],
    benefits: [
      'Maximized profit margin with premium starch yield',
      'Excellent drought escape capability',
      'Uniform cob maturity facilitating easier harvesting'
    ],
    fertilizerGuide: 'N:P:K at 130:65:45 kg/Acre. Apply zinc sulphate for better grain set.',
    irrigationGuide: 'Avoid waterlogging; irrigate at knee-high, tasseling, and dough stages.',
    growthDuration: '112 - 118 Days',
    height: '230 - 250 cm',
    grainQuality: 'Flat bold orange kernels, low moisture absorption',
    brochureUrl: '#'
  },
  {
    id: 'sra-5545',
    name: 'SRA 5545',
    cropType: 'Maize',
    category: 'Maize',
    tagline: 'Robust plant structure with heavy cob-bearing potential.',
    image: 'https://cdn.phototourl.com/member/2026-07-19-5ee3c02b-f16b-4715-8496-434387fdbb7e.png',
    rating: 4.7,
    expectedYield: '33 - 37 Quintals/Acre',
    diseaseResistance: ['Turcicum Blight', 'Banded Leaf and Sheath Blight'],
    germinationRate: '98%',
    climateSuitability: 'Hot and humid monsoon areas',
    soilCompatibility: 'Deep loamy soils with good drainage',
    waterAvailability: 'Medium to high irrigation',
    sowingWindow: 'June 15 - July 15',
    harvestWindow: 'October - November',
    availableSizes: ['4kg'],
    states: ['Telangana', 'Karnataka', 'Rajasthan', 'Uttar Pradesh', 'Punjab'],
    description: 'SRA 5545 is highly recommended for direct intensive farming. It produces two uniform cobs per plant under high fertilization, multiplying yield returns for commercial operations.',
    features: [
      'Thick, strong shank preventing cob dropping',
      'Vibrant yellow grains with a hard endosperm',
      'Exceptional performance in winter trials'
    ],
    benefits: [
      'Higher returns for silage-making',
      'Outstanding lodging tolerance',
      'High resistance to seed-borne fungal infections'
    ],
    fertilizerGuide: '140:70:50 kg N:P:K per Acre. Add organic manure during preparation.',
    irrigationGuide: 'Maintain uniform moisture; critical at flowering.',
    growthDuration: '108 - 114 Days',
    height: '215 - 235 cm',
    grainQuality: 'Bright yellow-orange flint grains',
    brochureUrl: '#'
  },
  {
    id: 'sra-1999',
    name: 'SRA 1999',
    cropType: 'Maize',
    category: 'Maize',
    tagline: 'Early maturity with rapid grain drying characteristics.',
    image: 'https://cdn.phototourl.com/member/2026-07-19-7744ae91-d463-44b3-866a-8b862d67c815.png',
    rating: 4.8,
    expectedYield: '32 - 36 Quintals/Acre',
    diseaseResistance: ['Leaf Blights', 'Stem Borer tolerant'],
    germinationRate: '98%',
    climateSuitability: 'Dry zones and erratic monsoon regions',
    soilCompatibility: 'Medium sandy loam and black soils',
    waterAvailability: 'Low to moderate irrigation',
    sowingWindow: 'June - July',
    harvestWindow: 'September - October',
    availableSizes: ['4kg', '8kg'],
    states: ['Telangana', 'Rajasthan', 'Madhya Pradesh', 'Maharashtra', 'Gujarat'],
    description: 'SRA 1999 is a fast-growing, early-maturing hybrid corn. It allows early harvesting, saving water resources and leaving the field perfectly ready for winter crop rotation like wheat or mustard.',
    features: [
      'Short duration crop escaping late season droughts',
      'High early seedling vigor',
      'Fast sun-drying grains reducing moisture management costs'
    ],
    benefits: [
      'Saves 15-20% on water usage compared to long-duration hybrids',
      'Optimizes crop rotation schedules',
      'Densely packed kernels with uniform filling'
    ],
    fertilizerGuide: '110:55:35 kg N:P:K per Acre. Basal application of compost.',
    irrigationGuide: 'Requires 3 scheduled waterings at key growth checkpoints.',
    growthDuration: '95 - 102 Days',
    height: '200 - 225 cm',
    grainQuality: 'Glossy golden yellow grains',
    brochureUrl: '#'
  },
  {
    id: 'sra-5144-plus',
    name: 'SRA 5144 Plus',
    cropType: 'Maize',
    category: 'Maize',
    tagline: 'Dual-purpose high performer: Massive cobs and high-quality silage.',
    image: 'https://cdn.phototourl.com/member/2026-07-19-d7da2fce-6e96-4b58-a1b2-82938b585fba.png',
    rating: 4.9,
    expectedYield: '36 - 42 Quintals/Acre',
    diseaseResistance: ['Banded Leaf Blight', 'Charcoal Rot'],
    germinationRate: '99%',
    climateSuitability: 'Extremely adaptive, high heat tolerance up to 45°C',
    soilCompatibility: 'Rich loamy, silt soils',
    waterAvailability: 'Medium to high irrigation',
    sowingWindow: 'Kharif: June / Rabi: October',
    harvestWindow: 'Kharif: Oct / Rabi: Mar',
    availableSizes: ['4kg', '8kg'],
    states: ['Telangana', 'Andhra Pradesh', 'Karnataka', 'Uttar Pradesh', 'Punjab', 'Bihar'],
    description: 'SRA 5144 Plus represents the pinnacle of maize hybrid breeding. It offers superior yield density, complete grain fill right to the tip of the cob, and premium nutrition values for livestock feeds.',
    features: [
      'Robust root anchors with massive lodging resistance',
      'Long cylindrical cobs (20-22 cm length)',
      'Exceptional grain weight and density'
    ],
    benefits: [
      'Maximum dry matter and starch content',
      'Sustained plant greenness up to harvest',
      'High shelling index ensuring solid weight tickets'
    ],
    fertilizerGuide: 'N:P:K at 150:75:50 kg/Acre. Split nitrogen at 3 crucial stages.',
    irrigationGuide: 'Regular watering is critical at tasseling and milk stages.',
    growthDuration: '115 - 120 Days',
    height: '240 - 260 cm',
    grainQuality: 'Semi-dent bright orange-red kernels',
    brochureUrl: '#'
  },
  {
    id: 'sra-551',
    name: 'SRA 551',
    cropType: 'Maize',
    category: 'Maize',
    tagline: 'Reliable and consistent harvests for small & marginal farmers.',
    image: 'https://cdn.phototourl.com/member/2026-07-19-5fce795b-8bad-4006-b83c-b6557f29e24b.png',
    rating: 4.7,
    expectedYield: '30 - 34 Quintals/Acre',
    diseaseResistance: ['Downy Mildew', 'Rust'],
    germinationRate: '97%',
    climateSuitability: 'Dry & rainfed farming zones',
    soilCompatibility: 'Sandy loam to light black soils',
    waterAvailability: 'Low to medium irrigation requirements',
    sowingWindow: 'June 10 - July 10',
    harvestWindow: 'September - October',
    availableSizes: ['4kg'],
    states: ['Telangana', 'Madhya Pradesh', 'Rajasthan', 'Gujarat'],
    description: 'SRA 551 is a dependable and affordable hybrid maize that yields heavy crops with low input requirements. It has built-in drought tolerance mechanisms, ensuring crop security for rain-fed farmers.',
    features: [
      'Vigorous vegetative growth and high leaf count',
      'Uniform cob sizing with attractive rows',
      'Sturdy stem preventing lodging under wind stress'
    ],
    benefits: [
      'Affordable seed cost with high return on investment',
      'Highly stable yield performance across seasons',
      'Grown easily with minimal chemical inputs'
    ],
    fertilizerGuide: '100:50:30 N:P:K kg/Acre. Top dress Urea at 30 and 50 days.',
    irrigationGuide: 'Rainfed primarily; supply 1-2 lifesaving irrigations if dry spells hit.',
    growthDuration: '100 - 105 Days',
    height: '210 - 230 cm',
    grainQuality: 'Bold golden orange semi-flint grain',
    brochureUrl: '#'
  },

  // SSG
  {
    id: 'ssg-malik-queen',
    name: 'Malik QUEEN',
    cropType: 'SSG',
    category: 'Ssg',
    tagline: 'Superior Sorghum Sudan Grass hybrid (SSG) for multi-cut fodder.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    expectedYield: '280 - 320 Quintals/Acre (Total across cuts)',
    diseaseResistance: ['Foliar Diseases', 'Anthracnose', 'Sorghum Downy Mildew'],
    germinationRate: '98%',
    climateSuitability: 'Hot summer, high humidity, wide adaptation',
    soilCompatibility: 'All soil types, thrives in heavy rich soils',
    waterAvailability: 'Medium to high irrigation',
    sowingWindow: 'March - August',
    harvestWindow: 'First cut at 45-50 days, subsequent cuts every 25-30 days',
    availableSizes: ['5kg', '10kg'],
    states: ['Telangana', 'Andhra Pradesh', 'Haryana', 'Punjab', 'Uttar Pradesh', 'Rajasthan', 'Gujarat'],
    description: 'Malik QUEEN is a highly advanced multi-cut Sorghum Sudan Grass hybrid. It is engineered specifically for premium animal forage, boasting thin sweet stems, highly palatable leaves, and rapid regeneration speeds after every cut.',
    features: [
      'Very high protein content (11-13% crude protein)',
      'Extremely vigorous regrowth with excellent tillering capacity',
      'Sweet, juicy stalks with low HCN levels for livestock safety'
    ],
    benefits: [
      'Boosts cattle milk production and general livestock health',
      'Provides up to 4-5 heavy cuts in a single sowing cycle',
      'Drought tolerance ensures lush green fodder even during peak summer'
    ],
    fertilizerGuide: 'Apply 40kg Nitrogen per Acre as basal. Apply 20kg Nitrogen after each cut.',
    irrigationGuide: 'Irrigate immediately after sowing and maintain a 10-12 days cycle in summer.',
    growthDuration: 'Multi-Cut (Full cycle 180-200 Days)',
    height: '240 - 280 cm',
    grainQuality: 'Premium green leafy fodder with high dry matter digestibility',
    brochureUrl: '#'
  },

  // URAD
  {
    id: 'urad-krishna-303',
    name: 'Krishna 303',
    cropType: 'Urad',
    category: 'Urad',
    tagline: 'Yellow Mosaic Virus resistant with bold shiny black grains.',
    image: 'https://cdn.phototourl.com/free/2026-07-19-331f7d4a-6160-4cdb-9f2f-5308df3e6c6f.png',
    rating: 4.8,
    expectedYield: '10 - 12 Quintals/Acre',
    diseaseResistance: ['Yellow Mosaic Virus (YMV)', 'Powdery Mildew'],
    germinationRate: '98%',
    climateSuitability: 'Warm and moderately dry crop environment',
    soilCompatibility: 'Well-drained medium black cotton and loamy soils',
    waterAvailability: 'Low irrigation, ideal for rainfed or residual moisture',
    sowingWindow: 'Kharif: June - July / Spring: February - March',
    harvestWindow: 'Kharif: September / Spring: May',
    availableSizes: ['5kg', '10kg'],
    states: ['Telangana', 'Andhra Pradesh', 'Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh', 'Rajasthan'],
    description: 'Krishna 303 is SRA SHRIJI\'s leading black gram variety. Characterized by an erect plant profile and synchronous pod maturity, it is highly suitable for mechanical harvesting and offers robust immunity against the destructive Yellow Mosaic Virus.',
    features: [
      'Erect, compact plant frame allowing high-density sowing',
      'Bold, black, lustrous seeds with uniform seed weight',
      'Synchronous pod ripening minimizing field shattering'
    ],
    benefits: [
      'No viral crop damage, saving heavy fungicide costs',
      'Short duration leaves field ready for quick Rabi sowing',
      'Premium pricing at mandis due to shiny bold seed appeal'
    ],
    fertilizerGuide: 'N:P:K at 10:20:10 kg/Acre. Seed inoculation with Rhizobium culture is recommended.',
    irrigationGuide: 'Requires 1-2 irrigations at flowering and pod filling stage (if dry).',
    growthDuration: '70 - 75 Days',
    height: '45 - 55 cm',
    grainQuality: 'Bold, glossy black shiny pulses',
    brochureUrl: '#'
  },

  // MOONG
  {
    id: 'moong-adha',
    name: 'ADHA',
    cropType: 'Moong',
    category: 'Moong',
    tagline: 'Synchronous maturity & excellent disease resilience.',
    image: 'https://cdn.phototourl.com/free/2026-07-19-048b1fa3-475b-4157-9bc3-06dd68fbc0d5.png',
    rating: 4.8,
    expectedYield: '8 - 10 Quintals/Acre',
    diseaseResistance: ['Yellow Mosaic Virus', 'Leaf Spot', 'Powdery Mildew'],
    germinationRate: '98%',
    climateSuitability: 'Warm summer, high drought resistance',
    soilCompatibility: 'Sandy loam to fertile clay loams',
    waterAvailability: 'Low moisture requirements',
    sowingWindow: 'Summer: Mar - Apr / Kharif: June - July',
    harvestWindow: 'Summer: May - June / Kharif: Aug - Sep',
    availableSizes: ['4kg', '8kg'],
    states: ['Telangana', 'Andhra Pradesh', 'Rajasthan', 'Haryana', 'Madhya Pradesh', 'Gujarat'],
    description: 'ADHA Moong is a highly specialized green gram variety designed for dual cropping. With a rapid crop maturity of 60 days, it is the perfect intermediate crop between wheat and paddy, restoring nitrogen soil levels naturally.',
    features: [
      'Extra-long pods containing 11-13 bold green seeds each',
      'Synchronous ripening of cobs, allowing single-harvest pulling',
      'Lush green plant which can be plowed back as green manure'
    ],
    benefits: [
      'Very short turnaround, maximizing yearly farm income',
      'Excellent drought escape and heat tolerance',
      'Dramatically reduces nitrogen chemical fertilizer costs for subsequent crops'
    ],
    fertilizerGuide: 'N:P:K at 8:16:8 kg/Acre. Apply sulphur for rich pod setting.',
    irrigationGuide: 'Irrigate at 20-25 days (pre-flowering) and 40 days (pod filling).',
    growthDuration: '60 - 65 Days',
    height: '50 - 60 cm',
    grainQuality: 'Lustrous, bold bright green grains',
    brochureUrl: '#'
  },

  // MILLET
  {
    id: 'millet-tiger-90',
    name: 'Tiger 90',
    cropType: 'Millet',
    category: 'Millet',
    tagline: 'Drought defier pearl millet with extra-long compact panicles.',
    image: 'https://cdn.phototourl.com/free/2026-07-19-7e22d560-8aa3-4fc7-9207-674220940556.png',
    rating: 4.9,
    expectedYield: '14 - 17 Quintals/Acre',
    diseaseResistance: ['Downy Mildew', 'Blast', 'Ergot'],
    germinationRate: '97%',
    climateSuitability: 'Highly arid, dry, survives temperatures up to 47°C',
    soilCompatibility: 'Sandy, gravelly soils, well-drained loam',
    waterAvailability: 'Extremely low, rainfed suitable',
    sowingWindow: 'June 15 - July 15',
    harvestWindow: 'September - October',
    availableSizes: ['1.5kg', '3kg'],
    states: ['Telangana', 'Rajasthan', 'Haryana', 'Gujarat', 'Maharashtra', 'Uttar Pradesh'],
    description: 'Tiger 90 is a premium hybrid Bajra (Pearl Millet) built for extreme climate resilience. It possesses a heavy-tillering root structure and yields extra-long, dense, fully-filled panicles (sittas) that provide rich grains and high-quality livestock dry fodder.',
    features: [
      'Super compact ears (32-38 cm panicle length) with tight grain packing',
      'Heavy tillering (5-7 productive shoots per plant)',
      'Excellent stover palatability'
    ],
    benefits: [
      'Guarantees steady food and feed even under failing rains',
      'High iron and zinc micronutrient density in harvested grains',
      'Stout lodging-proof stalks keep cobs clean and soil intact'
    ],
    fertilizerGuide: 'Apply 35kg Nitrogen and 15kg Phosphorus per Acre.',
    irrigationGuide: 'Largely rainfed. Single supplementary watering during tillering boosts yield immensely.',
    growthDuration: '80 - 85 Days',
    height: '180 - 200 cm',
    grainQuality: 'Attractive slate grey, bold spherical grains',
    brochureUrl: '#'
  },
  {
    id: 'millet-tehalka-94',
    name: 'Tehalka 94',
    cropType: 'Millet',
    category: 'Millet',
    tagline: 'Massive grain density and exceptional tillering capacity.',
    image: 'https://cdn.phototourl.com/free/2026-07-19-b548390c-03b4-4121-8c31-fe9db69deb17.png',
    rating: 4.8,
    expectedYield: '15 - 19 Quintals/Acre',
    diseaseResistance: ['Downy Mildew', 'Smut'],
    germinationRate: '98%',
    climateSuitability: 'Arid & semi-arid plains',
    soilCompatibility: 'Light to medium sandy soils',
    waterAvailability: 'Low water requirement, drought tolerant',
    sowingWindow: 'June - July',
    harvestWindow: 'September - October',
    availableSizes: ['1.5kg', '3kg'],
    states: ['Telangana', 'Rajasthan', 'Haryana', 'Madhya Pradesh', 'Uttar Pradesh'],
    description: 'Tehalka 94 Millet delivers outstanding results in dry zones. It is highly valued for its uniform tall framework, sweet stover fodder, and deep root system that pulls water from deep soil horizons.',
    features: [
      'Brilliant early crop establishment',
      'Massive uniform grain size with silver luster',
      'Highly resistant to leaf diseases'
    ],
    benefits: [
      'Consistent grain prices at local markets due to uniform visual grades',
      'Dual utility as rich green feed for farm animals',
      'Shatter-proof panicles prevent field losses during heavy wind'
    ],
    fertilizerGuide: 'N:P:K at 40:20:10 kg/Acre. FYM should be incorporated.',
    irrigationGuide: 'Irrigate only if severe drought persists longer than 20 days.',
    growthDuration: '82 - 88 Days',
    height: '190 - 210 cm',
    grainQuality: 'Glossy grey bold pearl grain',
    brochureUrl: '#'
  },

  // MUSTARD
  {
    id: 'mustard-sra-4646',
    name: 'SRA 4646',
    cropType: 'Mustard',
    category: 'Mustard',
    tagline: 'Extreme high oil content with thick branching pattern.',
    image: 'https://cdn.phototourl.com/member/2026-07-19-424d8585-ada1-4003-803b-fe9848ed374c.png',
    rating: 4.9,
    expectedYield: '11 - 13 Quintals/Acre',
    diseaseResistance: ['White Rust', 'Alternaria Leaf Blight'],
    germinationRate: '98%',
    climateSuitability: 'Cool winter temperature with dry bright days',
    soilCompatibility: 'Medium to heavy soils, clay-loam suitable',
    waterAvailability: 'Low to moderate (1-2 irrigations total)',
    sowingWindow: 'October 1 - October 30',
    harvestWindow: 'February - March',
    availableSizes: ['1kg', '2kg'],
    states: ['Telangana', 'Haryana', 'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh'],
    description: 'SRA 4646 is a champion hybrid mustard. It yields bold black lustrous grains boasting an exceptional oil extraction rate of 42-43%. Designed to survive frost shocks, it guarantees high mustard returns.',
    features: [
      'Highly branched plant architecture (18-24 primary branches)',
      'Densely packed siliquae with 20-22 bold seeds per pod',
      'Resistant to pod-shattering at maturity'
    ],
    benefits: [
      'Mandi premium bonuses due to high certified oil content',
      'Complete safety from devastating White Rust outbreaks',
      'Low cost of production due to minimal water and spray requirements'
    ],
    fertilizerGuide: 'N:P:K:S at 40:20:20:15 kg/Acre. Sulphur is vital for oil percentage.',
    irrigationGuide: '1st irrigation at 30-35 days, 2nd irrigation at flowering stage.',
    growthDuration: '115 - 125 Days',
    height: '160 - 180 cm',
    grainQuality: 'Bold black lustrous seeds with 42.5% oil level',
    brochureUrl: '#'
  },
  {
    id: 'mustard-sra-1166',
    name: 'SRA 1166',
    cropType: 'Mustard',
    category: 'Mustard',
    tagline: 'Early maturing yellow-rust resilient rabi mustard.',
    image: 'https://cdn.phototourl.com/member/2026-07-19-72db9bfd-5985-45d9-bce0-58e1181cc374.png',
    rating: 4.8,
    expectedYield: '9 - 11 Quintals/Acre',
    diseaseResistance: ['Powdery Mildew', 'Sclerotinia Rot'],
    germinationRate: '98%',
    climateSuitability: 'Moderate cold, wide winter adaptability',
    soilCompatibility: 'Light sandy-loam to medium clayey soils',
    waterAvailability: 'Very low water footprint',
    sowingWindow: 'October 15 - November 15',
    harvestWindow: 'February',
    availableSizes: ['1kg'],
    states: ['Telangana', 'Rajasthan', 'Haryana', 'Uttar Pradesh', 'Bihar'],
    description: 'SRA 1166 is an early-maturing hybrid mustard. It fits perfectly into intensive triple-cropping rotations, ripening quickly and escaping aphid infestation peaks and late-winter heat stress.',
    features: [
      'Early crop maturity (ripening in 110 days)',
      'Uniform siliquae angle preventing field damage',
      'Erect, manageable plant stature'
    ],
    benefits: [
      'Allows early potato or sugarcane transplanting post mustard harvest',
      'Saves irrigation costs (thrives on winter residual moisture)',
      'Excellent performance under late-sown conditions'
    ],
    fertilizerGuide: 'N:P:K:S at 35:18:18:12 kg/Acre. Apply elemental sulphur.',
    irrigationGuide: 'Provide one main irrigation during stem elongation stage.',
    growthDuration: '110 - 114 Days',
    height: '150 - 170 cm',
    grainQuality: 'Dark reddish-brown bold grains, 41% oil content',
    brochureUrl: '#'
  },

  // WHEAT
  {
    id: 'wheat-super-2967',
    name: 'Super 2967',
    cropType: 'Wheat',
    category: 'Wheat',
    tagline: 'High tillering, rust resistant legendary wheat variety.',
    image: 'https://cdn.phototourl.com/free/2026-07-19-47cea5f8-6cec-4b00-acca-62c66cc98286.png',
    rating: 4.9,
    expectedYield: '24 - 28 Quintals/Acre',
    diseaseResistance: ['Yellow Rust', 'Brown Rust', 'Karnal Bunt'],
    germinationRate: '99%',
    climateSuitability: 'Cool winters with bright sunny ripening phase',
    soilCompatibility: 'Clay-loam and medium loamy fertile soils',
    waterAvailability: 'Medium to high irrigation required (4-5 cycles)',
    sowingWindow: 'November 1 - November 25',
    harvestWindow: 'April',
    availableSizes: ['40kg'],
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Rajasthan', 'Bihar', 'Madhya Pradesh'],
    description: 'Super 2967 is SRA SHRIJI\'s improved premium wheat variety. Known nationwide for its thick stems, high tillering (12-14 per plant), and resistance to rust epidemics, it forms the food security backbone of Indian grain farms.',
    features: [
      'Exceptional early plant vigor and high tillering capacity',
      'Stay-green foliage keeping grain filling active under early heat waves',
      'Strong culms preventing lodging even during spring wind-storms'
    ],
    benefits: [
      'High bread/chapati flour milling value (excellent gluten network)',
      'Heavy crop weight yielding premium prices at government procurement centers',
      'Rust immunity reduces farming chemical expenses'
    ],
    fertilizerGuide: 'N:P:K at 60:30:20 kg/Acre. Apply 50% nitrogen as basal, rest during irrigations.',
    irrigationGuide: 'Irrigate at 21 days (Crown Root Initiation), jointing, flowering, and milking stages.',
    growthDuration: '135 - 140 Days',
    height: '95 - 100 cm',
    grainQuality: 'Hard, bold amber grains with 12.5% protein content',
    brochureUrl: '#'
  },
  {
    id: 'wheat-suveer',
    name: 'Suveer',
    cropType: 'Wheat',
    category: 'Wheat',
    tagline: 'Bold amber grains with unmatched lodging resistance.',
    image: 'https://cdn.phototourl.com/free/2026-07-19-c8d3b51f-5057-4389-85bb-fddb9d727f6f.png',
    rating: 4.8,
    expectedYield: '25 - 29 Quintals/Acre',
    diseaseResistance: ['Yellow Rust', 'Loose Smut'],
    germinationRate: '99%',
    climateSuitability: 'Cool, irrigated winter plains',
    soilCompatibility: 'Rich loamy, deep alluvial soils',
    waterAvailability: 'High irrigation required',
    sowingWindow: 'November 10 - November 30',
    harvestWindow: 'April',
    availableSizes: ['40kg'],
    states: ['Haryana', 'Punjab', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh'],
    description: 'Suveer Wheat represents the next tier in grain breeding. It has an optimal semi-dwarf stature, excellent lodging index under intensive fertilizer application, and beautiful vitreous grains highly valued for baking.',
    features: [
      'Thick stiff straws preventing lodging under high nitrogen application',
      'Symmetric bold spikes with high spikelet count',
      'Stay-green flag leaves for extended grain fill cycle'
    ],
    benefits: [
      'Produces clean chapati dough with excellent culinary properties',
      'Tolerant to terminal heat stress at harvest',
      'High straw density providing premium bhoosa/fodder quantity'
    ],
    fertilizerGuide: 'N:P:K at 65:32:22 kg/Acre. Split application as per guidance.',
    irrigationGuide: 'Regular scheduled irrigations; CRI stage watering is critical.',
    growthDuration: '130 - 135 Days',
    height: '90 - 95 cm',
    grainQuality: 'Lustrous, hard, vitreous amber grains',
    brochureUrl: '#'
  },

  // PADDY
  {
    id: 'paddy-pusa-1847',
    name: 'Pusa 1847',
    cropType: 'Paddy',
    category: 'Paddy',
    tagline: 'BLB & Blast resistant improved basmati paddy.',
    image: 'https://cdn.phototourl.com/free/2026-07-19-79a4571b-5905-4a03-aa1d-27a4827e326c.png',
    rating: 4.9,
    expectedYield: '26 - 30 Quintals/Acre',
    diseaseResistance: ['Bacterial Leaf Blight (BLB)', 'Rice Blast Disease', 'Neck Blast'],
    germinationRate: '98%',
    climateSuitability: 'Warm and humid, flooded basmati growing zones',
    soilCompatibility: 'Heavy clay and clay-loam soils retaining standing water',
    waterAvailability: 'High - flooded cultivation required',
    sowingWindow: 'Nursery: May 15 - June 15 / Transplanting: June 15 - July 15',
    harvestWindow: 'October - November',
    availableSizes: ['10kg', '25kg'],
    states: ['Telangana', 'Andhra Pradesh', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Uttarakhand'],
    description: 'Pusa 1847 is an improved version of the famous Pusa 1509 Basmati. It incorporates crucial genes for resistance to Bacterial Leaf Blight and Blast, ensuring stable, crop-safe basmati returns with excellent cooking properties.',
    features: [
      'Extra-long slender grains (nearly 8.4mm raw length)',
      'Exceptional elongation after cooking (up to 18-20mm)',
      'Strong erect flag leaves with minimal canopy humidity build-up'
    ],
    benefits: [
      'Eliminates the cost of expensive bactericides and blast sprays',
      'Commanding premium price in international and domestic mandis',
      'Excellent head rice recovery (above 58%) during milling'
    ],
    fertilizerGuide: 'N:P:K at 50:20:15 kg/Acre. Include Zinc Sulphate 10 kg/Acre to prevent Khaira disease.',
    irrigationGuide: 'Keep 3-5 cm standing water during transplanting and tillering. Drain 10 days before harvest.',
    growthDuration: '125 - 130 Days',
    height: '110 - 115 cm',
    grainQuality: 'Aromatic, ultra-slender, translucent long grains',
    brochureUrl: '#'
  },
  {
    id: 'paddy-pusa-1692',
    name: 'Pusa 1692',
    cropType: 'Paddy',
    category: 'Paddy',
    tagline: 'Early maturing aromatic basmati paddy with supreme grain recovery.',
    image: 'https://cdn.phototourl.com/free/2026-07-19-81873185-825a-448a-9745-e40fc17872e0.png',
    rating: 4.9,
    expectedYield: '25 - 28 Quintals/Acre',
    diseaseResistance: ['Blast tolerant', 'Bacterial Blight escape (early maturity)'],
    germinationRate: '98%',
    climateSuitability: 'Warm, humid basmati tracts',
    soilCompatibility: 'Rich clayey, silt-loam soils',
    waterAvailability: 'High water requirement',
    sowingWindow: 'Nursery: May / Transplanting: June',
    harvestWindow: 'September - October',
    availableSizes: ['10kg', '25kg'],
    states: ['Haryana', 'Punjab', 'Uttar Pradesh', 'Telangana'],
    description: 'Pusa 1692 is SRA SHRIJI\'s premier early basmati. It matures in just 115 days from seed to seed, yielding extra-long slender grains with a high milling recovery rate that exceeds traditional basmati varieties.',
    features: [
      'Short duration crop escaping late monsoon pest cycles',
      'Superior raw milling recovery (60% head rice recovery)',
      'Excellent cooking length and non-sticky texture'
    ],
    benefits: [
      'Saves 3-4 irrigations compared to late basmati varieties',
      'Allows double cropping with early winter vegetables or potato',
      'Incredible culinary aroma that commands export pricing'
    ],
    fertilizerGuide: 'N:P:K at 48:18:15 kg/Acre. Apply zinc sulphate in nursery.',
    irrigationGuide: 'Regular flooding; field drying is prohibited during panicle initiation.',
    growthDuration: '115 - 120 Days',
    height: '100 - 105 cm',
    grainQuality: 'Super-slender aromatic long grains with beautiful visual shine',
    brochureUrl: '#'
  },
  {
    id: 'paddy-pusa-1718',
    name: 'Pusa 1718',
    cropType: 'Paddy',
    category: 'Paddy',
    tagline: 'Dwarf-statured BLB resistant high yielding basmati.',
    image: 'https://cdn.phototourl.com/free/2026-07-19-c0e3d7cc-d77a-4e77-9358-f756ee87dc1a.png',
    rating: 4.8,
    expectedYield: '27 - 31 Quintals/Acre',
    diseaseResistance: ['Bacterial Leaf Blight (BLB)', 'Stem Rot'],
    germinationRate: '98%',
    climateSuitability: 'Humid, flooded environments with warm days',
    soilCompatibility: 'Clay soils with robust water retention',
    waterAvailability: 'High - flooded cultivation',
    sowingWindow: 'May - June (Nursery)',
    harvestWindow: 'October - November',
    availableSizes: ['10kg', '25kg'],
    states: ['Telangana', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Uttarakhand'],
    description: 'Pusa 1718 is a genetic improvement of the famous Pusa 1121. It has been bred to have a shorter stem height (dwarf stature) which prevents wind-induced crop lodging, while preserving basmati quality and adding BLB resistance.',
    features: [
      'Shorter plant height (95-100 cm) compared to Pusa 1121 (120 cm)',
      'Zero lodging even under high-wind monsoon conditions',
      'Grains retain the famous 1121 elongation and culinary value'
    ],
    benefits: [
      'Complete grain recovery since zero crop falls into mud',
      'High resistance to stem rot and lodging-induced mold',
      'High market price, matching 1121 Basmati premium indexes'
    ],
    fertilizerGuide: 'N:P:K at 52:22:18 kg/Acre. Apply organic inputs.',
    irrigationGuide: 'Maintain shallow standing water; drain 12 days before cutting.',
    growthDuration: '135 - 140 Days',
    height: '95 - 100 cm',
    grainQuality: 'Famous extra-long slender basmati grains, high cook elongation',
    brochureUrl: '#'
  },
  {
    id: 'paddy-pusa-1509',
    name: 'Pusa 1509',
    cropType: 'Paddy',
    category: 'Paddy',
    tagline: 'Classic ultra-early basmati variety with excellent cooking values.',
    image: 'https://cdn.phototourl.com/free/2026-07-19-29b8e5c7-c44b-4b29-8b1f-ea6d51bdd9c1.png',
    rating: 4.8,
    expectedYield: '24 - 28 Quintals/Acre',
    diseaseResistance: ['Fungal Blast escape', 'Leaf folder tolerant'],
    germinationRate: '98%',
    climateSuitability: 'Irrigated basmati zones',
    soilCompatibility: 'Heavy clay-loam water retaining soils',
    waterAvailability: 'High water, but early crop cycle saves water overall',
    sowingWindow: 'Nursery: May 1 - May 25 / Transplanting: June 1 - June 25',
    harvestWindow: 'September',
    availableSizes: ['10kg', '25kg'],
    states: ['Telangana', 'Andhra Pradesh', 'Punjab', 'Haryana', 'Uttar Pradesh'],
    description: 'Pusa 1509 is the foundational early basmati. It offers high seed purity, low crop maintenance costs, and a short duration that allows farmers to harvest in early September when basmati pricing is highly attractive.',
    features: [
      'Maturing within 115 days (seed to seed)',
      'Highly flexible planting window',
      'Delicate mild basmati aroma'
    ],
    benefits: [
      'Very high water conservation index',
      'Ideal crop for potato-wheat crop systems',
      'Excellent puffing and cooking quality'
    ],
    fertilizerGuide: 'N:P:K at 45:18:12 kg/Acre. Add zinc inputs.',
    irrigationGuide: 'Maintain standing water up to 30 days post transplanting.',
    growthDuration: '115 - 120 Days',
    height: '98 - 103 cm',
    grainQuality: 'Aromatic, premium slender grains',
    brochureUrl: '#'
  }
];

export const DEALERS: Dealer[] = [
  {
    id: 'dl-01',
    name: 'Sriji Seeds & Biotech',
    contact: 'K. Ranga Rao',
    phone: '+91 98663 29911',
    address: 'Pranava Business Park- 7th Floor, Kondapur',
    state: 'Telangana',
    district: 'Rangareddy',
    location: { lat: 17.4622, lng: 78.3568 }
  },
  {
    id: 'dl-02',
    name: 'Sra Shriji Agri Hub',
    contact: 'Venkata Reddy',
    phone: '+91 99012 34567',
    address: 'Near Agriculture Market Yard, Kothaguda',
    state: 'Telangana',
    district: 'Khammam',
    location: { lat: 17.2509, lng: 80.1511 }
  },
  {
    id: 'dl-03',
    name: 'Choudhary Fertilizer & Seed Store',
    contact: 'Ram Niwas Choudhary',
    phone: '+91 98290 56789',
    address: 'Krishi Mandi, NH-9, Mandi Dabwali',
    state: 'Haryana',
    district: 'Sirsa',
    location: { lat: 29.9712, lng: 74.7214 }
  },
  {
    id: 'dl-04',
    name: 'Punjab Agri Inputs',
    contact: 'Sukhwinder Singh',
    phone: '+91 94170 12345',
    address: 'SCF-12, New Grain Market, Bathinda',
    state: 'Punjab',
    district: 'Bathinda',
    location: { lat: 30.2110, lng: 74.9455 }
  },
  {
    id: 'dl-05',
    name: 'Patel Agro Agency',
    contact: 'Dinesh Patel',
    phone: '+91 99240 98765',
    address: 'NH-27, Station Road, Rajkot',
    state: 'Gujarat',
    district: 'Rajkot',
    location: { lat: 21.9625, lng: 70.7946 }
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'st-01',
    farmerName: 'M. Chandraiah',
    location: 'Warangal, Telangana',
    crop: 'Hybrid Maize',
    varietyUsed: 'SRA 5144 Plus',
    yieldBefore: '24 Quintals/Acre',
    yieldAfter: '39.2 Quintals/Acre',
    story: 'We were suffering from heavy cob rotting and stalk lodging due to unseasonal rains. Sra Shriji\'s advisor recommended SRA 5144 Plus. The stalks stood tall like trees and the cobs were massive and completely filled to the tip. Our yield increased by more than 15 quintals!',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    quote: 'SRA 5144 Plus gave me a solid harvest and absolute security against crop failure.'
  },
  {
    id: 'st-02',
    farmerName: 'Sardar Jagmeet Singh',
    location: 'Mandi Dabwali, Haryana',
    crop: 'Premium Wheat',
    varietyUsed: 'Super 2967',
    yieldBefore: '17 Quintals/Acre',
    yieldAfter: '27.5 Quintals/Acre',
    story: 'Yellow rust usually damages our wheat crops, but Super 2967 was highly resistant. The tillering was extraordinary, with 12 productive tillers per seed. We hit a massive harvest of 27.5 quintals per acre, making high profits at the market.',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
    quote: 'The massive tillering and rust resistance of Super 2967 Wheat changed my family fortune.'
  },
  {
    id: 'st-03',
    farmerName: 'Ch. Anjaneyulu',
    location: 'Nalgonda, Telangana',
    crop: 'Paddy',
    varietyUsed: 'Pusa 1847',
    yieldBefore: '18 Quintals/Acre',
    yieldAfter: '29.0 Quintals/Acre',
    story: 'Bacterial Leaf Blight used to wipe out our basmati yields. After sowing Pusa 1847 Paddy, we did not use a single chemical bactericide. The grains were extremely clean, aromatic, and long. It fetched a premium export price at the mandi.',
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
    quote: 'With Pusa 1847, my basmati was disease-free, super aromatic, and gave record yields.'
  }
];

export const TIMELINE_MILESTONES = [
  { year: '2016', title: 'The Launch', desc: 'SRA SHRIJI AGRI GENETICS SEEDS PVT LTD founded with high-quality research facilities to empower Indian farmers with resilient seeds.' },
  { year: '2018', title: 'R&D Center', desc: 'Established our state-of-the-art laboratory and experimental farms in Telangana for high-yield breeding.' },
  { year: '2020', title: 'Maize Breakthrough', desc: 'Released the SRA 9048 and SRA 9092 Maize hybrids which quickly became farmers\' favorites for high shelling recovery.' },
  { year: '2023', title: 'Expansion North', desc: 'Expanded our operations to Haryana, Punjab, and Rajasthan, introducing elite Pusa basmati and rust-resistant wheat.' },
  { year: '2026', title: 'Digital AI Agri-Suite', desc: 'Launching AI-powered leaf disease diagnostics and crop matching models to bring precision genetics to every field.' }
];

export const ADVISORIES = [
  {
    id: 'adv-1',
    crop: 'Maize',
    title: 'Stem Borer Management',
    desc: 'Monitor maize fields at knee-high stage. If pinholes are observed on leaves, release Trichogramma chilonis or apply bio-pesticide liquid spray.',
    urgency: 'high'
  },
  {
    id: 'adv-2',
    crop: 'Paddy',
    title: 'Water Management in Basmati',
    desc: 'Ensure 3 cm of standing water during the transplanting phase to promote robust root establishment. Avoid sudden drainage during tillering.',
    urgency: 'medium'
  },
  {
    id: 'adv-3',
    crop: 'SSG',
    title: 'Safe Fodder Cutting Guide',
    desc: 'Always perform the first cut of Malik QUEEN fodder between 45-50 days to ensure the lowest HCN levels and maximum crude protein for cows.',
    urgency: 'low'
  }
];

export const GALLERY_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
    category: 'R&D Lab',
    title: 'Sra Shriji Quality Testing Lab'
  },
  {
    url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    category: 'Field Day',
    title: 'Telangana Farmer Meet in Kondapur'
  },
  {
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    category: 'Cultivation',
    title: 'Flourishing Sra Shriji Maize Crops'
  },
  {
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    category: 'Research Trials',
    title: 'Basmati Pusa Breeding plots'
  }
];

export interface Product {
  id: string;
  name: string;
  cropType: string;
  category: string;
  tagline: string;
  image: string;
  rating: number;
  expectedYield: string;
  diseaseResistance: string[];
  germinationRate: string;
  climateSuitability: string;
  soilCompatibility: string;
  waterAvailability: string;
  sowingWindow: string;
  harvestWindow: string;
  availableSizes: string[];
  states: string[];
  description: string;
  features: string[];
  benefits: string[];
  fertilizerGuide: string;
  irrigationGuide: string;
  growthDuration: string;
  height: string;
  grainQuality: string;
  brochureUrl: string;
}

export interface RecommendationRequest {
  state: string;
  district: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  soilType: string;
  water: string;
  purpose: string;
}

export interface Dealer {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  state: string;
  district: string;
  location: { lat: number; lng: number };
}

export interface SuccessStory {
  id: string;
  farmerName: string;
  location: string;
  crop: string;
  varietyUsed: string;
  yieldBefore: string;
  yieldAfter: string;
  story: string;
  imageUrl: string;
  quote: string;
}

export interface CropDiseaseResult {
  detected: boolean;
  diseaseName: string;
  confidence: number;
  cause: string;
  symptoms: string[];
  prevention: string[];
  treatment: string[];
  recommendedPesticides: string[];
  recommendedProducts: string[];
}

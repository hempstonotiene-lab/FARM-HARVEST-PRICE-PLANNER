export const cropProfiles = [
  {
    id: "maize",
    name: "Maize",
    maturityDays: 120,
    yieldPerAcre: 18,
    basePrice: 4100,
    priceVolatility: 0.09,
    weatherSensitivity: 0.75,
    description: "Strong staple crop with moderate weather sensitivity."
  },
  {
    id: "beans",
    name: "Beans",
    maturityDays: 90,
    yieldPerAcre: 9,
    basePrice: 7600,
    priceVolatility: 0.12,
    weatherSensitivity: 0.62,
    description: "Shorter cycle crop with faster cash rotation."
  },
  {
    id: "tomatoes",
    name: "Tomatoes",
    maturityDays: 85,
    yieldPerAcre: 145,
    basePrice: 4800,
    priceVolatility: 0.18,
    weatherSensitivity: 0.82,
    description: "High-value crop with strong weather and timing effects."
  },
  {
    id: "onions",
    name: "Onions",
    maturityDays: 110,
    yieldPerAcre: 80,
    basePrice: 5200,
    priceVolatility: 0.11,
    weatherSensitivity: 0.57,
    description: "Reliable price performer with manageable maturity cycle."
  }
];

export const countyProfiles = [
  {
    id: "siaya",
    name: "Siaya",
    rainfallFactor: 1.06,
    temperatureFactor: 0.98,
    logisticsFactor: 0.95,
    weatherNote: "River-basin conditions support healthy vegetative growth."
  },
  {
    id: "kisumu",
    name: "Kisumu",
    rainfallFactor: 1.02,
    temperatureFactor: 1.03,
    logisticsFactor: 1.04,
    weatherNote: "Warm conditions can accelerate maturity in later weeks."
  },
  {
    id: "homabay",
    name: "Homa Bay",
    rainfallFactor: 0.97,
    temperatureFactor: 1.04,
    logisticsFactor: 0.93,
    weatherNote: "Mixed rainfall pattern may demand careful harvest timing."
  },
  {
    id: "nakuru",
    name: "Nakuru",
    rainfallFactor: 1.08,
    temperatureFactor: 0.95,
    logisticsFactor: 1.06,
    weatherNote: "Cooler highland weather extends crop development slightly."
  }
];

export const seasonalTrend = [
  { weekOffset: -2, multiplier: 0.92 },
  { weekOffset: -1, multiplier: 0.97 },
  { weekOffset: 0, multiplier: 1.01 },
  { weekOffset: 1, multiplier: 1.05 },
  { weekOffset: 2, multiplier: 1.12 },
  { weekOffset: 3, multiplier: 1.08 },
  { weekOffset: 4, multiplier: 1.02 }
];

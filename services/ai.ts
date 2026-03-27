import { VehicleCategory, WeatherState, AdvancedAIResponse, CityIntelligence, EnhancementResult } from "../types";

export type { EnhancementResult };

/* ================================
   ✅ API CONFIG (SAFE VERSION)
================================ */
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://127.0.0.1:5000";

/* ================================
   🔥 CONNECTION STATE
================================ */
let apiConnected = false;
let connectionCheckInProgress = false;

/* ================================
   ✅ CHECK API CONNECTION (FIXED)
================================ */
export const checkAPIConnection = async (): Promise<boolean> => {
  if (connectionCheckInProgress) return apiConnected;

  connectionCheckInProgress = true;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      apiConnected = data?.status === "ok";
      console.log("✅ AI Engine Connected:", data);
      return apiConnected; // ✅ FIXED
    }

    apiConnected = false;
    return false;
  } catch (error) {
    console.warn("⚠️ AI Engine Connection Failed:", error);
    apiConnected = false;
    return false;
  } finally {
    connectionCheckInProgress = false;
  }
};

export const isAPIConnected = (): boolean => apiConnected;

/* ================================
   🚀 UNIVERSAL API CALL (FIXED)
================================ */
async function callBackendAPI<T>(
  endpoint: string,
  payload: any
): Promise<T | null> {
  try {
    // 🔁 Ensure connection
    if (!apiConnected) {
      const connected = await checkAPIConnection();
      if (!connected) {
        console.error("🚨 Backend OFF - using fallback");
        return null;
      }
    }

    // ⏱ Timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();

    if (result?.success && result?.data) {
      return result.data as T;
    }

    throw new Error(result?.error || "Unknown API error");
  } catch (error) {
    console.error(`❌ API call failed (${endpoint}):`, error);
    return null;
  }
}

/* ================================
   🧠 MOCK FALLBACK DATA
================================ */
const generateMockTrafficAnalysis = (
  weather: WeatherState
): AdvancedAIResponse => ({
  vehicles: [
    {
      id: "V001",
      type: "Car",
      confidence: 0.95,
      speed_estimated_kmph: 65,
      bbox: [0.1, 0.1, 0.4, 0.5],
      status: "normal",
      plate: "TS09P4997",
    },
    {
      id: "V002",
      type: "Motorcycle",
      confidence: 0.88,
      speed_estimated_kmph: 50,
      bbox: [0.5, 0.2, 0.75, 0.6],
      status: "abnormal",
      plate: null,
    },
  ],
  collision_detected: false,
  collision_confidence: 0,
  collision_zone_coordinates: [0, 0, 1, 1],
  vehicles_involved: [],
  alert_level: "LOW",
  warning_message: "Traffic flowing normally",
});

const generateMockCityIntelligence = (): CityIntelligence => ({
  city: "Hyderabad",
  areas: [
    { name: "Madhapur", risk_percentage: 35, risk_level: "Low" },
    { name: "Gachibowli", risk_percentage: 42, risk_level: "Low" },
    { name: "Banjara Hills", risk_percentage: 28, risk_level: "Low" },
    { name: "Kukatpally", risk_percentage: 58, risk_level: "Medium" },
    { name: "LB Nagar", risk_percentage: 72, risk_level: "High" },
    { name: "Secunderabad", risk_percentage: 65, risk_level: "Medium" },
    { name: "Charminar", risk_percentage: 80, risk_level: "High" },
    { name: "Hitech City", risk_percentage: 45, risk_level: "Low" },
    { name: "Mehdipatnam", risk_percentage: 52, risk_level: "Medium" },
  ],
  current_weather: {
    temperature: "28°C",
    condition: "Sunny",
    humidity: "65%",
    wind_speed: "12 km/h",
    last_updated: new Date().toISOString(),
  },
});

/* ================================
   📡 API FUNCTIONS
================================ */

export const getHyderabadIntelligence = async (): Promise<CityIntelligence> => {
  const result = await callBackendAPI<CityIntelligence>(
    "/api/analyze/city-intelligence",
    {}
  );

  return result || generateMockCityIntelligence();
};

export const analyzeTrafficVideoFrame = async (
  base64Image: string,
  weather: WeatherState
): Promise<AdvancedAIResponse> => {
  const result = await callBackendAPI<AdvancedAIResponse>(
    "/api/analyze/video-frame",
    { image: base64Image, weather }
  );

  return result || generateMockTrafficAnalysis(weather);
};

export const analyzeVehicleImage = async (base64Image: string) => {
  const result = await callBackendAPI<any>("/api/analyze/vehicle", {
    image: base64Image,
  });

  return (
    result || {
      vehicle_type: "Car",
      plate_detected: true,
      plate_number: "TS09P4997",
      confidence_score: 0.92,
      validation_status: "VALID",
      error_message: null,
    }
  );
};

export const analyzeRouteSafety = async (
  source: string,
  destination: string,
  weather: WeatherState,
  coords?: { lat: number; lng: number }
) => {
  const result = await callBackendAPI<any>(
    "/api/analyze/route-safety",
    { source, destination, weather, coords }
  );

  return {
    text:
      result?.text ||
      "Route is safe. Recommended speed: 40–60 km/h. Moderate traffic.",
    links: result?.links || [],
  };
};

export const analyzeVideoUnderstanding = async (
  frames: string[]
): Promise<string> => {
  const result = await callBackendAPI<any>(
    "/api/analyze/video-understanding",
    { frames }
  );

  return (
    result?.narrative ||
    "Normal traffic flow. No incidents detected."
  );
};

export const enhanceCCTVImage = async (
  img: string
): Promise<EnhancementResult> => {
  const result = await callBackendAPI<any>(
    "/api/analyze/enhance-image",
    { image: img }
  );

  return {
    confidence: result?.confidence || 0.87,
    forensicSummary:
      result?.forensicSummary ||
      "Enhanced clarity with high confidence plate detection.",
  };
};

export const getSmartRecommendations = async (
  stats: any
): Promise<string[]> => {
  const result = await callBackendAPI<any>(
    "/api/analyze/recommendations",
    { stats }
  );

  return (
    result?.recommendations || [
      "Add traffic signals in busy areas",
      "Increase CCTV coverage",
      "Deploy traffic police during peak hours",
      "Introduce speed control measures",
    ]
  );
};
import axios from 'axios';

export interface Flight {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string | null;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    baggage: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string | null;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
  };
}

const API_KEY = import.meta.env.VITE_AVIATIONSTACK_API_KEY;
const BASE_URL = 'https://api.aviationstack.com/v1';

export const fetchFlights = async (airportIata: string, type: 'departure' | 'arrival' = 'departure'): Promise<Flight[]> => {
  if (!API_KEY) {
    console.warn("No AviationStack API key found. Using mock data.");
    return generateMockFlights(airportIata, type);
  }

  try {
    const response = await axios.get(`${BASE_URL}/flights`, {
      params: {
        access_key: API_KEY,
        [type === 'departure' ? 'dep_iata' : 'arr_iata']: airportIata,
        limit: 100
      }
    });
    
    if (response.data.error) {
      console.error("AviationStack API Error:", response.data.error);
      return generateMockFlights(airportIata, type);
    }

    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching flights:", error);
    return generateMockFlights(airportIata, type);
  }
};

const generateMockFlights = (airportIata: string, type: 'departure' | 'arrival'): Flight[] => {
  const airlines = [
    { name: "Delta Air Lines", iata: "DL" },
    { name: "United Airlines", iata: "UA" },
    { name: "Lufthansa", iata: "LH" },
    { name: "British Airways", iata: "BA" },
    { name: "Emirates", iata: "EK" },
    { name: "Air France", iata: "AF" },
    { name: "All Nippon Airways", iata: "NH" },
    { name: "Singapore Airlines", iata: "SQ" },
    { name: "Cathay Pacific", iata: "CX" },
    { name: "KLM", iata: "KL" },
  ];

  const destinations = ["JFK", "LHR", "HND", "CDG", "DXB", "SIN", "SFO", "LAX", "SYD", "GRU"];
  const statuses = ["scheduled", "active", "landed", "cancelled", "delayed"];

  return Array.from({ length: 50 }).map((_) => {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const otherAirport = destinations[Math.floor(Math.random() * destinations.length)];
    const now = new Date();
    // Generate flights spread over -30 to +90 minutes to ensure coverage
    const scheduledTime = new Date(now.getTime() + (Math.random() * 120 - 30) * 60000);

    return {
      flight_date: scheduledTime.toISOString().split('T')[0],
      flight_status: statuses[Math.floor(Math.random() * statuses.length)],
      departure: {
        airport: type === 'departure' ? airportIata : otherAirport,
        iata: type === 'departure' ? airportIata : otherAirport,
        terminal: String(Math.floor(Math.random() * 5) + 1),
        gate: String.fromCharCode(65 + Math.floor(Math.random() * 6)) + (Math.floor(Math.random() * 20) + 1),
        scheduled: scheduledTime.toISOString(),
        estimated: scheduledTime.toISOString(),
        actual: null,
        timezone: "UTC",
        icao: "",
        delay: 0
      },
      arrival: {
        airport: type === 'arrival' ? airportIata : otherAirport,
        iata: type === 'arrival' ? airportIata : otherAirport,
        terminal: String(Math.floor(Math.random() * 5) + 1),
        gate: String.fromCharCode(65 + Math.floor(Math.random() * 6)) + (Math.floor(Math.random() * 20) + 1),
        scheduled: scheduledTime.toISOString(),
        estimated: scheduledTime.toISOString(),
        actual: null,
        timezone: "UTC",
        icao: "",
        baggage: "B" + (Math.floor(Math.random() * 10) + 1),
        delay: 0
      },
      airline: {
        name: airline.name,
        iata: airline.iata,
        icao: airline.iata + "X"
      },
      flight: {
        number: String(Math.floor(Math.random() * 9000) + 1000),
        iata: airline.iata + (Math.floor(Math.random() * 9000) + 1000),
        icao: airline.iata + "X" + (Math.floor(Math.random() * 9000) + 1000)
      }
    };
  });
};

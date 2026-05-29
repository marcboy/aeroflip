export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

export const MAJOR_AIRPORTS: Airport[] = [
  { iata: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
  { iata: "LHR", name: "London Heathrow Airport", city: "London", country: "UK" },
  { iata: "HND", name: "Haneda Airport", city: "Tokyo", country: "Japan" },
  { iata: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { iata: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE" },
  { iata: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore" },
  { iata: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands" },
  { iata: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { iata: "HKG", name: "Hong Kong International Airport", city: "Hong Kong", country: "China" },
  { iata: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "USA" },
  { iata: "SFO", name: "San Francisco International Airport", city: "San Francisco", country: "USA" },
  { iata: "ORD", name: "O'Hare International Airport", city: "Chicago", country: "USA" },
  { iata: "SYD", name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia" },
  { iata: "GRU", name: "São Paulo/Guarulhos International Airport", city: "São Paulo", country: "Brazil" },
  { iata: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada" },
];

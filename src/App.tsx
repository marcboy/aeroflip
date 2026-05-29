import { useState, useEffect, useMemo } from 'react';
import { MAJOR_AIRPORTS } from './constants/airports';
import type { Airport } from './constants/airports';
import { fetchFlights } from './services/aviation';
import type { Flight } from './services/aviation';
import SplitFlapRow from './components/SplitFlapRow';
import { Plane } from 'lucide-react';
import pkg from '../package.json';
import './App.css';

const ROWS_PER_PAGE = 8;
const ROTATION_INTERVAL = 15000;

function App() {
  const [selectedAirport, setSelectedAirport] = useState<Airport>(MAJOR_AIRPORTS[0]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [boardType, setBoardType] = useState<'departure' | 'arrival'>('departure');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchFlights(selectedAirport.iata, boardType);
      setFlights(data);
      setLoading(false);
      setPageIndex(0);
    };
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [selectedAirport, boardType]);

  const filteredFlights = useMemo(() => {
    const now = new Date();
    const fifteenMinsAgo = new Date(now.getTime() - 15 * 60000);
    const oneHourAhead = new Date(now.getTime() + 60 * 60000);

    const filtered = flights.filter(f => {
      const flightTime = new Date(boardType === 'departure' ? f.departure.scheduled : f.arrival.scheduled);
      return flightTime >= fifteenMinsAgo && flightTime <= oneHourAhead;
    });

    if (filtered.length === 0 && flights.length > 0) {
      console.warn(`No flights in -15/+60 window for ${selectedAirport.iata}. Showing next available flights.`);
      // Show next 5 flights regardless of time window
      return [...flights].sort((a, b) => {
        const timeA = new Date(boardType === 'departure' ? a.departure.scheduled : a.arrival.scheduled).getTime();
        const timeB = new Date(boardType === 'departure' ? b.departure.scheduled : b.arrival.scheduled).getTime();
        return timeA - timeB;
      }).filter(f => new Date(boardType === 'departure' ? f.departure.scheduled : f.arrival.scheduled) >= fifteenMinsAgo)
      .slice(0, 5);
    }

    return filtered.sort((a, b) => {
      const timeA = new Date(boardType === 'departure' ? a.departure.scheduled : a.arrival.scheduled).getTime();
      const timeB = new Date(boardType === 'departure' ? b.departure.scheduled : b.arrival.scheduled).getTime();
      return timeA - timeB;
    });
  }, [flights, boardType, selectedAirport.iata]);

  useEffect(() => {
    if (filteredFlights.length === 0) return;
    
    const interval = setInterval(() => {
      setPageIndex((prev) => (prev + 1) % Math.ceil(filteredFlights.length / ROWS_PER_PAGE));
    }, ROTATION_INTERVAL);
    
    return () => clearInterval(interval);
  }, [filteredFlights]);

  const displayedFlights = useMemo(() => {
    const start = pageIndex * ROWS_PER_PAGE;
    return filteredFlights.slice(start, start + ROWS_PER_PAGE);
  }, [filteredFlights, pageIndex]);

  return (
    <div className="app-container">
      <header>
        <div className="logo-section">
          <Plane className="plane-icon" size={32} color="#ffd700" />
          <h1 style={{ display: 'inline', marginLeft: '1rem', color: '#ffd700' }}>AeroFlip</h1>
        </div>
        
        <div className="airport-selector">
          <select 
            value={selectedAirport.iata} 
            onChange={(e) => {
              const airport = MAJOR_AIRPORTS.find(a => a.iata === e.target.value);
              if (airport) setSelectedAirport(airport);
            }}
          >
            {MAJOR_AIRPORTS.map(a => (
              <option key={a.iata} value={a.iata}>{a.iata} - {a.name}</option>
            ))}
          </select>
        </div>

        <div className="type-toggle">
          <button 
            className={boardType === 'departure' ? 'active' : ''} 
            onClick={() => setBoardType('departure')}
          >
            DEPARTURES
          </button>
          <button 
            className={boardType === 'arrival' ? 'active' : ''} 
            onClick={() => setBoardType('arrival')}
          >
            ARRIVALS
          </button>
        </div>
      </header>

      <main className="board">
        <div className="board-header">
          <div className="col-logo">AIRLINE</div>
          <div className="col-expected">EXPECTED</div>
          <div className="col-actual">ACTUAL</div>
          <div className="col-destination">{boardType === 'departure' ? 'TO' : 'FROM'}</div>
          <div className="col-flight">FLIGHT</div>
          <div className="col-gate">GATE</div>
          <div className="col-status">STATUS</div>
        </div>

        {displayedFlights.map((flight, idx) => (
          <SplitFlapRow 
            key={`${flight.flight.iata}-${idx}`} 
            flight={flight} 
            type={boardType} 
          />
        ))}

        {loading ? (
          <div className="no-flights">
            LOADING REAL-TIME DATA...
          </div>
        ) : displayedFlights.length === 0 ? (
          <div className="no-flights">
            NO FLIGHTS SCHEDULED IN THE NEXT HOUR
          </div>
        ) : null}
      </main>

      <footer className="footer">
        v{pkg.version} | UPDATED: {pkg.latestUpdate} | {import.meta.env.VITE_AVIATIONSTACK_API_KEY ? 'LIVE DATA ACTIVE' : 'USING MOCK DATA'} | POWERED BY AVIATIONSTACK
      </footer>
    </div>
  );
}

export default App;

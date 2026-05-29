import React, { useEffect, useRef } from 'react';
import { SplitFlap } from 'react-split-flap';
import type { Flight } from '../services/aviation';

const FLIP_SOUND_URL = 'https://gfxsounds.com/wp-content/uploads/2023/03/Mechanical-keyboard-keystroke-pressing-spacebar.mp3';

interface SplitFlapRowProps {
  flight: Flight;
  type: 'departure' | 'arrival';
}

const SplitFlapRow: React.FC<SplitFlapRowProps> = ({ flight, type }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio object once
  useEffect(() => {
    audioRef.current = new Audio(FLIP_SOUND_URL);
    audioRef.current.volume = 0.2; // Keep it subtle
  }, []);

  const destination = type === 'departure' ? flight.arrival.iata : flight.departure.iata;
  const time = new Date(type === 'departure' ? flight.departure.scheduled : flight.arrival.scheduled);
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const gate = type === 'departure' ? flight.departure.gate || '--' : flight.arrival.gate || '--';
  const status = flight.flight_status.toUpperCase();
  const flightNumber = flight.flight.iata || `${flight.airline.iata}${flight.flight.number}`;

  // Trigger sound when important values change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.warn("Audio play blocked by browser policy:", e));
    }
  }, [destination, status, flightNumber]);

  const logoUrl = `https://logo.clearbit.com/${flight.airline.name.toLowerCase().replace(/\s+/g, '')}.com`;
  
  return (
    <div className="board-row">
      <div className="col-logo">
        <img 
          src={logoUrl} 
          alt={flight.airline.name} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/plane.svg';
          }}
        />
      </div>
      <div className="col-time">
        <SplitFlap value={timeStr} length={5} />
      </div>
      <div className="col-destination">
        <SplitFlap value={destination.padEnd(3, ' ')} length={3} />
      </div>
      <div className="col-flight">
        <SplitFlap value={flightNumber.padEnd(7, ' ')} length={7} />
      </div>
      <div className="col-gate">
        <SplitFlap value={gate.padEnd(3, ' ')} length={3} />
      </div>
      <div className="col-status">
        <SplitFlap value={status.padEnd(10, ' ')} length={10} />
      </div>
    </div>
  );
};

export default SplitFlapRow;

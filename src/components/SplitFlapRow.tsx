import React from 'react';
import { SplitFlap } from 'react-split-flap';
import type { Flight } from '../services/aviation';

interface SplitFlapRowProps {
  flight: Flight;
  type: 'departure' | 'arrival';
}

const SplitFlapRow: React.FC<SplitFlapRowProps> = ({ flight, type }) => {
  const logoUrl = `https://logo.clearbit.com/${flight.airline.name.toLowerCase().replace(/\s+/g, '')}.com`;
  
  const destination = type === 'departure' ? flight.arrival.iata : flight.departure.iata;
  const time = new Date(type === 'departure' ? flight.departure.scheduled : flight.arrival.scheduled);
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const gate = type === 'departure' ? flight.departure.gate || '--' : flight.arrival.gate || '--';
  const status = flight.flight_status.toUpperCase();
  const flightNumber = flight.flight.iata || `${flight.airline.iata}${flight.flight.number}`;

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

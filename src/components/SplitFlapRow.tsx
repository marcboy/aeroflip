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
  
  const scheduledTime = new Date(type === 'departure' ? flight.departure.scheduled : flight.arrival.scheduled);
  const expectedStr = scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  
  const estimatedTime = type === 'departure' 
    ? (flight.departure.actual || flight.departure.estimated) 
    : (flight.arrival.actual || flight.arrival.estimated);
  
  let actualStr = '--:--';
  if (estimatedTime) {
    const estDate = new Date(estimatedTime);
    // Only show actual if it differs from scheduled by at least 1 minute
    if (Math.abs(estDate.getTime() - scheduledTime.getTime()) > 60000) {
      actualStr = estDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  }

  const gate = type === 'departure' ? flight.departure.gate || '--' : flight.arrival.gate || '--';
  const status = flight.flight_status.toUpperCase();
  const flightNumber = flight.flight.iata || `${flight.airline.iata}${flight.flight.number}`;

  // Trigger sound when important values change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.warn("Audio play blocked by browser policy:", e));
    }
  }, [destination, status, flightNumber, actualStr]);

  // More robust airline domain mapping
  const getAirlineDomain = (name: string, iata: string) => {
    const commonAirlines: Record<string, string> = {
      'UA': 'united.com',
      'DL': 'delta.com',
      'AA': 'aa.com',
      'BA': 'britishairways.com',
      'AF': 'airfrance.com',
      'LH': 'lufthansa.com',
      'EK': 'emirates.com',
      'SQ': 'singaporeair.com',
      'CX': 'cathaypacific.com',
      'NH': 'ana.co.jp',
      'JL': 'jal.co.jp',
      'KL': 'klm.com',
      'AS': 'alaskaair.com',
      'WN': 'southwest.com',
      'B6': 'jetblue.com'
    };
    if (commonAirlines[iata]) return commonAirlines[iata];
    return name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  };

  const domain = getAirlineDomain(flight.airline.name, flight.airline.iata);
  const logoUrl = `https://logo.clearbit.com/${domain}`;
  
  return (
    <div className="board-row">
      <div className="col-logo">
        <div className="logo-container" style={{ width: 40, height: 40, background: '#fff', borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={logoUrl} 
            alt={flight.airline.name} 
            style={{ maxWidth: '90%', maxHeight: '90%', display: 'block' }}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src.includes('clearbit')) {
                // If clearbit fails, try a direct Wikimedia/IATA fallback or just the plane icon
                target.src = 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=64';
              } else if (target.src.includes('google')) {
                target.src = 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/plane.svg';
                target.style.filter = 'invert(0.5)';
              }
            }}
          />
        </div>
      </div>
      <div className="col-expected">
        <SplitFlap value={expectedStr} length={5} />
      </div>
      <div className="col-actual">
        <SplitFlap value={actualStr} length={5} />
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

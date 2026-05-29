# AeroFlip Project Handoff

## Project Overview
AeroFlip is a real-time airport flight information display system (FIDS) built with React, TypeScript, and Capacitor. It features a mechanical split-flap (Solari board) aesthetic.

## Current State
- **Core UI**: Implemented with `react-split-flap`. Dark theme optimized for Web, iOS, and TV.
- **Data Integration**: Aviationstack API integration with a mock data fallback.
- **Features**: Airport selection, 13-minute time window filtering, 5-second board rotation.
- **Platforms**: Web (Vite), iOS (Capacitor).
- **GitHub**: [https://github.com/marcboy/aeroflip](https://github.com/marcboy/aeroflip)

## Tech Stack
- React 19 / TypeScript / Vite
- Capacitor 8 (iOS)
- react-split-flap
- Lucide React (Icons)
- Axios

## Latest Update
- **Version**: 1.1.7
- **Timestamp**: 2026-05-28 21:05:20 PDT
- **Features**: 
    - Expanded time window (-15m to +60m) and slowed rotation to 15s.
    - Added "ACTUAL" column for delay tracking.
    - Added mechanical click sound effects.

## Next Steps
1. Implement weather information for destination airports.
2. Enhance TV-specific navigation (D-pad support).
3. Verify the live URL: [https://marcboy.github.io/aeroflip/](https://marcboy.github.io/aeroflip/)

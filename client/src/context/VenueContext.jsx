import React, { createContext, useContext } from 'react';
import { useVenueIntel } from '../hooks/useVenueIntel';

const VenueContext = createContext();

export const VenueProvider = ({ children }) => {
  // Global polling for venue intelligence
  const venueIntel = useVenueIntel(30000); // Poll every 30s

  return (
    <VenueContext.Provider value={venueIntel}>
      {children}
    </VenueContext.Provider>
  );
};

export const useVenue = () => {
  const context = useContext(VenueContext);
  if (!context) {
    throw new Error('useVenue must be used within a VenueProvider');
  }
  return context;
};

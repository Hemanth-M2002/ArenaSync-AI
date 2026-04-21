import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to pull real-time venue intelligence (gates, heatmap, alerts).
 * Implements polling to keep data fresh and simulate a live dashboard.
 */
export const useVenueIntel = (intervalMs = 30000) => {
  const { user, activeContext } = useAuth();
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get venue name from context or user preferences
  const venue = activeContext?.venue || user?.preferences?.selectedVenue;

  const fetchIntel = useCallback(async () => {
    if (!venue) return;

    try {
      const res = await api.get(`/analytics/live?venue=${encodeURIComponent(venue)}`);
      if (res.data.success) {
        setIntel(res.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch venue intel:', err);
      setError('Live data synchronization suspended');
    } finally {
      setLoading(false);
    }
  }, [venue]);

  useEffect(() => {
    fetchIntel();
    
    // Set up polling interval
    const timer = setInterval(fetchIntel, intervalMs);
    
    return () => clearInterval(timer);
  }, [fetchIntel, intervalMs]);

  /**
   * Helper to find the best gate based on walking distance + wait time
   */
  const getRecommendedGate = () => {
    if (!intel?.gateStatus) return null;
    
    return [...intel.gateStatus].sort((a, b) => {
      const totalA = a.waitTime + (a.walkingOffset || 0);
      const totalB = b.waitTime + (b.walkingOffset || 0);
      return totalA - totalB;
    })[0];
  };

  /**
   * Helper to get evacuation instructions if in emergency mode
   */
  const getEvacuationGuide = () => {
    if (!intel?.emergencyMode) return null;
    
    const userZoneId = activeContext?.stand; // Assume stand name maps to a zone ID for now
    const currentZone = intel.zoneDensity.find(z => z.zoneId === userZoneId);
    
    return {
      status: currentZone?.isSafe ? 'SAFE' : 'DANGER',
      message: currentZone?.isSafe 
        ? 'You are in a SAFE zone. Remain calm and follow stewards.' 
        : 'IMMEDIATE DEPARTURE: Your zone is hazardous. Follow the Green paths on your map now.'
    };
  };

  return {
    intel,
    loading,
    error,
    getRecommendedGate,
    getEvacuationGuide,
    refresh: fetchIntel
  };
};

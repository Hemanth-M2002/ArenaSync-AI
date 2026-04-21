import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Ticket, QrCode, Plus, ChevronLeft, ChevronRight, Calendar, MapPin, Hash, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import api from '../utils/api';

const TicketVerification = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationState, setVerificationState] = useState(null); // 'verifying', 'success', 'error'
  const [verificationMessage, setVerificationMessage] = useState('');
  const location = useLocation();
  
  // Passed down from ContextSelection.jsx
  const { selectedSport, selectedVenue, sportId } = location.state || {};

  const handleReturnToVenues = () => {
    navigate('/select-context', {
      state: {
        returnToStep: 2,
        selectedSportId: sportId,
        selectedVenue: selectedVenue
      }
    });
  };

  const [formData, setFormData] = useState({
    ticketType: 'e-ticket',
    bookingId: '',
    category: selectedSport || 'Cricket',
    cricketLeague: 'IPL',          // Only relevant when category === 'Cricket'
    eventName: '',
    venueName: selectedVenue || '',
    eventDate: '',
    gate: '',
    stand: '',
    seat: ''
  });

  const { setActiveContext } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedSport || !selectedVenue) {
      // If user came here without location state, send them back cleanly
      navigate('/select-context');
    }
  }, [selectedSport, selectedVenue, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleActivateContext = (ticket) => {
    // For cricket tickets, suffix the league (IPL / TNPL) into the sport label
    const sportLabel =
      ticket.category === 'Cricket'
        ? `Cricket · ${formData.cricketLeague}`
        : ticket.category;

    setActiveContext({
      ticketId: ticket._id,
      bookingId: ticket.bookingId,
      sport: sportLabel,
      venue: ticket.venueName,
      eventName: ticket.eventName,
      gate: ticket.gate,
      stand: ticket.stand
    });
    navigate('/dashboard');
  };

  const handleSubmitNewTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setVerificationState('verifying');
    setVerificationMessage('Authenticating ticket with BoxOffice...');
    
    try {
      const res = await api.post('/tickets', formData);
      if (res.data.success) {
        setVerificationState('success');
        setVerificationMessage(res.data.message || 'Ticket Authenticated!');
        
        // Brief delay to let user read the success message
        setTimeout(() => {
          handleActivateContext(res.data.ticket);
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to add ticket details', err);
      const msg = err.response?.data?.message || 'Failed to authenticate ticket. Please check details.';
      setVerificationState('error');
      setVerificationMessage(msg);
      setIsSubmitting(false);
    }
  };

  const handleScanQRPlaceholder = () => {
    alert("QR Scanning functionality will be integrated soon to automatically parse your e-ticket.");
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full z-10"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <Logo className="w-16 h-16 mb-4 drop-shadow-[0_0_15px_rgba(60,215,255,0.3)]" />
          <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter mb-2">
            Add Your <span className="gradient-text">Ticket Details</span>
          </h1>
          <p className="text-on-surface-variant text-base max-w-xl">
            Adding ticket details allows us to synchronize ArenaSync with your exact event location.
          </p>
        </div>

        <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/20 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex justify-between items-center mb-6 border-b border-outline-variant/20 pb-4">
                <button onClick={handleReturnToVenues} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-bold bg-surface-container-highest px-3 py-1.5 rounded-xl text-sm">
                  <ChevronLeft className="w-4 h-4"/> Back to Venues
                </button>
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">Step 3 of 3</span>
              </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <div>
                      <h4 className="font-bold text-sm">Automated Entry</h4>
                      <p className="text-xs text-on-surface-variant">Scan your ticket's QR code for fast entry.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleScanQRPlaceholder}
                    className="shrink-0 flex items-center gap-2 bg-surface text-primary border border-primary font-bold px-4 py-2 rounded-xl hover:bg-primary hover:text-on-primary transition-all"
                  >
                    <QrCode className="w-4 h-4" /> Scan QR
                  </button>
                </div>

                <div className="text-center text-sm text-on-surface-variant mb-6 relative">
                  <span className="bg-surface-container/50 px-2 relative z-10">Or enter details manually</span>
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/30 -z-0"></div>
                </div>

                <form onSubmit={handleSubmitNewTicket} className="space-y-6">
                  
                  {/* Category & Venue Header */}
                  <div className="bg-surface-container p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between border border-outline-variant/30 text-sm">
                     <div>
                       <span className="text-on-surface-variant font-bold">Category:</span> <span className="font-headline">{formData.category}</span>
                     </div>
                     <div>
                       <span className="text-on-surface-variant font-bold">Location:</span> <span className="font-headline text-primary">{formData.venueName}</span>
                     </div>
                  </div>

                  {/* Cricket League Selector — only shown for Cricket sport */}
                  {formData.category === 'Cricket' && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface-variant ml-1">Cricket League</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['IPL', 'TNPL'].map((league) => (
                          <button
                            key={league}
                            type="button"
                            onClick={() => setFormData({ ...formData, cricketLeague: league })}
                            className={`flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                              formData.cricketLeague === league
                                ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
                                : 'border-outline-variant/30 bg-surface-container text-on-surface-variant hover:border-primary/30'
                            }`}
                          >
                            <span className="text-xl">{league === 'IPL' ? '🏆' : '🏏'}</span>
                            <span className="text-sm tracking-wide">{league}</span>
                            <span className="text-[10px] font-normal text-on-surface-variant">
                              {league === 'IPL' ? 'Indian Premier League' : 'Tamil Nadu Premier League'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface-variant ml-1 flex items-center gap-1"><Hash className="w-3 h-3"/> Booking / PNR ID</label>
                      <input 
                        type="text"
                        name="bookingId"
                        value={formData.bookingId}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. BMS123XXXX"
                        className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface-variant ml-1">Event Name</label>
                      <input 
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. India vs Aus T20"
                        className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface-variant ml-1">Event Date</label>
                      <input 
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface-variant ml-1">Ticket Format</label>
                      <select 
                        name="ticketType"
                        value={formData.ticketType}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-on-surface"
                      >
                        <option value="e-ticket">E-Ticket</option>
                        <option value="physical">Physical Ticket</option>
                      </select>
                    </div>
                  </div>

                  {/* Stadium Location Info */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant ml-1">Gate / Entry</label>
                      <input type="text" name="gate" value={formData.gate} onChange={handleInputChange} required placeholder="e.g. Gate 4" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant ml-1">Stand / Block</label>
                      <input type="text" name="stand" value={formData.stand} onChange={handleInputChange} required placeholder="e.g. North Stand" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant ml-1">Seat Number</label>
                      <input type="text" name="seat" value={formData.seat} onChange={handleInputChange} required placeholder="e.g. 12A" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:border-primary" />
                    </div>
                  </div>

                  {/* Verification Status Banner */}
                  <AnimatePresence>
                    {verificationState === 'error' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex flex-col gap-2 items-center justify-center text-center">
                        <span className="text-rose-500 text-sm font-bold">{verificationMessage}</span>
                        <button type="button" onClick={handleReturnToVenues} className="bg-surface-container hover:bg-rose-500 hover:text-white transition-colors text-xs font-bold px-3 py-1.5 rounded-lg text-rose-500 border border-rose-500/50 mt-2">
                           Incorrect Venue? Change Selection
                        </button>
                      </motion.div>
                    )}
                    {verificationState === 'success' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 text-sm font-bold flex items-center justify-center text-center">
                        <ShieldCheck className="w-5 h-5 mr-2" /> {verificationMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isSubmitting || verificationState === 'success'}
                    className={`w-full h-14 mt-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg text-lg font-bold
                      ${verificationState === 'success' 
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                        : verificationState === 'error'
                        ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20'
                        : 'bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20'
                      } disabled:opacity-80`}
                  >
                    {verificationState === 'verifying' ? (
                      <>
                        <div className="w-5 h-5 relative mr-2">
                          <div className="absolute inset-0 rounded-sm border-2 border-primary/20 animate-pulse"></div>
                          <div className="absolute inset-x-0 top-0 h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-[scan_1.5s_ease-in-out_infinite_alternate]"></div>
                        </div>
                        {verificationMessage}
                      </>
                    ) : verificationState === 'success' ? (
                      <>Authenticated <ShieldCheck className="w-5 h-5" /></>
                    ) : (
                      <>Initiate Verification <Ticket className="w-5 h-5" /></>
                    )}
                  </button>

                </form>
              </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketVerification;

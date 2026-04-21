import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const SPORTS = [
  { id: 'cricket', name: 'Cricket', icon: Trophy, color: 'from-blue-600 to-cyan-500', image: '🏏' },
  { id: 'isl', name: 'ISL Football', icon: Activity, color: 'from-emerald-600 to-teal-500', image: '⚽' },
  { id: 'kabaddi', name: 'Pro Kabaddi', icon: Zap, color: 'from-rose-600 to-orange-500', image: '🤼' },
  { id: 'concert', name: 'Concerts', icon: TrendingUp, color: 'from-purple-600 to-pink-500', image: '🎤' },
];

const VENUE_MAPPING = {
  cricket: [
    'Narendra Modi Stadium, Ahmedabad',
    'Eden Gardens, Kolkata',
    'Wankhede Stadium, Mumbai',
    'M. Chinnaswamy Stadium, Bengaluru',
    'M. A. Chidambaram Stadium, Chennai',
    'Arun Jaitley Stadium, Delhi',
    'HPCA Stadium, Dharamshala',
    // TNPL venues
    'SCF Cricket Ground, Salem',
    'SNR College Cricket Ground, Coimbatore',
    'ICL Sankar Nagar Ground, Tirunelveli',
    'NPR College Ground, Dindigul',
  ],
  isl: [
    'Vivekananda Yuba Bharati Krirangan, Kolkata',
    'Jawaharlal Nehru Stadium, Kochi',
    'Mumbai Football Arena, Mumbai',
    'PJN Stadium, Fatorda (Goa)',
    'Kalinga Stadium, Bhubaneswar',
    'Sree Kanteerava Stadium, Bengaluru'
  ],
  kabaddi: [
    'Gachibowli Indoor Stadium, Hyderabad',
    'Noida Indoor Stadium, Noida',
    'Balewadi Indoor Stadium, Pune',
    'Thyagaraj Indoor Stadium, Delhi',
    'Rajiv Gandhi Indoor Stadium, Vizag'
  ],
  concert: [
    'DY Patil Stadium, Navi Mumbai',
    'Jio World Garden, BKC Mumbai',
    'Mahalaxmi Race Course, Mumbai',
    'Jawaharlal Nehru Stadium, Delhi',
    'Leisure Valley Ground, Gurugram',
    'NICE Grounds, Bengaluru'
  ]
};

const ContextSelection = () => {
  const location = useLocation();
  const [step, setStep] = useState(location.state?.returnToStep || 1);
  const [selectedSport, setSelectedSport] = useState(
    SPORTS.find(s => s.id === location.state?.selectedSportId) || null
  );
  const [selectedVenue, setSelectedVenue] = useState(location.state?.selectedVenue || '');
  const navigate = useNavigate();

  const handleNextPhase = () => {
    if (!selectedSport || !selectedVenue) return;
    
    // Navigate to ticket verification page instead of dashboard directly
    navigate('/ticket-verification', { 
      state: { 
        selectedSport: selectedSport.name, 
        selectedVenue,
        sportId: selectedSport.id
      } 
    });
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
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <Logo className="w-16 h-16 mb-6 drop-shadow-[0_0_15px_rgba(60,215,255,0.3)]" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter mb-4">
            Welcome to <span className="gradient-text">ArenaSync Intelligence</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl">
            Choose your arena context to synchronize your AI assistant with the current event data.
          </p>
        </div>

        <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold font-headline tracking-tight">Select your sport</h2>
                  <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">Step 1 of 3</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {SPORTS.map((sport) => {
                    const Icon = sport.icon;
                    const isSelected = selectedSport?.id === sport.id;
                    
                    return (
                      <motion.div
                        key={sport.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedSport(sport)}
                        className={`relative group cursor-pointer aspect-square rounded-3xl p-6 transition-all duration-300 border-2 ${
                          isSelected 
                            ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                            : 'bg-surface-container border-transparent hover:border-primary/30'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${sport.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold font-headline">{sport.name}</h3>
                        <div className="text-4xl absolute bottom-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity grayscale group-hover:grayscale-0">
                          {sport.image}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <button
                  disabled={!selectedSport}
                  onClick={() => setStep(2)}
                  className="w-full h-16 rounded-2xl bg-primary text-on-primary font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-primary/20 mt-8"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-bold bg-surface-container-highest px-4 py-2 rounded-xl"
                  >
                    Back
                  </button>
                  <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">Step 2 of 3</span>
                </div>

                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className={`w-20 h-20 rounded-3xl bg-linear-to-br ${selectedSport?.color} flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                      <selectedSport.icon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold font-headline tracking-tighter">Where are you located?</h2>
                    <p className="text-on-surface-variant">Selected Sport: <span className="text-on-surface font-bold">{selectedSport?.name}</span></p>
                  </div>

                  <div className="grid gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {(VENUE_MAPPING[selectedSport?.id] || []).map((venue) => (
                      <div
                        key={venue}
                        onClick={() => setSelectedVenue(venue)}
                        className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer border-2 transition-all ${
                          selectedVenue === venue 
                            ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' 
                            : 'bg-surface-container border-transparent hover:bg-surface-container-highest hover:border-primary/20'
                        }`}
                      >
                        <div className="flex items-center gap-4 text-left">
                          <MapPin className={`w-5 h-5 shrink-0 ${selectedVenue === venue ? 'text-primary' : 'text-on-surface-variant'}`} />
                          <span className="font-bold font-headline leading-tight">{venue}</span>
                        </div>
                        <div className={`w-5 h-5 shrink-0 rounded-full border-2 p-0.5 ${selectedVenue === venue ? 'border-primary' : 'border-outline-variant'}`}>
                          {selectedVenue === venue && <div className="w-full h-full bg-primary rounded-full" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!selectedVenue}
                  onClick={handleNextPhase}
                  className="w-full h-16 rounded-2xl bg-linear-to-r from-primary to-cyan-500 text-on-primary font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-xl shadow-primary/20 relative overflow-hidden"
                >
                  Confirm Venue & Add Ticket <ChevronRight className="w-5 h-5 fill-current" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-12 pb-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-10 h-1.5 rounded-full transition-all duration-500 ${step === i ? 'bg-primary w-20' : (i < step ? 'bg-primary/50' : 'bg-outline-variant/30')}`} 
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContextSelection;

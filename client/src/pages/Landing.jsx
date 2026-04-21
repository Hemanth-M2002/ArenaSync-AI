import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return { ref, controls, inView };
};

// Fade up animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
};

// Stagger children animation
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-cyan-400/20 shadow-[0_10px_30px_rgba(60,215,255,0.08)]'
          : 'bg-slate-950/80 backdrop-blur-lg border-b border-cyan-400/15'
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Logo className="w-10 h-10 shadow-lg shadow-primary/20" />
          <span className="text-2xl font-bold tracking-tighter text-slate-50 font-headline">
            ArenaSync <span className="text-primary">AI</span>
          </span>
        </motion.div>
        <div className="hidden md:flex items-center gap-8 font-['Space_Grotesk'] font-medium tracking-tight">
          {['Features', 'How It Works', 'Security', 'Contact'].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
              whileHover={{ y: -2 }}
              className="text-slate-400 hover:text-slate-100 transition-colors"
            >
              {item}
            </motion.a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link to="/signin">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-slate-400 hover:text-slate-100 transition-all font-headline text-sm font-semibold"
            >
              Login
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(60,215,255,0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-md font-headline font-bold text-sm transition-all"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

// Hero Section
const Hero = () => {
  const { ref, controls } = useScrollAnimation();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden" id="home">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          ref={ref}
          animate={controls}
          initial="hidden"
          variants={fadeUpVariants}
          className="z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest border border-outline-variant/20 mb-6">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex h-2 w-2 rounded-full bg-secondary-fixed"
            />
            <span className="text-xs font-label uppercase tracking-widest text-secondary-fixed">
              Next-Gen Venue Intelligence
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-headline font-bold text-on-surface leading-[1.1] tracking-tighter mb-6">
            Move Faster. <br />
            Wait Less. <br />
            <span className="gradient-text">Enjoy More.</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            AI-powered smart venue assistant for stadiums, sports arenas, and live events.
            Orchestrate every crowd movement with surgical precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-on-primary rounded-md font-headline font-bold text-lg flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                Get Started
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="material-symbols-outlined"
                >
                  arrow_forward
                </motion.span>
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-surface-container-highest/50 backdrop-blur-md border border-outline-variant/30 text-on-surface rounded-md font-headline font-bold text-lg flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          <div className="absolute -inset-20 bg-primary/10 blur-[120px] rounded-full" />
          <div className="relative glass-card rounded-xl p-4 border-outline-variant/20 transform hover:rotate-0 transition-transform duration-500 group">
            <motion.img
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              alt="Dashboard Mockup"
              className="rounded-lg shadow-2xl"
              src="/hero-dashboard.png"
            />
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 glass-card p-4 rounded-xl shadow-2xl hidden md:block"
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 rounded-full bg-secondary-fixed"
                />
                <span className="text-xs font-label text-on-surface-variant">LIVE CROWD FLOW</span>
              </div>
              <div className="text-2xl font-headline font-bold text-primary">84% Efficiency</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Stats Strip
const StatsStrip = () => {
  const stats = [
    { value: '50K+', label: 'Attendees Managed' },
    { value: '35%', label: 'Faster Entry', highlight: true },
    { value: '60%', label: 'Queue Reduction', highlight: true },
    { value: 'Real-Time', label: 'AI Guidance' }
  ];

  return (
    <div className="bg-surface-container-lowest py-12 border-y border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-8 md:gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div
              className={`text-3xl font-headline font-bold ${
                stat.highlight ? 'text-secondary-fixed' : 'text-on-surface'
              }`}
            >
              {stat.value}
            </div>
            <div className="text-xs font-label text-on-surface-variant uppercase tracking-widest">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Features Bento Grid
const Features = () => {
  const features = [
    { icon: 'gate', title: 'Smart Gate Entry', desc: 'Predictive entrance routing to eliminate bottlenecks before they happen.', highlight: false },
    { icon: 'map', title: 'Live Crowd Heatmap', desc: 'Visual intelligence layer tracking venue density in real-time high fidelity.', highlight: true, iconColor: 'text-secondary-fixed' },
    { icon: 'analytics', title: 'Queue Intelligence', desc: 'Wait time estimations for restrooms, food stalls, and stadium exits.', highlight: false },
    { icon: 'psychology', title: 'AI Venue Assistant', desc: 'Conversational interface for ticket holders to find their way effortlessly.', highlight: false },
    { icon: 'emergency', title: 'Emergency Routing', desc: 'Rapid, dynamic evacuation and crisis routing powered by real-time data.', highlight: false },
    { icon: 'departure_board', title: 'Smart Exit Planning', desc: 'Staggered exit strategy to ensure post-game transit flows perfectly.', highlight: false }
  ];

  return (
    <section className="py-24 relative" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-secondary-fixed font-label uppercase tracking-[0.2em] text-sm">
            Capabilities
          </span>
          <h2 className="text-4xl lg:text-5xl font-headline font-bold text-on-surface mt-4 tracking-tight">
            The Kinetic Intelligence
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`glass-card p-8 rounded-xl transition-all group ${
                feature.highlight ? 'border-primary/20' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span
                  className={`material-symbols-outlined ${feature.iconColor || 'text-primary'}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {feature.icon}
                </span>
              </div>
              <h3 className={`text-xl font-headline font-bold mb-3 ${feature.highlight ? 'text-secondary-fixed' : ''}`}>
                {feature.title}
              </h3>
              <p className="text-on-surface-variant leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorks = () => {
  const steps = [
    { number: '01', title: 'Enter Venue', desc: 'Sync your ticket and receive a personalized entrance route based on live flow.' },
    { number: '02', title: 'Get Live Guidance', desc: 'AI monitors the entire stadium and redirects you to shorter lines in real-time.' },
    { number: '03', title: 'Enjoy Experience', desc: 'Focus on the event, not the logistics. Leave the venue as smoothly as you arrived.' }
  ];

  return (
    <section className="py-24 bg-surface-container-lowest" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-4xl font-headline font-bold mb-6">Streamlined Experience</h2>
          <p className="text-on-surface-variant">We turn stadium chaos into a choreographed performance through three simple stages.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-outline-variant/30 to-transparent" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative flex flex-col items-center text-center z-10"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center border-4 border-background mb-6 shadow-xl"
              >
                <span className="text-primary font-headline font-bold text-2xl">{step.number}</span>
              </motion.div>
              <h4 className="text-xl font-headline font-bold mb-4 text-secondary-fixed">{step.title}</h4>
              <p className="text-on-surface-variant">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Security Section
const Security = () => {
  const features = [
    { title: 'Secure AI Protocols', desc: 'Military-grade encryption for all visitor data and venue telemetry.' },
    { title: 'Elastic Cloud Sync', desc: 'Seamless scaling from local theaters to 100K capacity Olympic arenas.' },
    { title: 'Zero-Downtime Infrastructure', desc: 'High-availability architecture designed for high-stress event environments.' }
  ];

  const cards = [
    { icon: 'cloud_done', title: 'Cloud Scalable', color: 'text-secondary-fixed', delay: 0 },
    { icon: 'lock_open', title: 'Encrypted Endpoints', color: 'text-primary', delay: 0.1 },
    { icon: 'shield_person', title: 'Privacy First', color: 'text-primary', delay: 0.2 },
    { icon: 'terminal', title: 'Open API', color: 'text-secondary-fixed', delay: 0.3 }
  ];

  return (
    <section className="py-24 overflow-hidden" id="security">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 border-outline-variant/10"
        >
          <div className="lg:w-1/2">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <span className="font-label text-primary uppercase tracking-widest text-sm">Enterprise Security</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-headline font-bold text-on-surface mb-8 leading-tight">
              Built for Scale. <br />Locked for Safety.
            </h2>
            <div className="space-y-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-xs">check</span>
                  </div>
                  <div>
                    <h5 className="font-bold font-headline">{feature.title}</h5>
                    <p className="text-on-surface-variant text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-10 bg-primary/5 blur-[80px] rounded-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {cards.slice(0, 2).map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: card.delay, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-surface-container-highest p-6 rounded-xl border border-outline-variant/20"
                  >
                    <span className={`material-symbols-outlined ${card.color} text-4xl`}>{card.icon}</span>
                    <div className="mt-4 font-headline font-bold">{card.title}</div>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-4 pt-12">
                {cards.slice(2, 4).map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: card.delay, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-surface-container-highest p-6 rounded-xl border border-outline-variant/20"
                  >
                    <span className={`material-symbols-outlined ${card.color} text-4xl`}>{card.icon}</span>
                    <div className="mt-4 font-headline font-bold">{card.title}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials
const Testimonials = () => {
  const testimonials = [
    {
      quote: "I've never entered a sold-out stadium this fast. The AI guided me to a gate I didn't even know existed. Pure magic.",
      name: 'Marcus R.',
      role: 'Season Ticket Holder',
      image: '/user1.png'
    },
    {
      quote: "Finding the shortest beer line during halftime was a game-changer. I didn't miss a single minute of the second half!",
      name: 'Sarah J.',
      role: 'Concert Visitor',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJqyoj9iPj6ltcnqhoMvSk5gzdohlp1IKle9pKQQttY6_d8JKMreh2JUFJxK_noiNx4JrY0TOw0Gfpnv2QwgxHhSKjLCeOgGcde1EYrm03zhRF3s1XsbJpClhNfvP1xWWYQ6x81klDB6U6RMvRTp3MmyD20IBbu8-_0LhZnVW2kkzsKIw_Vo7NuVhsBUtpPGDR_uxifttde4yIjzx-Aey7_9FKyg0JgBvh7PSpmDVjLp_ZtspEDLyIFjvtrYJlFpCVxfCTj_d-DebJ'
    },
    {
      quote: "The app directed us out of the stadium in record time. Usually we're stuck for an hour, but we were in our car in 15 minutes.",
      name: 'David L.',
      role: 'Event Organizer',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBnIHr1afqASntaM595IhbxTxwPDpOdKIP2h14a9-XRYdyQbmeZflRz9QPpOn7hwsIvvZ2rN-qaxa0wrYCtT7dpGe9V924LgIBMMn1t0l1JFexrki7ETc61vgxzXRT_z0Vtz7zl32JRNRy4HxupVPw62b8bzxWcCd4DReklmA2JnPMakRyijcKeoonwOPM0FmXhnuVhvLZ3gE5Bn5vg7sOwvDn7VgQsbLuSBhtACfUO7c3hh_liKSkdPOzIZR5VoEKM0UIyOhE4SuD'
    }
  ];

  return (
    <section className="py-24 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-16"
        >
          <div>
            <span className="text-secondary-fixed font-label uppercase tracking-widest text-sm">The Voice of the Fan</span>
            <h2 className="text-4xl font-headline font-bold text-on-surface mt-4">Visitor Impact</h2>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`glass-card p-8 rounded-xl relative ${idx === 1 ? 'border-primary/30' : ''}`}
            >
              <span className="material-symbols-outlined text-primary/20 text-6xl absolute top-4 right-4">
                format_quote
              </span>
              <p className="text-on-surface-variant mb-8 italic">{testimonial.quote}</p>
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant"
                >
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </motion.div>
                <div>
                  <div className="font-headline font-bold text-on-surface">{testimonial.name}</div>
                  <div className="text-xs text-primary font-label">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTA = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-primary/5"
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-5xl lg:text-7xl font-headline font-bold text-on-surface mb-8 tracking-tighter"
        >
          Upgrade Every <br />Stadium Experience
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-xl text-on-surface-variant mb-12"
        >
          Join the future of crowd orchestration today and transform how thousands experience live events.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 0.98, boxShadow: '0 0 30px rgba(60,215,255,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-primary text-on-primary rounded-md font-headline font-bold text-xl transition-all w-full sm:w-auto text-center"
            >
              Partner With Us
            </motion.button>
          </Link>
          <Link to="/signin">
            <motion.button
              whileHover={{ scale: 0.98, borderColor: '#3cd7ff', color: '#3cd7ff' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-transparent border-2 border-outline-variant text-on-surface rounded-md font-headline font-bold text-xl transition-all w-full sm:w-auto text-center"
            >
              Member Login
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const links = ['Privacy Policy', 'Terms of Service', 'Stadium Partners', 'API Docs'];

  return (
    <footer className="bg-slate-950 w-full py-16 border-t border-cyan-400/10">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center md:items-start"
        >
          <div className="text-xl font-bold text-slate-50 font-headline mb-4">ArenaSync AI</div>
          <p className="text-slate-500 max-w-xs text-center md:text-left text-sm">
            © 2024 ArenaSync AI. Orchestrating the Kinetic Theater.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 font-['Manrope'] text-sm tracking-wide">
          {links.map((link, idx) => (
            <motion.a
              key={idx}
              href="#"
              whileHover={{ y: -2, color: '#a9f900' }}
              className="text-slate-500 hover:text-lime-400 transition-colors duration-200"
            >
              {link}
            </motion.a>
          ))}
        </div>

        <div className="flex gap-4">
          {['public', 'alternate_email'].map((icon, idx) => (
            <motion.a
              key={idx}
              href="#"
              whileHover={{ scale: 1.1, backgroundColor: '#1e293b' }}
              className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-slate-400 text-lg">{icon}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const Landing = () => {
  // Add smooth scroll behavior for anchor links
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.hash && target.hash.startsWith('#') && target.hash !== '#') {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <Features />
        <HowItWorks />
        <Security />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;

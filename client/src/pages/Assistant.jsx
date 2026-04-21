import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';

const Assistant = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col lg:flex-row font-body transition-colors">
      <Sidebar />

      <main className="flex-1 flex flex-col h-[100svh] overflow-hidden">
        {/* Header */}
        <header className="h-16 md:h-20 px-4 md:px-6 lg:px-10 flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="p-2 mr-2 rounded-xl bg-surface-container-highest/50 text-on-surface-variant hover:text-primary transition-colors">
                <ChevronLeft className="w-5 h-5" />
             </button>
             <div>
                <h2 className="text-xl font-headline font-bold">AI Assistant</h2>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Full Screen Interactive Mode</p>
             </div>
          </div>
        </header>

        {/* Scaled-up ChatBox container */}
        <div className="flex-1 overflow-hidden p-4 md:p-6 lg:p-10">
          <div className="w-full h-full max-w-7xl mx-auto block">
            <ChatBox />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Assistant;

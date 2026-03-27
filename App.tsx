import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TrafficMap from './components/TrafficMap';
import ManualInputForm from './components/ManualInputForm';
import EnhancementLab from './components/EnhancementLab';
import ViolationHistory from './components/ViolationHistory';
import TopOffenders from './components/TopOffenders';
import SimulationDisplay from './components/SimulationDisplay';
import AIAssistant from './components/AIAssistant';
import VideoAnalyzer from './components/VideoAnalyzer';
import CityGrid from './components/CityGrid';
import { getViolations } from './services/storage';
import { checkAPIConnection } from './services/ai';
import { ViolationRecord, WeatherState, AppSettings } from './types';
import { Search, Wifi, WifiOff, Menu } from 'lucide-react';

const HYDERABAD_ZONES = ['Madhapur', 'Gachibowli', 'Banjara Hills', 'Kukatpally', 'LB Nagar', 'Secunderabad', 'Charminar', 'Hitech City', 'Mehdipatnam'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [weather, setWeather] = useState<WeatherState>('Sunny');
  const [isBooting, setIsBooting] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [settings] = useState<AppSettings>({
    darkMode: false,
    liveTelemetry: true,
    weatherSync: true,
    notificationsEnabled: true,
    monitoredZones: HYDERABAD_ZONES
  });

  const refreshData = useCallback(() => {
    const data = getViolations();
    setViolations(data);
  }, []);

  useEffect(() => {
    const bootSequence = async () => {
      refreshData();
      const connected = await checkAPIConnection();
      setApiConnected(connected);
      setIsBooting(false);
    };
    bootSequence();
  }, [refreshData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard violations={violations} />;
      case 'map': return <TrafficMap violations={violations} />;
      case 'video': return <VideoAnalyzer weather={weather} onViolationDetected={() => {}} />;
      case 'grid': return <CityGrid />;
      case 'input': return <ManualInputForm onProcessed={() => {}} />;
      case 'enhance': return <EnhancementLab />;
      case 'simulation': return <SimulationDisplay onViolationDetected={() => {}} />;
      case 'ai_hub': return <div className="h-full w-full overflow-hidden"><AIAssistant violations={violations} /></div>;
      case 'history': return <ViolationHistory violations={violations} onRefresh={refreshData} />;
      case 'offenders': return <TopOffenders violations={violations} />;
      default: return <Dashboard violations={violations} />;
    }
  };

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${settings.darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(t) => { setActiveTab(t); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 min-w-0 overflow-hidden w-full max-w-[100vw]">

        {/* HEADER */}
        <header className="flex justify-between items-center mb-6 flex-wrap gap-4 w-full">

          {/* MOBILE MENU */}
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-white rounded">
            <Menu size={20} />
          </button>

          {/* SEARCH */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <Search size={16} />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* STATUS */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`px-3 py-1 rounded ${apiConnected ? 'bg-green-200' : 'bg-red-200'}`}>
              {apiConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            </div>
          </div>

        </header>

        {/* PAGE CONTENT */}
        <div className="h-full w-full overflow-hidden">
          {renderContent()}
        </div>

      </main>
    </div>
  );
};

export default App;
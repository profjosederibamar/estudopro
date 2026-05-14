import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import Sidebar, { ModuleId } from './components/Sidebar';
import { useAppState } from './hooks/useAppState';
import Dashboard from './modules/Dashboard';
import WeeklyHours from './modules/WeeklyHours';
import VerticalEdital from './modules/VerticalEdital';
import StudyCycles from './modules/StudyCycles';
import PerformanceDiagnosis from './modules/PerformanceDiagnosis';
import SimuladosModule from './modules/Simulados';
import ChecklistModule from './modules/Checklist';

export default function App() {
  const { state, setState, resetData, loading } = useAppState();
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-brand-muted text-sm font-medium animate-pulse">Sincronizando seus dados...</p>
        </div>
      </div>
    );
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard state={state} onNavigate={(target) => {
          if (typeof target === 'function') {
            const newState = target(state);
            setState(newState);
          } else {
            setActiveModule(target as ModuleId);
          }
        }} />;
      case 'weekly':
        return <WeeklyHours state={state} setState={setState} onReset={() => resetData('weeklyHours')} />;
      case 'edital':
        return <VerticalEdital state={state} setState={setState} onReset={() => resetData('edital')} />;
      case 'cycles':
        return <StudyCycles state={state} setState={setState} onReset={() => resetData('cycles')} />;
      case 'diagnosis':
        return <PerformanceDiagnosis state={state} setState={setState} onReset={() => resetData('diagnosis')} />;
      case 'simulados':
        return <SimuladosModule state={state} setState={setState} onReset={() => resetData('simulados')} />;
      case 'checklist':
        return <ChecklistModule state={state} setState={setState} onReset={() => resetData('checklist')} />;
      default:
        return <Dashboard state={state} onNavigate={setActiveModule} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-bg text-brand-text">
      <Sidebar 
        activeModule={activeModule} 
        onSelect={setActiveModule}
        onReset={() => {
          resetData();
          setActiveModule('dashboard');
        }}
        isMobileExpanded={isMobileExpanded}
        setIsMobileExpanded={setIsMobileExpanded}
        examConfig={state.examConfig}
        onUpdateExam={(examConfig) => setState(prev => ({ ...prev, examConfig }))}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Polish */}
        <header className="h-20 shrink-0 border-b border-brand-secondary flex items-center justify-between px-8 bg-brand-bg hidden lg:flex">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-400 capitalize">{activeModule.replace(/([A-Z])/g, ' $1')}</h2>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-brand-secondary border-2 border-brand-accent flex items-center justify-center font-bold text-white text-xs">
              {state.examConfig.name?.substring(0, 2).toUpperCase() || 'EP'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderModule()}
        </div>
      </main>
    </div>
  );
}

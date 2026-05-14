import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  ListTodo, 
  RotateCw, 
  BarChart3, 
  TestTube2, 
  CheckSquare,
  Menu,
  X,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export type ModuleId = 'dashboard' | 'weekly' | 'edital' | 'cycles' | 'diagnosis' | 'simulados' | 'checklist';

interface SidebarProps {
  activeModule: ModuleId;
  onSelect: (id: ModuleId) => void;
  onReset: () => void;
  isMobileExpanded: boolean;
  setIsMobileExpanded: (val: boolean) => void;
  examConfig: { name: string; position: string };
  onUpdateExam: (config: { name: string; position: string }) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'weekly', label: 'Horas Semanais', icon: Clock },
  { id: 'edital', label: 'Edital Vertical', icon: ListTodo },
  { id: 'cycles', label: 'Ciclos de Estudo', icon: RotateCw },
  { id: 'diagnosis', label: 'Diagnóstico', icon: BarChart3 },
  { id: 'simulados', label: 'Simulados', icon: TestTube2 },
  { id: 'checklist', label: 'Checklist Org.', icon: CheckSquare },
] as const;

export default function Sidebar({ 
  activeModule, 
  onSelect, 
  onReset, 
  isMobileExpanded, 
  setIsMobileExpanded,
  examConfig,
  onUpdateExam
}: SidebarProps) {
  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-brand-card flex items-center justify-between px-4 z-50 border-b border-brand-secondary/30">
        <h1 className="text-brand-accent font-bold text-xl">EstudaPro</h1>
        <button 
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="p-2 text-brand-text hover:bg-brand-secondary/20 rounded-lg transition-colors"
        >
          {isMobileExpanded ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Desktop / Mobile Overlay */}
      <AnimatePresence>
        {(isMobileExpanded || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed lg:static inset-y-0 left-0 w-64 bg-brand-card z-40 flex flex-col border-r border-brand-secondary",
              !isMobileExpanded && "hidden lg:flex"
            )}
          >
            <div className="p-6 border-b border-brand-secondary/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center font-bold text-brand-bg">EP</div>
                <h1 className="text-xl font-bold tracking-tight text-white">EstudaPro</h1>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest pl-1">Concurso / Cargo</label>
                <input 
                  value={examConfig.name}
                  onChange={(e) => onUpdateExam({ ...examConfig, name: e.target.value })}
                  placeholder="Nome do Concurso..."
                  className="w-full bg-transparent border-none text-brand-accent font-bold text-sm outline-none focus:ring-0 p-1 hover:bg-white/5 rounded transition-colors"
                />
                <input 
                  value={examConfig.position}
                  onChange={(e) => onUpdateExam({ ...examConfig, position: e.target.value })}
                  placeholder="Cargo Pretendido..."
                  className="w-full bg-transparent border-none text-gray-400 text-[11px] outline-none focus:ring-0 p-1 hover:bg-white/5 rounded transition-colors italic"
                />
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelect(item.id);
                      setIsMobileExpanded(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group text-sm",
                      isActive 
                        ? "bg-brand-accent text-brand-bg font-semibold shadow-lg shadow-brand-accent/20" 
                        : "text-gray-300 hover:bg-brand-secondary transition-colors"
                    )}
                  >
                    <Icon size={18} className={cn(isActive ? "text-brand-bg" : "group-hover:scale-110 transition-transform")} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-6">
              <button
                onClick={() => {
                  if (confirm('Deseja realmente limpar TODOS os dados do aplicativo?')) {
                    onReset();
                  }
                }}
                className="w-full bg-brand-danger py-2 rounded text-xs font-bold uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
              >
                Limpar Dados
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay Backdrop */}
      {isMobileExpanded && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileExpanded(false)}
        />
      )}
    </>
  );
}

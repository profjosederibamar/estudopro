import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Target,
  Clock,
  ChevronRight
} from 'lucide-react';
import { AppState } from '../types';
import { cn } from '../lib/utils';

interface DashboardProps {
  state: AppState;
  onNavigate: (module: any) => void;
}

export default function Dashboard({ state, onNavigate }: DashboardProps) {
  const currentWeek = state.weeklyHours[state.weeklyHours.length - 1];
  const lastSimulado = state.simulados[state.simulados.length - 1];
  
  const checklistProgress = (() => {
    const total = state.checklist.reasons.length + state.checklist.actions.length;
    const checked = [...state.checklist.reasons, ...state.checklist.actions].filter(i => i.checked).length;
    return Math.round((checked / total) * 100) || 0;
  })();

  const stats = [
    { 
      label: 'Semana Atual', 
      value: currentWeek ? `Semana ${currentWeek.weekNumber}` : 'Nenhuma', 
      icon: Calendar,
      color: 'bg-blue-500/20 text-blue-400',
      moduleId: 'weekly'
    },
    { 
      label: 'Simulado Recente', 
      value: lastSimulado ? lastSimulado.name : 'Nenhum', 
      icon: Target,
      color: 'bg-orange-500/20 text-orange-400',
      moduleId: 'simulados'
    },
    { 
      label: 'Organização', 
      value: `${checklistProgress}%`, 
      icon: CheckCircle2,
      color: 'bg-green-500/20 text-green-400',
      moduleId: 'checklist'
    },
    { 
      label: 'Ciclo Ativo', 
      value: state.cycles[0]?.name || 'Nenhum', 
      icon: TrendingUp,
      color: 'bg-purple-500/20 text-purple-400',
      moduleId: 'cycles'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Resumo Geral</h2>
        <p className="text-brand-muted">Acompanhe seu progresso e mantenha o foco no objetivo.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onNavigate(stat.moduleId)}
            className="bg-brand-card p-6 rounded-xl border border-brand-secondary hover:border-brand-accent cursor-pointer transition-all group"
          >
            <div className={`p-3 rounded-lg w-fit ${stat.color} mb-4 group-hover:scale-110 transition-transform shadow-inner`}>
              <stat.icon size={20} />
            </div>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
            <p className="text-lg font-bold text-white mt-1 break-words">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
        {/* Module 1 & 2: Hours (Col span 2) */}
        <div className="lg:col-span-2 bg-brand-card rounded-xl border border-brand-secondary overflow-hidden flex flex-col shadow-lg">
          <div className="p-5 flex justify-between items-center bg-brand-card">
            <h3 className="font-bold text-brand-accent text-sm uppercase tracking-wider flex items-center gap-2">
              <Clock className="text-brand-accent" size={16} />
              Meta Semanal
            </h3>
            <span className="text-xs text-gray-400">Soma Realizada: {currentWeek?.subjects.reduce((a, b) => a + b.realized, 0) || 0}h</span>
          </div>
          <div className="px-5 pb-6 space-y-4">
            {currentWeek ? (
              <div className="space-y-4">
                {currentWeek.subjects.slice(0, 4).map(sub => {
                  const percent = Math.min(Math.round((sub.realized / sub.planned) * 100) || 0, 100);
                  const isLow = percent < 30;
                  return (
                    <div key={sub.id} className="space-y-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={cn("text-gray-300 font-medium", isLow && "text-brand-danger")}>{sub.name} {isLow && "(Alerta)"}</span>
                        <span className="text-gray-400">{sub.realized}h / {sub.planned}h</span>
                      </div>
                      <div className="h-2 bg-brand-bg rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          className={cn("h-full", isLow ? "bg-brand-danger" : "bg-brand-accent")}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 italic text-sm">
                Nenhuma semana ativa.
              </div>
            )}
          </div>
        </div>

        {/* Module 5: Simulations */}
        <div className="bg-brand-card rounded-xl border border-brand-secondary p-5 flex flex-col shadow-lg">
          <h3 className="font-bold text-brand-accent text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
            <Target className="text-brand-accent" size={16} />
            Último Simulado
          </h3>
          {lastSimulado ? (
            <div className="flex flex-col h-full justify-between pb-2 text-center">
              <div>
                <div className="text-5xl font-black text-brand-success">
                  {Math.round((lastSimulado.subjects.reduce((a, b) => a + b.hits, 0) / lastSimulado.subjects.reduce((a, b) => a + b.total, 0)) * 100) || 0}%
                </div>
                <div className="text-[10px] text-gray-400 mt-2 uppercase tracking-tight font-bold">Desempenho Geral</div>
              </div>
              <div className="space-y-2 mt-6">
                {state.simulados.slice(-2).reverse().map((sim, idx) => {
                  const s = sim.subjects.reduce((a, b) => a + b.hits, 0);
                  const t = sim.subjects.reduce((a, b) => a + b.total, 0);
                  return (
                    <div key={sim.id} className={cn(
                      "flex justify-between p-2 bg-brand-bg rounded border-l-4 text-xs font-medium",
                      idx === 0 ? "border-brand-success" : "border-brand-accent"
                    )}>
                      <span className="text-gray-200 truncate pr-2">{sim.name}</span>
                      <span className="font-mono text-white shrink-0">{s}/{t}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 italic text-sm">
              Sem dados de simulados.
            </div>
          )}
        </div>

        {/* Module 6: Checklist Snippet */}
        <div className="bg-brand-card rounded-xl border border-brand-secondary overflow-hidden flex flex-col shadow-lg min-h-[160px]">
          <div className="grid grid-cols-2 flex-1">
            <div className="p-4 bg-brand-danger bg-opacity-10 border-r border-brand-secondary/30">
               <h4 className="text-[10px] font-bold uppercase mb-3 text-brand-danger">Caos</h4>
               <div className="space-y-2">
                 {state.checklist.reasons.slice(0, 3).map(item => (
                   <div key={item.id} className="flex items-center gap-2 opacity-70">
                     <div className={cn("w-2 h-2 rounded-full", item.checked ? "bg-brand-danger" : "border border-brand-danger")} />
                     <span className="text-[10px] truncate text-gray-300">{item.text}</span>
                   </div>
                 ))}
               </div>
            </div>
            <div className="p-4 bg-brand-success bg-opacity-10">
               <h4 className="text-[10px] font-bold uppercase mb-3 text-brand-success">Ordem</h4>
               <div className="space-y-2">
                 {state.checklist.actions.slice(0, 3).map(item => (
                   <div key={item.id} className="flex items-center gap-2">
                     <div className={cn("w-2 h-2 rounded-full", item.checked ? "bg-brand-success" : "border border-brand-success")} />
                     <span className="text-[10px] truncate text-gray-300">{item.text}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Module 4: Diagnosis Snippet */}
        <div className="bg-brand-card rounded-xl p-5 border border-brand-secondary flex flex-col justify-between shadow-lg min-h-[160px]">
          <h3 className="font-bold text-brand-accent text-sm uppercase tracking-wider mb-4">Diagnóstico de Erros</h3>
          <div className="space-y-3">
             {state.diagnosis.slice(0, 3).map(item => (
               <div key={item.id} className="flex justify-between items-center bg-brand-bg/40 p-2 rounded">
                 <span className="text-[10px] text-gray-300 truncate pr-2">{item.area}</span>
                 <span className="bg-brand-accent px-2 py-0.5 rounded text-[8px] text-brand-bg font-bold whitespace-nowrap">REVISAR</span>
               </div>
             ))}
             {state.diagnosis.length === 0 && (
               <div className="text-center py-4 text-gray-500 text-[10px] italic">Sem diagnósticos.</div>
             )}
          </div>
        </div>

        {/* Module 3: Cycle Snippet */}
        <div className="bg-brand-card rounded-xl p-5 border border-brand-secondary shadow-lg min-h-[160px]">
          <div className="flex justify-between items-start mb-4">
             <h3 className="font-bold text-brand-accent text-sm uppercase tracking-wider">Ciclo Ativo</h3>
             <span className="px-2 py-1 bg-brand-secondary rounded text-[9px] font-bold text-white uppercase tracking-tighter">Reta Final</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
             <div className="p-2 bg-brand-bg/60 border border-brand-secondary rounded flex flex-col gap-1">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Hoje</span>
                <span className="text-[10px] font-bold text-white truncate">{state.cycles[0]?.items[0]?.subject || 'Descanso'}</span>
             </div>
             <div className="p-2 bg-brand-bg/60 border border-brand-secondary rounded flex flex-col gap-1">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Amanhã</span>
                <span className="text-[10px] font-bold text-white truncate">{state.cycles[0]?.items[1]?.subject || 'Próximo'}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Plus, Trash2, Calendar, Target, ChevronRight, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import { AppState, Simulado, SimuladoSubject } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SimuladosProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onReset: () => void;
}

export default function SimuladosModule({ state, setState, onReset }: SimuladosProps) {
  const [expandedSimulado, setExpandedSimulado] = useState<string | null>(null);

  const removeSimuladoSubject = (simId: string, subId: string) => {
    if (confirm('Excluir esta matéria do simulado?')) {
      setState(prev => ({
        ...prev,
        simulados: prev.simulados.map(s => s.id === simId ? {
          ...s,
          subjects: s.subjects.filter(sub => sub.id !== subId)
        } : s)
      }));
    }
  };

  const addSimulado = () => {
    const newSimulado: Simulado = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Simulado ${state.simulados.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      subjects: []
    };
    setState(prev => ({ ...prev, simulados: [...prev.simulados, newSimulado] }));
    setExpandedSimulado(newSimulado.id);
  };

  const removeSimulado = (id: string) => {
    if (confirm('Excluir este simulado?')) {
      setState(prev => ({ ...prev, simulados: prev.simulados.filter(s => s.id !== id) }));
    }
  };

  const addSubjectToSimulado = (simId: string) => {
    setState(prev => ({
      ...prev,
      simulados: prev.simulados.map(s => s.id === simId ? {
        ...s,
        subjects: [...s.subjects, { id: Math.random().toString(36).substr(2, 9), name: 'Nova Matéria', hits: 0, total: 0 }]
      } : s)
    }));
  };

  const updateSubjectData = (simId: string, subId: string, field: keyof SimuladoSubject, value: number) => {
    setState(prev => ({
      ...prev,
      simulados: prev.simulados.map(s => s.id === simId ? {
        ...s,
        subjects: s.subjects.map(sub => sub.id === subId ? { ...sub, [field]: value } : sub)
      } : s)
    }));
  };

  const updateSimuladoDate = (id: string, date: string) => {
      setState(prev => ({
          ...prev,
          simulados: prev.simulados.map(s => s.id === id ? { ...s, date } : s)
      }));
  };

  const getSimuladoStats = (sim: Simulado) => {
    const totalHits = sim.subjects.reduce((acc, s) => acc + s.hits, 0);
    const totalQuestions = sim.subjects.reduce((acc, s) => acc + s.total, 0);
    const percent = totalQuestions > 0 ? Math.round((totalHits / totalQuestions) * 100) : 0;
    return { totalHits, totalQuestions, percent };
  };

  const evolutionData = state.simulados.map(s => ({
    name: s.name,
    percent: getSimuladoStats(s).percent
  }));

  const cardColors = [
    'border-blue-500/50 from-blue-500/10',
    'border-orange-500/50 from-orange-500/10',
    'border-green-500/50 from-green-500/10',
    'border-purple-500/50 from-purple-500/10',
    'border-red-500/50 from-red-500/10',
    'border-cyan-500/50 from-cyan-500/10',
  ];

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Controle de Simulados</h2>
          <p className="text-brand-muted">Mensure seu desempenho em condições reais de prova.</p>
        </div>
        <button onClick={addSimulado} className="flex items-center gap-2 bg-brand-accent text-brand-bg px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform">
          <Plus size={20} />
          <span>Novo Simulado</span>
        </button>
      </header>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={addSimulado}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-accent text-brand-bg rounded-full shadow-2xl flex items-center justify-center z-30 active:scale-90 transition-transform"
      >
        <Plus size={32} />
      </button>

      {state.simulados.length > 1 && (
        <div className="bg-brand-card rounded-2xl border border-brand-secondary/10 p-6">
           <h3 className="text-brand-muted text-xs font-bold uppercase tracking-widest mb-6">Evolução do Desempenho (%)</h3>
           <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={evolutionData}>
                    <defs>
                      <linearGradient id="colorPercent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f5a623" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#415a7722" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#778da9', fontSize: 10 }} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a2e45', border: '1px solid #415a7733', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="percent" stroke="#f5a623" strokeWidth={3} fillOpacity={1} fill="url(#colorPercent)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      )}

      {state.simulados.length === 0 ? (
        <div className="bg-brand-card rounded-2xl p-12 border border-dashed border-brand-secondary/30 flex flex-col items-center gap-4">
          <Target className="text-brand-muted" size={48} />
          <p className="text-brand-muted text-center max-w-xs">Registre seu primeiro simulado para começar a traçar sua evolução.</p>
          <button onClick={addSimulado} className="text-brand-accent hover:underline font-semibold">Adicionar Simulado</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {state.simulados.slice().reverse().map((sim, i) => {
            const stats = getSimuladoStats(sim);
            const isExpanded = expandedSimulado === sim.id;
            const colorClass = cardColors[i % cardColors.length];

            return (
              <motion.div 
                key={sim.id}
                layout
                className={cn(
                  "bg-gradient-to-br bg-brand-card border-l-8 rounded-2xl overflow-hidden shadow-xl transition-all",
                  colorClass,
                  isExpanded ? "ring-2 ring-brand-accent/30" : "hover:border-opacity-100 border-opacity-40"
                )}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4 group/header">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-white leading-tight flex-1">
                          <input 
                            value={sim.name}
                            onChange={(e) => {
                              const name = e.target.value;
                              setState(prev => ({ ...prev, simulados: prev.simulados.map(s => s.id === sim.id ? { ...s, name } : s) }));
                            }}
                            className="bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 flex-1 font-bold text-xl"
                            placeholder="Nome do Simulado..."
                          />
                        </div>
                      <div className="flex items-center gap-2 text-brand-muted text-xs mt-1 pl-1">
                        <Calendar size={14} />
                        <input 
                          type="date"
                          value={sim.date}
                          onChange={(e) => updateSimuladoDate(sim.id, e.target.value)}
                          className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-3xl font-black text-brand-accent">{stats.percent}%</span>
                       <p className="text-[10px] uppercase font-bold text-brand-muted tracking-tighter">Aproveitamento Total</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-6">
                     <div className="flex-1 bg-brand-bg/50 p-3 rounded-xl border border-brand-secondary/10">
                        <p className="text-[10px] uppercase font-bold text-brand-muted mb-1">Questões</p>
                        <p className="text-lg font-bold">{stats.totalHits} / {stats.totalQuestions}</p>
                     </div>
                     <button 
                       onClick={() => setExpandedSimulado(isExpanded ? null : sim.id)}
                       className="p-3 bg-brand-secondary/20 hover:bg-brand-secondary/30 rounded-xl transition-colors"
                     >
                       {isExpanded ? <ChevronUp /> : <ChevronDown />}
                     </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                         <div className="space-y-4 pt-4 border-t border-brand-secondary/10">
                            {sim.subjects.map(sub => {
                               const subPercent = sub.total > 0 ? Math.round((sub.hits / sub.total) * 100) : 0;
                               return (
                                 <div key={sub.id} className="bg-brand-bg/30 p-3 rounded-lg flex items-center justify-between group/sub">
                                    <div className="space-y-1 flex-1 pr-4">
                                       <div className="flex justify-between text-xs font-bold mb-1">
                                          <div className="flex items-center gap-2 text-gray-200 flex-1">
                                            <input 
                                               value={sub.name}
                                               onChange={(e) => {
                                                 const val = e.target.value;
                                                 setState(prev => ({
                                                   ...prev,
                                                   simulados: prev.simulados.map(s => s.id === sim.id ? {
                                                     ...s,
                                                     subjects: s.subjects.map(item => item.id === sub.id ? { ...item, name: val } : item)
                                                   } : s)
                                                 }));
                                               }}
                                               className="bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 flex-1 font-bold text-xs"
                                               placeholder="Matéria..."
                                             />
                                            <button onClick={() => removeSimuladoSubject(sim.id, sub.id)} className="p-0.5 text-brand-danger hover:text-brand-danger transition-all opacity-0 group-hover/sub:opacity-100">
                                              <Trash2 size={12} />
                                            </button>
                                          </div>
                                          <span className={cn(
                                            "ml-2",
                                            subPercent >= 80 ? "text-green-400" : subPercent >= 50 ? "text-brand-accent" : "text-red-400"
                                          )}>{subPercent}%</span>
                                       </div>
                                       <div className="h-1 bg-brand-bg rounded-full overflow-hidden">
                                          <div className={cn("h-full", subPercent >= 80 ? "bg-green-500" : "bg-brand-accent")} style={{ width: `${subPercent}%` }} />
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <input 
                                         type="number"
                                         value={sub.hits}
                                         placeholder="Hits"
                                         onChange={(e) => updateSubjectData(sim.id, sub.id, 'hits', parseInt(e.target.value) || 0)}
                                         className="w-12 h-8 text-xs bg-brand-card border border-brand-secondary/20 rounded text-center outline-none focus:border-brand-accent"
                                       />
                                       <span className="text-brand-muted">/</span>
                                       <input 
                                         type="number"
                                         value={sub.total}
                                         placeholder="Total"
                                         onChange={(e) => updateSubjectData(sim.id, sub.id, 'total', parseInt(e.target.value) || 0)}
                                         className="w-12 h-8 text-xs bg-brand-card border border-brand-secondary/20 rounded text-center outline-none focus:border-brand-accent"
                                       />
                                    </div>
                                 </div>
                               );
                            })}
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => addSubjectToSimulado(sim.id)}
                                 className="flex-1 py-2 bg-brand-secondary/20 hover:bg-brand-secondary/30 rounded-lg text-xs font-bold uppercase tracking-widest"
                               >
                                 + Matéria
                               </button>
                               <button 
                                 onClick={() => removeSimulado(sim.id)}
                                 className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
                               >
                                 <Trash2 size={16} />
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

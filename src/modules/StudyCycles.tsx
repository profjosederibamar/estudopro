import React from 'react';
import { Plus, Trash2, CheckCircle, Circle, RotateCcw, Edit2 } from 'lucide-react';
import { AppState, Cycle, CyclePhase } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface StudyCyclesProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onReset: () => void;
}

export default function StudyCycles({ state, setState, onReset }: StudyCyclesProps) {
  const removeCycleItem = (cycleId: string, itemId: string) => {
    if (confirm('Excluir este item do ciclo?')) {
      setState(prev => ({
        ...prev,
        cycles: prev.cycles.map(c => c.id === cycleId ? {
          ...c,
          items: c.items.filter(i => i.id !== itemId)
        } : c)
      }));
    }
  };

  const addCycle = () => {
    const newCycle: Cycle = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Ciclo ${state.cycles.length + 1}`,
      phase: 'Pré-Edital',
      items: []
    };
    setState(prev => ({ ...prev, cycles: [...prev.cycles, newCycle] }));
  };

  const removeCycle = (id: string) => {
    if (confirm('Excluir este ciclo?')) {
      setState(prev => ({ ...prev, cycles: prev.cycles.filter(c => c.id !== id) }));
    }
  };

  const addCycleItem = (cycleId: string) => {
    setState(prev => ({
      ...prev,
      cycles: prev.cycles.map(c => c.id === cycleId ? {
        ...c,
        items: [...c.items, { id: Math.random().toString(36).substr(2, 9), subject: 'Nova Matéria', topic: 'Novo Assunto', completed: false }]
      } : c)
    }));
  };

  const toggleItem = (cycleId: string, itemId: string) => {
    setState(prev => ({
      ...prev,
      cycles: prev.cycles.map(c => c.id === cycleId ? {
        ...c,
        items: c.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
      } : c)
    }));
  };

  const updatePhase = (cycleId: string, phase: CyclePhase) => {
    setState(prev => ({
      ...prev,
      cycles: prev.cycles.map(c => c.id === cycleId ? { ...c, phase } : c)
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Plano de Ciclos</h2>
          <p className="text-brand-muted">Organize seus assuntos por ciclos e fases de estudo.</p>
        </div>
        <button onClick={addCycle} className="flex items-center gap-2 bg-brand-accent text-brand-bg px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform">
          <Plus size={20} />
          <span>Novo Ciclo</span>
        </button>
      </header>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={addCycle}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-accent text-brand-bg rounded-full shadow-2xl flex items-center justify-center z-30 active:scale-90 transition-transform"
      >
        <Plus size={32} />
      </button>

      {state.cycles.length === 0 ? (
        <div className="bg-brand-card rounded-2xl p-12 border border-dashed border-brand-secondary/30 flex flex-col items-center gap-4">
          <RotateCcw className="text-brand-muted" size={48} />
          <p className="text-brand-muted text-center max-w-xs">Você ainda não criou nenhum ciclo de estudos.</p>
          <button onClick={addCycle} className="text-brand-accent hover:underline font-semibold">Criar Ciclo 1</button>
        </div>
      ) : (
        <div className="space-y-12">
          {state.cycles.map((cycle) => {
            const completedCount = cycle.items.filter(i => i.completed).length;
            const progress = cycle.items.length > 0 ? Math.round((completedCount / cycle.items.length) * 100) : 0;

            return (
              <motion.div 
                key={cycle.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-card rounded-2xl border border-brand-secondary/10 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-brand-bg/30 border-b border-brand-secondary/10 gap-4 group">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <input 
                        value={cycle.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setState(prev => ({ ...prev, cycles: prev.cycles.map(c => c.id === cycle.id ? { ...c, name } : c) }));
                        }}
                        className="bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 font-bold text-xl flex-1"
                        placeholder="Nome do Ciclo..."
                      />
                      <span className="px-3 py-1 bg-brand-accent/20 text-brand-accent text-[10px] font-bold uppercase rounded-full tracking-wider shrink-0">{cycle.phase}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-32 h-1.5 bg-brand-bg rounded-full overflow-hidden">
                          <div className="h-full bg-brand-accent" style={{ width: `${progress}%` }} />
                       </div>
                       <span className="text-[10px] font-bold text-brand-muted">{progress}% Concluido</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      value={cycle.phase}
                      onChange={(e) => updatePhase(cycle.id, e.target.value as CyclePhase)}
                      className="bg-brand-bg border border-brand-secondary/20 text-xs px-3 py-2 rounded-lg outline-none focus:border-brand-accent"
                    >
                      <option value="Pré-Edital">Pré-Edital</option>
                      <option value="Pós-Edital">Pós-Edital</option>
                      <option value="Reta Final">Reta Final</option>
                    </select>
                    <button onClick={() => removeCycle(cycle.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                   <div className="table-container mb-6 border border-brand-secondary/10 rounded-xl">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                           <tr className="bg-brand-bg/50 text-brand-muted uppercase text-[10px] tracking-widest font-bold border-b border-brand-secondary/10">
                              <th className="p-4">Matéria</th>
                              <th className="p-4">Assunto da Semana</th>
                              <th className="p-4 text-center w-24">Status</th>
                           </tr>
                        </thead>
                        <tbody>
                          {cycle.items.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="p-8 text-center text-brand-muted italic">Módulo vazio. Adicione os assuntos deste ciclo.</td>
                            </tr>
                          ) : (
                            cycle.items.map((item, i) => (
                              <tr key={item.id} className={cn(
                                "border-b border-brand-secondary/5 transition-colors group/item",
                                i % 2 === 0 ? "bg-transparent" : "bg-brand-bg/10",
                                item.completed && "opacity-50"
                              )}>
                                <td className="p-4 font-bold text-brand-accent">
                                  <div className="flex items-center gap-2">
                                    <input 
                                      value={item.subject}
                                      onChange={(e) => {
                                        const subject = e.target.value;
                                        setState(prev => ({
                                          ...prev,
                                          cycles: prev.cycles.map(c => c.id === cycle.id ? {
                                            ...c,
                                            items: c.items.map(i => i.id === item.id ? { ...i, subject } : i)
                                          } : c)
                                        }));
                                      }}
                                      className="bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 flex-1 font-bold text-brand-accent"
                                      placeholder="Matéria..."
                                    />
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-between group/item">
                                    <input 
                                      value={item.topic}
                                      onChange={(e) => {
                                        const topic = e.target.value;
                                        setState(prev => ({
                                          ...prev,
                                          cycles: prev.cycles.map(c => c.id === cycle.id ? {
                                            ...c,
                                            items: c.items.map(i => i.id === item.id ? { ...i, topic } : i)
                                          } : c)
                                        }));
                                      }}
                                      className={cn("bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 flex-1", item.completed && "line-through text-brand-muted")}
                                      placeholder="Assunto..."
                                    />
                                    <div className="flex items-center gap-2 transition-opacity opacity-0 group-hover/item:opacity-100">
                                      <button onClick={() => removeCycleItem(cycle.id, item.id)} className="p-1 text-brand-danger">
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  <button onClick={() => toggleItem(cycle.id, item.id)} className="p-2 transition-transform hover:scale-110 active:scale-95">
                                    {item.completed ? <CheckCircle className="text-green-500" /> : <Circle className="text-brand-muted" />}
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                   </div>

                   <button 
                     onClick={() => addCycleItem(cycle.id)}
                     className="w-full py-4 border-2 border-dashed border-brand-secondary/20 rounded-2xl flex items-center justify-center gap-2 text-brand-muted hover:border-brand-accent hover:text-brand-accent transition-all font-bold uppercase text-xs tracking-widest"
                   >
                     <Plus size={20} />
                     Adicionar Matéria ao Ciclo
                   </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

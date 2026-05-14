import React from 'react';
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Printer, 
  Download,
  Clock,
  Edit2
} from 'lucide-react';
import { AppState, WeekData, WeeklySubject } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface WeeklyHoursProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onReset: () => void;
}

export default function WeeklyHours({ state, setState, onReset }: WeeklyHoursProps) {
  const addWeek = () => {
    const nextWeekNumber = state.weeklyHours.length > 0 
      ? state.weeklyHours[state.weeklyHours.length - 1].weekNumber + 1 
      : 1;
    
    // Copy subjects from last week if available
    const lastWeekSubjects = state.weeklyHours.length > 0
      ? state.weeklyHours[state.weeklyHours.length - 1].subjects.map(s => ({ ...s, realized: 0, id: Math.random().toString(36).substr(2, 9) }))
      : [];

    const newWeek: WeekData = {
      id: Math.random().toString(36).substr(2, 9),
      weekNumber: nextWeekNumber,
      subjects: lastWeekSubjects,
      proposal: ''
    };

    setState(prev => ({
      ...prev,
      weeklyHours: [...prev.weeklyHours, newWeek]
    }));
  };

  const removeWeek = (id: string) => {
    if (confirm('Excluir esta semana?')) {
      setState(prev => ({
        ...prev,
        weeklyHours: prev.weeklyHours.filter(w => w.id !== id)
      }));
    }
  };

  const addSubject = (weekId: string) => {
    setState(prev => ({
      ...prev,
      weeklyHours: prev.weeklyHours.map(w => w.id === weekId ? {
        ...w,
        subjects: [...w.subjects, { id: Math.random().toString(36).substr(2, 9), name: 'Nova Matéria', planned: 0, realized: 0 }]
      } : w)
    }));
  };

  const removeSubject = (weekId: string, subjectId: string) => {
    if (confirm('Excluir esta matéria desta semana?')) {
      setState(prev => ({
        ...prev,
        weeklyHours: prev.weeklyHours.map(w => w.id === weekId ? {
          ...w,
          subjects: w.subjects.filter(s => s.id !== subjectId)
        } : w)
      }));
    }
  };

  const updateRealized = (weekId: string, subjectId: string, value: number) => {
    setState(prev => ({
      ...prev,
      weeklyHours: prev.weeklyHours.map(w => w.id === weekId ? {
        ...w,
        subjects: w.subjects.map(s => s.id === subjectId ? { ...s, realized: value } : s)
      } : w)
    }));
  };

  const updateProposal = (weekId: string, text: string) => {
    setState(prev => ({
      ...prev,
      weeklyHours: prev.weeklyHours.map(w => w.id === weekId ? { ...w, proposal: text } : w)
    }));
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Distribuição de Horas</h2>
          <p className="text-brand-muted">Gerencie suas horas de estudo semanais e acompanhe sua evolução.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.print()}
            className="p-2 bg-brand-secondary/20 hover:bg-brand-secondary/30 rounded-lg text-brand-text transition-colors"
            title="Imprimir / PDF"
          >
            <Printer size={20} />
          </button>
          <button 
            onClick={addWeek}
            className="flex items-center gap-2 bg-brand-accent text-brand-bg px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <Plus size={20} />
            <span>Nova Semana</span>
          </button>
        </div>
      </header>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={addWeek}
        className="md:hidden fixed bottom-8 right-8 w-14 h-14 bg-brand-accent text-brand-bg rounded-full shadow-2xl flex items-center justify-center z-30 active:scale-95 transition-transform text-3xl font-bold ring-4 ring-brand-bg shrink-0"
      >
        +
      </button>

      {state.weeklyHours.length === 0 ? (
        <div className="bg-brand-card rounded-xl p-12 border border-dashed border-brand-secondary flex flex-col items-center gap-4">
          <Clock className="text-gray-400" size={48} />
          <p className="text-gray-400 text-center max-w-xs">Você ainda não cadastrou nenhuma semana de estudos.</p>
          <button onClick={addWeek} className="text-brand-accent hover:underline font-bold uppercase text-xs tracking-widest">Começar Agora</button>
        </div>
      ) : (
        <div className="space-y-10">
          {state.weeklyHours.slice().reverse().map((week) => {
            const totalPlanned = week.subjects.reduce((acc, s) => acc + s.planned, 0);
            const totalRealized = week.subjects.reduce((acc, s) => acc + s.realized, 0);
            const weekProgress = Math.min(Math.round((totalRealized / totalPlanned) * 100) || 0, 100);

            return (
              <motion.div 
                key={week.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-card rounded-xl border border-brand-secondary overflow-hidden shadow-lg"
              >
                <div className="p-5 bg-brand-card/50 border-b border-brand-secondary flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-white">Semana {week.weekNumber}</h3>
                    <div className="hidden md:flex items-center gap-3">
                       <div className="w-32 h-2 bg-brand-bg rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${weekProgress}%` }}
                            className={cn("h-full", weekProgress < 100 ? "bg-brand-accent" : "bg-brand-success")}
                          />
                       </div>
                       <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{weekProgress}% Completo</span>
                    </div>
                  </div>
                  <button onClick={() => removeWeek(week.id)} className="text-brand-danger hover:opacity-80 p-2 transition-opacity">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-5">
                  <div className="table-container mb-6 bg-brand-bg/20 rounded-lg border border-brand-secondary/30">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-gray-400 border-b border-brand-secondary">
                          <th className="p-4 uppercase text-[10px] font-bold">Matéria</th>
                          <th className="p-4 text-center uppercase text-[10px] font-bold">Planejado</th>
                          <th className="p-4 text-center uppercase text-[10px] font-bold">Realizado</th>
                          <th className="p-4 text-right uppercase text-[10px] font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {week.subjects.map((subject) => (
                          <tr key={subject.id} className="border-b border-brand-secondary/20 hover:bg-white/5 transition-colors group">
                            <td className="p-4 font-medium text-gray-200">
                              <div className="flex items-center gap-2">
                                <input 
                                  value={subject.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setState(prev => ({
                                      ...prev,
                                      weeklyHours: prev.weeklyHours.map(w => w.id === week.id ? {
                                        ...w,
                                        subjects: w.subjects.map(s => s.id === subject.id ? { ...s, name: val } : s)
                                      } : w)
                                    }));
                                  }}
                                  className="bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 flex-1 text-sm font-bold"
                                />
                                <button 
                                  onClick={() => removeSubject(week.id, subject.id)}
                                  className="p-1 text-brand-danger/50 hover:text-brand-danger transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <input 
                                type="number" 
                                value={subject.planned}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  setState(prev => ({
                                    ...prev,
                                    weeklyHours: prev.weeklyHours.map(w => w.id === week.id ? {
                                      ...w,
                                      subjects: w.subjects.map(s => s.id === subject.id ? { ...s, planned: val } : s)
                                    } : w)
                                  }));
                                }}
                                className="w-14 bg-brand-bg border border-brand-secondary rounded px-2 py-1 text-center outline-none focus:border-brand-accent text-white font-mono"
                              />
                            </td>
                            <td className="p-4 text-center">
                              <input 
                                type="number" 
                                value={subject.realized}
                                onChange={(e) => updateRealized(week.id, subject.id, parseInt(e.target.value) || 0)}
                                className="w-14 bg-brand-bg border border-brand-secondary rounded px-2 py-1 text-center outline-none focus:border-brand-accent text-white"
                              />
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-3">
                                {subject.realized < subject.planned ? (
                                  <span className="text-brand-danger font-bold text-[10px] uppercase italic tracking-tighter">Falta {subject.planned - subject.realized}h</span>
                                ) : (
                                  <span className="text-brand-success font-bold text-[10px] uppercase tracking-widest">Meta OK</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-brand-bg font-bold text-white">
                          <td className="p-4 uppercase text-xs">Total Semanal</td>
                          <td className="p-4 text-center text-xs">{totalPlanned}h</td>
                          <td className="p-4 text-center text-brand-accent text-xs">{totalRealized}h</td>
                          <td className="p-4 text-right text-xs">
                             <span className={totalRealized >= totalPlanned ? "text-brand-success" : "text-gray-400"}>
                               {totalRealized >= totalPlanned ? "META CONCLUÍDA" : "EM ANDAMENTO"}
                             </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                       <label className="text-brand-muted text-xs font-bold uppercase">Proposta Semanal</label>
                       <textarea 
                         value={week.proposal}
                         onChange={(e) => updateProposal(week.id, e.target.value)}
                         placeholder="Descreva sua meta principal ou foco da semana..."
                         className="w-full h-24 bg-brand-bg border border-brand-secondary/20 rounded-xl p-4 text-sm outline-none focus:border-brand-accent resize-none placeholder:text-brand-muted/30"
                       />
                    </div>
                    <div className="flex gap-3 justify-end">
                       <button 
                         onClick={() => addSubject(week.id)}
                         className="flex items-center gap-2 px-6 py-3 bg-brand-secondary/20 text-brand-text rounded-xl hover:bg-brand-secondary/30 transition-all font-semibold"
                       >
                         <Plus size={18} />
                         <span>Adicionar Matéria</span>
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

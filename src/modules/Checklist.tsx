import React from 'react';
import { Info, Plus, Trash2 } from 'lucide-react';
import { AppState, ChecklistItem } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ChecklistProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onReset: () => void;
}

export default function ChecklistModule({ state, setState }: ChecklistProps) {
  const toggleItem = (type: 'reasons' | 'actions', id: string) => {
    setState(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [type]: prev.checklist[type].map(item => item.id === id ? { ...item, checked: !item.checked } : item)
      }
    }));
  };

  const addItem = (type: 'reasons' | 'actions') => {
    const text = type === 'reasons' ? 'Novo Motivo do Caos' : 'Nova Ação de Ordem';
    setState(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [type]: [...prev.checklist[type], { id: Math.random().toString(36).substr(2, 9), text, checked: false }]
      }
    }));
  };

  const removeItem = (type: 'reasons' | 'actions', id: string) => {
    setState(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [type]: prev.checklist[type].filter(item => item.id !== id)
      }
    }));
  };

  const updateItemText = (type: 'reasons' | 'actions', id: string, text: string) => {
    setState(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [type]: prev.checklist[type].map(i => i.id === id ? { ...i, text } : i)
      }
    }));
  };

  const updateIntro = (intro: string) => {
    setState(prev => ({
      ...prev,
      checklist: { ...prev.checklist, intro }
    }));
  };

  const calculateProgress = (items: ChecklistItem[]) => {
    const total = items.length;
    const checked = items.filter(i => i.checked).length;
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  const reasonProgress = calculateProgress(state.checklist.reasons);
  const actionProgress = calculateProgress(state.checklist.actions);

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Checklist de Organização</h2>
        <p className="text-brand-muted">Equilibre sua rotina eliminando o que te trava e focando no que funciona.</p>
      </header>

      <div className="bg-brand-card p-6 rounded-2xl border-l-4 border-brand-accent flex items-start gap-4">
         <Info className="text-brand-accent shrink-0 mt-1" size={20} />
         <div className="flex-1">
            <textarea 
              value={state.checklist.intro}
              onChange={(e) => updateIntro(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-brand-text leading-relaxed resize-none h-20"
              placeholder="Introdução do Checklist..."
            />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden border border-brand-secondary rounded-xl bg-brand-card">
        {/* Reasons Column */}
        <div className="flex flex-col gap-6 p-6 bg-brand-danger bg-opacity-10 border-r border-brand-secondary/30">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-brand-danger uppercase tracking-widest flex items-center gap-2">
                Motivos do Caos
                <span className="bg-brand-danger/20 px-2 py-0.5 rounded text-[10px]">{reasonProgress}%</span>
              </h3>
              <button 
                onClick={() => addItem('reasons')}
                className="p-1 text-brand-danger hover:bg-brand-danger/10 rounded"
              >
                <Plus size={16} />
              </button>
           </div>

           <div className="space-y-2">
             {state.checklist.reasons.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleItem('reasons', item.id)}
                  className={cn(
                    "p-3 rounded-lg flex items-center justify-between group cursor-pointer transition-colors bg-brand-bg/40",
                    item.checked ? "opacity-50" : "hover:bg-brand-bg/60"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                     <input 
                       type="checkbox" 
                       checked={item.checked} 
                       onChange={() => toggleItem('reasons', item.id)}
                       className="accent-brand-danger" 
                     />
                     <input 
                       value={item.text}
                       onChange={(e) => updateItemText('reasons', item.id, e.target.value)}
                       onClick={(e) => e.stopPropagation()}
                       className={cn(
                         "bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 flex-1 text-xs font-medium",
                         item.checked ? "line-through text-gray-400" : "text-gray-200"
                       )}
                       placeholder="Motivo..."
                     />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeItem('reasons', item.id); }}
                      className="p-1 text-brand-danger"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
             ))}
           </div>
        </div>

        {/* Actions Column */}
        <div className="flex flex-col gap-6 p-6 bg-brand-success bg-opacity-10">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-brand-success uppercase tracking-widest flex items-center gap-2">
                Ações de Ordem
                <span className="bg-brand-success/20 px-2 py-0.5 rounded text-[10px]">{actionProgress}%</span>
              </h3>
              <button 
                onClick={() => addItem('actions')}
                className="p-1 text-brand-success hover:bg-brand-success/10 rounded"
              >
                <Plus size={16} />
              </button>
           </div>

           <div className="space-y-2">
             {state.checklist.actions.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleItem('actions', item.id)}
                  className={cn(
                    "p-3 rounded-lg flex items-center justify-between group cursor-pointer transition-colors bg-brand-bg/40",
                    item.checked ? "opacity-50" : "hover:bg-brand-bg/60"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                     <input 
                       type="checkbox" 
                       checked={item.checked} 
                       onChange={() => toggleItem('actions', item.id)}
                       className="accent-brand-success" 
                     />
                     <input 
                       value={item.text}
                       onChange={(e) => updateItemText('actions', item.id, e.target.value)}
                       onClick={(e) => e.stopPropagation()}
                       className={cn(
                         "bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 flex-1 text-xs font-medium",
                         item.checked ? "line-through text-gray-400" : "text-gray-200"
                       )}
                       placeholder="Ação..."
                     />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeItem('actions', item.id); }}
                      className="p-1 text-brand-success"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}

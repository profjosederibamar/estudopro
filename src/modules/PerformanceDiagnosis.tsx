import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AppState, DiagnosisArea } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus,
  Trash2,
  Edit2,
  Info, 
  HelpCircle, 
  Lightbulb, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

interface PerformanceDiagnosisProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onReset: () => void;
}

export default function PerformanceDiagnosis({ state, setState, onReset }: PerformanceDiagnosisProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const addArea = () => {
    setState(prev => ({
      ...prev,
      diagnosis: [...prev.diagnosis, { id: Math.random().toString(36).substr(2, 9), area: 'Nova Área', score: 0, maxScore: 10, reason: '' }]
    }));
  };

  const removeArea = (id: string) => {
    if (confirm('Excluir esta área do diagnóstico?')) {
      setState(prev => ({
        ...prev,
        diagnosis: prev.diagnosis.filter(d => d.id !== id)
      }));
    }
  };

  const updateArea = (id: string, field: keyof DiagnosisArea, value: any) => {
    setState(prev => ({
      ...prev,
      diagnosis: prev.diagnosis.map(d => d.id === id ? { ...d, [field]: value } : d)
    }));
  };

  const totalScore = state.diagnosis.reduce((acc, d) => acc + d.score, 0);
  const totalMax = state.diagnosis.reduce((acc, d) => acc + d.maxScore, 0);
  const totalPercent = Math.round((totalScore / totalMax) * 100) || 0;

  const chartData = state.diagnosis.map(d => ({
    name: d.area,
    percent: Math.round((d.score / d.maxScore) * 100) || 0,
    score: d.score,
    max: d.maxScore
  }));

  const getAnalysis = () => {
    const critical = state.diagnosis.filter(d => (d.score / d.maxScore) < 0.5);
    const excellent = state.diagnosis.filter(d => (d.score / d.maxScore) >= 0.8);
    
    return {
      critical,
      excellent,
      summary: totalPercent > 70 
        ? "Desempenho sólido. Ajuste os detalhes para a nota máxima."
        : totalPercent > 50 
        ? "Desempenho mediano. Identifique os gargalos de método."
        : "Atenção necessária. Revise sua base e método de execução."
    };
  };

  const analysis = getAnalysis();

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Diagnóstico de Desempenho</h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-brand-muted">Avalie seu nível em áreas críticas e identifique onde melhorar.</p>
          <button 
            onClick={addArea}
            className="flex items-center gap-2 bg-brand-accent text-brand-bg px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform shrink-0"
          >
            <Plus size={20} />
            <span>Adicionar Área</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Table Section */}
        <div className="bg-brand-card rounded-2xl border border-brand-secondary/10 overflow-hidden shadow-xl">
           <div className="p-4 bg-brand-bg/30 border-b border-brand-secondary/10 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-muted">
              <span>Áreas de Aprendizado</span>
              <div className="flex gap-4">
                 <span>Sua Nota</span>
                 <span>Máx</span>
              </div>
           </div>

            <div className="p-2 space-y-1">
              {state.diagnosis.map((area) => (
                <div key={area.id} className="flex flex-col md:flex-row gap-4 p-4 border-b border-brand-secondary/5 last:border-0 hover:bg-brand-bg/10 transition-colors group">
                    <div className="flex-1 space-y-2">
                         <div className="flex items-center gap-2">
                           <input 
                             value={area.area}
                             onChange={(e) => updateArea(area.id, 'area', e.target.value)}
                             className="font-bold text-brand-text bg-transparent border-b border-transparent focus:border-brand-accent/30 outline-none px-1 flex-1 transition-colors"
                             placeholder="Nome da Área..."
                           />
                           <button 
                             onClick={() => removeArea(area.id)}
                             className="p-1 text-brand-danger/50 hover:text-brand-danger transition-all"
                             title="Remover Área"
                           >
                             <Trash2 size={14} />
                           </button>
                         </div>
                       <input 
                         value={area.reason}
                         onChange={(e) => updateArea(area.id, 'reason', e.target.value)}
                         placeholder="Descreva o motivo desse desempenho ou observações..."
                         className="w-full text-xs bg-transparent border-b border-brand-secondary/20 focus:border-brand-accent outline-none py-1 italic text-brand-muted"
                       />
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex flex-col items-center">
                         <span className="text-[9px] text-brand-muted font-bold uppercase mb-1">Nota</span>
                         <input 
                           type="number"
                           step="0.1"
                           value={area.score}
                           onChange={(e) => updateArea(area.id, 'score', parseFloat(e.target.value) || 0)}
                           className="w-16 h-10 rounded-lg bg-brand-accent/10 border border-brand-accent/30 text-brand-accent font-bold text-center outline-none focus:ring-2 focus:ring-brand-accent/50"
                         />
                       </div>
                       <div className="flex flex-col items-center">
                         <span className="text-[9px] text-brand-muted font-bold uppercase mb-1">Máximo</span>
                         <input 
                           type="number"
                           value={area.maxScore}
                           onChange={(e) => updateArea(area.id, 'maxScore', parseInt(e.target.value) || 0)}
                           className="w-16 h-10 rounded-lg bg-brand-secondary/20 text-brand-text font-bold text-center outline-none focus:ring-2 focus:ring-brand-accent/50"
                         />
                       </div>
                    </div>
                </div>
              ))}
           </div>

           <div className="p-6 bg-brand-bg/40 border-t border-brand-secondary/10 flex justify-between items-center font-bold text-white">
              <span>RESULTADO TOTAL</span>
              <div className="flex flex-col items-end">
                <span className="text-2xl text-brand-accent">{totalScore.toFixed(1)} / {totalMax}</span>
                <span className="text-xs text-brand-muted font-mono">{totalPercent}% DE APROVEITAMENTO</span>
              </div>
           </div>
        </div>

        {/* Chart Section */}
        <div className="bg-brand-card rounded-2xl border border-brand-secondary/10 p-6 flex flex-col items-center">
           <h3 className="text-brand-muted text-xs font-bold uppercase tracking-widest mb-6 w-full">Visualização por Área (%)</h3>
           <div className="w-full h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#415a7744" />
                 <XAxis type="number" hide domain={[0, 100]} />
                 <YAxis 
                   dataKey="name" 
                   type="category" 
                   width={120} 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#778da9', fontSize: 10, fontWeight: 700 }}
                 />
                 <Tooltip 
                   cursor={{ fill: '#415a7722' }}
                   contentStyle={{ backgroundColor: '#1a2e45', border: '1px solid #415a7733', borderRadius: '8px' }}
                 />
                 <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={24}>
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.percent >= 80 ? '#2ecc71' : entry.percent >= 50 ? '#f5a623' : '#e74c3c'} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>

           <button 
             onClick={() => setShowAnalysis(!showAnalysis)}
             className="mt-6 w-full py-4 bg-brand-accent text-brand-bg rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-accent/20"
           >
             Ver Resultados & Análise
           </button>
        </div>
      </div>

      <AnimatePresence>
        {showAnalysis && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-brand-card p-8 rounded-2xl border-l-4 border-brand-accent shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 rotate-12 opacity-5">
               <TrendingUp size={200} />
             </div>

             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4 border-b border-brand-secondary/10 pb-4">
                   <div className="p-3 bg-brand-accent rounded-full text-brand-bg">
                      <Lightbulb size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold">Análise do Consultor</h3>
                      <p className={cn(
                        "text-lg font-medium",
                        totalPercent > 70 ? "text-green-400" : totalPercent > 50 ? "text-brand-accent" : "text-red-400"
                      )}>{analysis.summary}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-red-400 uppercase tracking-wider">
                         <AlertCircle size={16} /> Pontos de Atenção
                      </h4>
                      {analysis.critical.length > 0 ? (
                        <ul className="space-y-2">
                          {analysis.critical.map(c => (
                            <li key={c.id} className="text-sm border-l-2 border-red-500/30 pl-3">
                              <span className="font-bold text-white">{c.area}</span>: 
                              {c.reason ? ` ${c.reason}` : " Nota abaixo de 50%. Necessário rever fundamentos."}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-brand-muted italic">Nenhuma área crítica identificada.</p>
                      )}
                   </div>
                   <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-green-400 uppercase tracking-wider">
                         <CheckCircle2 size={16} className="text-green-500" /> Seus Diferenciais
                      </h4>
                      {analysis.excellent.length > 0 ? (
                        <ul className="space-y-2">
                          {analysis.excellent.map(e => (
                            <li key={e.id} className="text-sm border-l-2 border-green-500/30 pl-3">
                              <span className="font-bold text-white">{e.area}</span>: Nota acima de 80%. Mantenha o ritmo!
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-brand-muted italic">Mantenha a constância para atingir a excelência.</p>
                      )}
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

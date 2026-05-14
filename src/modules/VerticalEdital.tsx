import React, { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  Star, 
  Circle,
  MoreVertical,
  Trash2,
  Filter,
  Printer,
  ListTodo,
  Edit2
} from 'lucide-react';
import { AppState, Edital, TopicStatus, Topic } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface VerticalEditalProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onReset: () => void;
}

const statusConfig: Record<TopicStatus, { icon: any, color: string, label: string }> = {
  'não estudado': { icon: Circle, color: 'text-brand-muted', label: 'Não estudado' },
  'em andamento': { icon: Clock, color: 'text-blue-400', label: 'Em andamento' },
  'revisado': { icon: CheckCircle2, color: 'text-orange-400', label: 'Revisado' },
  'dominado': { icon: Star, color: 'text-green-500', label: 'Dominado' },
};

export default function VerticalEdital({ state, setState, onReset }: VerticalEditalProps) {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<TopicStatus | 'all'>('all');

  const toggleSubject = (id: string) => {
    const next = new Set(expandedSubjects);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedSubjects(next);
  };

  const removeExam = (editalId: string, examId: string) => {
    if (confirm('Excluir esta prova?')) {
      setState(prev => ({
        ...prev,
        edital: prev.edital.map(e => e.id === editalId ? {
          ...e,
          exams: e.exams.filter(ex => ex.id !== examId)
        } : e)
      }));
    }
  };

  const removeSubject = (editalId: string, examId: string, subjectId: string) => {
    if (confirm('Excluir esta matéria?')) {
      setState(prev => ({
        ...prev,
        edital: prev.edital.map(e => e.id === editalId ? {
          ...e,
          exams: e.exams.map(ex => ex.id === examId ? {
            ...ex,
            subjects: ex.subjects.filter(s => s.id !== subjectId)
          } : ex)
        } : e)
      }));
    }
  };

  const removeTopic = (editalId: string, examId: string, subjectId: string, topicId: string) => {
    if (confirm('Excluir este tópico?')) {
      setState(prev => ({
        ...prev,
        edital: prev.edital.map(e => e.id === editalId ? {
          ...e,
          exams: e.exams.map(ex => ex.id === examId ? {
            ...ex,
            subjects: ex.subjects.map(s => s.id === subjectId ? {
              ...s,
              topics: s.topics.filter(t => t.id !== topicId)
            } : s)
          } : ex)
        } : e)
      }));
    }
  };

  const addEdital = () => {
    const newEdital: Edital = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Edital',
      exams: []
    };
    setState(prev => ({ ...prev, edital: [...prev.edital, newEdital] }));
  };

  const addExam = (editalId: string) => {
    setState(prev => ({
      ...prev,
      edital: prev.edital.map(e => e.id === editalId ? {
        ...e,
        exams: [...e.exams, { id: Math.random().toString(36).substr(2, 9), name: 'Nova Prova', questions: 0, weight: 1, subjects: [] }]
      } : e)
    }));
  };

  const addSubject = (editalId: string, examId: string) => {
    setState(prev => ({
      ...prev,
      edital: prev.edital.map(e => e.id === editalId ? {
        ...e,
        exams: e.exams.map(ex => ex.id === examId ? {
          ...ex,
          subjects: [...ex.subjects, { id: Math.random().toString(36).substr(2, 9), name: 'Nova Matéria', questions: 0, weight: 1, topics: [] }]
        } : ex)
      } : e)
    }));
  };

  const addTopic = (editalId: string, examId: string, subjectId: string) => {
    setState(prev => ({
      ...prev,
      edital: prev.edital.map(e => e.id === editalId ? {
        ...e,
        exams: e.exams.map(ex => ex.id === examId ? {
          ...ex,
          subjects: ex.subjects.map(s => s.id === subjectId ? {
            ...s,
            topics: [...s.topics, { id: Math.random().toString(36).substr(2, 9), title: 'Novo Tópico', status: 'não estudado' }]
          } : s)
        } : ex)
      } : e)
    }));
  };

  const updateTopicStatus = (editalId: string, examId: string, subjectId: string, topicId: string, status: TopicStatus) => {
    setState(prev => ({
      ...prev,
      edital: prev.edital.map(e => e.id === editalId ? {
        ...e,
        exams: e.exams.map(ex => ex.id === examId ? {
          ...ex,
          subjects: ex.subjects.map(s => s.id === subjectId ? {
            ...s,
            topics: s.topics.map(t => t.id === topicId ? { ...t, status } : t)
          } : s)
        } : ex)
      } : e)
    }));
  };

  const removeEdital = (id: string) => {
    if (confirm('Excluir este edital?')) {
      setState(prev => ({ ...prev, edital: prev.edital.filter(e => e.id !== id) }));
    }
  };

  // Progress calculations
  const getSubjectProgress = (topics: Topic[]) => {
    if (topics.length === 0) return 0;
    const completed = topics.filter(t => t.status !== 'não estudado').length;
    return Math.round((completed / topics.length) * 100);
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Edital Verticalizado</h2>
          <p className="text-brand-muted">Mapeie seu edital e controle o estudo de cada tópico.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="p-2 bg-brand-secondary/20 hover:bg-brand-secondary/30 rounded-lg text-brand-text transition-colors">
            <Printer size={20} />
          </button>
          <button onClick={addEdital} className="flex items-center gap-2 bg-brand-accent text-brand-bg px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform">
            <Plus size={20} />
            <span>Novo Edital</span>
          </button>
        </div>
      </header>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={addEdital}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-accent text-brand-bg rounded-full shadow-2xl flex items-center justify-center z-30 active:scale-90 transition-transform"
      >
        <Plus size={32} />
      </button>

      {state.edital.length === 0 ? (
        <div className="bg-brand-card rounded-2xl p-12 border border-dashed border-brand-secondary/30 flex flex-col items-center gap-4">
          <ListTodo className="text-brand-muted" size={48} />
          <p className="text-brand-muted text-center max-w-xs">Você ainda não tem editais cadastrados.</p>
          <button onClick={addEdital} className="text-brand-accent hover:underline font-semibold tracking-wide">Cadastrar Edital Agora</button>
        </div>
      ) : (
        <div className="space-y-12">
          {state.edital.map((edital) => (
            <div key={edital.id} className="space-y-6">
              <div className="flex items-center justify-between bg-brand-card p-4 rounded-xl border border-brand-secondary/10 group">
                <div className="flex items-center gap-2">
                  <input 
                    value={edital.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setState(prev => ({ ...prev, edital: prev.edital.map(item => item.id === edital.id ? { ...item, name: val } : item) }));
                    }}
                    className="bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 font-bold text-xl text-brand-accent flex-1"
                    placeholder="Nome do Edital..."
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => addExam(edital.id)} className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-brand-secondary/20 rounded hover:bg-brand-secondary/30 transition-colors">Adicionar Prova</button>
                  <button onClick={() => removeEdital(edital.id)} className="text-red-400 p-1"><Trash2 size={16} /></button>
                </div>
              </div>

              {edital.exams.map((exam) => (
                <div key={exam.id} className="ml-4 lg:ml-8 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between border-l-4 border-brand-secondary pl-4 py-2 group gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <input 
                          value={exam.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setState(prev => ({
                              ...prev,
                              edital: prev.edital.map(ed => ed.id === edital.id ? {
                                ...ed,
                                exams: ed.exams.map(ex => ex.id === exam.id ? { ...ex, name: val } : ex)
                              } : ed)
                            }));
                          }}
                          className="bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 font-semibold text-lg text-white/90 flex-1"
                        />
                        <button onClick={() => removeExam(edital.id, exam.id)} className="opacity-0 group-hover:opacity-100 p-1 text-brand-danger hover:text-brand-danger transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-brand-muted">Qtd Questões:</span>
                          <input 
                            type="number"
                            value={exam.questions}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setState(prev => ({
                                ...prev,
                                edital: prev.edital.map(ed => ed.id === edital.id ? {
                                  ...ed,
                                  exams: ed.exams.map(ex => ex.id === exam.id ? { ...ex, questions: val } : ex)
                                } : ed)
                              }));
                            }}
                            className="w-12 bg-transparent border-b border-brand-secondary/30 text-xs text-center focus:border-brand-accent outline-none font-bold text-white/70"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-brand-muted">Peso Prova:</span>
                          <input 
                            type="number"
                            value={exam.weight}
                            step="0.1"
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setState(prev => ({
                                ...prev,
                                edital: prev.edital.map(ed => ed.id === edital.id ? {
                                  ...ed,
                                  exams: ed.exams.map(ex => ex.id === exam.id ? { ...ex, weight: val } : ex)
                                } : ed)
                              }));
                            }}
                            className="w-12 bg-transparent border-b border-brand-secondary/30 text-xs text-center focus:border-brand-accent outline-none font-bold text-white/70"
                          />
                        </div>
                      </div>
                    </div>

                      <button 
                        onClick={() => addSubject(edital.id, exam.id)} 
                        className="flex items-center gap-1 text-[10px] uppercase font-bold text-brand-muted hover:text-brand-accent bg-brand-secondary/10 px-2 py-1 rounded transition-colors self-start lg:self-center"
                      >
                        <Plus size={12} />
                        Add Matéria
                      </button>
                    </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {exam.subjects.map((subject) => {
                      const expanded = expandedSubjects.has(subject.id);
                      const progress = getSubjectProgress(subject.topics);
                      
                      return (
                        <div key={subject.id} className="bg-brand-card rounded-xl border border-brand-secondary/10 overflow-hidden group/sub">
                          <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                            <button 
                              onClick={() => toggleSubject(subject.id)}
                              className="flex-1 flex items-center justify-between text-left"
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center border-2 border-brand-secondary/30 text-xs font-bold",
                                  progress === 100 ? "bg-green-500/20 text-green-400 border-green-500" : "text-brand-accent border-brand-accent/50"
                                )}>
                                  {progress}%
                                </div>
                                <input 
                                  value={subject.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setState(prev => ({
                                      ...prev,
                                      edital: prev.edital.map(e => e.id === edital.id ? {
                                        ...e,
                                        exams: e.exams.map(ex => ex.id === exam.id ? {
                                          ...ex,
                                          subjects: ex.subjects.map(s => s.id === subject.id ? { ...s, name: val } : s)
                                        } : ex)
                                      } : e)
                                    }));
                                  }}
                                  className="bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 flex-1 font-bold text-sm tracking-tight"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              {expanded ? <ChevronDown size={20} className="rotate-180 transition-transform" /> : <ChevronDown size={20} className="transition-transform" />}
                            </button>
                            <div className="flex items-center gap-2 ml-4">
                              <button onClick={() => removeSubject(edital.id, exam.id, subject.id)} className="p-1 text-brand-danger hover:text-brand-danger transition-all">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="px-4 pb-2 flex gap-4 border-b border-brand-secondary/5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold text-brand-muted">Questões:</span>
                              <input 
                                type="number"
                                value={subject.questions}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  setState(prev => ({
                                    ...prev,
                                    edital: prev.edital.map(e => e.id === edital.id ? {
                                      ...e,
                                      exams: e.exams.map(ex => ex.id === exam.id ? {
                                        ...ex,
                                        subjects: ex.subjects.map(s => s.id === subject.id ? { ...s, questions: val } : s)
                                      } : ex)
                                    } : e)
                                  }));
                                }}
                                className="w-10 bg-transparent border-b border-brand-secondary/30 text-xs text-center focus:border-brand-accent outline-none"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold text-brand-muted">Peso:</span>
                              <input 
                                type="number"
                                value={subject.weight}
                                step="0.1"
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  setState(prev => ({
                                    ...prev,
                                    edital: prev.edital.map(e => e.id === edital.id ? {
                                      ...e,
                                      exams: e.exams.map(ex => ex.id === exam.id ? {
                                        ...ex,
                                        subjects: ex.subjects.map(s => s.id === subject.id ? { ...s, weight: val } : s)
                                      } : ex)
                                    } : e)
                                  }));
                                }}
                                className="w-10 bg-transparent border-b border-brand-secondary/30 text-xs text-center focus:border-brand-accent outline-none"
                              />
                            </div>
                          </div>

                          <AnimatePresence>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden bg-brand-bg/30"
                              >
                                <div className="p-4 space-y-2">
                                  {subject.topics.length === 0 && (
                                    <p className="text-xs text-brand-muted italic text-center py-2">Sem tópicos cadastrados.</p>
                                  )}
                                  {subject.topics.map((topic, i) => {
                                    const StatusIcon = statusConfig[topic.status].icon;
                                    return (
                                      <div key={topic.id} className="flex items-center justify-between p-3 bg-brand-card/50 rounded-lg group/topic">
                                        <div className="flex items-center gap-3 flex-1">
                                          <span className="text-[10px] text-brand-muted font-mono">{i + 1}.</span>
                                          <input 
                                            value={topic.title}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setState(prev => ({
                                                ...prev,
                                                edital: prev.edital.map(e => e.id === edital.id ? {
                                                  ...e,
                                                  exams: e.exams.map(ex => ex.id === exam.id ? {
                                                    ...ex,
                                                    subjects: ex.subjects.map(s => s.id === subject.id ? {
                                                      ...s,
                                                      topics: s.topics.map(t => t.id === topic.id ? { ...t, title: val } : t)
                                                    } : s)
                                                  } : ex)
                                                } : e)
                                              }));
                                            }}
                                            className="bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-accent/30 rounded px-1 flex-1 text-sm font-medium"
                                            placeholder="Título do Tópico..."
                                          />
                                          <button onClick={() => removeTopic(edital.id, exam.id, subject.id, topic.id)} className="p-1 text-brand-danger opacity-0 group-hover/topic:opacity-100">
                                            <Trash2 size={10} />
                                          </button>
                                        </div>
                                        <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                          {(Object.keys(statusConfig) as TopicStatus[]).map((s) => {
                                            const cfg = statusConfig[s];
                                            const ProtoIcon = cfg.icon;
                                            return (
                                              <button 
                                                key={s}
                                                onClick={() => updateTopicStatus(edital.id, exam.id, subject.id, topic.id, s)}
                                                className={cn(
                                                  "p-1.5 rounded transition-all",
                                                  topic.status === s ? cfg.color + " bg-brand-secondary/20 scale-110" : "text-brand-muted hover:text-brand-text"
                                                )}
                                                title={cfg.label}
                                              >
                                                <ProtoIcon size={14} />
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                  <button 
                                    onClick={() => addTopic(edital.id, exam.id, subject.id)}
                                    className="w-full mt-4 py-2 border border-dashed border-brand-secondary/40 rounded-lg text-xs font-bold text-brand-muted hover:text-brand-accent hover:border-brand-accent/50 transition-all uppercase tracking-widest"
                                  >
                                    + Adicionar Tópico
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

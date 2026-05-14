import { useState, useEffect } from 'react';
import { AppState } from '../types';

const STORAGE_KEY = 'estudapro_data';

const initialState: AppState = {
  examConfig: { name: 'Novo Concurso', position: 'Cargo Pretendido' },
  weeklyHours: [],
  edital: [],
  cycles: [],
  diagnosis: [
    { id: '1', area: 'Questões Corretas', score: 0, maxScore: 10, reason: '' },
    { id: '2', area: 'Erros de Método', score: 0, maxScore: 5, reason: '' },
    { id: '3', area: 'Erros de Execução', score: 0, maxScore: 5, reason: '' },
    { id: '4', area: 'Erros de Atenção', score: 0, maxScore: 5, reason: '' },
    { id: '5', area: 'Conteúdo não Estudado', score: 0, maxScore: 5, reason: '' },
  ],
  simulados: [],
  checklist: {
    reasons: [
      { id: 'r1', text: 'Falta de Planejamento Claro', checked: false },
      { id: 'r2', text: 'Falta de Rotina e Comprometimento', checked: false },
      { id: 'r3', text: 'Paralisia da Escolha', checked: false },
      { id: 'r4', text: 'Procrastinação', checked: false },
      { id: 'r5', text: 'Falta de Um Método de Estudos', checked: false },
      { id: 'r6', text: 'Ambiente desorganizado', checked: false },
      { id: 'r7', text: 'Falta de Gestão do Tempo', checked: false },
    ],
    actions: [
      { id: 'a1', text: 'Micrometas', checked: false },
      { id: 'a2', text: 'Planejamento Semanal', checked: false },
      { id: 'a3', text: 'Lista de Prioridades', checked: false },
      { id: 'a4', text: 'Distribuição de Horas', checked: false },
      { id: 'a5', text: 'Organização dos Materiais', checked: false },
      { id: 'a6', text: 'Diminuir o Atrito', checked: false },
      { id: 'a7', text: 'Adequar estudos à rotina', checked: false },
    ],
    intro: 'Organização é a base da aprovação. Identifique o que te atrapalha e implemente ações práticas.',
  },
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialState;
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const resetData = (module?: keyof AppState) => {
    if (module) {
      setState(prev => ({ ...prev, [module]: initialState[module] }));
    } else {
      setState(initialState);
    }
  };

  return { state, setState, resetData };
}

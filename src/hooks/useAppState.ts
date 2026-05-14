import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppState } from '../types';

const LOCAL_USER_ID_KEY = 'estudapro_user_id';

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
  const [state, setState] = useState<AppState>(initialState);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(() => {
    let id = localStorage.getItem(LOCAL_USER_ID_KEY);
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(LOCAL_USER_ID_KEY, id);
    }
    return id;
  });

  // Load initial data
  useEffect(() => {
    const docRef = doc(db, 'users', userId);
    
    // Use onSnapshot for real-time updates (optional but good for multi-device sync if user opens it twice)
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setState(docSnap.data() as AppState);
      } else {
        // If no data exists, initialize it in Firestore
        setDoc(docRef, initialState);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error loading sync data:", error);
      setLoading(false);
    });

    return () => unsub();
  }, [userId]);

  // Save data on changes (with simple debounce logic could be added, but Firestore handles frequency well)
  // We use a separate effect for saving to avoid infinite loops if onSnapshot triggers state update
  // Actually, a better pattern is to only update Firestore when the user makes a change, 
  // but since we use a local state and standard setState, we can just sync it back.
  // To avoid circular updates, we can either check for equality or use a ref.
  
  const saveToFirestore = useCallback(async (newState: AppState) => {
    if (!userId) return;
    try {
      await setDoc(doc(db, 'users', userId), newState);
    } catch (e) {
      console.error("Error saving data:", e);
    }
  }, [userId]);

  // Wrapped setState to trigger Firestore save
  const updateState = useCallback((updater: any) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToFirestore(next);
      return next;
    });
  }, [saveToFirestore]);

  const resetData = (module?: keyof AppState) => {
    if (module) {
      updateState((prev: AppState) => ({ ...prev, [module]: initialState[module] }));
    } else {
      updateState(initialState);
    }
  };

  return { state, setState: updateState, resetData, loading };
}

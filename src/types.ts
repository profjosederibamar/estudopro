export type TopicStatus = 'não estudado' | 'em andamento' | 'revisado' | 'dominado';

export interface Topic {
  id: string;
  title: string;
  status: TopicStatus;
}

export interface SubjectInEdital {
  id: string;
  name: string;
  questions: number;
  weight: number;
  topics: Topic[];
}

export interface ExamInEdital {
  id: string;
  name: string;
  questions: number;
  weight: number;
  subjects: SubjectInEdital[];
}

export interface Edital {
  id: string;
  name: string;
  exams: ExamInEdital[];
}

export interface WeeklySubject {
  id: string;
  name: string;
  planned: number;
  realized: number;
}

export interface WeekData {
  id: string;
  weekNumber: number;
  subjects: WeeklySubject[];
  proposal: string;
}

export type CyclePhase = 'Pré-Edital' | 'Pós-Edital' | 'Reta Final';

export interface CycleSubjectAssunto {
  id: string;
  subject: string;
  topic: string;
  completed: boolean;
}

export interface Cycle {
  id: string;
  name: string;
  phase: CyclePhase;
  items: CycleSubjectAssunto[];
}

export interface DiagnosisArea {
  id: string;
  area: string;
  score: number;
  maxScore: number;
  reason?: string;
}

export interface SimuladoSubject {
  id: string;
  name: string;
  hits: number;
  total: number;
}

export interface Simulado {
  id: string;
  name: string;
  date: string;
  subjects: SimuladoSubject[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Checklist {
  reasons: ChecklistItem[];
  actions: ChecklistItem[];
  intro: string;
}

export interface AppState {
  examConfig: { name: string; position: string };
  weeklyHours: WeekData[];
  edital: Edital[];
  cycles: Cycle[];
  diagnosis: DiagnosisArea[];
  simulados: Simulado[];
  checklist: Checklist;
}

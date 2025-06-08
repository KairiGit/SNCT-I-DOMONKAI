export type Grade = 1 | 2 | 3 | 4 | 5;

export interface Absentee {
  id: string;
  memo: string;
  timestamp: number;
}

export interface AppState {
  currentId: string;
  remainingIds: Record<Grade, string[]>;
  selectedCount: Record<Grade, number>;
  weights: Record<Grade, number>;
  lastSelectedGrade?: Grade;
}

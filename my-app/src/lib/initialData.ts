import { AppState } from "../types/app";

export const initialState: AppState = {
  currentId: "",
  remainingIds: {
    1: Array.from(
      { length: 42 },
      (_, i) => `1I${String(i + 1).padStart(2, "0")}`
    ),
    2: Array.from(
      { length: 46 },
      (_, i) => `2I${String(i + 1).padStart(2, "0")}`
    ),
    3: Array.from(
      { length: 44 },
      (_, i) => `3I${String(i + 1).padStart(2, "0")}`
    ),
    4: Array.from(
      { length: 39 },
      (_, i) => `4I${String(i + 1).padStart(2, "0")}`
    ),
    5: Array.from(
      { length: 38 },
      (_, i) => `5I${String(i + 1).padStart(2, "0")}`
    ),
  },
  selectedCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  weights: { 1: 1.0, 2: 1.0, 3: 1.0, 4: 1.0, 5: 1.0 },
};

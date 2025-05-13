"use client";

import React, { useState } from "react";
import { weightedRandom } from "../lib/weightedRandom";

type Grade = 1 | 2 | 3 | 4 | 5;

interface Absentee {
  id: string;
  memo: string;
  timestamp: number;
}

interface AppState {
  currentId: string;
  remainingIds: Record<Grade, string[]>;
  selectedCount: Record<Grade, number>;
  weights: Record<Grade, number>;
  lastSelectedGrade?: Grade;
}

const initialState: AppState = {
  currentId: "",
  remainingIds: {
    1: Array.from(
      { length: 25 },
      (_, i) => `1I${String(i + 1).padStart(2, "0")}`
    ),
    2: Array.from(
      { length: 30 },
      (_, i) => `2I${String(i + 1).padStart(2, "0")}`
    ),
    3: Array.from(
      { length: 28 },
      (_, i) => `3I${String(i + 1).padStart(2, "0")}`
    ),
    4: Array.from(
      { length: 20 },
      (_, i) => `4I${String(i + 1).padStart(2, "0")}`
    ),
    5: Array.from(
      { length: 22 },
      (_, i) => `5I${String(i + 1).padStart(2, "0")}`
    ),
  },
  selectedCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  weights: { 1: 1.0, 2: 1.0, 3: 1.0, 4: 1.0, 5: 1.0 },
};

export default function HomePage() {
  const [state, setState] = useState<AppState>(initialState);
  const [absentees, setAbsentees] = useState<Absentee[]>([]);
  const [showAbsenteeForm, setShowAbsenteeForm] = useState(false);
  const [absenteeMemo, setAbsenteeMemo] = useState("");

  const generateStudentId = () => {
    const availableGrades = (
      Object.keys(state.remainingIds) as unknown as Grade[]
    ).filter((g) => state.remainingIds[g].length > 0);
    if (availableGrades.length === 0) {
      alert("すべての学籍番号が生成されました。リセットしてください。");
      return;
    }

    const grades = availableGrades;
    const weights = grades.map((g) => state.weights[g]);
    const selectedGrade = weightedRandom(grades, weights);

    const ids = state.remainingIds[selectedGrade];
    const selectedId = ids[Math.floor(Math.random() * ids.length)];

    setState((prev) => {
      const newRemaining = { ...prev.remainingIds };
      newRemaining[selectedGrade] = newRemaining[selectedGrade].filter(
        (id) => id !== selectedId
      );

      const newCount = { ...prev.selectedCount };
      newCount[selectedGrade] += 1;

      return {
        ...prev,
        currentId: selectedId,
        remainingIds: newRemaining,
        selectedCount: newCount,
        lastSelectedGrade: selectedGrade,
      };
    });
  };

  const redrawStudentId = () => {
    if (!state.currentId || !state.lastSelectedGrade) {
      alert("引き直す対象がありません。");
      return;
    }

    setState((prev) => {
      const newRemaining = { ...prev.remainingIds };
      newRemaining[prev.lastSelectedGrade!] = [
        ...newRemaining[prev.lastSelectedGrade!],
        prev.currentId,
      ];

      const newCount = { ...prev.selectedCount };
      newCount[prev.lastSelectedGrade!] -= 1;

      return {
        ...prev,
        currentId: "",
        remainingIds: newRemaining,
        selectedCount: newCount,
        lastSelectedGrade: undefined,
      };
    });

    setTimeout(generateStudentId, 100);
  };

  const handleAbsentee = () => {
    if (!state.currentId) {
      alert("不在者を登録する対象がありません。");
      return;
    }
    setShowAbsenteeForm(true);
  };

  const saveAbsentee = () => {
    if (!absenteeMemo.trim()) {
      alert("メモを入力してください。");
      return;
    }

    setAbsentees((prev) => [
      ...prev,
      {
        id: state.currentId,
        memo: absenteeMemo,
        timestamp: Date.now(),
      },
    ]);

    setAbsenteeMemo("");
    setShowAbsenteeForm(false);
    setState((prev) => ({ ...prev, lastSelectedGrade: undefined }));
  };

  const cancelAbsentee = () => {
    setAbsenteeMemo("");
    setShowAbsenteeForm(false);
  };

  const updateWeight = (grade: Grade, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      alert("重みは0より大きい数値を入力してください。");
      return;
    }
    setState((prev) => ({
      ...prev,
      weights: { ...prev.weights, [grade]: num },
    }));
  };

  const resetAll = () => {
    if (confirm("本当にリセットしますか？")) {
      setState(initialState);
      setAbsentees([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800">
            2025/05/14 SNCT-I-同門会
          </h1>

          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600">
                {state.currentId || "まだ生成されていません"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={generateStudentId}
                className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
              >
                学籍番号を生成
              </button>
              <button
                onClick={redrawStudentId}
                disabled={!state.lastSelectedGrade}
                className={`px-4 py-1.5 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md ${
                  state.lastSelectedGrade
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                引き直し
              </button>
              <button
                onClick={handleAbsentee}
                disabled={!state.lastSelectedGrade}
                className={`px-4 py-1.5 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md ${
                  state.lastSelectedGrade
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                不在
              </button>
              <button
                onClick={resetAll}
                className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
              >
                リセット
              </button>
            </div>
          </section>

          {showAbsenteeForm && (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                不在者メモ
              </h2>
              <div className="space-y-4">
                <textarea
                  value={absenteeMemo}
                  onChange={(e) => setAbsenteeMemo(e.target.value)}
                  placeholder="メモを入力してください"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelAbsentee}
                    className="px-4 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={saveAbsentee}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    保存
                  </button>
                </div>
              </div>
            </section>
          )}

          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as Grade[]).map((g) => (
                <div key={g} className="text-center">
                  <div className="text-lg font-medium text-gray-700 mb-1">
                    {g}年
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="mb-2">
                      <label className="text-xs text-gray-500 block mb-1">
                        重み
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={state.weights[g]}
                        onChange={(e) => updateWeight(g, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>
                        <span className="text-gray-500">当選</span>
                        <div className="font-bold text-blue-600">
                          {state.selectedCount[g]}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">残り</span>
                        <div className="font-bold text-green-600">
                          {state.remainingIds[g].length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {absentees.length > 0 && (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                不在者一覧
              </h2>
              <div className="space-y-2">
                {absentees.map((absentee) => (
                  <div
                    key={absentee.timestamp}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <div className="font-medium text-gray-900">
                      {absentee.id}
                    </div>
                    <div className="text-gray-600">{absentee.memo}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

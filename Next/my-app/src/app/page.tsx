"use client";

import React, { useState, useEffect } from "react";
import { weightedRandom } from "../lib/weightedRandom";
import { initialState } from "../lib/initialData";
import { AppState, Grade, Absentee } from "../types/app";
import { useTheme } from "./context/ThemeContext";

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [state, setState] = useState<AppState>(initialState);
  const [absentees, setAbsentees] = useState<Absentee[]>([]);
  const [showAbsenteeForm, setShowAbsenteeForm] = useState(false);
  const [absenteeMemo, setAbsenteeMemo] = useState("");

  useEffect(() => {
    setState(initialState);
  }, []);

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
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              2025/05/14 SNCT-I-同門会
            </h1>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                theme === "dark" ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <section
            className={`${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
            } rounded-lg shadow-md p-6 border`}
          >
            <div className="text-center mb-6">
              <div className="relative inline-block p-4">
                <h2
                  className={`text-7xl sm:text-8xl md:text-9xl font-bold transition-all duration-500 relative z-10 ${
                    state.currentId
                      ? "animate-fade-in-scale bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                      : theme === "dark"
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}
                  style={
                    state.currentId
                      ? {
                          backgroundImage:
                            "linear-gradient(to right, rgb(49, 54, 224) 0%, rgb(127, 36, 201) 50%, rgb(236, 72, 189) 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          textShadow: "0 0 20px rgba(84, 0, 95, 0.3)",
                        }
                      : {}
                  }
                >
                  {state.currentId || "Enjoy!"}
                </h2>
                {state.currentId && (
                  <div
                    className="absolute inset-0 rounded-lg
                             bg-[conic-gradient(from_var(--angle)_at_50%_50%,#3b82f6,#60a5fa,#3b82f6,transparent_40%)]
                             [--angle:0deg]
                             animate-border-spin
                             pointer-events-none
                             bg-[length:200%_200%]
                             opacity-80"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={generateStudentId}
                className="animate-bounce rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                学籍番号を生成
              </button>
              <button
                onClick={redrawStudentId}
                disabled={!state.lastSelectedGrade}
                className={`px-4 py-2 rounded font-bold transition-colors ${
                  state.lastSelectedGrade
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-500"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                引き直し
              </button>
              <button
                onClick={handleAbsentee}
                disabled={!state.lastSelectedGrade}
                className={`px-4 py-2 rounded font-bold transition-colors ${
                  state.lastSelectedGrade
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-500"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                不在
              </button>
              <button
                onClick={resetAll}
                className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600 transition-colors"
              >
                リセット
              </button>
            </div>
          </section>

          {showAbsenteeForm && (
            <section
              className={`${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
              } rounded-lg shadow-md p-6 border`}
            >
              <h2
                className={`text-xl font-semibold mb-4 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-700"
                }`}
              >
                不在者メモ
              </h2>
              <div className="space-y-4">
                <textarea
                  value={absenteeMemo}
                  onChange={(e) => setAbsenteeMemo(e.target.value)}
                  placeholder="メモを入力してください"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  rows={3}
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelAbsentee}
                    className={`px-4 py-1.5 text-white rounded transition-colors text-sm ${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
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

          <section
            className={`${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
            } rounded-lg shadow-md p-6 border`}
          >
            <div className="grid grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as Grade[]).map((g) => (
                <div key={g} className="text-center">
                  <div
                    className={`text-lg font-medium mb-1 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-700"
                    }`}
                  >
                    {g}年
                  </div>
                  <div
                    className={`${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50"
                    } rounded-lg p-2 border`}
                  >
                    <div className="mb-2">
                      <label
                        className={`text-xs block mb-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        重み
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={state.weights[g]}
                        onChange={(e) => updateWeight(g, e.target.value)}
                        className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          theme === "dark"
                            ? "bg-gray-600 border-gray-500 text-gray-100"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          当選
                        </span>
                        <div
                          className={`font-bold ${
                            theme === "dark" ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          {state.selectedCount[g]}
                        </div>
                      </div>
                      <div>
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          残り
                        </span>
                        <div
                          className={`font-bold ${
                            theme === "dark"
                              ? "text-green-400"
                              : "text-green-600"
                          }`}
                        >
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
            <section
              className={`${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
              } rounded-lg shadow-md p-6 border`}
            >
              <h2
                className={`text-2xl font-semibold mb-4 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-700"
                }`}
              >
                不在者一覧
              </h2>
              <div className="space-y-2">
                {absentees.map((absentee) => (
                  <div
                    key={absentee.timestamp}
                    className={`flex items-center justify-between rounded-lg p-3 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50"
                    } border`}
                  >
                    <div
                      className={`font-medium ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {absentee.id}
                    </div>
                    <div
                      className={
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }
                    >
                      {absentee.memo}
                    </div>
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

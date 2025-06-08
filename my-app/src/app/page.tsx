"use client";

import React, { useState, useEffect } from "react";
import { weightedRandom } from "../lib/weightedRandom";
import { initialState } from "../lib/initialData";
import { AppState, Grade, Absentee } from "../types/app";
import { useTheme } from "./context/ThemeContext";
import Header from "./components/Header";
import StudentIdSection from "./components/StudentIdSection";
import AbsenteeForm from "./components/AbsenteeForm";
import GradeStatusGrid from "./components/GradeStatusGrid";
import AbsenteeList from "./components/AbsenteeList";
import WinnerList from "./components/WinnerList";

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [state, setState] = useState<AppState>(initialState);
  const [absentees, setAbsentees] = useState<Absentee[]>([]);
  const [showAbsenteeForm, setShowAbsenteeForm] = useState(false);
  const [absenteeMemo, setAbsenteeMemo] = useState("");
  const [showWinnerList, setShowWinnerList] = useState(false);

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

  // 当選者一覧を計算
  const winners = Object.entries(state.selectedCount).flatMap(([grade]) => {
    const g = Number(grade) as Grade;
    const selected = (initialState.remainingIds[g] as string[]).filter(
      (id: string) => !state.remainingIds[g].includes(id)
    );
    return selected.map((id: string) => ({ grade: g, id }));
  });

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Header
            theme={theme}
            toggleTheme={toggleTheme}
            showWinnerList={() => setShowWinnerList(true)}
          />
          <StudentIdSection
            theme={theme}
            state={state}
            generateStudentId={generateStudentId}
            redrawStudentId={redrawStudentId}
            handleAbsentee={handleAbsentee}
            resetAll={resetAll}
          />
          {showAbsenteeForm && (
            <AbsenteeForm
              theme={theme}
              absenteeMemo={absenteeMemo}
              setAbsenteeMemo={setAbsenteeMemo}
              cancelAbsentee={cancelAbsentee}
              saveAbsentee={saveAbsentee}
            />
          )}
          <GradeStatusGrid
            theme={theme}
            state={state}
            updateWeight={updateWeight}
          />
          {absentees.length > 0 && (
            <AbsenteeList theme={theme} absentees={absentees} />
          )}
          {showWinnerList && (
            <WinnerList
              theme={theme}
              winners={winners}
              onClose={() => setShowWinnerList(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

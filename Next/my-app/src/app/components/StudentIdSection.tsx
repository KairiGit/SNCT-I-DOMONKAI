import React from "react";
import { AppState } from "../../types/app";

type StudentIdSectionProps = {
  theme: string;
  state: AppState;
  generateStudentId: () => void;
  redrawStudentId: () => void;
  handleAbsentee: () => void;
  resetAll: () => void;
};

const StudentIdSection: React.FC<StudentIdSectionProps> = ({
  theme,
  state,
  generateStudentId,
  redrawStudentId,
  handleAbsentee,
  resetAll,
}) => (
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
        className={`animate-bounce rounded px-4 py-2 font-bold text-white transition-colors
          ${
            theme === "dark"
              ? "bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-900 shadow-md hover:from-blue-700 hover:to-indigo-800"
              : "bg-blue-500 hover:bg-blue-700"
          }
        `}
      >
        学籍番号を生成
      </button>
      <button
        onClick={redrawStudentId}
        disabled={!state.lastSelectedGrade}
        className={`rounded px-4 py-2 font-bold text-white transition-colors
          ${
            state.lastSelectedGrade
              ? theme === "dark"
                ? "bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 shadow-md hover:from-yellow-500 hover:to-yellow-700"
                : "bg-yellow-500 hover:bg-yellow-600"
              : theme === "dark"
              ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-gray-500"
              : "bg-gray-300 text-gray-500"
          }
        `}
      >
        引き直し
      </button>
      <button
        onClick={handleAbsentee}
        disabled={!state.lastSelectedGrade}
        className={`rounded px-4 py-2 font-bold text-white transition-colors
          ${
            state.lastSelectedGrade
              ? theme === "dark"
                ? "bg-gradient-to-r from-orange-700 via-pink-700 to-red-800 shadow-md hover:from-orange-600 hover:to-red-700"
                : "bg-orange-500 hover:bg-orange-600"
              : theme === "dark"
              ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-gray-500"
              : "bg-gray-300 text-gray-500"
          }
        `}
      >
        不在
      </button>
      <button
        onClick={resetAll}
        className={`rounded px-4 py-2 font-bold text-white transition-colors
          ${
            theme === "dark"
              ? "bg-gradient-to-r from-red-800 via-pink-800 to-purple-900 shadow-md hover:from-red-700 hover:to-purple-800"
              : "bg-red-500 hover:bg-red-600"
          }
        `}
      >
        リセット
      </button>
    </div>
  </section>
);

export default StudentIdSection;

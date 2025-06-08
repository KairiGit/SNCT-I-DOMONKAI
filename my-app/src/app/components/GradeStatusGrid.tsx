import React from "react";
import { AppState, Grade } from "../../types/app";

type GradeStatusGridProps = {
  theme: string;
  state: AppState;
  updateWeight: (grade: Grade, value: string) => void;
};

const GradeStatusGrid: React.FC<GradeStatusGridProps> = ({
  theme,
  state,
  updateWeight,
}) => (
  <section
    className={`$${
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
            className={`$${
              theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50"
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
                    theme === "dark" ? "text-green-400" : "text-green-600"
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
);

export default GradeStatusGrid;

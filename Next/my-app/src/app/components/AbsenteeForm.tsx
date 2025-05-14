import React from "react";

type AbsenteeFormProps = {
  theme: string;
  absenteeMemo: string;
  setAbsenteeMemo: (v: string) => void;
  cancelAbsentee: () => void;
  saveAbsentee: () => void;
};

const AbsenteeForm: React.FC<AbsenteeFormProps> = ({
  theme,
  absenteeMemo,
  setAbsenteeMemo,
  cancelAbsentee,
  saveAbsentee,
}) => (
  <section
    className={`$${
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
          className={`rounded px-4 py-1.5 text-white transition-colors text-sm
            ${
              theme === "dark"
                ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:to-gray-800"
                : "bg-gray-500 hover:bg-gray-600"
            }
          `}
        >
          キャンセル
        </button>
        <button
          onClick={saveAbsentee}
          className={`rounded px-4 py-1.5 text-white transition-colors text-sm
            ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-900 shadow-md hover:from-blue-700 hover:to-indigo-800"
                : "bg-blue-500 hover:bg-blue-600"
            }
          `}
        >
          保存
        </button>
      </div>
    </div>
  </section>
);

export default AbsenteeForm;

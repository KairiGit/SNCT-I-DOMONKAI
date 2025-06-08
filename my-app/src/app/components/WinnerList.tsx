import React from "react";

type Winner = {
  grade: number;
  id: string;
};

type WinnerListProps = {
  theme: string;
  winners: Winner[];
  onClose: () => void;
};

const WinnerList: React.FC<WinnerListProps> = ({ theme, winners, onClose }) => (
  <section
    className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40`}
  >
    <div
      className={`$${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white"
      } rounded-lg shadow-lg p-8 border max-w-lg w-full`}
    >
      <h2
        className={`text-2xl font-semibold mb-4 text-center ${
          theme === "dark" ? "text-gray-100" : "text-gray-700"
        }`}
      >
        当選者一覧
      </h2>
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-300 dark:divide-gray-700">
        {winners.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            まだ当選者はいません
          </div>
        ) : (
          winners.map((w) => (
            <div
              key={w.grade + w.id}
              className="flex justify-between py-2 px-2"
            >
              <span className="font-bold">{w.grade}年</span>
              <span className="ml-2">{w.id}</span>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className={`rounded px-6 py-2 font-bold text-white transition-colors
            ${
              theme === "dark"
                ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:to-gray-800"
                : "bg-gray-500 hover:bg-gray-600"
            }
          `}
        >
          閉じる
        </button>
      </div>
    </div>
  </section>
);

export default WinnerList;

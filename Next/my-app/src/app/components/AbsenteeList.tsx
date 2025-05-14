import React from "react";
import { Absentee } from "../../types/app";

type AbsenteeListProps = {
  theme: string;
  absentees: Absentee[];
};

const AbsenteeList: React.FC<AbsenteeListProps> = ({ theme, absentees }) => (
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
            theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50"
          } border`}
        >
          <div
            className={`font-medium ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {absentee.id}
          </div>
          <div className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
            {absentee.memo}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AbsenteeList;

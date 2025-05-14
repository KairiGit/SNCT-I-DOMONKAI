import React from "react";

type HeaderProps = {
  theme: string;
  toggleTheme: () => void;
};

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => (
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
);

export default Header;

import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  isLoading,
  placeholder = "Search for movies...",
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClearClick = () => {
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onClear();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input-field pl-10 pr-12"
          disabled={isLoading}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isLoading ? (
            <div className="animate-spin h-5 w-5 text-blue-500">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          ) : value ? (
            <button
              onClick={handleClearClick}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              type="button">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-1 text-center">
        Start typing to search for movies...
      </p>
    </div>
  );
};

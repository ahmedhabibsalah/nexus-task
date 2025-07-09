import React from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  breadcrumbs?: Array<{ label: string; onClick?: () => void }>;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Movie Search App",
  subtitle = "Discover movies powered by OMDb API",
  showBackButton = false,
  onBack,
  breadcrumbs,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 mx-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                  {crumb.onClick ? (
                    <button
                      onClick={crumb.onClick}
                      className="hover:text-blue-600 transition-colors">
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-gray-900 font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Search Results
          </button>
        )}

        <div className="text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
};

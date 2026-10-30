import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  className?: string;
  position?: 'top' | 'bottom';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  className = '',
  position = 'top',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside or escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center align-middle ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={toggleOpen}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className="text-[#98A2B3] hover:text-[#202B38] focus:text-[#202B38] focus:outline-none p-1 -m-0.5 rounded transition-colors cursor-help inline-flex items-center justify-center min-w-[28px] min-h-[28px]"
        aria-label="Exibir informações sobre este campo"
        aria-expanded={isOpen}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className={`absolute z-30 w-48 xs:w-56 sm:w-64 max-w-[calc(100vw-40px)] p-2.5 text-[11px] leading-relaxed text-white bg-[#202B38] border border-[#17212C] rounded-[4px] shadow-lg pointer-events-none transition-opacity duration-150 ${
            position === 'top'
              ? 'bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-1.5'
              : 'top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-1.5'
          }`}
        >
          {content}
          {/* Subtle arrow pointer */}
          <div
            className={`absolute left-3 sm:left-1/2 sm:-translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent ${
              position === 'top'
                ? 'top-full border-t-4 border-t-[#202B38]'
                : 'bottom-full border-b-4 border-b-[#202B38]'
            }`}
          />
        </div>
      )}
    </div>
  );
};

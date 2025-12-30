import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search products...',
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center bg-surface rounded-xl px-4 py-3">
        <span className="text-xl mr-3">🔍</span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-base text-text-primary placeholder-text-tertiary"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="ml-2 text-text-tertiary hover:text-text-secondary"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}

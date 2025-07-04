"use client";

import { Icon } from "@iconify/react";

interface PreferenceSelectorProps {
  title: string;
  items: string[];
  selectedItems: string[];
  onItemChange: (value: string, checked: boolean) => void;
  icon: string;
  loading?: boolean;
  searchPlaceholder?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function PreferenceSelector({
  title,
  items,
  selectedItems,
  onItemChange,
  icon,
  loading = false,
  searchPlaceholder,
  showSearch = false,
  searchValue = "",
  onSearchChange,
}: PreferenceSelectorProps) {
  const filteredItems = showSearch && searchValue
    ? items.filter(item =>
      item.toLowerCase().includes(searchValue.toLowerCase())
    )
    : items;

  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Icon icon={icon} className="w-5 h-5" />
        {title}
      </h2>

      {showSearch && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 text-sm"
            disabled={loading}
          />
        </div>
      )}

      <div className={`space-y-2 ${showSearch ? 'max-h-64' : 'max-h-80'} overflow-y-auto`}>
        {filteredItems.map((item) => {
          const displayName = item.split('/').pop() || item;
          const isBlacklisted = selectedItems.includes(item);
          const checked = !isBlacklisted;
          return (
            <label key={item} className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-2 rounded">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onItemChange(item, e.target.checked)}
                className="rounded border-neutral-300"
                disabled={loading}
              />
              <span className="text-sm capitalize">{displayName}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
} 
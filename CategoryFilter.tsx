"use client";

import { Dispatch, SetStateAction } from 'react';

interface CategoryFilterProps {
  categories: { id: string; name: string }[];
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}

/**
 * Dropdown filter for categories. When the selected value changes the parent component
 * should update the state and re-filter listings.
 */
export default function CategoryFilter({ categories, selected, setSelected }: CategoryFilterProps) {
  return (
    <select
      className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:border-primary focus:outline-none focus:ring-primary"
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
    >
      <option value="">כל הקטגוריות</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
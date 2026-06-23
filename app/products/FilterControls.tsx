'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import styles from './products.module.css';

interface FilterControlsProps {
  initialSearch?: string;
  initialSort?: string;
}

const sortOptions = [
  { value: 'id_desc', label: 'Eng yangi mahsulotlar' },
  { value: 'price_asc', label: 'Narx: arzonidan qimmatiga' },
  { value: 'price_desc', label: 'Narx: qimmatidan arzoniga' },
  { value: 'name_asc', label: "Nomi bo'yicha (A-Z)" },
  { value: 'name_desc', label: "Nomi bo'yicha (Z-A)" },
];

export default function FilterControls({ initialSearch = '', initialSort = 'id_desc' }: FilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    params.delete('page');
    
    router.push(`/products?${params.toString()}`);
  };

  const handleSortSelect = (value: string) => {
    setIsDropdownOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const currentSortLabel = sortOptions.find(opt => opt.value === initialSort)?.label || 'Tartiblash...';

  return (
    <div className={styles.topControls}>
      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Mahsulot nomini kiriting..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Qidirish
        </button>
      </form>

      {/* Custom Sort Dropdown */}
      <div className={styles.customSelectWrapper} ref={dropdownRef} data-open={isDropdownOpen}>
        <button 
          type="button" 
          className={styles.customSelectTrigger} 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {currentSortLabel}
          <svg className={styles.dropdownIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        
        {isDropdownOpen && (
          <div className={styles.customSelectPopup}>
            {sortOptions.map(option => (
              <div 
                key={option.value}
                className={`${styles.customOption} ${initialSort === option.value ? styles.activeOption : ''}`}
                onClick={() => handleSortSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

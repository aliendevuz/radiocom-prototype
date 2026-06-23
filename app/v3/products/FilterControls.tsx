'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './v3-products.module.css';

interface FilterControlsProps {
  initialSearch?: string;
  initialSort?: string;
}

export default function FilterControls({ initialSearch = '', initialSort = 'id_desc' }: FilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    params.delete('page');
    
    router.push(`/v3/products?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.delete('page');
    router.push(`/v3/products?${params.toString()}`);
  };

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

      {/* Sort Dropdown */}
      <select
        value={initialSort}
        onChange={handleSortChange}
        className={styles.sortSelect}
      >
        <option value="id_desc">Eng yangi mahsulotlar</option>
        <option value="price_asc">Narx: arzonidan qimmatiga</option>
        <option value="price_desc">Narx: qimmatidan arzoniga</option>
        <option value="name_asc">Nomi bo'yicha (A-Z)</option>
        <option value="name_desc">Nomi bo'yicha (Z-A)</option>
      </select>
    </div>
  );
}

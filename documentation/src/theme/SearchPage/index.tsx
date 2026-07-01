/**
 * SearchPage Theme Override
 * Injects advanced filtering UI into the search results page.
 * Wraps the default search plugin output with custom filter controls.
 */

import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import SearchPage from '@theme-init/SearchPage';
import { SearchFilters, type SearchFilterState } from '../../components/SearchFilters';
import { matchesFilters } from '../../utils/searchFilterUtils';

export default function SearchPageWrapper(props: any) {
  const [filters, setFilters] = useState<SearchFilterState>({
    categories: [],
    difficulty: [],
    tags: [],
  });

  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: SearchFilterState) => {
    setFilters(newFilters);
  }, []);

  // Apply filters to search results
  useEffect(() => {
    if (!props.location?.search) {
      setFilteredResults([]);
      return;
    }

    // Get all result articles from the DOM
    const articles = document.querySelectorAll('main section article');
    const results: any[] = [];

    articles.forEach((article) => {
      const link = article.querySelector('a');
      const href = link?.getAttribute('href') || '';

      // Check if this result matches the active filters
      if (matchesFilters(href, filters)) {
        results.push(article);
      } else {
        // Hide non-matching results
        const htmlElement = article as HTMLElement;
        htmlElement.style.display = 'none';
      }
    });

    setFilteredResults(results);
  }, [filters, props.location?.search]);

  // Show/hide articles based on filter state
  useEffect(() => {
    const articles = document.querySelectorAll('main section article');
    articles.forEach((article) => {
      const link = article.querySelector('a');
      const href = link?.getAttribute('href') || '';
      const isVisible = matchesFilters(href, filters);
      const htmlElement = article as HTMLElement;
      htmlElement.style.display = isVisible ? '' : 'none';
    });
  }, [filters]);

  return (
    <>
      <SearchPage {...props} />
      <div style={{ marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
        <SearchFilters onFilterChange={handleFilterChange} />
      </div>
    </>
  );
}

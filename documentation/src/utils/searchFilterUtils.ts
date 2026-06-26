/**
 * Search Filter Utilities
 * Client-side filtering for search results based on metadata
 */

import type { SearchFilterState } from '../components/SearchFilters';

/**
 * Map document paths to their metadata (category, difficulty, tags)
 */
const DOCUMENT_METADATA: Record<string, DocumentMetadata> = {
  // Getting Started
  'getting-started/setup': {
    category: 'getting-started',
    difficulty: 'beginner',
    tags: [],
  },
  'getting-started/setup-linux': {
    category: 'getting-started',
    difficulty: 'beginner',
    tags: [],
  },
  'getting-started/setup-macos': {
    category: 'getting-started',
    difficulty: 'beginner',
    tags: [],
  },
  'getting-started/setup-windows': {
    category: 'getting-started',
    difficulty: 'beginner',
    tags: [],
  },
  'getting-started/first-contract': {
    category: 'getting-started',
    difficulty: 'beginner',
    tags: [],
  },
  'getting-started/building-and-compilation': {
    category: 'getting-started',
    difficulty: 'beginner',
    tags: [],
  },
  'getting-started/deploy-testnet': {
    category: 'getting-started',
    difficulty: 'intermediate',
    tags: [],
  },
  'getting-started/deploy-mainnet': {
    category: 'getting-started',
    difficulty: 'advanced',
    tags: [],
  },
  'getting-started/contract-interaction': {
    category: 'getting-started',
    difficulty: 'intermediate',
    tags: [],
  },
  'getting-started/debugging': {
    category: 'getting-started',
    difficulty: 'intermediate',
    tags: [],
  },
  'getting-started/testing-errors': {
    category: 'getting-started',
    difficulty: 'intermediate',
    tags: ['errors'],
  },

  // Core Concepts
  'concepts/introduction': {
    category: 'concepts',
    difficulty: 'beginner',
    tags: [],
  },
  'concepts/overview': {
    category: 'concepts',
    difficulty: 'beginner',
    tags: [],
  },
  'concepts/best-practices': {
    category: 'concepts',
    difficulty: 'intermediate',
    tags: ['optimization'],
  },
  'concepts/storage': {
    category: 'concepts',
    difficulty: 'intermediate',
    tags: ['storage'],
  },
  'concepts/authorization': {
    category: 'concepts',
    difficulty: 'intermediate',
    tags: ['auth'],
  },
  'concepts/events': {
    category: 'concepts',
    difficulty: 'intermediate',
    tags: ['events'],
  },
  'concepts/gas-and-resources': {
    category: 'concepts',
    difficulty: 'intermediate',
    tags: ['optimization'],
  },
  'concepts/cross-contract-invocation': {
    category: 'concepts',
    difficulty: 'advanced',
    tags: [],
  },

  // Patterns
  'patterns/hello-world': {
    category: 'patterns',
    difficulty: 'beginner',
    tags: [],
  },
  'patterns/custom-types': {
    category: 'patterns',
    difficulty: 'intermediate',
    tags: [],
  },
  'patterns/authorization': {
    category: 'patterns',
    difficulty: 'advanced',
    tags: ['auth'],
  },
  'patterns/optimization-playbook': {
    category: 'patterns',
    difficulty: 'advanced',
    tags: ['optimization'],
  },
  'patterns/lifecycle-upgrades': {
    category: 'patterns',
    difficulty: 'advanced',
    tags: [],
  },
  'patterns/error-handling': {
    category: 'patterns',
    difficulty: 'intermediate',
    tags: ['errors'],
  },
  'patterns/error-recovery': {
    category: 'patterns',
    difficulty: 'advanced',
    tags: ['errors'],
  },

  // Security
  'security/fundamentals': {
    category: 'security',
    difficulty: 'intermediate',
    tags: ['auth'],
  },
};

export interface DocumentMetadata {
  category: string;
  difficulty: string;
  tags: string[];
}

/**
 * Extract path from search result URL
 */
function extractPath(url: string): string {
  // Remove leading /docs/ and trailing slashes
  const path = url.replace(/^\/docs\//, '').replace(/\/$/, '');
  return path;
}

/**
 * Get metadata for a document URL
 */
export function getDocumentMetadata(url: string): DocumentMetadata | null {
  const path = extractPath(url);
  return DOCUMENT_METADATA[path] || null;
}

/**
 * Check if a document matches the active filters
 */
export function matchesFilters(
  documentUrl: string,
  filters: SearchFilterState
): boolean {
  const metadata = getDocumentMetadata(documentUrl);

  if (!metadata) {
    // If we don't have metadata, include the result
    return true;
  }

  // If no filters active, include everything
  if (
    filters.categories.length === 0 &&
    filters.difficulty.length === 0 &&
    filters.tags.length === 0
  ) {
    return true;
  }

  // Category filter: must match if active
  if (filters.categories.length > 0) {
    if (!filters.categories.includes(metadata.category)) {
      return false;
    }
  }

  // Difficulty filter: must match if active
  if (filters.difficulty.length > 0) {
    if (!filters.difficulty.includes(metadata.difficulty)) {
      return false;
    }
  }

  // Tags filter: must match at least one tag if active
  if (filters.tags.length > 0) {
    const hasMatchingTag = filters.tags.some((tag) =>
      metadata.tags.includes(tag)
    );
    if (!hasMatchingTag) {
      return false;
    }
  }

  return true;
}
